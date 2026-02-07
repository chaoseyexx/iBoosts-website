"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    ShoppingBag,
    Coins,
    TrendingUp,
    Wallet,
    MessageCircle,
    Bell,
    Settings,
    User as UserIcon,
} from "lucide-react";

const mobileLinks = [
    { href: "/dashboard/orders", icon: ShoppingBag, label: "Orders" },
    { href: "/dashboard/offers", icon: Coins, label: "Offers" },
    { href: "/dashboard/boosting", icon: TrendingUp, label: "Boosting" },
    { href: "/dashboard/wallet", icon: Wallet, label: "Wallet" },
    { href: "/dashboard/messages", icon: MessageCircle, label: "Messages" },
    { href: "/dashboard/notifications", icon: Bell, label: "Notifications" },
    { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export function MobileDashboardNav() {
    const pathname = usePathname();

    return (
        <div className="lg:hidden border-b border-[#1c2128] bg-[#0a0e13] sticky top-[60px] z-30 overflow-x-auto scrollbar-hide">
            <div className="flex px-4 py-3 gap-2 min-w-max">
                {mobileLinks.map((link) => {
                    const isActive = pathname.startsWith(link.href);
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap",
                                isActive
                                    ? "bg-[#f5a623] text-black"
                                    : "bg-[#1c2128] text-[#8b949e] hover:text-white"
                            )}
                        >
                            <link.icon className="h-3.5 w-3.5" />
                            {link.label}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
