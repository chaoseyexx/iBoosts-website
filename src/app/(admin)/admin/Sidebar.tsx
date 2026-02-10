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
    Wallet,
    ShieldCheck,
    Bot
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
    { label: "Audit Logs", href: "/admin/logs", icon: ShieldCheck },
    { label: "iShield AI", href: "/admin/ishield", icon: Bot },
    { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();

    const handleSignOut = async () => {
        await signOut();
    };

    return (
        <aside className="sticky top-0 flex h-screen w-64 flex-col border-r border-white/5 bg-[#0a0e13]/80 backdrop-blur-xl flex-shrink-0 z-40 transition-all duration-300">
            {/* Logo area */}
            <div className="border-b border-white/5 py-6 px-6 relative overflow-hidden group">
                {/* Micro Ambient Glow */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#f5a623]/20 to-transparent" />

                <Link href="/" className="flex items-center gap-2 group/logo relative z-10">
                    <div className="flex flex-col">
                        <span className="font-black text-2xl tracking-tighter text-white">
                            <span className="text-[#f5a623] drop-shadow-[0_0_8px_rgba(245,166,35,0.3)]">i</span>BOOSTS
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <div className="h-1 w-1 rounded-full bg-[#f5a623] animate-pulse shadow-[0_0_8px_rgba(245,166,35,0.6)]" />
                            <span className="text-[10px] font-black text-[#f5a623]/60 uppercase tracking-[0.2em]">Admin Node</span>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 no-scrollbar relative">
                <div className="px-6 mb-4 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] flex items-center justify-between">
                    Management Matrix
                    <div className="h-[1px] w-12 bg-white/5" />
                </div>
                <div className="space-y-1 px-3">
                    {ADMIN_NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href}>
                                <div className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 group relative overflow-hidden",
                                    isActive
                                        ? "bg-[#f5a623]/10 text-[#f5a623] shadow-[inset_0_0_20px_rgba(245,166,35,0.05)] border border-[#f5a623]/20"
                                        : "text-white/40 hover:text-white hover:bg-white/5 border border-transparent"
                                )}>
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-nav"
                                            className="absolute left-0 top-1/4 bottom-1/4 w-[2px] bg-[#f5a623] rounded-full shadow-[0_0_8px_rgba(245,166,35,0.8)]"
                                        />
                                    )}
                                    <Icon className={cn(
                                        "h-4 w-4 transition-all duration-300",
                                        isActive ? "text-[#f5a623] scale-110" : "group-hover:text-white"
                                    )} />
                                    <span className={cn(
                                        "text-[12px] font-black uppercase tracking-widest transition-all",
                                        isActive ? "translate-x-1" : "group-hover:translate-x-0.5"
                                    )}>
                                        {item.label}
                                    </span>
                                    {isActive && (
                                        <div className="ml-auto h-1.5 w-1.5 rounded-full bg-[#f5a623] shadow-[0_0_8px_rgba(245,166,35,0.4)]" />
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Footer User */}
            <div className="p-4 border-t border-white/5 bg-black/20">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-white/30 hover:text-rose-500 hover:bg-rose-500/10 h-10 rounded-lg transition-all font-black text-[10px] uppercase tracking-[0.2em] gap-3"
                    onClick={handleSignOut}
                >
                    <LogOut className="h-4 w-4" />
                    Terminate Session
                </Button>
            </div>
        </aside>
    );
}
