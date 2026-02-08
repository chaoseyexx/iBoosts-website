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
    Tag,
    ChevronRight,
    ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/ui/notification-dropdown";
import { ActivityButton } from "@/components/ui/activity-dropdown";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/ui/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NotificationDropdown } from "@/components/ui/notification-dropdown";
import { motion, AnimatePresence } from "framer-motion";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getProfile } from "@/app/(dashboard)/dashboard/settings/actions";
import { MegaMenu } from "./mega-menu";
import { SearchDropdown } from "./search-dropdown";
import { fetchGamesForNavbar } from "@/app/(admin)/admin/actions";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

interface MainNavbarProps {
    variant?: "landing" | "dashboard";
    user?: {
        id: string;
        email?: string;
        username?: string;
        avatar?: string;
    } | null;
    initialCategories?: NavCategory[];
    initialCategories?: NavCategory[];
    initialGamesData?: Record<string, { popular: NavGame[]; all: NavGame[] }>;
    homeLink?: string;
}

// Interface for games from database
interface NavGame {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
    isPopular: boolean;
    href: string;
}

interface NavCategory {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
}

export function MainNavbar({
    variant = "landing",
    user: initialUser,
    initialCategories,
    variant = "landing",
    user: initialUser,
    initialCategories,
    initialGamesData,
    homeLink = "/"
}: MainNavbarProps) {
    const router = useRouter();
    const [user, setUser] = React.useState<{ id: string; email?: string; username?: string; avatar?: string; } | null>(initialUser || null);
    const [loading, setLoading] = React.useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const [expandedCategory, setExpandedCategory] = React.useState<string | null>(null);
    const [userMenuOpen, setUserMenuOpen] = React.useState(false);
    const [languageModalOpen, setLanguageModalOpen] = React.useState(false);
    const [mounted, setMounted] = React.useState(false); // Add mounted state

    // Handle mounting
    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Dynamic categories and games from database
    const [navCategories, setNavCategories] = React.useState<NavCategory[]>(initialCategories || []);
    const [gamesData, setGamesData] = React.useState<Record<string, { popular: NavGame[]; all: NavGame[] }>>(initialGamesData || {});
    const [navLoading, setNavLoading] = React.useState(!initialCategories || !initialGamesData);

    // Fetch games and categories from database
    React.useEffect(() => {
        if (initialCategories && initialGamesData) {
            setNavLoading(false);
            return;
        }

        const loadNavbarData = async () => {
            try {
                const { categories, gamesByCategory } = await fetchGamesForNavbar();

                // Transform categories
                setNavCategories(categories.map((c: any) => ({
                    id: c.id,
                    name: c.name,
                    slug: c.slug,
                    icon: c.icon
                })));

                // Transform games to include href
                const transformedData: Record<string, { popular: NavGame[]; all: NavGame[] }> = {};
                for (const [catName, data] of Object.entries(gamesByCategory as Record<string, any>)) {
                    const catSlug = categories.find((c: any) => c.name === catName)?.slug || catName.toLowerCase().replace(/\s+/g, '-');
                    transformedData[catName] = {
                        popular: data.popular.map((g: any) => ({
                            ...g,
                            href: `/${catSlug}/${g.slug}`
                        })),
                        all: data.all.map((g: any) => ({
                            ...g,
                            href: `/${catSlug}/${g.slug}`
                        }))
                    };
                }
                setGamesData(transformedData);
            } catch (error) {
                console.error("Error loading navbar data:", error);
            } finally {
                setNavLoading(false);
            }
        };

        loadNavbarData();
    }, []);

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
                        <div className="flex-1 hidden lg:block" /> {/* Left Spacer */}

                        <div className="flex items-center gap-1.5 hover:text-white cursor-pointer transition-colors mx-auto lg:mx-0">
                            <span className="text-[#f5a623]">●</span>
                            <span>24/7 Live Support</span>
                        </div>

                        <div className="flex-1 flex justify-end items-center gap-4 uppercase">
                            <div className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors">
                                <Globe className="h-3 w-3" />
                                <span>English | USD - $</span>
                                <ChevronDown className="h-3 w-3" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Navbar */}
                <div className="flex h-[60px] lg:h-[64px] items-center justify-between px-4 max-w-[1920px] mx-auto gap-3 lg:gap-6">

                    {/* Left Section: Logo & Nav Links */}
                    <div className="flex items-center gap-6">
                        <div className="lg:hidden">
                            <Button variant="ghost" size="icon" className="text-[#c9d1d9]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </Button>
                        </div>

                        {/* Inline Logo Component */}
                        <Link href={homeLink} className="flex items-center gap-2 shrink-0">
                            <Logo className="h-[36px] lg:h-[44px] w-auto" />
                        </Link>

                        {/* Desktop Navigation - Dynamic from Database */}
                        <div className="hidden lg:flex items-center gap-6">
                            {navLoading ? (
                                <div className="flex items-center gap-6">
                                    {[1, 2, 3, 4, 5, 6].map((i) => (
                                        <div key={i} className="h-4 w-16 bg-[#1c2128] rounded animate-pulse" />
                                    ))}
                                </div>
                            ) : navCategories.length > 0 && mounted ? (
                                <NavigationMenu viewport={true} showViewport={false} className="relative !max-w-none">
                                    <NavigationMenuList className="gap-6">
                                        {navCategories.map((cat) => (
                                            <NavigationMenuItem key={cat.id}>
                                                <NavigationMenuTrigger
                                                    className={cn(
                                                        "bg-transparent text-[14px] lg:text-[15px] font-bold transition-all duration-300 whitespace-nowrap p-0 h-auto gap-1 hover:bg-transparent outline-none focus:bg-transparent data-[state=open]:bg-transparent border-none ring-0 focus:ring-0",
                                                        cat.name === "Boosting" ? "text-[#f5a623]" : "text-[#c9d1d9] hover:text-white data-[state=open]:text-[#f5a623]"
                                                    )}
                                                >
                                                    {cat.name}
                                                    {(cat.name === "Boosting" || cat.name === "Currency") && (
                                                        <span className="flex h-1.5 w-1.5 rounded-full bg-[#f5a623] animate-pulse ml-0.5" />
                                                    )}
                                                </NavigationMenuTrigger>
                                                <NavigationMenuContent className="w-[1100px] xl:w-[1240px] 2xl:w-[1400px] max-w-[95vw] border-[#30363d] overflow-hidden rounded-xl shadow-2xl">
                                                    <MegaMenu
                                                        category={cat.name}
                                                        popularGames={gamesData[cat.name]?.popular || []}
                                                        allGames={gamesData[cat.name]?.all || []}
                                                    />
                                                </NavigationMenuContent>
                                            </NavigationMenuItem>
                                        ))}
                                    </NavigationMenuList>
                                    <div className="fixed top-[96px] left-0 right-0 flex justify-center pointer-events-none z-[100]">
                                        <div className="w-[1100px] xl:w-[1240px] 2xl:w-[1400px] max-w-[95vw] pointer-events-auto">
                                            <NavigationMenuViewport className="w-full border-[#30363d] overflow-hidden rounded-b-xl shadow-2xl bg-[#161b22]/95 backdrop-blur-md" />
                                        </div>
                                    </div>
                                </NavigationMenu>
                            ) : null}
                        </div>
                    </div>

                    {/* Middle Section: Search - Shifted Left */}
                    <div className="flex-1 max-w-2xl hidden md:block pl-0 pr-8">
                        <SearchDropdown gamesData={gamesData} />
                    </div>

                    {/* Right Section: Actions & Auth */}
                    <div className="flex items-center gap-4 shrink-0">
                        {loading ? (
                            <div className="h-8 w-20 bg-[#1c2128] rounded-lg animate-pulse" />
                        ) : user ? (
                            <>
                                <div className="hidden sm:flex items-center gap-2">
                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-[#c9d1d9] hover:text-white">
                                        <MessageCircle className="h-5 w-5" />
                                    </Button>

                                    <NotificationBell userId={user.id} />
                                    <ActivityButton />
                                </div>

                                {/* User Menu */}
                                <div className="relative">
                                    <button
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        className="relative h-9 w-9 rounded-full ml-1 p-0 hover:bg-transparent flex items-center justify-center outline-none"
                                    >
                                        <Avatar className="h-9 w-9 border border-[#30363d]">
                                            <AvatarImage src={user.avatar || ""} alt={user.username} />
                                            <AvatarFallback className="bg-[#21262d] text-[#c9d1d9]">
                                                {user.username?.[0]?.toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </button>

                                    <AnimatePresence>
                                        {userMenuOpen && (
                                            <>
                                                {/* Backdrop to close */}
                                                <div
                                                    className="fixed inset-0 z-40"
                                                    onClick={() => setUserMenuOpen(false)}
                                                />
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                    className="absolute right-0 mt-3 w-80 rounded-2xl border border-[#30363d] bg-[#0d1117]/80 backdrop-blur-xl text-[#c9d1d9] shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden"
                                                >
                                                    {/* Header - Premium Profile Segment */}
                                                    <div className="relative p-5 overflow-hidden">
                                                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#f5a623]/10 to-transparent pointer-events-none" />

                                                        <div className="flex items-center gap-4 relative z-10">
                                                            <div className="relative">
                                                                <Avatar className="h-14 w-14 border-2 border-[#30363d] ring-2 ring-[#f5a623]/20 transition-transform hover:scale-105 duration-300">
                                                                    <AvatarImage src={user.avatar || ""} alt={user.username} />
                                                                    <AvatarFallback className="bg-[#1c2128] text-[#f5a623] text-xl font-bold">
                                                                        {user.username?.[0]?.toUpperCase()}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-[#0d1117] rounded-full" />
                                                            </div>

                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-bold text-white text-base truncate group-hover:text-[#f5a623] transition-colors">
                                                                    {user.username}
                                                                </p>
                                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                                    <span className="text-[#f5a623] font-black text-sm">$0.00</span>
                                                                    <span className="text-[10px] text-[#8b949e] uppercase tracking-widest font-bold">Available</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="px-3 pb-3 space-y-4">
                                                        {/* Primary Navigation */}
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {[
                                                                { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
                                                                { label: 'Orders', icon: ShoppingCart, path: '/dashboard/orders' },
                                                                { label: 'Offers', icon: Tag, path: '/dashboard/offers' },
                                                                { label: 'Boosting', icon: ChevronsUp, path: '/dashboard/boosting' },
                                                            ].map((item) => (
                                                                <button
                                                                    key={item.path}
                                                                    onClick={() => { router.push(item.path); setUserMenuOpen(false); }}
                                                                    className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[#1c2128]/50 border border-[#30363d]/50 hover:border-[#f5a623]/30 hover:bg-[#f5a623]/5 transition-all group"
                                                                >
                                                                    <item.icon className="h-5 w-5 text-[#8b949e] group-hover:text-[#f5a623] transition-colors" />
                                                                    <span className="text-[11px] font-bold text-[#8b949e] group-hover:text-white uppercase tracking-wider">{item.label}</span>
                                                                </button>
                                                            ))}
                                                        </div>

                                                        {/* Secondary Actions */}
                                                        <div className="space-y-1">
                                                            {[
                                                                { label: 'Wallet', icon: Wallet, path: '/dashboard/wallet' },
                                                                { label: 'Messages', icon: MessageCircle, path: '/dashboard/messages' },
                                                                { label: 'Notifications', icon: Bell, path: '/dashboard/notifications' },
                                                                { label: 'Feedback', icon: Star, path: '/dashboard/feedback' },
                                                                { label: 'Settings', icon: Settings, path: '/dashboard/settings' },
                                                            ].map((item) => (
                                                                <button
                                                                    key={item.path}
                                                                    onClick={() => { router.push(item.path); setUserMenuOpen(false); }}
                                                                    className="w-full flex items-center justify-between group px-4 py-2.5 rounded-xl hover:bg-[#f5a623]/5 transition-colors"
                                                                >
                                                                    <div className="flex items-center gap-3">
                                                                        <item.icon className="h-4 w-4 text-[#8b949e] group-hover:text-[#f5a623] transition-colors" />
                                                                        <span className="text-sm font-semibold text-[#8b949e] group-hover:text-white">{item.label}</span>
                                                                    </div>
                                                                    <ChevronRight className="h-3 w-3 text-[#30363d] group-hover:text-[#f5a623] transition-transform group-hover:translate-x-0.5" />
                                                                </button>
                                                            ))}
                                                        </div>

                                                        {/* Bottom Section */}
                                                        <div className="pt-2 border-t border-[#30363d]/50 space-y-1">
                                                            <div className="flex items-center justify-between px-4 py-2.5 rounded-xl hover:bg-[#1c2128]/50 transition-colors group cursor-pointer">
                                                                <div className="flex items-center gap-3">
                                                                    <Moon className="h-4 w-4 text-[#8b949e] group-hover:text-white" />
                                                                    <span className="text-sm font-semibold text-[#8b949e] group-hover:text-white">Offline mode</span>
                                                                </div>
                                                                <div className="w-9 h-5 rounded-full bg-[#1c2128] border border-[#30363d] p-0.5 transition-colors group-hover:border-[#f5a623]/30">
                                                                    <div className="h-full aspect-square rounded-full bg-[#30363d] group-hover:bg-[#f5a623]" />
                                                                </div>
                                                            </div>

                                                            <button
                                                                onClick={handleLogout}
                                                                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[#f85149] hover:bg-[#f85149]/10 transition-colors group"
                                                            >
                                                                <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                                                                <span className="text-sm font-bold">Log out</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </>
                        ) : (
                            /* Guest Actions */
                            <div className="flex items-center gap-2 ml-2">
                                <Link href="/login">
                                    <Button variant="ghost" className="text-[#c9d1d9] hover:text-[#f5a623] hover:bg-[#1c2128] font-bold text-[15px] h-10 px-6 rounded-xl transition-all">
                                        Log In
                                    </Button>
                                </Link>
                                <Link href="/signup">
                                    <Button className="bg-[#f5a623] hover:bg-[#e09612] text-black font-bold h-10 px-8 rounded-xl shadow-lg shadow-orange-500/20 text-[15px] transition-all hover:scale-105 active:scale-95">
                                        Sign Up
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile menu - Enhanced */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="lg:hidden border-t border-[#1c2128] bg-[#0a0e13] absolute w-full left-0 top-full shadow-2xl max-h-[calc(100vh-64px)] overflow-y-auto z-40"
                        >
                            <div className="p-4 space-y-6">
                                {/* Mobile Search */}
                                <div className="md:hidden">
                                    <SearchDropdown gamesData={gamesData} isMobile={true} />
                                </div>

                                {/* Categories & Links */}
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-[#8b949e] uppercase tracking-[0.2em] px-3 mb-2">Categories</p>
                                    <div className="space-y-1">
                                        {navCategories.map((cat) => (
                                            <div key={cat.id} className="space-y-1">
                                                <button
                                                    onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)}
                                                    className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-[#1c2128] text-white transition-colors group"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-lg bg-[#1c2128] flex items-center justify-center text-[#f5a623] text-lg border border-[#30363d] group-hover:border-[#f5a623]/30">
                                                            {cat.name.charAt(0)}
                                                        </div>
                                                        <div className="flex flex-col text-left">
                                                            <span className="text-[14px] font-bold">{cat.name}</span>
                                                            <span className="text-[11px] text-[#8b949e]">Explore {cat.name} products</span>
                                                        </div>
                                                    </div>
                                                    <ChevronDown className={cn(
                                                        "h-4 w-4 text-[#8b949e] transition-transform",
                                                        expandedCategory === cat.id && "rotate-180"
                                                    )} />
                                                </button>

                                                <AnimatePresence>
                                                    {expandedCategory === cat.id && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="overflow-hidden pl-13 pr-4 space-y-1"
                                                        >
                                                            {/* Popular Games Label */}
                                                            {gamesData[cat.name]?.popular.length > 0 && (
                                                                <p className="text-[10px] font-bold text-[#8b949e] uppercase tracking-wider mb-2 ml-1">Popular Games</p>
                                                            )}
                                                            <div className="grid grid-cols-1 gap-1">
                                                                {gamesData[cat.name]?.popular.map((game) => (
                                                                    <Link
                                                                        key={game.id}
                                                                        href={game.href}
                                                                        onClick={() => {
                                                                            setMobileMenuOpen(false);
                                                                            setExpandedCategory(null);
                                                                        }}
                                                                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#1c2128] text-sm text-[#8b949e] hover:text-white transition-colors"
                                                                    >
                                                                        {game.icon && (
                                                                            <img src={game.icon} alt="" className="h-4 w-4 rounded-sm object-cover" />
                                                                        )}
                                                                        {game.name}
                                                                    </Link>
                                                                ))}
                                                            </div>

                                                            {/* View All Category Link */}
                                                            <Link
                                                                href={`/category/${cat.slug}`}
                                                                onClick={() => {
                                                                    setMobileMenuOpen(false);
                                                                    setExpandedCategory(null);
                                                                }}
                                                                className="flex items-center gap-2 px-3 py-3 mt-2 rounded-lg bg-[#1c2128]/50 text-xs font-bold text-[#f5a623] hover:bg-[#1c2128] transition-colors"
                                                            >
                                                                View All {cat.name}
                                                            </Link>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick Links */}
                                <div className="space-y-1 pt-4 border-t border-[#1c2128]">
                                    <p className="text-[10px] font-black text-[#8b949e] uppercase tracking-[0.2em] px-3 mb-2">Platform</p>
                                    <Link href="https://support.iboosts.gg" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 text-[#c9d1d9] hover:text-white transition-colors">
                                        <div className="h-2 w-2 rounded-full bg-[#f5a623]" />
                                        <span className="text-sm font-bold">Support Hub</span>
                                    </Link>
                                    <Link href="/status" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 text-[#c9d1d9] hover:text-white transition-colors">
                                        <div className="h-2 w-2 rounded-full bg-green-500" />
                                        <span className="text-sm font-bold">System Status</span>
                                    </Link>
                                </div>

                                {!user && (
                                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#1c2128]">
                                        <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                            <Button variant="outline" className="w-full border-[#30363d] text-white h-11">Log In</Button>
                                        </Link>
                                        <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                                            <Button className="w-full bg-[#f5a623] text-black h-11 font-bold">Sign Up</Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav >
        </>
    );
}
