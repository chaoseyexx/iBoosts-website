"use client";

import * as React from "react";
import Link from "next/link";
import { X, Bell, ShoppingBag, TrendingUp, PackageCheck, AlertTriangle, MessageCircle, Shield, Info, Loader2, Tag, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, getBoostingRequests } from "@/app/(dashboard)/dashboard/notifications/actions";
import { getSupabaseClient } from "@/lib/supabase/client";

// Notification types with icons
const notificationIcons: Record<string, any> = {
    ORDER_NEW: ShoppingBag,
    ORDER_DELIVERED: PackageCheck,
    ORDER_COMPLETED: PackageCheck,
    ORDER_CANCELLED: X,
    ORDER_DISPUTED: AlertTriangle,
    MESSAGE_NEW: MessageCircle,
    OFFER_RECEIVED: Tag,
    BOOSTING_REQUEST: Flame,
    SYSTEM: Bell,
    default: Bell,
};

// Notification type colors
const notificationColors: Record<string, string> = {
    ORDER_NEW: "#22c55e",
    ORDER_DELIVERED: "#22c55e",
    ORDER_COMPLETED: "#22c55e",
    ORDER_CANCELLED: "#ef4444",
    ORDER_DISPUTED: "#ef4444",
    MESSAGE_NEW: "#f5a623",
    BOOSTING_REQUEST: "#f5a623",
    SYSTEM: "#3b82f6",
    default: "#6b7280",
};

export interface UnifiedNotification {
    id: string;
    type: string;
    title: string;
    content: string;
    isRead: boolean;
    link?: string | null;
    createdAt: Date | string;
    isBoosting?: boolean;
}

// Notification sound hook (simplified)
function useNotificationSound() {
    const playSound = React.useCallback(() => {
        try {
            const audio = new Audio("/sounds/notification.mp3");
            audio.volume = 0.5;
            audio.play().catch(() => { });
        } catch (e) { }
    }, []);
    return playSound;
}

interface NotificationDropdownProps {
    isOpen: boolean;
    onClose: () => void;
    userId?: string;
    onCountChange?: (count: number) => void;
}

export function NotificationDropdown({
    isOpen,
    onClose,
    userId,
    onCountChange,
}: NotificationDropdownProps) {
    const [isConnected, setIsConnected] = React.useState(true);
    const [localNotifications, setLocalNotifications] = React.useState<UnifiedNotification[]>([]);
    const [loading, setLoading] = React.useState(false);
    const playSound = useNotificationSound();
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    // Fetch unified notifications
    const fetchAll = React.useCallback(async () => {
        if (!userId) return;
        setLoading(true);

        try {
            const [notifications, boosting] = await Promise.all([
                getNotifications(userId),
                getBoostingRequests()
            ]);

            const transformedBoosting: UnifiedNotification[] = boosting.map((b: any) => ({
                id: b.id,
                type: "BOOSTING_REQUEST",
                title: `🔥 New ${b.game.name} Boosting Request!`,
                content: b.description,
                isRead: false,
                link: `/dashboard/notifications`, // Or specific link if exists
                createdAt: b.createdAt,
                isBoosting: true
            }));

            const combined = [
                ...(notifications || []),
                ...transformedBoosting
            ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            setLocalNotifications(combined);
            if (onCountChange) {
                onCountChange(combined.filter(n => !n.isRead).length);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    }, [userId, onCountChange]);

    React.useEffect(() => {
        if (isOpen && userId) {
            fetchAll();
        }
    }, [isOpen, userId, fetchAll]);

    // Real-time listener
    React.useEffect(() => {
        if (!userId) return;

        const supabase = getSupabaseClient();
        const channel = supabase.channel(`notifications-${userId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'Notification',
                filter: `userId=eq.${userId}`
            }, () => {
                playSound();
                fetchAll();
            })
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'BoostingRequest'
            }, () => {
                playSound();
                fetchAll();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId, fetchAll, playSound]);

    // Close on click outside
    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    const markAllAsRead = async () => {
        if (!userId) return;
        await markAllNotificationsAsRead(userId);
        setLocalNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        if (onCountChange) onCountChange(0);
    };

    const handleMarkAsRead = async (id: string, isBoosting?: boolean) => {
        if (!isBoosting) {
            await markNotificationAsRead(id);
        }
        setLocalNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        const newCount = localNotifications.filter(n => !n.isRead && n.id !== id).length;
        if (onCountChange) onCountChange(newCount);
    };

    if (!isOpen) return null;

    return (
        <div
            ref={dropdownRef}
            className="absolute right-0 top-full mt-2 w-96 bg-[#1c2128] border border-[#2d333b] rounded-lg shadow-xl z-50 overflow-hidden animate-fade-in"
        >
            <div className="flex items-center justify-between p-4 border-b border-[#2d333b]">
                <div>
                    <h3 className="font-semibold text-white uppercase tracking-tight">Notifications</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
                        <span className="text-[10px] font-black text-[#5c9eff] uppercase tracking-widest">Live Connection</span>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="h-8 w-8 rounded-lg flex items-center justify-center text-[#6b7280] hover:text-white hover:bg-[#252b33] transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            <div className="px-4 py-2 border-b border-[#2d333b] flex justify-between items-center bg-[#13181e]">
                <button onClick={markAllAsRead} className="text-[11px] font-black text-[#5c9eff] hover:underline uppercase tracking-wider">
                    Mark all as Read
                </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto bg-[#0a0e13]/50">
                {loading && localNotifications.length === 0 ? (
                    <div className="p-8 text-center">
                        <Loader2 className="h-6 w-6 animate-spin text-[#f5a623] mx-auto" />
                    </div>
                ) : localNotifications.length > 0 ? (
                    localNotifications.map((notification) => {
                        const Icon = notificationIcons[notification.type] || notificationIcons.default;
                        const color = notificationColors[notification.type] || notificationColors.default;

                        return (
                            <Link
                                key={notification.id}
                                href={notification.link || "/dashboard/notifications"}
                                onClick={() => handleMarkAsRead(notification.id, notification.isBoosting)}
                                className={cn(
                                    "flex items-start gap-3 p-4 hover:bg-[#252b33] transition-colors border-b border-[#2d333b] last:border-b-0",
                                    !notification.isRead && "bg-[#f5a623]/10 border-l-2 border-[#f5a623]"
                                )}
                            >
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#21262d] border border-[#30363d] shadow-sm">
                                        <Icon className="h-5 w-5" style={{ color }} />
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <p className="text-[13px] font-bold text-white tracking-tight leading-snug">
                                                {notification.title}
                                            </p>
                                            <p className="text-[11px] text-[#8b949e] mt-1 line-clamp-2 leading-relaxed">
                                                {notification.content}
                                            </p>
                                            <p className="text-[9px] text-[#5c9eff] font-black uppercase mt-1 tracking-widest">
                                                {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                        {!notification.isRead && (
                                            <div className="h-2 w-2 rounded-full bg-[#f5a623] shrink-0 mt-1.5 shadow-[0_0_8px_rgba(245,166,35,0.8)]" />
                                        )}
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                ) : (
                    <div className="p-12 text-center opacity-50">
                        <Bell className="h-10 w-10 text-[#6b7280] mx-auto mb-3" />
                        <p className="text-white text-xs font-bold uppercase tracking-widest">No notifications</p>
                    </div>
                )}
            </div>

            <div className="p-3 border-t border-[#2d333b] bg-[#13181e]">
                <Link
                    href="/dashboard/notifications"
                    onClick={onClose}
                    className="block w-full py-2.5 px-4 text-center text-[11px] font-black bg-[#252b33] hover:bg-[#f5a623] hover:text-black text-white rounded-lg transition-all uppercase tracking-widest"
                >
                    View all notifications
                </Link>
            </div>
        </div>
    );
}

interface NotificationBellProps {
    userId?: string;
}

export function NotificationBell({ userId }: NotificationBellProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [count, setCount] = React.useState(0);
    const playSound = useNotificationSound();

    // Fetch initial unread count on mount
    React.useEffect(() => {
        if (!userId) return;

        const fetchInitialCount = async () => {
            try {
                const notifications = await getNotifications(userId);
                const unreadCount = (notifications || []).filter((n: any) => !n.isRead).length;
                setCount(unreadCount);
            } catch (error) {
                console.error("Error fetching initial notification count:", error);
            }
        };

        fetchInitialCount();
    }, [userId]);

    // Real-time subscription for badge updates
    React.useEffect(() => {
        if (!userId) return;

        const supabase = getSupabaseClient();
        const channel = supabase.channel(`bell-notifications-${userId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'Notification',
                filter: `userId=eq.${userId}`
            }, (payload: any) => {
                // Increment count
                setCount(prev => prev + 1);
                // Play sound
                playSound();
                // Show toast
                if (typeof window !== 'undefined') {
                    import('sonner').then(({ toast }) => {
                        toast.info(payload.new?.title || "New Notification", {
                            description: payload.new?.content || "You have a new notification",
                            action: {
                                label: "View",
                                onClick: () => setIsOpen(true)
                            }
                        });
                    });
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId, playSound]);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative text-[#9ca3af] hover:text-white transition-colors"
                title="Notifications"
            >
                <Bell className="h-5 w-5" />
                {count > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#f5a623] text-[9px] font-black text-black shadow-[0_0_10px_rgba(245,166,35,0.4)] animate-pulse">
                        {count > 99 ? "99+" : count}
                    </span>
                )}
            </button>

            <NotificationDropdown
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                userId={userId}
                onCountChange={setCount}
            />
        </div>
    );
}
