"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
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

    return (
        <aside className="sticky top-[88px] flex h-[calc(100vh-88px)] w-64 flex-col border-r border-[#2d333b]/40 bg-[#0d1117] flex-shrink-0">
            {/* User Profile Section */}
            <div className="border-b border-[#2d333b]/40 py-5 px-4">
                <div className="flex items-center gap-3">
                    <Avatar
                        src={user?.avatar || undefined}
                        fallback={user?.username || "User"}
                        size="md"
                    />
                    <div className="flex flex-col flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="font-bold text-white truncate text-base">
                                {user?.username || "Guest"}
                            </span>
                            {user?.verified && (
                                <Shield className="h-4 w-4 text-[#f5a623] fill-[#f5a623]" />
                            )}
                        </div>
                        <p className="text-[11px] font-bold text-[#4b5563] uppercase">
                            Registered: {user?.registeredAt || "N/A"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-2">
                {sidebarSections.map((section) => (
                    <div key={section.id}>
                        {section.children ? (
                            <>
                                <button
                                    onClick={() => toggleSection(section.id)}
                                    className={cn(
                                        "flex w-full items-center justify-between px-4 py-3 transition-colors",
                                        isSectionActive(section)
                                            ? "text-[#f5a623]"
                                            : "text-[#8b949e] hover:text-white hover:bg-[#1c2128]"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <section.icon className="h-4.5 w-4.5" />
                                        <span className="text-[13px] font-bold">{section.label}</span>
                                    </div>
                                    {expandedSections.includes(section.id) ? (
                                        <ChevronUp className="h-3.5 w-3.5" />
                                    ) : (
                                        <ChevronDown className="h-3.5 w-3.5" />
                                    )}
                                </button>
                                {expandedSections.includes(section.id) && (
                                    <div className="mt-0.5">
                                        {section.children.map((child) => (
                                            <Link
                                                key={child.href}
                                                href={child.href}
                                                className={cn(
                                                    "block pl-10 pr-4 py-2 text-[12px] font-bold transition-all",
                                                    isActive(child.href)
                                                        ? "bg-[#f5a623] text-black"
                                                        : "text-[#8b949e] hover:text-white"
                                                )}
                                            >
                                                {child.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <Link
                                href={section.href!}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-2.5 transition-colors",
                                    pathname === section.href
                                        ? "bg-[#f5a623] text-black"
                                        : "text-[#8b949e] hover:text-white hover:bg-[#1c2128]"
                                )}
                            >
                                <section.icon className="h-4.5 w-4.5" />
                                <span className="text-[13px] font-bold">{section.label}</span>
                            </Link>
                        )}
                    </div>
                ))}
            </nav>
        </aside>
    );
}
