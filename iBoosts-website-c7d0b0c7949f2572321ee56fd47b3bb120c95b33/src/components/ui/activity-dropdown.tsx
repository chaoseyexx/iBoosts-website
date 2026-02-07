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
const activityIcons: Record<string, React.ElementType> = {
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
            className="absolute right-0 top-full mt-2 w-96 bg-[#1c2128] border border-[#2d333b] rounded-lg shadow-xl z-50 overflow-hidden"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#2d333b]">
                <div>
                    <h3 className="font-semibold text-white">Activity</h3>
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

            {/* Activities list */}
            <div className="min-h-[200px] max-h-[400px] overflow-y-auto">
                {activities.length > 0 ? (
                    activities.map((activity) => {
                        const IconComponent = activityIcons[activity.type] || ShoppingBag;
                        const color = activityColors[activity.type] || "#6b7280";

                        const ActivityIcon = IconComponent as any;

                        return (
                            <Link
                                key={activity.id}
                                href={activity.link || "/dashboard/orders"}
                                className="flex items-start gap-3 p-4 hover:bg-[#252b33] transition-colors border-b border-[#2d333b] last:border-b-0"
                            >
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                    style={{ backgroundColor: `${color}20` }}
                                >
                                    <ActivityIcon className="h-5 w-5" style={{ color }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white">{activity.title}</p>
                                    <p className="text-xs text-[#6b7280]">{activity.status}</p>
                                    <p className="text-xs text-[#6b7280] mt-1">{activity.timestamp}</p>
                                </div>
                            </Link>
                        );
                    })
                ) : (
                    <div className="p-8 text-center">
                        {/* Empty state illustration */}
                        <div className="w-20 h-20 mx-auto mb-4 bg-[#252b33] rounded-full flex items-center justify-center">
                            <span className="text-4xl">📦</span>
                        </div>
                        <p className="text-white font-medium mb-1">You have no activities</p>
                        <p className="text-sm text-[#6b7280]">
                            Active orders, disputes, and boosting requests will appear here
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

// Activity button with dropdown
export function ActivityButton() {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-[#9ca3af] hover:text-white transition-colors"
                title="Activity"
            >
                <ArrowLeftRight className="h-5 w-5" />
            </button>

            <ActivityDropdown isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>
    );
}
