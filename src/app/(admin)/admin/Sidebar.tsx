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
        <aside className="w-64 bg-[#161b22] border-r border-[#30363d] flex flex-col flex-shrink-0">
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-[#30363d]">
                <div className="font-black text-xl tracking-tighter text-white">
                    <span className="text-[#f5a623]">iBOOSTS</span>
                    <span className="text-[#238636] text-xs ml-2 px-1.5 py-0.5 rounded bg-[#238636]/10 border border-[#238636]/20">ADMIN</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                {ADMIN_NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href}>
                            <div className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                                isActive
                                    ? "bg-[#1f2937] text-white border-l-2 border-[#f5a623]"
                                    : "text-[#8b949e] hover:text-white hover:bg-[#1f2937]"
                            )}>
                                <Icon className={cn("h-4 w-4", isActive ? "text-[#f5a623]" : "text-[#7d8590]")} />
                                {item.label}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer User */}
            <div className="p-4 border-t border-[#30363d]">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-[#8b949e] hover:text-red-400 hover:bg-red-500/10"
                    onClick={handleSignOut}
                >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                </Button>
            </div>
        </aside>
    );
}
