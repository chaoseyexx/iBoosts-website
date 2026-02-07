"use client";

import React, { useState, useMemo } from "react";
import { RecommendedSellerCard } from "./recommended-seller-card";
import { CurrencyListingsTable } from "./currency-listings-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";

interface CurrencyMarketplaceViewProps {
    category: any;
    game: any;
    listings: any[];
}

export function CurrencyMarketplaceView({ category, game, listings }: CurrencyMarketplaceViewProps) {
    const [searchQuery, setSearchQuery] = useState("");

    // Select the "Recommended Seller" based on high rating + high volume
    const recommendedListing = useMemo(() => {
        if (!listings.length) return null;
        return [...listings].sort((a, b) => {
            const aScore = (a.seller.sellerRating || 0) * 0.7 + (a.seller.totalSales || 0) * 0.3;
            const bScore = (b.seller.sellerRating || 0) * 0.7 + (b.seller.totalSales || 0) * 0.3;
            return bScore - aScore;
        })[0];
    }, [listings]);

    const otherListings = useMemo(() => {
        if (!recommendedListing) return listings;
        return listings.filter(l => l.id !== recommendedListing.id);
    }, [listings, recommendedListing]);

    const filteredListings = useMemo(() => {
        if (!searchQuery) return otherListings;
        return otherListings.filter(l =>
            l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            l.seller.username.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [otherListings, searchQuery]);

    return (
        <div className="min-h-screen bg-[#050506] relative">
            {/* Background Image Layer */}
            {game?.banner && (
                <div
                    className="absolute inset-0 z-0 pointer-events-none"
                    style={{
                        backgroundImage: `url(${game.banner})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center top',
                        backgroundAttachment: 'fixed' // Optional: parallax effect
                    }}
                >
                    {/* 
                      Gradient Overlays:
                      1. Top darkening for navbar readability
                      2. Strong fade from bottom to blend into the main background color
                      3. General dark overlay to ensure text contrast everywhere
                    */}
                    <div className="absolute inset-0 bg-[#050506]/60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050506] via-[#050506]/80 to-transparent" />
                    <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#050506] to-transparent" />
                </div>
            )}

            {/* Content Layer */}
            <div className="relative z-10">
                <div className="pt-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    {/* Breadcrumbs / Back */}
                    <div className="mb-8 flex items-center gap-2">
                        <Link href="/" className="text-xs text-[#8b949e] hover:text-white transition-colors flex items-center gap-1 group">
                            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                            Back to Home
                        </Link>
                        <span className="text-[#30363d] text-xs">/</span>
                        <span className="text-xs text-[#8b949e]">{category.name}</span>
                        {game && (
                            <>
                                <span className="text-[#30363d] text-xs">/</span>
                                <span className="text-xs text-white font-bold">{game.name}</span>
                            </>
                        )}
                    </div>

                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div className="flex items-center gap-6">
                            {game?.icon && (
                                <div className="relative h-24 w-24 rounded-2xl overflow-hidden border-2 border-[#30363d] shadow-xl shadow-black/50">
                                    <Image
                                        src={game.icon}
                                        alt={game.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            <div>
                                <h1 className="text-4xl font-black text-white tracking-tight mb-2 uppercase drop-shadow-lg">
                                    {game?.name} {category.name}
                                </h1>
                                <p className="text-[#d0d7de] max-w-2xl text-sm leading-relaxed drop-shadow-md font-medium">
                                    Buy {game?.name} {category.name} safely from <span className="text-[#22c55e]">verified</span> pros. Instant delivery, best rates, and 24/7 support.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="px-5 py-2.5 rounded-xl bg-[#0d1117]/80 backdrop-blur-sm border border-[#30363d] flex flex-col shadow-lg">
                                <span className="text-[10px] text-[#8b949e] font-black uppercase tracking-wider mb-0.5">Listings</span>
                                <span className="text-xl font-black text-[#f5a623]">{listings.length}</span>
                            </div>
                            <div className="px-5 py-2.5 rounded-xl bg-[#0d1117]/80 backdrop-blur-sm border border-[#30363d] flex flex-col shadow-lg">
                                <span className="text-[10px] text-[#8b949e] font-black uppercase tracking-wider mb-0.5">Market Status</span>
                                <span className="text-xl font-black text-[#22c55e]">ACTIVE</span>
                            </div>
                        </div>
                    </div>
                </div>

                <main className="pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    {/* Recommended Seller Section */}
                    {recommendedListing && (
                        <div className="mb-16">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#30363d]" />
                                <h2 className="text-[10px] font-black text-[#f5a623] uppercase tracking-[0.3em] flex items-center gap-3 drop-shadow-md">
                                    <span className="flex h-1.5 w-1.5 rounded-full bg-[#f5a623] animate-ping" />
                                    Recommended Seller
                                </h2>
                                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#30363d]" />
                            </div>
                            <div className="relative z-10">
                                <RecommendedSellerCard listing={recommendedListing} />
                            </div>
                        </div>
                    )}

                    {/* All Listings Section */}
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 border-y border-[#30363d]/50 relative z-10">
                            <h2 className="text-lg font-black text-white uppercase tracking-tight drop-shadow-md">All Other Sellers</h2>

                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8b949e]" />
                                    <input
                                        type="text"
                                        placeholder="Search sellers or tags..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="h-10 w-64 bg-[#0d1117]/80 backdrop-blur-sm border border-[#30363d] rounded-lg pl-10 pr-4 text-xs text-white focus:border-[#f5a623] focus:outline-none transition-all placeholder:text-[#8b949e]"
                                    />
                                </div>
                                <Button variant="outline" size="sm" className="h-10 border-[#30363d] bg-[#0d1117]/80 backdrop-blur-sm text-[#8b949e] hover:text-white hover:bg-[#1c2128]">
                                    <SlidersHorizontal className="h-3.5 w-3.5 mr-2" />
                                    Sort & Filter
                                </Button>
                            </div>
                        </div>

                        <CurrencyListingsTable listings={filteredListings} />
                    </div>
                </main>
            </div>
        </div>
    );
}

