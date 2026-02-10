"use client";

import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MainNavbar } from "@/components/layout/main-navbar";
import { Footer } from "@/components/layout/footer";
import {
    ArrowRight,
    Shield,
    Zap,
    Star,
    ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Dynamic import for Three.js to avoid SSR issues
const HeroScene = dynamic(
    () => import("@/components/three/hero-scene").then((mod) => mod.HeroScene),
    { ssr: false }
);


interface NavGame {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
}

interface NavCategory {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
}

interface PlatformStats {
    totalVolume: string;
    avgDelivery: string;
    successRate: string;
}

interface HomePageClientProps {
    initialCategories?: NavCategory[];
    initialGamesData?: Record<string, { popular: NavGame[]; all: NavGame[] }>;
    initialUserCount?: number;
    stats?: PlatformStats;
}

// Feature cards
const features = [
    { icon: Shield, title: "Secure Escrow", desc: "100% buyer protection" },
    { icon: Zap, title: "Instant Delivery", desc: "Get items in seconds" },
    { icon: Star, title: "24/7 Support", desc: "Always here to help" },
];

// Product row component
function ProductRow({
    items
}: {
    items: Array<{ icon: string; name: string; details?: string; price: number | string; link: string }>;
}) {
    return (
        <div className="space-y-2">
            {items.map((item, i) => (
                <Link key={i} href={item.link}>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-[#1c2128] hover:bg-[#252b33] transition-all border border-[#2d333b] hover:border-[#f5a623]/50 group">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#252b33] flex items-center justify-center overflow-hidden shrink-0 border border-[#2d333b]">
                                {item.icon.startsWith("http") ? (
                                    <Image
                                        src={item.icon}
                                        alt={item.name}
                                        width={40}
                                        height={40}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-xl">{item.icon}</span>
                                )}
                            </div>
                            <div>
                                <p className="text-white font-medium group-hover:text-[#f5a623] transition-colors text-sm">
                                    {item.name}
                                </p>
                                <p className="text-[#6b7280] text-xs">{item.details}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[#6b7280] text-xs">from</p>
                            <p className="text-[#f5a623] font-bold">
                                {typeof item.price === "number" ? `$${item.price.toFixed(2)}` : item.price.startsWith("$") ? item.price : `$${item.price}`}
                            </p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}

export function HomePageClient({
    initialCategories = [],
    initialGamesData = {},
    initialUserCount = 2000,
    stats = { totalVolume: "$0", avgDelivery: "Instant", successRate: "99.9%" }
}: HomePageClientProps) {

    // Helper to get games for a section
    const getSectionItems = (categoryName: string, categorySlug: string, defaultPrices: Record<string, number | string>) => {
        const games = initialGamesData[categoryName]?.popular || [];
        return games.slice(0, 4).map(game => ({
            icon: game.icon || "🎮",
            name: game.name,
            details: categoryName === "Currency" ? "Market Rates" : "Verified Listings",
            price: defaultPrices[game.slug] || (categoryName === "Currency" ? "0.01/unit" : 9.99),
            link: `/${categorySlug}/${game.slug}`
        }));
    };

    // Sections data derived from props
    const popularItems = getSectionItems("Items", "items", {
        "brainrot": 11.99,
        "tsunami": 8.00,
        "roblox": 0.50,
        "arc": 3.90
    });

    const popularAccounts = getSectionItems("Accounts", "accounts", {
        "fortnite": 149.99,
        "gta-v": 49.90, // Note: Slug is gta-v in DB seed
        "r6-siege": 39.99,
        "roblox": 19.99,
        "valorant": 89.90
    });

    const popularCurrencies = getSectionItems("Currency", "currency", {
        "osrs": "0.18/M",
        "fc": "0.0215/K",
        "roblox": "0.00479/unit",
        "wow": "0.05664/unit"
    });

    const popularTopUps = getSectionItems("Top Ups", "top-ups", {
        "fc": 56.88
    });

    const popularBoosting = getSectionItems("Boosting", "boosting", {
        "valorant": 7.00
    });

    const popularGiftCards = getSectionItems("Gift Cards", "gift-cards", {
        "roblox": 9.59
    });

    return (
        <div className="min-h-screen bg-[#0a0e13] relative overflow-hidden selection:bg-[#f5a623]/30">
            {/* Global Cinematic Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Single, large depth gradient for focus */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[1200px] max-h-[1200px] bg-[radial-gradient(circle,rgba(245,166,35,0.03)_0%,transparent_70%)] rounded-full blur-[120px]" />
            </div>

            <div className="relative z-1">
                {/* Hero Section with Cinematic Design */}
                <section className="relative min-h-[85vh] flex items-center pt-[96px] overflow-hidden">
                    {/* 3D Background - Enhanced */}
                    <Suspense fallback={null}>
                        <div className="absolute inset-0 z-0">
                            <HeroScene />
                        </div>
                    </Suspense>

                    {/* Layered Gradient Overlays for Depth */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e13] via-transparent to-transparent pointer-events-none z-1" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e13]/50 via-transparent to-transparent pointer-events-none z-1" />

                    {/* Hero Content */}
                    <div className="relative z-10 mx-auto max-w-7xl px-6 py-12 lg:py-24 w-full">

                        {/* Animated Decorative Elements */}
                        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#f5a623]/5 rounded-full blur-[120px] animate-pulse-glow pointer-events-none" />

                        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-0">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="max-w-3xl relative z-10"
                            >
                                {/* Trustpilot Floating Glass Badge */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                >
                                    <Link
                                        href="https://www.trustpilot.com/review/iboosts.gg"
                                        target="_blank"
                                        className="inline-flex items-center gap-3 mb-8 px-4 py-2 rounded-full glass border-[#f5a623]/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:bg-[#f5a623]/10 transition-colors"
                                    >
                                        <div className="flex items-center gap-1.5 border-r border-white/10 pr-3 mr-1">
                                            <Badge className="bg-[#00b67a] text-white border-0 px-2 py-0.5 text-[10px] uppercase font-black">
                                                ★ Trustpilot
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-0.5">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star key={star} className="h-3 w-3 text-[#00b67a] fill-[#00b67a]" />
                                            ))}
                                        </div>
                                        <span className="text-[11px] font-bold text-white/70 uppercase tracking-widest hidden sm:inline">4.9/5 Rating</span>
                                    </Link>
                                </motion.div>

                                {/* Headline with Cinematic Typography */}
                                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-6 tracking-tighter">
                                    THE LARGEST{" "}
                                    <br className="hidden sm:block" />
                                    <span className="relative inline-block">
                                        <span className="bg-gradient-to-r from-[#f5a623] via-[#ffc107] to-[#f5a623] bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer">
                                            DIGITAL GAMING
                                        </span>
                                        <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#f5a623] to-transparent opacity-30" />
                                    </span>{" "}
                                    <br className="hidden lg:block" />
                                    MARKETPLACE
                                </h1>

                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4, duration: 0.8 }}
                                    className="text-lg sm:text-xl text-[#8b949e] mb-10 max-w-xl leading-relaxed font-medium"
                                >
                                    Experience the future of gaming trade. Secure escrow, instant deliveries, and 24/7 elite support.
                                </motion.p>

                                {/* CTA Actions */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6, duration: 0.5 }}
                                    className="flex flex-wrap gap-5"
                                >
                                    <Link href="/items">
                                        <Button size="lg" className="bg-[#f5a623] hover:bg-[#ffb339] text-black font-black h-14 px-10 rounded-2xl shadow-[0_8px_30px_rgba(245,166,35,0.3)] transition-all hover:scale-105 active:scale-95 text-base uppercase tracking-wider group">
                                            Explore Items
                                            <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                                        </Button>
                                    </Link>
                                    <Link href="/accounts">
                                        <Button size="lg" variant="secondary" className="bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 h-14 px-10 rounded-2xl transition-all hover:scale-105 active:scale-95 text-base font-bold uppercase tracking-wider">
                                            View Accounts
                                        </Button>
                                    </Link>
                                </motion.div>

                                {/* Fast Trust Indicators */}
                                <div className="flex items-center gap-8 mt-14 pt-8 border-t border-white/5">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className="h-10 w-10 rounded-full border-2 border-[#0a0e13] bg-[#1c2128] overflow-hidden">
                                                <Image src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" width={40} height={40} />
                                            </div>
                                        ))}
                                        <div className="h-10 w-10 rounded-full border-2 border-[#0a0e13] bg-[#f5a623] flex items-center justify-center text-[10px] font-black text-black">
                                            {initialUserCount}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-white text-sm font-bold">Trusted by {initialUserCount.toLocaleString()}+ gamers</p>
                                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#00b67a]/10 border border-[#00b67a]/20">
                                                <span className="h-1.5 w-1.5 rounded-full bg-[#00b67a]"></span>
                                                <span className="text-[10px] font-black text-[#00b67a] uppercase tracking-tighter">Verified</span>
                                            </div>
                                        </div>
                                        <p className="text-[#8b949e] text-xs">Join our growing community today</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Hero Visual Container */}
                            <div className="relative flex-1 hidden lg:flex justify-center items-center h-[600px]">
                                {/* Glowing Orbit Rings */}
                                <div className="absolute w-[500px] h-[500px] border border-[#f5a623]/10 rounded-full animate-[spin_20s_linear_infinite]" />
                                <div className="absolute w-[400px] h-[400px] border border-[#f5a623]/5 rounded-full animate-[spin_15s_linear_infinite_reverse]" />

                                {/* New Hero Character - Centered & Premium */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                    transition={{ duration: 1.2, ease: "easeOut" }}
                                    className="relative z-10"
                                >
                                    <Image
                                        src="https://cdn.iboosts.gg/images/landing-character-omen.png"
                                        alt="Hero"
                                        width={550}
                                        height={550}
                                        className="object-contain drop-shadow-[0_0_50px_rgba(245,166,35,0.2)]"
                                        priority
                                    />
                                    {/* Ambient Light Source behind character */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#f5a623]/20 rounded-full blur-[100px] -z-10" />
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Bento Grid Marketplace Section */}
                <section className="py-24 px-6 relative">

                    <div className="mx-auto max-w-7xl relative z-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="h-1 w-8 bg-[#f5a623] rounded-full" />
                                    <span className="text-[#f5a623] text-xs font-black uppercase tracking-[0.3em]">Top Collections</span>
                                </div>
                                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tighter">
                                    POPULAR <span className="text-[#f5a623]">DEALS</span>
                                </h2>
                            </div>
                            <Link href="/items">
                                <Button variant="ghost" className="text-[#8b949e] hover:text-[#f5a623] font-bold group">
                                    EXPLORE ALL COLLECTIONS
                                    <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                        </div>

                        {/* Improved Bento-Style Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { title: "Popular Items", items: popularItems, color: "#f5a623", link: "/items" },
                                { title: "Trending Accounts", items: popularAccounts, color: "#3b82f6", link: "/accounts" },
                                { title: "Currencies", items: popularCurrencies, color: "#22c55e", link: "/currency" },
                                { title: "Top Ups", items: popularTopUps, color: "#8b5cf6", link: "/top-ups" },
                                { title: "Boosting", items: popularBoosting, color: "#f43f5e", link: "/boosting" },
                                { title: "Gift Cards", items: popularGiftCards, color: "#ec4899", link: "/gift-cards" },
                            ].map((section, idx) => (
                                <motion.div
                                    key={section.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="group"
                                >
                                    <Card className="bg-[#13181e]/40 backdrop-blur-md border-[#2d333b]/50 hover:border-[#f5a623]/30 transition-all duration-500 overflow-hidden h-full flex flex-col rounded-3xl group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="flex items-center justify-between mb-6">
                                                <h3 className="text-sm font-black text-white uppercase tracking-widest">{section.title}</h3>
                                                <Link href={section.link}>
                                                    <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#f5a623] transition-colors duration-300">
                                                        <ArrowRight className="h-4 w-4 text-white/50 group-hover:text-black" />
                                                    </div>
                                                </Link>
                                            </div>

                                            <div className="space-y-3 flex-1">
                                                {section.items.map((item, i) => (
                                                    <Link key={i} href={item.link}>
                                                        <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all group/item">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center overflow-hidden shrink-0 border border-white/5">
                                                                    {item.icon.startsWith("http") ? (
                                                                        <Image src={item.icon} alt={item.name} width={40} height={40} className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <span className="text-xl">{item.icon}</span>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <p className="text-white font-bold text-[13px] group-hover/item:text-[#f5a623] transition-colors leading-tight truncate max-w-[120px]">
                                                                        {item.name}
                                                                    </p>
                                                                    <p className="text-[#8b949e] text-[10px] uppercase font-bold tracking-wider">{item.details}</p>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-[#f5a623] font-black text-sm">
                                                                    {typeof item.price === "number" ? `$${item.price.toFixed(2)}` : item.price}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#f5a623]/20 to-transparent absolute bottom-0 left-0" />
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Why Us Section - Cinematic Feature Showcase */}
                <section className="py-32 px-6 relative">

                    <div className="mx-auto max-w-7xl relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-[#f5a623]/10 border border-[#f5a623]/20">
                                    <Shield className="h-4 w-4 text-[#f5a623]" />
                                    <span className="text-[#f5a623] text-[10px] font-black uppercase tracking-widest">Trust & Security</span>
                                </div>
                                <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-8 tracking-tighter">
                                    WHY ELITE GAMERS <br />
                                    <span className="text-[#f5a623]">CHOOSE IBOOSTS</span>
                                </h2>
                                <p className="text-lg text-[#8b949e] mb-12 max-w-xl leading-relaxed">
                                    Join over 2,000 active users trading on the world's most advanced gaming marketplace. We combine cutting-edge technology with rigorous security.
                                </p>

                                <div className="space-y-6">
                                    {[
                                        { icon: Shield, title: "SECURE ESCROW PROTECTION", desc: "Funds are held securely and only released when you confirm receipt." },
                                        { icon: Zap, title: "ULTRA-FAST SETTLEMENTS", desc: "Our automated systems ensure instant delivery for most digital assets." },
                                        { icon: Star, title: "KYC VERIFIED SELLERS", desc: "Every elite seller passes a background check to ensure 100% integrity." },
                                    ].map((feature) => (
                                        <div key={feature.title} className="flex gap-5 group">
                                            <div className="h-12 w-12 rounded-2xl bg-[#1c2128] border border-white/5 flex items-center justify-center shrink-0 group-hover:border-[#f5a623]/50 transition-colors shadow-xl">
                                                <feature.icon className="h-6 w-6 text-[#f5a623]" />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-black text-sm uppercase tracking-widest mb-1">{feature.title}</h4>
                                                <p className="text-[#8b949e] text-sm leading-relaxed">{feature.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#f5a623]/20 to-transparent blur-[120px] rounded-full" />
                                <Card className="relative bg-[#13181e] border-[#2d333b] p-8 rounded-[40px] overflow-hidden shadow-2xl">
                                    <div className="absolute top-0 right-0 p-8">
                                        <Badge className="bg-[#f5a623] text-black font-black uppercase tracking-tighter text-xs">Verified 2026</Badge>
                                    </div>
                                    <div className="flex flex-col gap-8">
                                        <div className="space-y-2">
                                            <p className="text-[#8b949e] text-xs font-black uppercase tracking-widest">Total Trade Volume</p>
                                            <p className="text-5xl font-black text-white">{stats.totalVolume}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="space-y-1">
                                                <p className="text-[#8b949e] text-[10px] font-black uppercase tracking-widest">Avg. Delivery</p>
                                                <p className="text-2xl font-black text-[#f5a623]">{stats.avgDelivery}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[#8b949e] text-[10px] font-black uppercase tracking-widest">Success Rate</p>
                                                <p className="text-2xl font-black text-white">{stats.successRate}</p>
                                            </div>
                                        </div>
                                        <div className="pt-8 border-t border-white/5 text-center italic text-[#8b949e] text-sm font-medium">
                                            "The fastest and safest trade I've ever experienced in OSRS."
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section - Impactful Terminal Style */}
                <section className="py-32 px-6 relative">
                    <div className="mx-auto max-w-7xl relative">
                        <Card className="bg-gradient-to-br from-[#1c2128] to-[#0a0e13] border-[#2d333b] p-12 sm:p-20 rounded-[40px] overflow-hidden text-center relative shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,166,35,0.08)_0%,transparent_50%)]" />

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="relative z-10"
                            >
                                <h2 className="text-4xl sm:text-6xl font-black text-white mb-8 tracking-tighter leading-tight uppercase">
                                    READY TO JOIN THE <br />
                                    <span className="text-[#f5a623]">ELITE TIER?</span>
                                </h2>
                                <p className="text-xl text-[#8b949e] mb-12 max-w-2xl mx-auto font-medium">
                                    Create your free account today and start trading on the most secure digital goods marketplace in the industry.
                                </p>
                                <div className="flex flex-wrap justify-center gap-6">
                                    <Link href="/signup">
                                        <Button size="lg" className="bg-[#f5a623] hover:bg-[#ffb339] text-black font-black h-16 px-12 rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all text-lg uppercase tracking-wider">
                                            Create Free Account
                                            <ArrowRight className="h-6 w-6 ml-2" />
                                        </Button>
                                    </Link>
                                    <Link href="/items">
                                        <Button size="lg" variant="outline" className="bg-transparent border-white/10 text-white hover:bg-white/5 h-16 px-12 rounded-2xl font-black text-lg uppercase tracking-wider transition-all">
                                            View Products
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>
                        </Card>
                    </div>
                </section>

                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
}
