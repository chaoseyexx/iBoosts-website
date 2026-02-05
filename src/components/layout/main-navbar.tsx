"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
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
    Headphones,
    Tag,
    ChevronsUp,
    Wallet,
    Bell,
    Star,
    Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/ui/notification-dropdown";
import { ActivityButton } from "@/components/ui/activity-dropdown";
import { createClient } from "@/lib/supabase/client";
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
    const [dropdownOpen, setDropdownOpen] = React.useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    // Check auth state
    React.useEffect(() => {
        const supabase = createClient();

        const checkUser = async () => {
            try {
                const { data: { user: authUser } } = await supabase.auth.getUser();
                if (authUser) {
                    const profile = await getProfile();

                    setUser({
                        id: authUser.id,
                        email: authUser.email,
                        username: profile?.username || authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "User",
                        avatar: profile?.avatar || authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture,
                    });
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
                    avatar: profile?.avatar || session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
                });
            } else if (event === "SIGNED_OUT") {
                setUser(null);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        setUser(null);
        setDropdownOpen(false);
        router.push("/");
        router.refresh();
    };

    const [languageModalOpen, setLanguageModalOpen] = React.useState(false);

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#2d333b] bg-[#0a0e13]/90 backdrop-blur-md">
                {/* Top bar (Language/Currency) */}
                <div className="h-8 bg-[#0a0e13] border-b border-[#2d333b] flex items-center justify-end px-6 gap-4 text-xs font-medium text-[#9ca3af] hidden sm:flex">
                    <button
                        onClick={() => setLanguageModalOpen(true)}
                        className="hover:text-white transition-colors flex items-center gap-1.5"
                    >
                        <Globe className="h-3 w-3" />
                        English (EN) / USD ($)
                        <ChevronDown className="h-3 w-3" />
                    </button>
                    <Link href="/support" className="hover:text-white transition-colors">
                        Support
                    </Link>
                </div>

                {/* Main nav */}
                <div className="flex items-center justify-between px-6 h-14">
                    <div className="flex-1 flex items-center gap-6">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f5a623] font-bold text-black text-sm">
                                IB
                            </div>
                            <span className="font-bold text-white text-lg">iBoosts</span>
                        </Link>

                        {/* Desktop Categories */}
                        <div className="hidden lg:flex items-center gap-1">
                            {navCategories.map((cat) => (
                                <Link
                                    key={cat.name}
                                    href={cat.href}
                                    className="px-3 py-2 text-[15px] font-bold text-white hover:text-[#f5a623] transition-colors whitespace-nowrap"
                                >
                                    {cat.name}
                                </Link>
                            ))}
                        </div>

                        {/* Search Bar */}
                        <div className="relative hidden md:block flex-1 max-w-xl mx-4">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7280]" />
                            <input
                                type="text"
                                placeholder="Search iBoosts"
                                className="h-9 w-full rounded-lg border border-[#2d333b] bg-[#1c2128] pl-10 pr-4 text-sm text-white placeholder:text-[#6b7280] focus:border-[#f5a623] focus:outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {loading ? (
                            <div className="h-8 w-20 bg-[#1c2128] rounded-lg animate-pulse" />
                        ) : user ? (
                            <>
                                <ActivityButton />
                                <Link href="/dashboard/messages" className="text-[#9ca3af] hover:text-white transition-colors hidden sm:block">
                                    <MessageCircle className="h-5 w-5" />
                                </Link>
                                <NotificationBell count={99} />

                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-[#1c2128] transition-colors"
                                    >
                                        <div className="h-8 w-8 rounded-full bg-[#252b33] overflow-hidden border border-[#2d333b] flex items-center justify-center relative">
                                            {user.avatar ? (
                                                <img
                                                    src={user.avatar}
                                                    alt={user.username || "User"}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-sm font-medium text-white">
                                                    {user.username?.charAt(0).toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <ChevronDown className="h-4 w-4 text-[#9ca3af]" />
                                    </button>


                                    {/* Dropdown menu */}
                                    {dropdownOpen && (
                                        <div className="absolute right-0 top-full mt-2 w-72 bg-[#1c2128] border border-[#2d333b] rounded-lg shadow-xl overflow-hidden z-50">
                                            {/* Header */}
                                            <div className="p-4 border-b border-[#2d333b] flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-[#252b33] overflow-hidden border border-[#2d333b] flex items-center justify-center relative">
                                                        {user.avatar ? (
                                                            <img
                                                                src={user.avatar}
                                                                alt={user.username || "User"}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="text-lg font-bold text-white">
                                                                {user.username?.charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white text-sm">{user.username}</div>
                                                        <div className="text-[#9ca3af] text-xs">$0.00</div>
                                                    </div>
                                                </div>
                                                <Link href="/dashboard/listings/create">
                                                    <Button className="bg-[#f5a623] hover:bg-[#e09612] text-black font-bold h-8 px-4 text-xs">
                                                        Sell
                                                    </Button>
                                                </Link>
                                            </div>

                                            {/* Menu Groups */}
                                            <div className="py-2">
                                                <Link href="/dashboard/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-white hover:bg-[#252b33] transition-colors">
                                                    <ShoppingCart className="h-4 w-4 text-[#9ca3af]" />
                                                    Orders
                                                </Link>
                                                <Link href="/dashboard/offers" className="flex items-center gap-3 px-4 py-2.5 text-sm text-white hover:bg-[#252b33] transition-colors">
                                                    <Tag className="h-4 w-4 text-[#9ca3af]" />
                                                    Offers
                                                </Link>
                                                <Link href="/dashboard/boosting" className="flex items-center gap-3 px-4 py-2.5 text-sm text-white hover:bg-[#252b33] transition-colors">
                                                    <ChevronsUp className="h-4 w-4 text-[#9ca3af]" />
                                                    Boosting
                                                </Link>
                                            </div>

                                            <div className="border-t border-[#2d333b] py-2">
                                                <Link href="/dashboard/wallet" className="flex items-center gap-3 px-4 py-2.5 text-sm text-white hover:bg-[#252b33] transition-colors">
                                                    <Wallet className="h-4 w-4 text-[#9ca3af]" />
                                                    Wallet
                                                </Link>
                                                <Link href="/dashboard/messages" className="flex items-center gap-3 px-4 py-2.5 text-sm text-white hover:bg-[#252b33] transition-colors">
                                                    <MessageCircle className="h-4 w-4 text-[#9ca3af]" />
                                                    Messages
                                                </Link>
                                                <Link href="/dashboard/notifications" className="flex items-center gap-3 px-4 py-2.5 text-sm text-white hover:bg-[#252b33] transition-colors">
                                                    <Bell className="h-4 w-4 text-[#9ca3af]" />
                                                    Notifications
                                                </Link>
                                                <Link href="/dashboard/feedback" className="flex items-center gap-3 px-4 py-2.5 text-sm text-white hover:bg-[#252b33] transition-colors">
                                                    <Star className="h-4 w-4 text-[#9ca3af]" />
                                                    Feedback
                                                </Link>
                                                <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-white hover:bg-[#252b33] transition-colors">
                                                    <Settings className="h-4 w-4 text-[#9ca3af]" />
                                                    Account settings
                                                </Link>
                                            </div>

                                            <div className="border-t border-[#2d333b] py-2">
                                                <div className="flex items-center justify-between px-4 py-2.5 text-sm text-white hover:bg-[#252b33] transition-colors cursor-pointer">
                                                    <div className="flex items-center gap-3">
                                                        <Moon className="h-4 w-4 text-[#9ca3af]" />
                                                        <span>Offline mode</span>
                                                    </div>
                                                    {/* Custom Toggle Switch */}
                                                    <div className="w-9 h-5 rounded-full bg-[#374151] relative">
                                                        <div className="absolute left-1 top-1 h-3 w-3 rounded-full bg-[#9ca3af] transition-transform" />
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#9ca3af] hover:bg-[#252b33] hover:text-white transition-colors"
                                                >
                                                    <LogOut className="h-4 w-4" />
                                                    Log out
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            // Logged out state
                            <>
                                <Link href="/login">
                                    <Button variant="ghost" className="text-[#9ca3af] hover:text-white">
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href="/signup">
                                    <Button className="bg-[#f5a623] hover:bg-[#e09612] text-black font-semibold">
                                        Sign Up
                                    </Button>
                                </Link>
                            </>
                        )}

                        {/* Mobile menu button */}
                        <button
                            className="lg:hidden text-[#9ca3af] hover:text-white"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden border-t border-[#2d333b] bg-[#0f1419]">
                        <div className="px-4 py-3 space-y-1">
                            {navCategories.map((cat) => (
                                <Link
                                    key={cat.name}
                                    href={cat.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-3 py-2 text-sm text-[#9ca3af] hover:text-white hover:bg-[#1c2128] rounded-lg transition-colors"
                                >
                                    {cat.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </nav>

            {/* Language/Currency Modal */}
            {languageModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-[#1c2128] border border-[#2d333b] rounded-xl shadow-2xl p-6 relative">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-6">
                            <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                                <Globe className="h-5 w-5" />
                                Choose your language and currency
                            </h3>
                            <button
                                onClick={() => setLanguageModalOpen(false)}
                                className="text-[#9ca3af] hover:text-white transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white">Language</label>
                                <div className="relative">
                                    <select className="w-full h-10 px-3 rounded-lg bg-[#0a0e13] border border-[#2d333b] text-white appearance-none focus:border-[#f5a623] focus:outline-none">
                                        <option>English (EN)</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#6b7280]">
                                        ▼
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white">Currency</label>
                                <div className="relative">
                                    <select className="w-full h-10 px-3 rounded-lg bg-[#0a0e13] border border-[#2d333b] text-white appearance-none focus:border-[#f5a623] focus:outline-none">
                                        <option>USD - $</option>
                                        <option>EUR - €</option>
                                        <option>GBP - £</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#6b7280]">
                                        ▼
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 pt-4">
                                <Button
                                    className="w-full bg-[#f5a623] hover:bg-[#e09612] text-black font-bold h-11"
                                    onClick={() => setLanguageModalOpen(false)}
                                >
                                    Save
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full text-white hover:bg-[#252b33] h-11 border border-[#2d333b]"
                                    onClick={() => setLanguageModalOpen(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
