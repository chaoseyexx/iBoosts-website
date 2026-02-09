"use client";

import * as React from "react";
import Link from "next/link";
import { X, ArrowLeftRight, ShoppingBag, AlertTriangle, TrendingUp, Package } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Activity {
    id: string;
    type: "order" | "dispute" | "boosting" | "delivery";
    title: string;
    status: string;
    timestamp: string;
    link?: string;
}

// Activity type icons
const activityIcons: Record<string, any> = {
    order: ShoppingBag,
    dispute: AlertTriangle,
    boosting: TrendingUp,
    delivery: Package,
};

// Activity type colors
const activityColors: Record<string, string> = {
    order: "#22c55e",
    dispute: "#ef4444",
    boosting: "#5c9eff",
    delivery: "#f5a623",
};

// Mock activities - replace with real data
const mockActivities: Activity[] = [];

interface ActivityDropdownProps {
    isOpen: boolean;
    onClose: () => void;
    activities?: Activity[];
}

export function ActivityDropdown({
    isOpen,
    onClose,
    activities = mockActivities,
}: ActivityDropdownProps) {
    const [isConnected, setIsConnected] = React.useState(true);
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

    if (!isOpen) return null;

    return (
        <div
            ref={dropdownRef}
            className="absolute right-0 top-full mt-4 w-[400px] bg-[#0d1117]/95 backdrop-blur-xl border border-white/5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[100] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 ring-1 ring-white/10"
        >
            {/* Glow Header */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#f5a623]/20 to-transparent" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-white/[0.02]">
                <div className="space-y-1">
                    <h3 className="text-[11px] font-extrabold text-white uppercase tracking-[0.2em]">Activity Feed</h3>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded-full">
                            <span className={cn(
                                "h-1.5 w-1.5 rounded-full animate-pulse",
                                isConnected ? "bg-green-500" : "bg-yellow-500"
                            )} />
                            <span className="text-[9px] font-bold text-green-500 uppercase tracking-tight">
                                Live
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="text-[9px] font-bold text-[#8b949e] hover:text-white uppercase tracking-widest transition-colors px-3 py-1 hover:bg-white/5 rounded-md">
                        Clear All
                    </button>
                    <button
                        onClick={onClose}
                        className="h-8 w-8 rounded-full flex items-center justify-center text-[#8b949e] hover:text-white hover:bg-white/5 transition-all"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Activities list */}
            <div className="min-h-[200px] max-h-[480px] overflow-y-auto scrollbar-hide py-2">
                {activities.length > 0 ? (
                    activities.map((activity) => {
                        const IconComponent = activityIcons[activity.type] || ShoppingBag;
                        const baseColor = activityColors[activity.type] || "#ffffff";

                        // Status styling
                        const isPending = activity.status.toLowerCase().includes('pending');
                        const isDelivered = activity.status.toLowerCase().includes('delivered') || activity.status.toLowerCase().includes('approved');

                        return (
                            <Link
                                key={activity.id}
                                onClick={onClose}
                                href={activity.link || "/dashboard/orders"}
                                className="group flex items-start gap-4 px-6 py-4 hover:bg-white/[0.03] transition-all border-b border-white/[0.02] last:border-b-0 relative overflow-hidden"
                            >
                                {/* Item Glow */}
                                <div className="absolute inset-y-0 left-0 w-[2px] bg-[#f5a623] scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />

                                <div
                                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 duration-300 border border-white/5 relative bg-[#0f1419]"
                                >
                                    <IconComponent className="h-5 w-5 text-white/70 group-hover:text-white" />
                                </div>

                                <div className="flex-1 min-w-0 space-y-1.5">
                                    <div className="flex items-start justify-between gap-2">
                                        <p className="text-[12px] font-bold text-white group-hover:text-[#f5a623] transition-colors leading-snug line-clamp-1">
                                            {activity.title}
                                        </p>
                                        <span className="text-[8px] font-black text-[#5a5a5a] uppercase whitespace-nowrap mt-0.5">
                                            {activity.timestamp}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className={cn(
                                            "text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-md",
                                            isPending ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                                                isDelivered ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                                                    "bg-white/5 text-[#8b949e] border border-white/10"
                                        )}>
                                            {activity.status}
                                        </span>
                                        <div className="h-1 w-1 rounded-full bg-[#30363d]" />
                                        <span className="text-[9px] font-bold text-[#8b949e] uppercase tracking-tighter">
                                            Order Ref
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                ) : (
                    <div className="py-16 px-8 text-center space-y-4">
                        <div className="w-16 h-16 mx-auto bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 rotate-12 group hover:rotate-0 transition-all duration-500 shadow-2xl">
                            <Package className="h-8 w-8 text-[#30363d]" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-extrabold text-white uppercase tracking-widest">Sky is clear</p>
                            <p className="text-[10px] text-[#8b949e] uppercase tracking-tight font-medium opacity-60 italic">
                                No active notifications at this time
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <Link
                href="/dashboard/orders"
                onClick={onClose}
                className="flex items-center justify-center py-4 bg-white/[0.02] border-t border-white/5 hover:bg-white/[0.05] transition-all group"
            >
                <span className="text-[10px] font-black text-[#f5a623] uppercase tracking-[0.2em] group-hover:tracking-[0.3em] transition-all">
                    View Full Activity Log
                </span>
            </Link>
        </div>
    );
}

// Activity button with dropdown
export function ActivityButton() {
    const [isOpen, setIsOpen] = React.useState(false);
    const [activities, setActivities] = React.useState<Activity[]>([]);

    React.useEffect(() => {
        if (isOpen) {
            import("@/app/(dashboard)/dashboard/activity-actions").then(mod => {
                mod.getRecentActivities().then(data => setActivities(data));
            });
        }
    }, [isOpen]);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "h-10 w-10 md:h-11 md:w-11 rounded-xl flex items-center justify-center transition-all border",
                    isOpen
                        ? "bg-[#f5a623]/10 border-[#f5a623]/20 shadow-[0_0_20px_rgba(245,166,35,0.1)]"
                        : "bg-white/[0.03] border-white/5 hover:border-white/10"
                )}
                title="Activity"
            >
                <div className="relative">
                    <ArrowLeftRight className={cn(
                        "h-4 w-4 md:h-5 md:w-5 transition-all",
                        isOpen ? "text-[#f5a623]" : "text-[#8b949e]"
                    )} />
                    {activities.length > 0 && !isOpen && (
                        <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-[#f5a623] rounded-full border-2 border-[#0d1117]" />
                    )}
                </div>
            </button>

            <ActivityDropdown isOpen={isOpen} onClose={() => setIsOpen(false)} activities={activities} />
        </div>
    );
}
