"use client";

import React from "react";
import { Star, ShieldCheck, Zap, TrendingUp, History, ShoppingCart } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface CurrencyListingsTableProps {
    listings: any[];
}

export function CurrencyListingsTable({ listings }: CurrencyListingsTableProps) {
    if (!listings.length) {
        return (
            <div className="py-20 text-center bg-[#0d1117] rounded-3xl border border-[#30363d]/50 border-dashed">
                <p className="text-[#8b949e] font-black uppercase tracking-widest">No listings found for this search.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* Header (Desktop Only) */}
            <div className="hidden lg:grid grid-cols-12 gap-6 px-8 py-4 bg-[#0d1117]/50 rounded-xl border border-[#30363d]/30">
                <div className="col-span-4 text-[10px] font-black text-[#8b949e] uppercase tracking-widest">Seller</div>
                <div className="col-span-2 text-[10px] font-black text-[#8b949e] uppercase tracking-widest">Delivery</div>
                <div className="col-span-2 text-[10px] font-black text-[#8b949e] uppercase tracking-widest">Stock</div>
                <div className="col-span-2 text-[10px] font-black text-[#8b949e] uppercase tracking-widest text-right">Price per K</div>
                <div className="col-span-2"></div>
            </div>

            {/* Listings Row */}
            {listings.map((listing) => {
                const unitPrice = Number(listing.price);
                const pricePerK = unitPrice * 1000;

                return (
                    <div
                        key={listing.id}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-center p-6 lg:px-8 bg-[#0d1117] hover:bg-[#161b22] border border-[#30363d]/50 rounded-2xl transition-all group"
                    >
                        {/* Seller */}
                        <div className="col-span-1 lg:col-span-4 flex items-center gap-4">
                            <div className="relative">
                                <Avatar className="h-12 w-12 rounded-xl border border-[#30363d] group-hover:border-[#f5a623]/50 transition-colors">
                                    <AvatarImage src={listing.seller.avatar} />
                                    <AvatarFallback className="bg-[#050506] text-white">
                                        {listing.seller.username?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                {listing.seller.sellerRating >= 4.8 && (
                                    <div className="absolute -top-1 -right-1 bg-[#f5a623] text-black p-0.5 rounded shadow-lg">
                                        <ShieldCheck className="w-2.5 h-2.5" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-black text-white uppercase tracking-tight text-sm">
                                        {listing.seller.username}
                                    </span>
                                    {listing.seller.totalSales > 100 && (
                                        <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-[8px] uppercase font-black px-1.5 py-0">Elite</Badge>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <div className="flex items-center text-[#f5a623]">
                                        <Star className="w-2.5 h-2.5 fill-current" />
                                        <span className="ml-1 text-[10px] font-black">{listing.seller.sellerRating?.toFixed(1) || "5.0"}</span>
                                    </div>
                                    <span className="text-[#30363d] text-[10px]">|</span>
                                    <span className="text-[10px] text-[#8b949e] font-bold">
                                        {listing.seller.totalSales} Sales
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Delivery */}
                        <div className="col-span-1 lg:col-span-2 flex items-center gap-3">
                            <History className="w-4 h-4 text-[#8b949e] lg:hidden" />
                            <div>
                                <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest lg:hidden mb-1">Delivery Time</div>
                                <div className="text-white text-sm font-bold flex items-center gap-2">
                                    <Zap className="w-3 h-3 text-[#f5a623]" />
                                    ~{listing.deliveryTime} mins
                                </div>
                            </div>
                        </div>

                        {/* Stock */}
                        <div className="col-span-1 lg:col-span-2 flex items-center gap-3">
                            <TrendingUp className="w-4 h-4 text-[#8b949e] lg:hidden" />
                            <div>
                                <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest lg:hidden mb-1">Stock Left</div>
                                <div className="text-white text-sm font-bold">
                                    {listing.stock.toLocaleString()} K Units
                                </div>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="col-span-1 lg:col-span-2 lg:text-right">
                            <div className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest lg:hidden mb-1">Price per K</div>
                            <div className="text-[#f5a623] text-lg font-black tracking-tighter">
                                {formatCurrency(pricePerK)}
                            </div>
                        </div>

                        {/* Action */}
                        <div className="col-span-1 lg:col-span-2">
                            <Button className="w-full lg:w-auto px-6 h-11 bg-white hover:bg-[#f5a623] hover:text-black text-black font-black uppercase tracking-tighter text-xs rounded-xl transition-all group-hover:shadow-[0_0_20px_rgba(245,166,35,0.15)]">
                                <ShoppingCart className="w-3.5 h-3.5 mr-2" />
                                Select
                            </Button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
