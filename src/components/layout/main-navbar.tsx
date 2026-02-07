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
    initialGamesData?: Record<string, { popular: NavGame[]; all: NavGame[] }>;
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
    initialGamesData
}: MainNavbarProps) {
    const router = useRouter();
    const [user, setUser] = React.useState<{ id: string; email?: string; username?: string; avatar?: string; } | null>(initialUser || null);
    const [loading, setLoading] = React.useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
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
                            <Logo className="h-[44px] w-auto" />
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

                                <NotificationBell userId={user.id} />
                                <ActivityButton />

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
                                                    transition={{ duration: 0.15 }}
                                                    className="absolute right-0 mt-2 w-72 rounded-xl border border-[#30363d] bg-[#1c2128] text-[#c9d1d9] shadow-2xl z-50 overflow-hidden"
                                                >
                                                    {/* Header */}
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
                                                                <span className="text-[#9ca3af] text-xs">$0.00</span>
                                                            </div>
                                                        </div>
                                                        <Link href="/dashboard/listings/create" onClick={() => setUserMenuOpen(false)}>
                                                            <Button className="bg-[#f5a623] hover:bg-[#e09612] text-black font-bold h-8 px-4 text-xs">
                                                                Sell
                                                            </Button>
                                                        </Link>
                                                    </div>

                                                    {/* Marketplace Group */}
                                                    <div className="p-2 space-y-1">
                                                        <button
                                                            onClick={() => { router.push('/dashboard'); setUserMenuOpen(false); }}
                                                            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#8b949e] transition-colors hover:bg-[#30363d] hover:text-white"
                                                        >
                                                            <LayoutDashboard className="h-4 w-4" />
                                                            <span>Dashboard</span>
                                                        </button>
                                                        <button
                                                            onClick={() => { router.push('/dashboard/orders'); setUserMenuOpen(false); }}
                                                            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#8b949e] transition-colors hover:bg-[#30363d] hover:text-white"
                                                        >
                                                            <ShoppingCart className="h-4 w-4" />
                                                            <span>Orders</span>
                                                        </button>
                                                        <button
                                                            onClick={() => { router.push('/dashboard/offers'); setUserMenuOpen(false); }}
                                                            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#8b949e] transition-colors hover:bg-[#30363d] hover:text-white"
                                                        >
                                                            <Tag className="h-4 w-4" />
                                                            <span>Offers</span>
                                                        </button>
                                                        <button
                                                            onClick={() => { router.push('/dashboard/boosting'); setUserMenuOpen(false); }}
                                                            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#8b949e] transition-colors hover:bg-[#30363d] hover:text-white"
                                                        >
                                                            <ChevronsUp className="h-4 w-4" />
                                                            <span>Boosting</span>
                                                        </button>
                                                    </div>

                                                    {/* Account Group */}
                                                    <div className="p-2 border-t border-[#30363d] space-y-1">
                                                        <button
                                                            onClick={() => { router.push('/dashboard/wallet'); setUserMenuOpen(false); }}
                                                            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#8b949e] transition-colors hover:bg-[#30363d] hover:text-white"
                                                        >
                                                            <Wallet className="h-4 w-4" />
                                                            <span>Wallet</span>
                                                        </button>
                                                        <button
                                                            onClick={() => { router.push('/dashboard/messages'); setUserMenuOpen(false); }}
                                                            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#8b949e] transition-colors hover:bg-[#30363d] hover:text-white"
                                                        >
                                                            <MessageCircle className="h-4 w-4" />
                                                            <span>Messages</span>
                                                        </button>
                                                        <button
                                                            onClick={() => { router.push('/dashboard/notifications'); setUserMenuOpen(false); }}
                                                            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#8b949e] transition-colors hover:bg-[#30363d] hover:text-white"
                                                        >
                                                            <Bell className="h-4 w-4" />
                                                            <span>Notifications</span>
                                                        </button>
                                                        <button
                                                            onClick={() => { router.push('/dashboard/feedback'); setUserMenuOpen(false); }}
                                                            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#8b949e] transition-colors hover:bg-[#30363d] hover:text-white"
                                                        >
                                                            <Star className="h-4 w-4" />
                                                            <span>Feedback</span>
                                                        </button>
                                                        <button
                                                            onClick={() => { router.push('/dashboard/settings'); setUserMenuOpen(false); }}
                                                            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#8b949e] transition-colors hover:bg-[#30363d] hover:text-white"
                                                        >
                                                            <Settings className="h-4 w-4" />
                                                            <span>Account settings</span>
                                                        </button>
                                                    </div>

                                                    {/* App Group */}
                                                    <div className="p-2 border-t border-[#30363d] space-y-1">
                                                        <div className="w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm text-[#8b949e] transition-colors hover:bg-[#30363d] hover:text-white cursor-pointer">
                                                            <div className="flex items-center gap-3">
                                                                <Moon className="h-4 w-4" />
                                                                <span>Offline mode</span>
                                                            </div>
                                                            <div className="w-8 h-4 rounded-full bg-[#30363d] relative">
                                                                <div className="absolute left-1 top-1 h-2 w-2 rounded-full bg-[#8b949e]" />
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={handleLogout}
                                                            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#f85149] transition-colors hover:bg-[#f85149]/10"
                                                        >
                                                            <LogOut className="h-4 w-4" />
                                                            <span>Log out</span>
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>
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

                {/* Mobile menu - Dynamic */}
                {mobileMenuOpen && (
                    <div className="lg:hidden border-t border-[#2d333b] bg-[#0d1117] absolute w-full left-0 top-[96px] shadow-2xl h-[calc(100vh-96px)] overflow-y-auto">
                        <div className="p-4 space-y-1">
                            {navCategories.map((cat) => (
                                <div
                                    key={cat.id}
                                    className="block px-4 py-3 text-base font-medium text-[#c9d1d9] hover:text-white hover:bg-[#1c2128] rounded-lg transition-colors cursor-default"
                                >
                                    {cat.icon} {cat.name}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
}
