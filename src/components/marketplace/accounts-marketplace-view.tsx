"use client";

import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { AccountListingCard } from "./account-listing-card";

interface AccountsMarketplaceViewProps {
    category: any;
    game: any;
    listings: any[];
    currentUserId?: string;
}

export function AccountsMarketplaceView({ category, game, listings, currentUserId }: AccountsMarketplaceViewProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredListings = useMemo(() => {
        if (!searchQuery) return listings;
        return listings.filter(l =>
            l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            l.seller.username.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [listings, searchQuery]);

    return (
        <div className="min-h-screen bg-[#050506] relative">
            {/* Background Image Layer */}
            {game?.banner && (
                <div
                    className="absolute inset-x-0 top-0 h-[85vh] z-0 pointer-events-none overflow-hidden"
                    style={{
                        backgroundImage: `url(${game.banner})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center top',
                        backgroundAttachment: 'fixed'
                    }}
                >
                    <div className="absolute inset-0 bg-[#050506]/60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050506] via-[#050506]/50 to-transparent" />
                    <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#050506] to-transparent opacity-50" />
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
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
                            {game?.icon && (
                                <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-2xl overflow-hidden border-2 border-[#30363d] shadow-xl shadow-black/50 shrink-0">
                                    <Image
                                        src={game.icon}
                                        alt={game.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            <div>
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight mb-2 uppercase drop-shadow-lg leading-tight">
                                    {game?.name.toLowerCase().endsWith(category.name.toLowerCase())
                                        ? game.name
                                        : `${game?.name} ${category.name}`}
                                </h1>
                                <p className="text-[#d0d7de] max-w-xl text-xs sm:text-sm leading-relaxed drop-shadow-md font-medium">
                                    {game?.description || category?.description || `Explore the best marketplace for ${game?.name} ${category.name}. Instant delivery, verified sellers, and the most competitive rates.`}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-center sm:justify-start gap-3">
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
                    {/* Filter & Search Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-8 border-y border-[#30363d]/50 mb-10 relative z-10 bg-[#050506]/40 backdrop-blur-md rounded-2xl px-6">
                        <h2 className="text-lg font-black text-white uppercase tracking-tight drop-shadow-md">All {game?.name} {category.name}</h2>

                        <div className="flex flex-col sm:flex-row items-center gap-3">
                            <div className="relative w-full sm:w-auto">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8b949e]" />
                                <input
                                    type="text"
                                    placeholder="Search listings..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="h-11 w-full sm:w-72 bg-[#0d1117]/80 backdrop-blur-sm border border-[#30363d] rounded-xl pl-10 pr-4 text-xs text-white focus:border-[#f5a623] focus:outline-none transition-all placeholder:text-[#8b949e] shadow-inner"
                                />
                            </div>
                            <Button variant="outline" size="sm" className="h-11 w-full sm:w-auto border-[#30363d] bg-[#0d1117]/80 backdrop-blur-sm text-[#8b949e] hover:text-white hover:bg-[#1c2128] rounded-xl px-5">
                                <SlidersHorizontal className="h-3.5 w-3.5 mr-2" />
                                Sort & Filter
                            </Button>
                        </div>
                    </div>

                    {/* Listings Grid */}
                    {filteredListings.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
                            {filteredListings.map((listing) => (
                                <AccountListingCard
                                    key={listing.id}
                                    listing={{
                                        ...listing,
                                        image: listing.images?.[0]?.url,
                                        isVerifiedByAI: listing.isVerifiedByAI || false,
                                        seller: {
                                            username: listing.seller.username,
                                            avatar: listing.seller.avatar,
                                            rating: listing.seller.sellerRating || 0,
                                            sales: listing.seller.totalSales || 0
                                        }
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-[#0d1117]/40 border border-[#30363d] border-dashed rounded-[2rem] relative z-10">
                            <div className="w-16 h-16 rounded-full bg-[#30363d]/30 flex items-center justify-center mb-4">
                                <Search className="w-8 h-8 text-[#8b949e]" />
                            </div>
                            <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2">No {category.name} found</h3>
                            <p className="text-[#8b949e] text-sm">Try adjusting your search or filters.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
