"use client";

import React, { useState } from "react";
import { Star, ShieldCheck, Zap } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import { ListingQuickView } from "./listing-quick-view";

interface AccountListingCardProps {
    listing: {
        id: string;
        title: string;
        description: string;
        price: number;
        originalPrice?: number | null;
        image?: string | null;
        seller: {
            username: string;
            avatar?: string | null;
            rating: number;
            sales: number;
        };
        isVerifiedByAI?: boolean;
        stock?: number;
    };
}

export function AccountListingCard({ listing }: AccountListingCardProps) {
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

    const discount = listing.originalPrice
        ? Math.round(((listing.originalPrice - listing.price) / listing.originalPrice) * 100)
        : null;

    return (
        <>
            <div
                onClick={() => setIsQuickViewOpen(true)}
                className="group bg-[#0d1117]/40 backdrop-blur-sm border border-[#30363d] rounded-[2rem] overflow-hidden flex flex-col h-full transition-all hover:border-[#f5a623]/50 hover:shadow-[0_0_30px_rgba(245,166,35,0.05)] hover:-translate-y-1 cursor-pointer"
            >
                {/* Image Section */}
                <div className="relative h-56 w-full overflow-hidden bg-[#050506]">
                    {listing.image ? (
                        <Image
                            src={listing.image}
                            alt={listing.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-20">
                            <Zap className="w-12 h-12 text-[#f5a623]" />
                        </div>
                    )}

                    {/* Floating Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {listing.isVerifiedByAI && (
                            <div className="bg-[#22c55e]/10 backdrop-blur-md border border-[#22c55e]/20 rounded-full px-3 py-1 flex items-center gap-1.5 shadow-lg">
                                <ShieldCheck className="w-3 h-3 text-[#22c55e]" />
                                <span className="text-[10px] font-black text-[#22c55e] uppercase tracking-wider">iShield Protected</span>
                            </div>
                        )}
                        {discount && discount > 0 && (
                            <div className="bg-[#f55a23]/10 backdrop-blur-md border border-[#f55a23]/20 rounded-full px-3 py-1 text-[10px] font-black text-[#f55a23] uppercase tracking-wider w-fit shadow-lg">
                                -{discount}%
                            </div>
                        )}
                    </div>
                </div>

                {/* Info Section */}
                <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-white font-black text-sm uppercase tracking-tight line-clamp-2 mb-4 transition-colors group-hover:text-[#f5a623]">
                        {listing.title}
                    </h3>

                    <div className="mt-auto space-y-4">
                        {/* Seller & Rating */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <Avatar className="h-7 w-7 border-2 border-[#30363d] group-hover:border-[#f5a623]/30 transition-colors">
                                    <AvatarImage src={listing.seller.avatar || undefined} />
                                    <AvatarFallback className="text-[10px] bg-[#30363d] text-[#8b949e]">
                                        {listing.seller.username.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-white/80 group-hover:text-white transition-colors">
                                        {listing.seller.username}
                                    </span>
                                    <span className="text-[9px] font-black text-[#8b949e] uppercase tracking-widest">
                                        {listing.seller.sales} Sales
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg">
                                <Star className="w-3 h-3 fill-[#f5a623] text-[#f5a623]" />
                                <span className="text-xs font-black text-white">
                                    {listing.seller.rating.toFixed(1)}
                                </span>
                            </div>
                        </div>

                        {/* Price Action */}
                        <div className="flex items-center justify-between pt-4 border-t border-[#30363d]/50">
                            <div className="flex flex-col">
                                {listing.originalPrice && (
                                    <span className="text-[10px] text-[#8b949e] line-through font-bold">
                                        {formatCurrency(listing.originalPrice)}
                                    </span>
                                )}
                                <span className="text-xl font-black text-[#f5a623]">
                                    {formatCurrency(listing.price)}
                                </span>
                            </div>
                            <div className="h-10 w-10 rounded-xl bg-[#f5a623] flex items-center justify-center text-black shadow-[0_0_20px_rgba(245,166,35,0.2)] transition-all group-hover:scale-110 active:scale-95">
                                <Zap className="w-5 h-5 fill-current" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ListingQuickView
                listing={listing}
                isOpen={isQuickViewOpen}
                onOpenChange={setIsQuickViewOpen}
            />
        </>
    );
}
