"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    ShoppingBag,
    ChevronDown,
    ChevronUp,
    Coins,
    TrendingUp,
    Wallet,
    MessageCircle,
    Bell,
    MessageSquare,
    Settings,
    Eye,
    Shield,
    User as UserIcon,
} from "lucide-react";

interface SidebarLink {
    href: string;
    label: string;
    category?: string;
}

interface SidebarSection {
    id: string;
    label: string;
    icon: any;
    href?: string;
    basePath?: string;
    children?: SidebarLink[];
}

interface DashboardSidebarProps {
    user?: {
        username: string;
        displayName?: string | null;
        avatar?: string | null;
        registeredAt?: string;
        verified?: boolean;
        role?: string;
        sellerLevel?: number;
    };
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [expandedSections, setExpandedSections] = React.useState<string[]>(["orders", "offers"]);

    const sidebarSections: SidebarSection[] = [
        {
            id: "orders",
            label: "Orders",
            icon: ShoppingBag,
            basePath: "/dashboard/orders",
            children: [
                { href: "/dashboard/orders?type=purchased", label: "Purchased orders", category: "purchased" },
                { href: "/dashboard/orders?type=sold", label: "Sold orders", category: "sold" },
            ],
        },
        {
            id: "offers",
            label: "Offers",
            icon: Coins,
            basePath: "/dashboard/offers",
            children: [
                { href: "/dashboard/offers?category=currency", label: "Currency", category: "currency" },
                { href: "/dashboard/offers?category=accounts", label: "Accounts", category: "accounts" },
                { href: "/dashboard/offers?category=top-ups", label: "Top Ups", category: "top-ups" },
                { href: "/dashboard/offers?category=items", label: "Items", category: "items" },
                { href: "/dashboard/offers?category=gift-cards", label: "Gift Cards", category: "gift-cards" },
            ],
        },
        {
            id: "boosting",
            label: "Boosting",
            icon: TrendingUp,
            basePath: "/dashboard/boosting",
            children: [
                { href: "/dashboard/boosting?type=my-requests", label: "My requests", category: "my-requests" },
                { href: "/dashboard/boosting?type=received", label: "Received requests", category: "received" },
            ],
        },
        {
            id: "wallet",
            label: "Wallet",
            icon: Wallet,
            href: "/dashboard/wallet",
        },
        {
            id: "messages",
            label: "Messages",
            icon: MessageCircle,
            href: "/dashboard/messages",
        },
        {
            id: "notifications",
            label: "Notifications",
            icon: Bell,
            href: "/dashboard/notifications",
        },
        {
            id: "feedback",
            label: "Feedback",
            icon: MessageSquare,
            href: "/dashboard/feedback",
        },
        {
            id: "account-settings",
            label: "Account settings",
            icon: Settings,
            href: "/dashboard/settings",
        },
        {
            id: "view-profile",
            label: "View Profile",
            icon: Eye,
            href: `/users/${user?.username || "Guest"}`,
        },
    ];

    const toggleSection = (sectionId: string) => {
        setExpandedSections((prev) =>
            prev.includes(sectionId)
                ? prev.filter((id) => id !== sectionId)
                : [...prev, sectionId]
        );
    };

    const isActive = (href: string) => {
        const [path, queryString] = href.split("?");
        const params = new URLSearchParams(queryString || "");

        if (pathname !== path) return false;

        for (const [key, value] of params.entries()) {
            if (searchParams.get(key) !== value) return false;
        }
        return true;
    };

    const isSectionActive = (section: SidebarSection) => {
        if (section.href) return pathname === section.href;
        if (section.basePath) return pathname === section.basePath || pathname.startsWith(section.basePath);
        return section.children?.some((child) => isActive(child.href));
    };

    // Helper to determine role badge
    const getRoleBadge = () => {
        const role = user?.role || "BUYER";
        const level = user?.sellerLevel || 0;

        if (role === "ADMIN") return { text: "ADMIN", color: "text-[#ff4d4f]", border: "border-[#ff4d4f]/20", bg: "bg-[#ff4d4f]/10" };
        if (role === "SUPPORT") return { text: "SUPPORT", color: "text-[#1890ff]", border: "border-[#1890ff]/20", bg: "bg-[#1890ff]/10" };
        if (role === "MODERATOR") return { text: "MODERATOR", color: "text-[#722ed1]", border: "border-[#722ed1]/20", bg: "bg-[#722ed1]/10" };

        if (role === "SELLER") {
            if (level >= 10) return { text: "ELITE SELLER", color: "text-[#f5a623]", border: "border-[#f5a623]/20", bg: "bg-[#f5a623]/10" };
            return { text: `SELLER LVL ${level}`, color: "text-[#52c41a]", border: "border-[#52c41a]/20", bg: "bg-[#52c41a]/10" };
        }

        return { text: "MEMBER", color: "text-[#8b949e]", border: "border-[#8b949e]/20", bg: "bg-[#8b949e]/10" };
    };

    const badge = getRoleBadge();

    return (
        <aside className="hidden lg:flex sticky top-[96px] h-[calc(100vh-96px)] w-64 flex-col border-r border-white/[0.05] bg-[#0d1117] flex-shrink-0 z-20">
            <div className="border-b border-[#2d333b]/40 p-5 bg-white/[0.01]">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-black/40 border border-[#f5a623]/20 flex items-center justify-center relative shadow-lg overflow-hidden">
                        <Avatar className="h-full w-full rounded-none">
                            {user?.avatar && user.avatar !== "" && user.avatar !== "null" && (
                                <AvatarImage src={user.avatar} alt={user?.username || ""} className="object-cover" />
                            )}
                            <AvatarFallback className="bg-transparent">
                                <UserIcon className="h-5 w-5 text-[#f5a623]" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-[#f5a623] border-2 border-[#0d1117] shadow-[0_0_5px_rgba(245,166,35,0.5)] z-10" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <span className="block font-semibold text-white truncate text-[13px] tracking-tight leading-none mb-1">
                            {user?.username || "Guest"}
                        </span>
                        <div className="flex items-center gap-1.5">
                            <span className={cn(
                                "block text-[9px] font-semibold uppercase tracking-[0.2em] leading-none px-1.5 py-0.5 rounded border",
                                badge.color,
                                badge.border,
                                badge.bg
                            )}>
                                {badge.text}
                            </span>
                            {user?.verified && <Shield className="h-3 w-3 text-[#f5a623] fill-[#f5a623]" />}
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {sidebarSections.map((section) => (
                    <div key={section.id}>
                        {section.children ? (
                            <>
                                <button
                                    onClick={() => toggleSection(section.id)}
                                    className={cn(
                                        "flex w-full items-center justify-between px-4 py-3.5 transition-all relative group",
                                        isSectionActive(section)
                                            ? "text-white bg-white/[0.03]"
                                            : "text-[#8b949e] hover:text-white hover:bg-white/[0.02]"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <section.icon className={cn(
                                            "h-[18px] w-[18px] transition-colors",
                                            isSectionActive(section) ? "text-[#f5a623]" : "group-hover:text-[#f5a623]"
                                        )} />
                                        <span className={cn(
                                            "text-[13px] font-bold uppercase tracking-[0.1em] transition-colors",
                                            isSectionActive(section) ? "text-white" : "text-[#8b949e] group-hover:text-white"
                                        )}>
                                            {section.label}
                                        </span>
                                    </div>
                                    {expandedSections.includes(section.id) ? (
                                        <ChevronUp className={cn(
                                            "h-4 w-4 transition-transform duration-200",
                                            expandedSections.includes(section.id) && "rotate-180",
                                            isSectionActive(section) ? "text-[#f5a623]" : "text-[#8b949e]"
                                        )} />
                                    ) : (
                                        <ChevronDown className="h-4 w-4 text-[#8b949e]" />
                                    )}
                                </button>
                                {expandedSections.includes(section.id) && (
                                    <div className="mt-1 space-y-1">
                                        {section.children.map((child) => (
                                            <Link
                                                key={child.href}
                                                href={child.href}
                                                className={cn(
                                                    "block mx-2 pl-9 pr-3 py-2 text-[12px] font-bold rounded-lg transition-all",
                                                    isActive(child.href)
                                                        ? "bg-[#f5a623] text-black shadow-[0_0_15px_rgba(245,166,35,0.2)]"
                                                        : "text-[#8b949e] hover:text-white hover:bg-white/[0.03]"
                                                )}
                                            >
                                                <span className={cn(
                                                    "transition-colors",
                                                    isActive(child.href) ? "text-black" : "text-[#8b949e] group-hover:text-white"
                                                )}>
                                                    {child.label}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <Link
                                href={section.href!}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group text-[13px] font-bold tracking-wide",
                                    isActive(section.href!)
                                        ? "bg-[#f5a623] text-black shadow-[0_0_20px_rgba(245,166,35,0.15)]"
                                        : "text-[#8b949e] hover:text-white hover:bg-white/[0.02]"
                                )}
                            >
                                <section.icon className={cn(
                                    "h-5 w-5 transition-colors",
                                    pathname === section.href ? "text-black" : "text-[#8b949e] group-hover:text-white"
                                )} />
                                <span className={cn(
                                    "transition-colors",
                                    pathname === section.href ? "text-black" : "text-[#8b949e] group-hover:text-white"
                                )}>
                                    {section.label}
                                </span>
                            </Link>
                        )}
                    </div>
                ))}
            </nav>
        </aside >
    );
}
