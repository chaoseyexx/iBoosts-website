"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingCart,
    Users,
    MessageSquare,
    Swords,
    Settings,
    LogOut,
    Gamepad2,
    Tags,
    Wallet
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { signOut } from "@/actions/auth";
import { motion, AnimatePresence } from "framer-motion";

const ADMIN_NAV_ITEMS = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { label: "Listings", href: "/admin/listings", icon: Tags },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Games & Categories", href: "/admin/cms", icon: Gamepad2 },
    { label: "Disputes", href: "/admin/disputes", icon: Swords },
    { label: "Finance", href: "/admin/finance", icon: Wallet },
    { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();

    const handleSignOut = async () => {
        await signOut();
    };

    return (
        <aside className="sticky top-0 flex h-screen w-64 flex-col border-r border-[#2d333b]/40 bg-[#0d1117] flex-shrink-0 z-40 transition-all duration-300">
            {/* Logo area */}
            <div className="border-b border-[#2d333b]/40 py-6 px-6">
                <Link href="/" className="flex items-center gap-2 group/logo">
                    <div className="flex flex-col">
                        <span className="font-black text-xl tracking-tighter text-white">
                            <span className="text-[#f5a623]">i</span>BOOSTS
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Admin Node</span>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 no-scrollbar">
                <div className="px-6 mb-3 text-[10px] font-bold text-[#4b5563] uppercase tracking-[0.2em]">
                    Management Matrix
                </div>
                <div className="space-y-0.5">
                    {ADMIN_NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href}>
                                <div className={cn(
                                    "flex items-center gap-3 px-6 py-3 transition-all duration-200 group text-[13px] font-bold",
                                    isActive
                                        ? "bg-[#f5a623] text-black"
                                        : "text-[#8b949e] hover:text-white hover:bg-[#1c2128]"
                                )}>
                                    <Icon className={cn(
                                        "h-4.5 w-4.5 transition-colors",
                                        isActive ? "text-black" : "text-[#8b949e] group-hover:text-white"
                                    )} />
                                    <span>{item.label}</span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Footer User */}
            <div className="p-4 border-t border-[#2d333b]/40 bg-[#0a0e13]/50">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-[#8b949e] hover:text-rose-500 hover:bg-rose-500/10 h-11 rounded-lg transition-all font-bold text-xs uppercase tracking-wider gap-3"
                    onClick={handleSignOut}
                >
                    <LogOut className="h-4 w-4" />
                    Terminate Session
                </Button>
            </div>
        </aside>
    );
}
