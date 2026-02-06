

import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NavbarServer } from "@/components/layout/navbar-server";
import { HeroSection } from "@/components/home/hero-section";
import { Footer } from "@/components/layout/footer";
import {
    Shield,
    Zap,
    Star,
    ChevronRight,
    ArrowRight,
} from "lucide-react";

// Popular items data
const popularItems = [
    { icon: "🎮", name: "Steal a Brainrot", game: "Garena and Madundsong", price: 11.99, link: "/items/brainrot" },
    { icon: "🌊", name: "Escape Tsunami For Brainrots", game: "Strawberry Elephant", price: 8.00, link: "/items/tsunami" },
    { icon: "🔴", name: "Roblox", game: "Steal a Brainrot", price: 0.50, link: "/items/roblox" },
    { icon: "🚀", name: "Arc Raiders", game: "Blueprint", price: 3.90, link: "/items/arc" },
];

const popularAccounts = [
    { icon: "🎮", name: "GTA 5", details: "Pure Cash", price: 49.90, link: "/accounts/gta5" },
    { icon: "🎯", name: "Fortnite", details: "IKONIK", price: 249.99, link: "/accounts/fortnite" },
    { icon: "❤️", name: "Valorant", details: "Level 20", price: 4.90, link: "/accounts/valorant" },
    { icon: "🎖️", name: "Rainbow Six Siege X", details: "Ranked Ready", price: 3.99, link: "/accounts/r6" },
];

const popularCurrencies = [
    { icon: "⚔️", name: "OSRS", details: "Gold", price: "0.18/M", link: "/currency/osrs" },
    { icon: "⚽", name: "EA Sports FC", details: "FC Coins", price: "0.0215/K", link: "/currency/fc" },
    { icon: "🔴", name: "Roblox", details: "Robux", price: "0.00479/unit", link: "/currency/roblox" },
    { icon: "🌍", name: "WoW Classic", details: "Gold", price: "0.05664/unit", link: "/currency/wow" },
];

const popularTopUps = [
    { icon: "⚽", name: "EA Sports FC", details: "12000 Points", price: 56.88, link: "/topups/fc" },
];

const popularBoosting = [
    { icon: "❤️", name: "Valorant", details: "Rank Boost", price: 7.00, link: "/boosting/valorant" },
];

const popularGiftCards = [
    { icon: "🔴", name: "Roblox", details: "10 USD", price: 9.59, link: "/giftcards/roblox" },
];

// Product row component
function ProductRow({
    items,
    showPrice = true
}: {
    items: Array<{ icon: string; name: string; game?: string; details?: string; price: number | string; link: string }>;
    showPrice?: boolean;
}) {
    return (
        <div className="space-y-2">
            {items.map((item, i) => (
                <Link key={i} href={item.link}>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-[#1c2128] hover:bg-[#252b33] transition-all border border-[#2d333b] hover:border-[#f5a623]/50 group">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#252b33] flex items-center justify-center text-xl">
                                {item.icon}
                            </div>
                            <div>
                                <p className="text-white font-medium group-hover:text-[#f5a623] transition-colors text-sm">
                                    {item.name}
                                </p>
                                <p className="text-[#6b7280] text-xs">{item.game || item.details}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[#6b7280] text-xs">from</p>
                            <p className="text-[#f5a623] font-bold">
                                ${typeof item.price === "number" ? item.price.toFixed(2) : item.price}
                            </p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}

export default function HomePage() {
    return (
        <div className="min-h-screen bg-[#0a0e13]">
            {/* Navbar */}
            <NavbarServer variant="landing" />

            {/* Hero Section */}
            <HeroSection />

            {/* Popular Products Section */}
            <section className="py-16 px-6 bg-[#0a0e13]">
                <div className="mx-auto max-w-7xl">
                    {/* Main Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Popular Items */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-white">Popular Items</h2>
                                <Link href="/items" className="text-[#5c9eff] text-sm hover:underline flex items-center gap-1">
                                    View All <ChevronRight className="h-4 w-4" />
                                </Link>
                            </div>
                            <ProductRow items={popularItems} />
                        </div>

                        {/* Popular Accounts */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-white">Popular Accounts</h2>
                                <Link href="/accounts" className="text-[#5c9eff] text-sm hover:underline flex items-center gap-1">
                                    View All <ChevronRight className="h-4 w-4" />
                                </Link>
                            </div>
                            <ProductRow items={popularAccounts} />
                        </div>

                        {/* Popular Currencies */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-white">Popular Currencies</h2>
                                <Link href="/currency" className="text-[#5c9eff] text-sm hover:underline flex items-center gap-1">
                                    View All <ChevronRight className="h-4 w-4" />
                                </Link>
                            </div>
                            <ProductRow items={popularCurrencies} />
                        </div>
                    </div>

                    {/* Secondary Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                        {/* Popular Top Ups */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-white">Popular Top Ups</h2>
                                <Link href="/top-ups" className="text-[#5c9eff] text-sm hover:underline flex items-center gap-1">
                                    View All <ChevronRight className="h-4 w-4" />
                                </Link>
                            </div>
                            <ProductRow items={popularTopUps} />
                        </div>

                        {/* Popular Boosting Services */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-white">Popular Boosting Services</h2>
                                <Link href="/boosting" className="text-[#5c9eff] text-sm hover:underline flex items-center gap-1">
                                    View All <ChevronRight className="h-4 w-4" />
                                </Link>
                            </div>
                            <ProductRow items={popularBoosting} />
                        </div>

                        {/* Popular Gift Cards */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-white">Popular Gift Cards</h2>
                                <Link href="/gift-cards" className="text-[#5c9eff] text-sm hover:underline flex items-center gap-1">
                                    View All <ChevronRight className="h-4 w-4" />
                                </Link>
                            </div>
                            <ProductRow items={popularGiftCards} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Us Section */}
            <section className="py-20 px-6 bg-[#0f1419]">
                <div className="mx-auto max-w-7xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">Why Choose iBoosts?</h2>
                        <p className="text-[#6b7280] max-w-2xl mx-auto">
                            The most secure and trusted marketplace for digital gaming goods
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { icon: Shield, title: "Secure Escrow", desc: "Funds protected until delivery confirmed. 100% buyer protection on every transaction." },
                            { icon: Zap, title: "Instant Delivery", desc: "Get your digital goods delivered instantly. No waiting, no delays - just pure speed." },
                            { icon: Star, title: "Verified Sellers", desc: "All sellers verified through KYC. Trade with confidence knowing who you're dealing with." },
                        ].map((feature) => (
                            <Card key={feature.title} className="border-[#2d333b] bg-[#1c2128] p-6 text-center">
                                <div className="w-14 h-14 rounded-xl bg-[#f5a623]/10 flex items-center justify-center mx-auto mb-4">
                                    <feature.icon className="h-7 w-7 text-[#f5a623]" />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                                <p className="text-sm text-[#6b7280]">{feature.desc}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 bg-[#0a0e13] relative overflow-hidden">
                {/* Background glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#f5a623]/5 rounded-full blur-[120px]" />

                <div className="relative z-10 mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Ready to Start Trading?
                    </h2>
                    <p className="text-lg text-[#6b7280] mb-8 max-w-2xl mx-auto">
                        Join thousands of satisfied customers on the most trusted digital goods marketplace.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/signup">
                            <Button size="lg" className="bg-[#f5a623] hover:bg-[#e09612] text-black font-semibold h-12 px-8">
                                Create Free Account
                                <ArrowRight className="h-5 w-5 ml-2" />
                            </Button>
                        </Link>
                        <Link href="/marketplace">
                            <Button size="lg" variant="secondary" className="bg-[#1c2128] border border-[#2d333b] text-white hover:bg-[#252b33] h-12 px-8">
                                Browse Marketplace
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
}
