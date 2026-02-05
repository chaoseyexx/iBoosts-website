"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Menu,
    X,
    Bell,
    Search,
    ShoppingBag,
    User,
    LogOut,
    Settings,
    LayoutDashboard,
    Wallet,
    ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Mock user - replace with actual auth
const mockUser = null; // Set to user object when logged in

interface NavbarProps {
    user?: {
        id: string;
        username: string;
        displayName: string | null;
        avatar: string | null;
        role: string;
    } | null;
    notificationCount?: number;
}

export function Navbar({ user = mockUser, notificationCount = 0 }: NavbarProps) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
    const [isScrolled, setIsScrolled] = React.useState(false);

    // Handle scroll effect
    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { href: "/marketplace", label: "Marketplace" },
        { href: "/seller", label: "Sell" },
    ];

    const userMenuItems = [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/orders", label: "My Orders", icon: ShoppingBag },
        { href: "/wallet", label: "Wallet", icon: Wallet },
        { href: "/settings", label: "Settings", icon: Settings },
    ];

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
                isScrolled
                    ? "bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border-subtle)]"
                    : "bg-transparent"
            )}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <img
                            src="/images/logo-full.png"
                            alt="iboosts.gg"
                            className="h-16 w-auto object-contain"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "text-sm font-medium transition-colors",
                                    pathname === link.href
                                        ? "text-[var(--olive-400)]"
                                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Right Section */}
                    <div className="hidden md:flex md:items-center md:gap-3">
                        {/* Search */}
                        <Button variant="ghost" size="icon">
                            <Search className="h-5 w-5" />
                        </Button>

                        {user ? (
                            <>
                                {/* Notifications */}
                                <div className="relative">
                                    <Button variant="ghost" size="icon">
                                        <Bell className="h-5 w-5" />
                                        {notificationCount > 0 && (
                                            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--olive-600)] text-[10px] font-bold text-white">
                                                {notificationCount > 9 ? "9+" : notificationCount}
                                            </span>
                                        )}
                                    </Button>
                                </div>

                                {/* User Menu */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-[var(--bg-elevated)]"
                                    >
                                        <Avatar
                                            src={user.avatar}
                                            fallback={user.displayName || user.username}
                                            size="sm"
                                        />
                                        <ChevronDown
                                            className={cn(
                                                "h-4 w-4 text-[var(--text-muted)] transition-transform",
                                                isUserMenuOpen && "rotate-180"
                                            )}
                                        />
                                    </button>

                                    <AnimatePresence>
                                        {isUserMenuOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute right-0 mt-2 w-56 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-2 shadow-xl"
                                            >
                                                {/* User Info */}
                                                <div className="mb-2 border-b border-[var(--border-subtle)] px-3 pb-3 pt-1">
                                                    <p className="font-medium text-[var(--text-primary)]">
                                                        {user.displayName || user.username}
                                                    </p>
                                                    <p className="text-xs text-[var(--text-muted)]">
                                                        @{user.username}
                                                    </p>
                                                    <Badge variant="default" size="sm" className="mt-1.5">
                                                        {user.role}
                                                    </Badge>
                                                </div>

                                                {/* Menu Items */}
                                                {userMenuItems.map((item) => (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        onClick={() => setIsUserMenuOpen(false)}
                                                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
                                                    >
                                                        <item.icon className="h-4 w-4" />
                                                        {item.label}
                                                    </Link>
                                                ))}

                                                <div className="mt-2 border-t border-[var(--border-subtle)] pt-2">
                                                    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--error)] transition-colors hover:bg-[var(--error)]/10">
                                                        <LogOut className="h-4 w-4" />
                                                        Sign Out
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost">Sign In</Button>
                                </Link>
                                <Link href="/signup">
                                    <Button>Get Started</Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="inline-flex items-center justify-center rounded-lg p-2 text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] md:hidden"
                    >
                        {isMobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] md:hidden"
                    >
                        <div className="space-y-1 px-4 py-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        "block rounded-lg px-3 py-2 text-base font-medium transition-colors",
                                        pathname === link.href
                                            ? "bg-[var(--olive-600)]/10 text-[var(--olive-400)]"
                                            : "text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            {!user && (
                                <div className="mt-4 flex flex-col gap-2 border-t border-[var(--border-subtle)] pt-4">
                                    <Link href="/login">
                                        <Button variant="secondary" className="w-full">
                                            Sign In
                                        </Button>
                                    </Link>
                                    <Link href="/signup">
                                        <Button className="w-full">Get Started</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
