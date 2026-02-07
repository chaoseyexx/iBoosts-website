"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    ShieldCheck,
    Zap,
    Star,
    TrendingUp,
    Info,
    Minus,
    Plus,
    CheckCircle2,
    Lock,
    Headphones,
    CreditCard
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface CurrencyListingHeroProps {
    listing: any;
    gameSlug?: string;
    gameName?: string;
}

// Game-specific configuration
const GAME_CONFIG: Record<string, any> = {
    'roblox-robux': {
        currencyName: "Robux",
        warnings: [
            "30% Tax IS NOT COVERED",
            "NO GIFT IN GAME",
            "ROBUX WILL BE PENDING FOR 5-7 DAYS.",
            "*DON'T ENABLE REGIONAL PRICING*"
        ],
        steps: [
            "Select the amount of Robux you want.",
            "Make a gamepass and send us the link.",
            "Robux will be credited to your account and you should be able to see it pending in the transaction page."
        ]
    },
    'poe2-currency': {
        currencyName: "Chaos Orb",
        warnings: [
            "Face-to-Face Trade Only",
            "Do not talk in-game about RMT",
            "Put a rare item in trade window for safety"
        ],
        steps: [
            "Select the amount you want to buy.",
            "Provide your character name.",
            "We will invite you to a party and trade the currency."
        ]
    },
    'throne-and-liberty-lucent': {
        currencyName: "Lucent",
        warnings: [
            "Auction House Method",
            "List an item for the amount you bought",
            "We cover the 20% AH Tax"
        ],
        steps: [
            "List an item on the Auction House.",
            "Send us a screenshot of your listing.",
            "We will purchase your item."
        ]
    },
    'default': {
        currencyName: "Currency",
        warnings: [
            "Ensure your inventory has space",
            "Do not mention real money in-game",
            "Verify character name before purchase"
        ],
        steps: [
            "Select the amount you want to purchase.",
            "Enter your character name or ID.",
            "Wait for our delivery agent to contact you in-game."
        ]
    }
};

export function CurrencyListingHero({ listing, gameSlug = 'default', gameName = 'Game' }: CurrencyListingHeroProps) {
    const [quantity, setQuantity] = useState(1000);
    const [isExpanded, setIsExpanded] = useState(true);
    const minQty = listing?.minQuantity || 1000;
    const unitPrice = listing?.price || 0.0056;

    const config = GAME_CONFIG[gameSlug] || GAME_CONFIG['default'];
    const currencyName = config.currencyName;

    const handleIncrement = () => {
        setQuantity(prev => Math.min(prev + 1000, listing?.stock || 1000000));
    };

    const handleDecrement = () => {
        setQuantity(prev => Math.max(prev - 1000, minQty));
    };

    if (!listing) return null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Seller Info & Instructions (8 cols) */}
            <div className="lg:col-span-7 space-y-6">
                <Card className="bg-[#0d1117]/80 backdrop-blur-sm border-[#30363d] overflow-hidden">
                    <CardContent className="p-0">
                        {/* Seller Ribbon */}
                        <div className="bg-[#161b22] px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#30363d] gap-4">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-[#22c55e]">
                                    <AvatarImage src={listing.seller.avatar || undefined} />
                                    <AvatarFallback className="bg-[#30363d]">
                                        {listing.seller.username.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-base sm:text-lg font-black text-white">{listing.seller.username}</h3>
                                        <CheckCircle2 className="h-4 w-4 text-[#22c55e] fill-[#22c55e]/10" />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1 text-[#22c55e]">
                                            <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                            <span className="text-[10px] sm:text-xs font-bold">99.3%</span>
                                        </div>
                                        <span className="text-[10px] sm:text-xs text-[#58a6ff] hover:underline cursor-pointer">
                                            {listing.seller.totalSales?.toLocaleString() || "732,044"} reviews
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="sm:text-right w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-[#30363d]">
                                <span className="text-[10px] text-[#8b949e] font-bold uppercase tracking-widest block mb-1">Delivery time</span>
                                <span className="text-sm font-black text-white">8 min - 20 min</span>
                            </div>
                        </div>

                        <div className="p-6 space-y-8">
                            {/* Critical Warnings */}
                            <div className="space-y-4">
                                <h4 className="text-[#f85149] font-black flex items-center gap-3 text-sm tracking-widest uppercase">
                                    <span className="flex h-5 w-5 items-center justify-center rounded-sm bg-[#f85149] text-white font-black animate-pulse">!</span>
                                    READ BEFORE PURCHASE !
                                </h4>
                                <div className="space-y-3">
                                    {config.warnings.map((warning: string, i: number) => (
                                        <div key={i} className="flex items-center gap-3 group">
                                            <Star className="h-4 w-4 text-[#f5a623] fill-[#f5a623]" />
                                            <span className="text-sm text-[#d0d7de] font-bold">{warning}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Seller Description (Rich Text) */}
                            {listing.description && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 px-1">
                                        <Info className="h-4 w-4 text-[#58a6ff]" />
                                        <h4 className="text-white font-bold text-xs uppercase tracking-wider">Offer Details</h4>
                                    </div>
                                    <div
                                        className="prose prose-invert prose-sm max-w-none text-xs text-[#d0d7de] bg-[#0d1117]/50 p-5 rounded-xl border border-[#30363d] relative overflow-hidden"
                                    >
                                        <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#58a6ff] to-transparent opacity-50" />
                                        <div
                                            className="relative z-10 leading-relaxed"
                                            dangerouslySetInnerHTML={{ __html: listing.description }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Purchase Steps & Warranty - Conditional on isExpanded */}
                        {isExpanded && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-8 pt-6 border-t border-[#30363d]"
                            >
                                {/* Purchase Steps */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">🚀</span>
                                        <h4 className="text-white font-bold text-sm">How to purchase <span className="text-[#f85149]">?</span></h4>
                                    </div>
                                    <div className="space-y-3">
                                        {config.steps.map((step: string, i: number) => (
                                            <div key={i} className="flex items-start gap-3">
                                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[#58a6ff] text-white text-[10px] font-black">{i + 1}</span>
                                                <p className="text-sm text-[#d0d7de]">{step}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Warranty */}
                                <div className="flex items-start gap-3 p-4 rounded-xl bg-[#f85149]/5 border border-[#f85149]/20">
                                    <Zap className="h-4 w-4 text-[#f85149] shrink-0 mt-0.5" />
                                    <p className="text-xs text-[#d0d7de] font-medium leading-relaxed">
                                        We do not offer any warranty due to RMT (Real Money Trade) reasons.
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        <div className="pt-6 border-t border-[#30363d]">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="bg-[#1c2128] border-[#30363d] text-[#8b949e] font-extrabold hover:text-white w-full"
                            >
                                {isExpanded ? "Read less" : "Read more"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Column: Pricing & Controls (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
                <Card className="bg-[#0d1117]/80 backdrop-blur-sm border-[#30363d] h-fit">
                    <CardContent className="p-8 space-y-8">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-[#8b949e] font-bold">Price</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-black text-white">$ {unitPrice.toFixed(4)}</span>
                                <span className="text-sm text-[#8b949e]">/ unit</span>
                            </div>
                        </div>

                        {/* Quantity Selector */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#010409] border border-[#30363d]">
                                <button
                                    onClick={handleDecrement}
                                    className="h-12 w-12 flex items-center justify-center rounded-lg bg-[#30363d]/50 hover:bg-[#30363d] text-white transition-colors"
                                >
                                    <Minus className="h-5 w-5" />
                                </button>
                                <div className="flex-1 text-center font-black text-white text-lg">
                                    {quantity.toLocaleString()}
                                </div>
                                <button
                                    onClick={handleIncrement}
                                    className="h-12 w-12 flex items-center justify-center rounded-lg bg-[#30363d]/50 hover:bg-[#30363d] text-white transition-colors"
                                >
                                    <Plus className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="flex items-center justify-between px-1">
                                <span className="text-[10px] text-[#8b949e] font-bold uppercase tracking-wider">Min. qty.: {minQty} unit</span>
                                <span className="text-[10px] text-[#8b949e] font-bold uppercase tracking-wider">In stock: {listing.stock?.toLocaleString()} unit</span>
                            </div>
                        </div>

                        {/* Total & Buy Now */}
                        <div className="space-y-4">
                            <Button className="w-full h-14 bg-[#f5a623] hover:bg-[#e09612] text-[#0d1117] font-black text-lg transition-all rounded-xl shadow-[0_0_20px_rgba(245,166,35,0.2)] hover:shadow-[0_0_30px_rgba(245,166,35,0.3)]">
                                ${((quantity * unitPrice)).toFixed(2)} | Buy now
                            </Button>

                            <div className="space-y-4 pt-4">
                                <div className="flex items-center gap-3 text-[#58a6ff]">
                                    <ShieldCheck className="h-5 w-5 shrink-0" />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-white">Money-back Guarantee</span>
                                        <span className="text-[10px] text-[#8b949e]">Protected by TradeShield</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-[#58a6ff]">
                                    <Zap className="h-5 w-5 shrink-0" />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-white">Fast Checkout Options</span>
                                        <div className="flex items-center gap-1.5 grayscale opacity-50 mt-0.5">
                                            <div className="h-3 w-6 bg-white/20 rounded-sm" />
                                            <div className="h-3 w-6 bg-white/20 rounded-sm" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-[#58a6ff]">
                                    <Headphones className="h-5 w-5 shrink-0" />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-white">24/7 Live Support</span>
                                        <span className="text-[10px] text-[#8b949e]">We're always here to help</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
