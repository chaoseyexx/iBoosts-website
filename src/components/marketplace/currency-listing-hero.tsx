"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
    CreditCard,
    ChevronDown
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, formatPrice } from "@/lib/utils";
import Image from "next/image";

interface CurrencyListingHeroProps {
    listing: any;
    gameSlug?: string;
    gameName?: string;
    currentUserId?: string;
}

export function CurrencyListingHero({ listing, gameSlug, gameName, currentUserId }: CurrencyListingHeroProps) {
    const router = useRouter();
    const [quantity, setQuantity] = useState(listing.minQuantity || 1);
    const [isExpanded, setIsExpanded] = useState(false);
    const minQty = listing?.minQuantity || 1000;
    const unitPrice = listing?.price || 0.0056;

    const handleIncrement = () => {
        setQuantity((prev: number) => Math.min(prev + 1000, listing?.stock || 1000000));
    };

    const handleDecrement = () => {
        setQuantity((prev: number) => Math.max(prev - 1000, minQty));
    };

    if (!listing) return null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Seller Info & Description (8 cols) */}
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
                                        <div className="flex items-center gap-1.5 text-[#f5a623] bg-[#f5a623]/5 px-2 py-0.5 rounded-md border border-[#f5a623]/10">
                                            <Star className="h-3 w-3 fill-current" />
                                            <span className="text-[10px] font-black">{Number(listing.seller.sellerRating || 5).toFixed(1)}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-[#22c55e]">
                                            <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                            <span className="text-[10px] sm:text-xs font-bold">99.8%</span>
                                        </div>
                                        <span className="text-[10px] sm:text-xs text-[#8b949e] font-medium">
                                            {listing.seller.totalReviews?.toLocaleString() || "0"} verified reviews
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="sm:text-right w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-[#30363d]">
                                <span className="text-[10px] text-[#8b949e] font-bold uppercase tracking-widest block mb-1">Delivery time</span>
                                <span className="text-sm font-black text-white uppercase tracking-tighter">
                                    {listing.deliveryTime}
                                </span>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Listing Image */}
                            {listing.images && listing.images.length > 0 && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 px-1">
                                        <div className="p-1 rounded bg-[#f5a623]/10 text-[#f5a623]">
                                            <TrendingUp className="h-3 w-3" />
                                        </div>
                                        <h4 className="text-white font-bold text-xs uppercase tracking-wider">Preview</h4>
                                    </div>
                                    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-[#30363d] bg-[#010409]">
                                        <Image
                                            src={listing.images[0].url}
                                            alt={listing.title}
                                            fill
                                            className="object-cover hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Seller Description (Rich Text) */}
                            {listing.description && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 px-1">
                                        <Info className="h-4 w-4 text-[#58a6ff]" />
                                        <h4 className="text-white font-bold text-xs uppercase tracking-wider">Offer Details</h4>
                                    </div>
                                    <div className="relative group">
                                        <div
                                            className={cn(
                                                "prose prose-invert prose-sm max-w-none text-xs text-[#d0d7de] bg-[#0d1117]/50 p-5 rounded-xl border border-[#30363d] relative overflow-hidden transition-all duration-300",
                                                !isExpanded && "max-h-[120px]"
                                            )}
                                        >
                                            <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#58a6ff] to-transparent opacity-50" />
                                            <div
                                                className="relative z-10 leading-relaxed"
                                                dangerouslySetInnerHTML={{ __html: listing.description }}
                                            />
                                            {!isExpanded && (
                                                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#0d1117] to-transparent z-20" />
                                            )}
                                        </div>
                                        <div className="pt-4 px-1">
                                            <button
                                                onClick={() => setIsExpanded(!isExpanded)}
                                                className="text-xs font-black text-[#8b949e] hover:text-white uppercase tracking-widest flex items-center gap-2 transition-colors"
                                            >
                                                {isExpanded ? "Read less" : "Read more"}
                                                <ChevronDown className={cn("h-3 w-3 transition-transform duration-300", isExpanded && "rotate-180")} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
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
                                <span className="text-2xl font-black text-white">$ {formatPrice(unitPrice)}</span>
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
                            {currentUserId && listing.seller?.supabaseId === currentUserId ? (
                                <Button
                                    onClick={() => router.push(`/dashboard/listings/${listing.id}/edit`)}
                                    className="w-full h-14 bg-[#30363d] hover:bg-[#1c2128] text-white font-black text-lg transition-all rounded-xl border border-[#8b949e]/50"
                                >
                                    Edit Listing
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => router.push(`/checkout/${listing.id}?quantity=${quantity}`)}
                                    className="w-full h-14 bg-[#f5a623] hover:bg-[#e09612] text-[#0d1117] font-black text-lg transition-all rounded-xl shadow-[0_0_20px_rgba(245,166,35,0.2)] hover:shadow-[0_0_30px_rgba(245,166,35,0.3)]"
                                >
                                    ${formatPrice(quantity * unitPrice, 2)} | Buy now
                                </Button>
                            )}

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
