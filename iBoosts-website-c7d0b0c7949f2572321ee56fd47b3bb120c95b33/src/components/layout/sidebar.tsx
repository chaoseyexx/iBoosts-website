"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    Wallet,
    Bell,
    Settings,
    TrendingUp,
    BanknoteIcon,
    BarChart,
    Users,
    AlertTriangle,
    Shield,
    Flag,
    Cog,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

interface SidebarProps {
    variant: "buyer" | "seller" | "admin";
    isCollapsed?: boolean;
    onToggle?: () => void;
}

const buyerLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/orders", label: "Orders", icon: ShoppingBag },
    { href: "/wallet", label: "Wallet", icon: Wallet },
    { href: "/notifications", label: "Notifications", icon: Bell },
    { href: "/settings", label: "Settings", icon: Settings },
];

const sellerLinks = [
    { href: "/seller", label: "Overview", icon: LayoutDashboard },
    { href: "/listings", label: "My Listings", icon: Package },
    { href: "/seller/sales", label: "Sales", icon: TrendingUp },
    { href: "/withdrawals", label: "Withdrawals", icon: BanknoteIcon },
    { href: "/seller/analytics", label: "Analytics", icon: BarChart },
];

const adminLinks = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { href: "/admin/disputes", label: "Disputes", icon: AlertTriangle },
    { href: "/admin/kyc", label: "KYC", icon: Shield },
    { href: "/admin/withdrawals", label: "Withdrawals", icon: BanknoteIcon },
    { href: "/admin/reports", label: "Reports", icon: Flag },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart },
    { href: "/admin/config", label: "Config", icon: Cog },
];

export function Sidebar({ variant, isCollapsed = false, onToggle }: SidebarProps) {
    const pathname = usePathname();

    const links = variant === "admin"
        ? adminLinks
        : variant === "seller"
            ? sellerLinks
            : buyerLinks;

    const title = variant === "admin"
        ? "Admin Panel"
        : variant === "seller"
            ? "Seller Hub"
            : "Dashboard";

    return (
        <aside
            className={cn(
                "flex h-screen flex-col border-r border-[var(--border-subtle)] bg-[var(--bg-secondary)] transition-all duration-300",
                isCollapsed ? "w-16" : "w-64"
            )}
        >
            {/* Header */}
            <div className="flex h-16 items-center justify-between border-b border-[var(--border-subtle)] px-4">
                {!isCollapsed && (
                    <span className="text-lg font-semibold text-[var(--text-primary)]">
                        {title}
                    </span>
                )}
                <button
                    onClick={onToggle}
                    className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]",
                        isCollapsed && "mx-auto"
                    )}
                >
                    {isCollapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <ChevronLeft className="h-4 w-4" />
                    )}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-2">
                <ul className="space-y-1">
                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                                        isActive
                                            ? "bg-[var(--olive-600)] text-white shadow-md"
                                            : "text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]",
                                        isCollapsed && "justify-center px-2"
                                    )}
                                    title={isCollapsed ? link.label : undefined}
                                >
                                    <link.icon className="h-5 w-5 shrink-0" />
                                    {!isCollapsed && <span>{link.label}</span>}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer */}
            {!isCollapsed && (
                <div className="border-t border-[var(--border-subtle)] p-4">
                    <div className="rounded-lg bg-[var(--olive-900)]/30 p-3">
                        <p className="text-xs font-medium text-[var(--olive-400)]">
                            {variant === "seller" ? "Seller Level 2" : variant === "admin" ? "Admin Access" : "Buyer Account"}
                        </p>
                        <p className="mt-1 text-[10px] text-[var(--text-muted)]">
                            {variant === "seller" ? "10% lower fees" : variant === "admin" ? "Full permissions" : "Standard account"}
                        </p>
                    </div>
                </div>
            )}
        </aside>
    );
}
