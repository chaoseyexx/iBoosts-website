"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Check, ShoppingBag, Wallet, MessageCircle, AlertTriangle, ShieldCheck, Gamepad2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Mock notifications with game-specific data
const mockNotifications = [
    {
        id: "1",
        game: "Warframe",
        type: "Credit Farming",
        time: "23s ago",
        read: false,
        icon: "https://i.imgur.com/u7FvX8B.png",
    },
    {
        id: "2",
        game: "Valorant",
        type: "Rank Boost",
        time: "27s ago",
        read: false,
        details: ["Platinum III", "Platinum II", "EU"],
        icon: "https://i.imgur.com/8N48l8b.png",
    },
    {
        id: "3",
        game: "Valorant",
        type: "Rank Boost",
        time: "48s ago",
        read: false,
        details: ["Ascendant II", "Immortal I", "NA"],
        icon: "https://i.imgur.com/8N48l8b.png",
    },
    {
        id: "4",
        game: "Fisch",
        type: "Rod Services",
        time: "1min ago",
        read: false,
        details: ["I want the masterline rod"],
        icon: "https://i.imgur.com/39A8n8A.png",
    },
    {
        id: "5",
        game: "Roblox",
        type: "Custom Request",
        time: "4min ago",
        read: false,
        details: ["Bee Swarm Simulator"],
        icon: "https://i.imgur.com/39A8n8A.png",
    },
    {
        id: "6",
        game: "Valorant",
        type: "Rank Boost",
        time: "4min ago",
        read: true,
        details: ["Ascendant III", "Ascendant III", "EU"],
        icon: "https://i.imgur.com/8N48l8b.png",
    },
];

export default function NotificationsPage() {
    const [notifications, setNotifications] = React.useState(mockNotifications);

    const markAllAsRead = () => {
        setNotifications(notifications.map((n) => ({ ...n, read: true })));
    };

    const markAsRead = (id: string) => {
        setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
    };

    return (
        <div className="relative min-h-[calc(100vh-100px)]">
            {/* Background Character Graphic */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-15 pointer-events-none z-0 overflow-hidden">
                <Image
                    src="https://i.imgur.com/39A8n8A.png" // Placeholder for the character graphic
                    alt="Background Character"
                    fill
                    className="object-contain object-right"
                />
            </div>

            <div className="relative z-10 space-y-6">
                {/* Page Header */}
                <div className="flex items-center gap-3">
                    <Bell className="h-6 w-6 text-[#f5a623] fill-[#f5a623]" />
                    <h1 className="text-3xl font-black text-white tracking-tight italic uppercase">Notifications</h1>
                </div>

                {/* Status and Action Row */}
                <div className="flex items-center justify-between border-b border-[#2d333b]/30 pb-4">
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00b67a] opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00b67a]"></span>
                        </span>
                        <span className="text-[11px] font-bold text-[#4b5563] uppercase tracking-wider">Connected</span>
                    </div>
                    <button
                        onClick={markAllAsRead}
                        className="text-[11px] font-bold text-[#8b949e] hover:text-[#f5a623] transition-colors underline decoration-dotted underline-offset-4"
                    >
                        Mark all as Read
                    </button>
                </div>

                {/* Notifications List */}
                <div className="space-y-1">
                    {notifications.map((notification) => (
                        <Link
                            key={notification.id}
                            href={`/boosting-request/${notification.id}`}
                            onClick={() => markAsRead(notification.id)}
                            className={cn(
                                "group relative flex items-start gap-4 p-4 transition-all border-l-2 block cursor-pointer",
                                !notification.read
                                    ? "border-[#f5a623] bg-[#f5a623]/[0.02]"
                                    : "border-transparent opacity-60 grayscale hover:grayscale-0 hover:opacity-100 hover:bg-[#1c2128]/30"
                            )}
                        >
                            {/* Game Icon */}
                            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1c2128] border border-[#2d333b]/50 p-1.5 overflow-hidden">
                                <Image
                                    src={notification.icon}
                                    alt={notification.game}
                                    width={32}
                                    height={32}
                                    className="object-contain"
                                />
                            </div>

                            {/* Notification Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-[13px] font-bold text-white">
                                        {notification.game} <span className="text-[#8b949e] font-medium italic">({notification.type})</span>
                                    </span>
                                    <span className="text-[11px] font-bold text-[#4b5563] uppercase">
                                        • {notification.time}
                                    </span>
                                </div>
                                {notification.details && (
                                    <div className="mt-0.5 space-y-0.5">
                                        {notification.details.map((detail, idx) => (
                                            <p key={idx} className="text-[12px] text-[#8b949e] font-medium leading-tight">
                                                {detail}
                                            </p>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Mark as Read Action */}
                            <button
                                onClick={() => markAsRead(notification.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-[#4b5563] hover:text-[#f5a623] uppercase tracking-tighter"
                            >
                                Mark as read
                            </button>

                            {/* Decorative Line (if unread) */}
                            {!notification.read && (
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#f5a623] rounded-l-full blur-[1px]" />
                            )}
                        </Link>
                    ))}
                </div>

                {/* Empty State */}
                {notifications.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 bg-[#0d1117]/30 rounded-2xl border border-dashed border-[#2d333b]">
                        <Bell className="h-12 w-12 text-[#2d333b] mb-4" />
                        <h3 className="text-lg font-bold text-white italic uppercase italic">No notifications</h3>
                        <p className="text-[#4b5563] text-sm">You are all caught up for now.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}

