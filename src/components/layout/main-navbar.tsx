"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Search,
    MessageCircle,
    ShoppingCart,
    LogOut,
    User,
    Settings,
    Menu,
    X,
    Globe,
    ChevronDown,
    ChevronsUp,
    Wallet,
    Bell,
    Star,
    Moon,
    LayoutDashboard,
    Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/ui/notification-dropdown";
import { ActivityButton } from "@/components/ui/activity-dropdown";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/ui/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NotificationDropdown } from "@/components/ui/notification-dropdown"; // Ensure this matches if used differently under user state
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getProfile } from "@/app/(dashboard)/dashboard/settings/actions";

// Navigation categories
const navCategories = [
    { name: "Currency", href: "/currency" },
    { name: "Accounts", href: "/accounts" },
    { name: "Top Ups", href: "/top-ups" },
    { name: "Items", href: "/items" },
    { name: "Boosting", href: "/boosting" },
    { name: "Gift Cards", href: "/gift-cards" },
];

interface MainNavbarProps {
    variant?: "landing" | "dashboard";
    user?: {
        id: string;
        email?: string;
        username?: string;
        avatar?: string;
    } | null;
}

export function MainNavbar({ variant = "landing", user: initialUser }: MainNavbarProps) {
    const router = useRouter();
    const [user, setUser] = React.useState<{ id: string; email?: string; username?: string; avatar?: string; } | null>(initialUser || null);
    const [loading, setLoading] = React.useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const [languageModalOpen, setLanguageModalOpen] = React.useState(false);

    // Sync user state
    React.useEffect(() => {
        if (initialUser) setUser(initialUser);
    }, [initialUser]);

    React.useEffect(() => {
        const supabase = createClient();
        const checkUser = async () => {
            try {
                if (!initialUser) {
                    const { data: { user: authUser } } = await supabase.auth.getUser();
                    if (authUser) {
                        const profile = await getProfile();
                        setUser({
                            id: authUser.id,
                            email: authUser.email,
                            username: profile?.username || authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "User",
                            avatar: profile?.avatar || authUser.user_metadata?.avatar_url,
                        });
                    }
                }
            } catch (error) {
                console.error("Error checking auth:", error);
            } finally {
                setLoading(false);
            }
        };

        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === "SIGNED_IN" && session?.user) {
                const profile = await getProfile();
                setUser({
                    id: session.user.id,
                    email: session.user.email,
                    username: profile?.username || session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "User",
                    avatar: profile?.avatar || session.user.user_metadata?.avatar_url,
                });
            } else if (event === "SIGNED_OUT") {
                setUser(null);
            }
        });

        return () => subscription.unsubscribe();
    }, [initialUser]);

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        setUser(null);
        router.push("/login");
        router.refresh();
    };

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0e12] border-b border-[#1c2128]">
                {/* Top Utility Bar */}
                <div className="h-8 border-b border-[#1c2128] bg-[#0a0e12]">
                    <div className="max-w-[1920px] mx-auto h-full flex items-center justify-between px-4 text-[11px] font-bold text-[#8b949e]">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5 hover:text-white cursor-pointer transition-colors">
                                <span className="text-[#f5a623]">●</span>
                                <span>24/7 Live Support</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 uppercase">
                            <div className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors">
                                <Globe className="h-3 w-3" />
                                <span>English | USD - $</span>
                                <ChevronDown className="h-3 w-3" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Navbar */}
                <div className="flex h-[64px] items-center justify-between px-4 max-w-[1920px] mx-auto gap-6">

                    {/* Left Section: Logo & Nav Links */}
                    <div className="flex items-center gap-6">
                        <div className="lg:hidden">
                            <Button variant="ghost" size="icon" className="text-[#c9d1d9]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </Button>
                        </div>

                        {/* Inline Logo Component */}
                        <Link href="/" className="flex items-center gap-2 shrink-0">
                            <Logo className="h-[36px] w-auto" />
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-6">
                            {navCategories.map((cat) => (
                                <Link
                                    key={cat.name}
                                    href={cat.href}
                                    className="text-[15px] font-bold text-white hover:text-[#f5a623] transition-colors whitespace-nowrap"
                                >
                                    {cat.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Middle Section: Search - Shifted Left */}
                    <div className="flex-1 max-w-2xl hidden md:block pl-0 pr-8">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8b949e]" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full h-10 pl-10 pr-4 bg-[#161b22] border border-[#30363d] rounded-lg text-sm text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-0 transition-all"
                            />
                        </div>
                    </div>

                    {/* Right Section: Actions & Auth */}
                    <div className="flex items-center gap-4 shrink-0">
                        {loading ? (
                            <div className="h-8 w-20 bg-[#1c2128] rounded-lg animate-pulse" />
                        ) : user ? (
                            <>
                                <Button variant="ghost" size="icon" className="h-9 w-9 text-[#c9d1d9] hover:text-white">
                                    <MessageCircle className="h-5 w-5" />
                                </Button>

                                <NotificationBell count={0} />

                                {/* User Menu */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-9 w-9 rounded-full ml-1 p-0 hover:bg-transparent">
                                            <Avatar className="h-9 w-9 border border-[#30363d]">
                                                <AvatarImage src={user.avatar || ""} alt={user.username} />
                                                <AvatarFallback className="bg-[#21262d] text-[#c9d1d9]">
                                                    {user.username?.[0]?.toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-64 bg-[#1c2128] border-[#30363d] text-[#c9d1d9] p-0" align="end" forceMount>
                                        <div className="p-4 border-b border-[#30363d] flex items-center justify-between bg-[#161b22]">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10 border border-[#30363d]">
                                                    <AvatarImage src={user.avatar || ""} alt={user.username} />
                                                    <AvatarFallback className="bg-[#21262d] text-[#c9d1d9]">
                                                        {user.username?.[0]?.toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-white text-sm">{user.username}</span>
                                                    <span className="text-[#8b949e] text-xs truncate max-w-[100px]">{user.email}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-2 space-y-1">
                                            <DropdownMenuItem className="focus:bg-[#30363d] focus:text-white cursor-pointer px-3 py-2" onClick={() => router.push('/dashboard')}>
                                                <LayoutDashboard className="mr-3 h-4 w-4" />
                                                <span>Dashboard</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="focus:bg-[#30363d] focus:text-white cursor-pointer px-3 py-2" onClick={() => router.push('/dashboard/orders')}>
                                                <ShoppingCart className="mr-3 h-4 w-4" />
                                                <span>Orders</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="focus:bg-[#30363d] focus:text-white cursor-pointer px-3 py-2" onClick={() => router.push('/dashboard/offers')}>
                                                <Tag className="mr-3 h-4 w-4" />
                                                <span>My Offers</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="focus:bg-[#30363d] focus:text-white cursor-pointer px-3 py-2" onClick={() => router.push('/dashboard/settings')}>
                                                <Settings className="mr-3 h-4 w-4" />
                                                <span>Settings</span>
                                            </DropdownMenuItem>
                                        </div>

                                        <div className="p-2 border-t border-[#30363d]">
                                            <DropdownMenuItem className="focus:bg-[#30363d] focus:text-red-400 text-[#f85149] cursor-pointer px-3 py-2" onClick={handleLogout}>
                                                <LogOut className="mr-3 h-4 w-4" />
                                                <span>Log out</span>
                                            </DropdownMenuItem>
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            /* Guest Actions */
                            <div className="flex items-center gap-4 ml-2">
                                <Link href="/login">
                                    <Button variant="ghost" className="text-white hover:text-[#f5a623] font-bold text-[15px] h-9 px-0">
                                        Log In
                                    </Button>
                                </Link>
                                <Link href="/signup">
                                    <Button className="bg-[#f5a623] hover:bg-[#e09612] text-black font-bold h-10 px-8 rounded-lg shadow-lg shadow-orange-500/10 text-[15px]">
                                        Sign Up
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile menu - Adjust top position */}
                {mobileMenuOpen && (
                    <div className="lg:hidden border-t border-[#2d333b] bg-[#0d1117] absolute w-full left-0 top-[96px] shadow-2xl h-[calc(100vh-96px)] overflow-y-auto">
                        <div className="p-4 space-y-1">
                            {navCategories.map((cat) => (
                                <Link
                                    key={cat.name}
                                    href={cat.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-4 py-3 text-base font-medium text-[#c9d1d9] hover:text-white hover:bg-[#1c2128] rounded-lg transition-colors"
                                >
                                    {cat.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
}
