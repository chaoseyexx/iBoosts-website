"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Check, ShoppingBag, Wallet, MessageCircle, AlertTriangle, ShieldCheck, Gamepad2, Loader2, Info } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, getBoostingRequests } from "./actions";
import { getSupabaseClient } from "@/lib/supabase/client";

export interface UnifiedNotification {
    id: string;
    type: string;
    title: string;
    content: string;
    isRead: boolean;
    link?: string | null;
    createdAt: Date | string;
    isBoosting?: boolean;
    gameIcon?: string;
    gameName?: string;
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = React.useState<UnifiedNotification[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [userId, setUserId] = React.useState<string | null>(null);

    const fetchAll = React.useCallback(async (uid: string) => {
        setLoading(true);
        try {
            const [notifs, boosting] = await Promise.all([
                getNotifications(uid),
                getBoostingRequests()
            ]);

            const transformedBoosting: UnifiedNotification[] = boosting.map((b: any) => ({
                id: b.id,
                type: "BOOSTING_REQUEST",
                title: `🔥 New ${b.game.name} Boosting Request!`,
                content: b.description,
                isRead: false,
                link: `/dashboard/notifications`,
                createdAt: b.createdAt,
                isBoosting: true,
                gameIcon: b.game.icon,
                gameName: b.game.name
            }));

            const combined = [
                ...(notifs || []),
                ...transformedBoosting
            ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            setNotifications(combined);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        const init = async () => {
            const supabase = getSupabaseClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                // We need the internal profile ID, not supabaseId
                // For now, let's assume the getNotifications action handles the supabaseId or we fetch profile
                // Actually, getNotifications(userId) expects the cuid.
                // Let's fetch the profile first.
                const { data: profile } = await supabase.from('User').select('id').eq('supabaseId', user.id).single();
                if (profile) {
                    setUserId(profile.id);
                    fetchAll(profile.id);
                }
            }
        };
        init();
    }, [fetchAll]);

    // Real-time listener
    React.useEffect(() => {
        if (!userId) return;

        const supabase = getSupabaseClient();
        const channel = supabase.channel(`notifications-page-${userId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'Notification',
                filter: `userId=eq.${userId}`
            }, () => {
                fetchAll(userId);
            })
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'BoostingRequest'
            }, () => {
                fetchAll(userId);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId, fetchAll]);

    const handleMarkAllAsRead = async () => {
        if (!userId) return;
        await markAllNotificationsAsRead(userId);
        setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    };

    const handleMarkAsRead = async (id: string, isBoosting?: boolean) => {
        if (!isBoosting) {
            await markNotificationAsRead(id);
        }
        setNotifications(notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    };

    return (
        <div className="relative min-h-[calc(100vh-100px)]">
            {/* Background Character Graphic */}

            <div className="relative z-10 space-y-6">
                {/* Page Header */}
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1c2128] border border-[#f5a623]/20 shadow-[0_0_20px_rgba(245,166,35,0.05)]">
                        <Bell className="h-6 w-6 text-[#f5a623] fill-[#f5a623]" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-semibold text-white tracking-tight uppercase">Notifications</h1>
                        <p className="text-sm text-[#8b949e] font-bold uppercase tracking-wider">Stay updated with your activities</p>
                    </div>
                </div>

                {/* Status and Action Row */}
                <div className="flex items-center justify-between border-b border-[#2d333b]/30 pb-4">
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#f5a623] opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#f5a623] shadow-[0_0_10px_rgba(245,166,35,0.5)]"></span>
                        </span>
                        <span className="text-[11px] font-semibold text-[#58a6ff] uppercase tracking-[0.2em]">Real-time Sync Active</span>
                    </div>
                    <button
                        onClick={handleMarkAllAsRead}
                        className="text-[11px] font-bold text-[#8b949e] hover:text-[#f5a623] transition-colors underline decoration-dotted underline-offset-4 uppercase tracking-widest"
                    >
                        Mark all as Read
                    </button>
                </div>

                {/* Notifications List */}
                <div className="space-y-3">
                    {loading && notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-[#f5a623] mb-4" />
                            <p className="text-sm text-[#8b949e] font-bold uppercase tracking-widest">Loading notifications...</p>
                        </div>
                    ) : notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div key={notification.id} className="relative group">
                                <Link
                                    href={notification.link || `/dashboard/notifications`}
                                    onClick={() => handleMarkAsRead(notification.id, notification.isBoosting)}
                                    className={cn(
                                        "relative flex items-start gap-4 p-5 transition-all border border-[#2d333b] rounded-xl hover:bg-[#1c2128] block overflow-hidden",
                                        !notification.isRead
                                            ? "bg-[#f5a623]/[0.03] border-[#f5a623]/30 shadow-[0_0_40px_rgba(245,166,35,0.03)]"
                                            : "opacity-60 grayscale hover:grayscale-0 hover:opacity-100 bg-[#1c2128]/20"
                                    )}
                                >
                                    {/* Icon / Game Avatar */}
                                    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0d1117] border border-[#2d333b] p-1 shadow-inner overflow-hidden">
                                        {notification.gameIcon ? (
                                            <Image
                                                src={notification.gameIcon}
                                                alt={notification.gameName || "Game"}
                                                width={40}
                                                height={40}
                                                className="object-contain"
                                            />
                                        ) : (
                                            <div className="h-6 w-6 text-[#f5a623]">
                                                {notification.type === 'MESSAGE_NEW' ? <MessageCircle className="h-full w-full" /> :
                                                    notification.type === 'ORDER_NEW' ? <ShoppingBag className="h-full w-full" /> :
                                                        <Bell className="h-full w-full" />}
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[15px] font-semibold text-white tracking-tight uppercase">
                                                {notification.title}
                                            </span>
                                            <span className="text-[10px] font-semibold text-[#8b949e] uppercase tracking-widest bg-[#2d333b]/30 px-2 py-0.5 rounded">
                                                {new Date(notification.createdAt).toLocaleDateString() === new Date().toLocaleDateString() ?
                                                    'Today' : new Date(notification.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-[13px] text-[#9ca3af] font-medium leading-relaxed tracking-tight line-clamp-2">
                                            {notification.content}
                                        </p>
                                        <div className="flex items-center gap-4 mt-2">
                                            <span className="text-[9px] font-semibold text-[#58a6ff] uppercase tracking-[0.2em]">
                                                {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            {notification.isBoosting && (
                                                <Badge variant="outline" className="text-[9px] border-[#f5a623] text-[#f5a623] font-semibold tracking-widest px-2 h-4">BOOSTING REQUEST</Badge>
                                            )}
                                        </div>
                                    </div>

                                    {/* Mark as read on hover */}
                                    {!notification.isRead && (
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleMarkAsRead(notification.id, notification.isBoosting);
                                            }}
                                            className="absolute top-4 right-4 h-8 w-8 rounded-full bg-[#1c2128] border border-[#2d333b] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-[#f5a623] hover:text-black group/read"
                                            title="Mark as read"
                                        >
                                            <Check className="h-4 w-4" />
                                        </button>
                                    )}

                                    {/* Indicator Bar */}
                                    {!notification.isRead && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-[#f5a623] rounded-r-full shadow-[0_0_15px_rgba(245,166,35,0.5)]" />
                                    )}
                                </Link>
                            </div>
                        ))
                    ) : (
                        !loading && (
                            <div className="flex flex-col items-center justify-center py-24 bg-[#0d1117]/30 rounded-2xl border border-dashed border-[#2d333b]">
                                <div className="h-16 w-16 rounded-full bg-[#1c2128] flex items-center justify-center mb-6">
                                    <Bell className="h-8 w-8 text-[#2d333b]" />
                                </div>
                                <h3 className="text-xl font-semibold text-white uppercase tracking-tight">No incoming notifications</h3>
                                <p className="text-[#8b949e] text-sm font-bold uppercase tracking-[0.2em] mt-2">Your slate is clean.</p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

