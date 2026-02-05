"use client";

import * as React from "react";
import Link from "next/link";
import { X, Bell, ShoppingBag, TrendingUp, PackageCheck, AlertTriangle, MessageCircle, Shield, Info, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/app/(dashboard)/dashboard/notifications/actions";

// Notification types with icons
const notificationIcons: Record<string, React.ElementType> = {
    order: ShoppingBag,
    boosting: TrendingUp,
    delivered: PackageCheck,
    dispute: AlertTriangle,
    message: MessageCircle,
    security: Shield,
    SYSTEM: Bell,
    default: Bell,
};

// Notification type colors
const notificationColors: Record<string, string> = {
    order: "#22c55e",
    boosting: "#5c9eff",
    delivered: "#22c55e",
    dispute: "#ef4444",
    message: "#f5a623",
    security: "#f59e0b",
    SYSTEM: "#3b82f6",
    default: "#6b7280",
};

export interface Notification {
    id: string;
    type: "order" | "boosting" | "delivered" | "dispute" | "message" | "security" | "default";
    title: string;
    details: string[];
    timestamp: string;
    read: boolean;
    icon?: string; // Optional custom icon (emoji or image URL)
    link?: string;
}

// Mock notifications
const mockNotifications: Notification[] = [
    {
        id: "1",
        type: "boosting",
        title: "Marvel Rivals (Hero proficiency)",
        details: ["Adam Warlock", "Captain", "Lord", "PlayStation"],
        timestamp: "3min ago",
        read: false,
        icon: "🎮",
    },
    {
        id: "2",
        type: "boosting",
        title: "Rainbow Six Siege X (Leveling Boost)",
        details: ["45", "50", "PC", "North America"],
        timestamp: "3min ago",
        read: false,
        icon: "🎯",
    },
    {
        id: "3",
        type: "boosting",
        title: "Marvel Rivals (Rank Boost)",
        details: ["Grandmaster I", "Celestial I", "PC"],
        timestamp: "6min ago",
        read: false,
        icon: "🎮",
    },
    {
        id: "4",
        type: "boosting",
        title: "Valorant (Rank Boost)",
        details: ["Silver I", "Diamond I", "NA"],
        timestamp: "6min ago",
        read: true,
        icon: "❤️",
    },
    {
        id: "5",
        type: "order",
        title: "New Order Received",
        details: ["GamerX purchased Discord Nitro", "$79.99"],
        timestamp: "10min ago",
        read: true,
    },
    {
        id: "6",
        type: "delivered",
        title: "Order Delivered",
        details: ["Order ORD-2026-001234 confirmed", "Funds released to wallet"],
        timestamp: "15min ago",
        read: true,
    },
];

// Notification sound hook
function useNotificationSound() {
    const audioRef = React.useRef<HTMLAudioElement | null>(null);

    React.useEffect(() => {
        // Create audio element for notification sound
        audioRef.current = new Audio("/sounds/notification.mp3");
        audioRef.current.volume = 0.5;
        return () => {
            audioRef.current = null;
        };
    }, []);

    const playSound = React.useCallback(() => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {
                // Autoplay might be blocked
            });
        }
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
    const [localNotifications, setLocalNotifications] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(false);
    const playSound = useNotificationSound();
    const dropdownRef = React.useRef<HTMLDivElement>(null);

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

    // Simulate real-time notifications (for demo)
    React.useEffect(() => {
        if (!isOpen) return;

        const interval = setInterval(() => {
            // Simulate connection status
            setIsConnected(Math.random() > 0.1);
        }, 5000);

        return () => clearInterval(interval);
    }, [isOpen]);

    const fetchNotifications = React.useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        const data = await getNotifications(userId);
        setLocalNotifications(data || []);
        if (onCountChange) {
            onCountChange(data?.filter((n: any) => !n.isRead).length || 0);
        }
        setLoading(false);
    }, [userId, onCountChange]);

    React.useEffect(() => {
        if (isOpen && userId) {
            fetchNotifications();
        }
    }, [isOpen, userId, fetchNotifications]);

    // Initial count fetch
    React.useEffect(() => {
        if (userId) {
            fetchNotifications();
        }
    }, [userId]);

    const markAllAsRead = async () => {
        if (!userId) return;
        await markAllNotificationsAsRead(userId);
        setLocalNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        if (onCountChange) onCountChange(0);
    };

    const handleMarkAsRead = async (id: string) => {
        await markNotificationAsRead(id);
        setLocalNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
        const newUnreadCount = localNotifications.filter(n => !n.isRead && n.id !== id).length;
        if (onCountChange) onCountChange(newUnreadCount);
    };

    const unreadCount = localNotifications.filter((n) => !n.isRead).length;

    if (!isOpen) return null;

    return (
        <div
            ref={dropdownRef}
            className="absolute right-0 top-full mt-2 w-96 bg-[#1c2128] border border-[#2d333b] rounded-lg shadow-xl z-50 overflow-hidden animate-fade-in"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#2d333b]">
                <div>
                    <h3 className="font-semibold text-white">Notifications</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={cn(
                            "h-2 w-2 rounded-full",
                            isConnected ? "bg-green-500" : "bg-yellow-500"
                        )} />
                        <span className="text-xs text-[#6b7280]">
                            {isConnected ? "Connected" : "Reconnecting..."}
                        </span>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="h-8 w-8 rounded-lg flex items-center justify-center text-[#6b7280] hover:text-white hover:bg-[#252b33] transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* Mark all as read */}
            <div className="px-4 py-2 border-b border-[#2d333b]">
                <button
                    onClick={markAllAsRead}
                    className="text-sm text-[#5c9eff] hover:underline"
                >
                    Mark all as Read
                </button>
            </div>

            {/* Notifications list */}
            <div className="max-h-[400px] overflow-y-auto">
                {loading ? (
                    <div className="p-8 text-center bg-[#1c2128]">
                        <Loader2 className="h-6 w-6 animate-spin text-[#f5a623] mx-auto" />
                    </div>
                ) : localNotifications.length > 0 ? (
                    localNotifications.map((notification) => {
                        const IconComponent = (notificationIcons[notification.type] || Info) as React.ElementType;
                        const color = notificationColors[notification.type] || "#f5a623";

                        return (
                            <Link
                                key={notification.id}
                                href={notification.link || "/dashboard/notifications"}
                                onClick={() => handleMarkAsRead(notification.id)}
                                className={cn(
                                    "flex items-start gap-3 p-4 hover:bg-[#252b33] transition-colors border-b border-[#2d333b] last:border-b-0",
                                    !notification.isRead && "bg-[#f5a623]/5"
                                )}
                            >
                                {/* Icon */}
                                <div className="flex-shrink-0">
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#21262d] border border-[#30363d]"
                                    >
                                        <IconComponent className="h-5 w-5" style={{ color }} />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <p className="text-sm font-medium text-white">
                                                {notification.title}
                                                <span className="ml-2 text-[10px] text-[#6b7280] font-normal">
                                                    {new Date(notification.createdAt).toLocaleDateString()}
                                                </span>
                                            </p>
                                            <p className="text-xs text-[#8b949e] mt-1 line-clamp-2">
                                                {notification.content}
                                            </p>
                                        </div>
                                        {!notification.isRead && (
                                            <div className="h-2 w-2 rounded-full bg-[#f5a623] shrink-0 mt-1.5" />
                                        )}
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                ) : (
                    <div className="p-8 text-center">
                        <Bell className="h-10 w-10 text-[#6b7280] mx-auto mb-3 opacity-20" />
                        <p className="text-[#6b7280] text-sm font-medium">No notifications yet</p>
                        <p className="text-[#8b949e] text-xs mt-1">We'll alert you when something happens.</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-[#2d333b]">
                <Link
                    href="/dashboard/notifications"
                    onClick={onClose}
                    className="block w-full py-2 px-4 text-center text-sm bg-[#252b33] hover:bg-[#2d333b] text-white rounded-lg transition-colors"
                >
                    View all notifications
                </Link>
            </div>
        </div>
    );
}

// Notification bell button with dropdown
interface NotificationBellProps {
    userId?: string;
}

export function NotificationBell({ userId }: NotificationBellProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [count, setCount] = React.useState(0);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative text-[#9ca3af] hover:text-white transition-colors"
            >
                <Bell className="h-5 w-5" />
                {count > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#f5a623] text-[10px] font-bold text-black">
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
