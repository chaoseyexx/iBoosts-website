"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, ShieldCheck, Zap, Package, Clock, ShoppingCart } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface ListingQuickViewProps {
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
        deliveryTime?: number;
    };
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ListingQuickView({ listing, isOpen, onOpenChange }: ListingQuickViewProps) {
    const discount = listing.originalPrice
        ? Math.round(((listing.originalPrice - listing.price) / listing.originalPrice) * 100)
        : null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl bg-[#0d1117] border-[#30363d] p-0 overflow-hidden rounded-[2rem]">
                <div className="flex flex-col md:flex-row h-full max-h-[90vh] overflow-y-auto md:overflow-hidden">
                    {/* Left side: Image */}
                    <div className="md:w-1/2 relative bg-[#050506] flex items-center justify-center min-h-[300px] md:min-h-0">
                        {listing.image ? (
                            <Image
                                src={listing.image}
                                alt={listing.title}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <Zap className="w-16 h-16 text-[#f5a623] opacity-20" />
                        )}

                        {listing.isVerifiedByAI && (
                            <div className="absolute top-6 left-6 bg-[#22c55e]/10 backdrop-blur-md border border-[#22c55e]/20 rounded-full px-4 py-1.5 flex items-center gap-2 shadow-xl">
                                <ShieldCheck className="w-4 h-4 text-[#22c55e]" />
                                <span className="text-xs font-black text-[#22c55e] uppercase tracking-wider">iShield Verified</span>
                            </div>
                        )}
                    </div>

                    {/* Right side: Details */}
                    <div className="md:w-1/2 p-8 flex flex-col bg-gradient-to-br from-[#0d1117] to-[#161b22]">
                        <div className="mb-6">
                            <DialogTitle className="text-xl md:text-2xl font-black text-white uppercase tracking-tight leading-tight mb-2">
                                {listing.title}
                            </DialogTitle>
                            <DialogDescription className="sr-only">
                                Listing details for {listing.title}
                            </DialogDescription>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6 border border-[#30363d]">
                                        <AvatarImage src={listing.seller.avatar || undefined} />
                                        <AvatarFallback className="text-[10px] bg-[#30363d]">
                                            {listing.seller.username.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-xs font-bold text-[#8b949e]">
                                        {listing.seller.username}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-[#f5a623]/10 px-2 py-0.5 rounded-lg">
                                    <Star className="w-3 h-3 fill-[#f5a623] text-[#f5a623]" />
                                    <span className="text-[11px] font-black text-[#f5a623]">
                                        {listing.seller.rating.toFixed(1)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="flex-1 overflow-y-auto mb-8 pr-2 custom-scrollbar">
                            <div
                                className="text-sm text-[#8b949e] leading-relaxed prose prose-invert max-w-none prose-sm"
                                dangerouslySetInnerHTML={{ __html: listing.description }}
                            />
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-[#050506]/50 rounded-xl p-3 border border-white/5">
                                <span className="text-[9px] font-black text-[#8b949e] uppercase tracking-widest block mb-1">Availability</span>
                                <div className="flex items-center gap-2">
                                    <Package className="w-3.5 h-3.5 text-[#22c55e]" />
                                    <span className="text-xs font-bold text-white uppercase">{listing.stock || 'In Stock'}</span>
                                </div>
                            </div>
                            <div className="bg-[#050506]/50 rounded-xl p-3 border border-white/5">
                                <span className="text-[9px] font-black text-[#8b949e] uppercase tracking-widest block mb-1">Delivery Time</span>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-3.5 h-3.5 text-[#f5a623]" />
                                    <span className="text-xs font-bold text-white uppercase">Instant</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer / CTA */}
                        <div className="mt-auto pt-6 border-t border-white/5">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex flex-col">
                                    {discount && (
                                        <span className="text-xs text-[#8b949e] line-through font-bold">
                                            {formatCurrency(listing.originalPrice || 0)}
                                        </span>
                                    )}
                                    <span className="text-2xl font-black text-[#f5a623]">
                                        {formatCurrency(listing.price)}
                                    </span>
                                </div>
                                {discount && (
                                    <div className="bg-[#f55a23]/10 border border-[#f55a23]/20 rounded-lg px-2.5 py-1 text-[10px] font-black text-[#f55a23] uppercase">
                                        Save {discount}%
                                    </div>
                                )}
                            </div>

                            <Link href={`/checkout/${listing.id}`} className="block">
                                <Button className="w-full h-12 bg-[#f5a623] hover:bg-[#e09612] text-black font-black uppercase tracking-widest rounded-xl shadow-[0_4px_20px_rgba(245,166,35,0.2)]">
                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                    Proceed to Purchase
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
