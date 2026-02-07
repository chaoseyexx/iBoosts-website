"use client";

import React from "react";
import { formatCurrency } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star, Shield, Clock, ShoppingCart, TrendingUp } from "lucide-react";
import Link from "next/link";

interface CurrencyListingsTableProps {
    listings: any[];
}

export function CurrencyListingsTable({ listings }: CurrencyListingsTableProps) {
    if (listings.length === 0) {
        return (
            <div className="py-20 text-center bg-[#0d1117]/30 border border-dashed border-[#30363d] rounded-2xl">
                <p className="text-[#8b949e]">No other listings found matching your search.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-2xl border border-[#30363d] bg-[#0d1117]/20">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-[#30363d] bg-[#0d1117]/50">
                        <th className="p-5 text-[10px] font-black text-[#8b949e] uppercase tracking-widest">Seller</th>
                        <th className="p-5 text-[10px] font-black text-[#8b949e] uppercase tracking-widest hidden md:table-cell">Details</th>
                        <th className="p-5 text-[10px] font-black text-[#8b949e] uppercase tracking-widest">In Stock</th>
                        <th className="p-5 text-[10px] font-black text-[#8b949e] uppercase tracking-widest">Price / 1k</th>
                        <th className="p-5 text-right"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#30363d]/30">
                    {listings.map((listing) => (
                        <tr key={listing.id} className="hover:bg-[#1c2128]/40 transition-colors group">
                            <td className="p-5">
                                <Link href={`/seller/${listing.seller.username}`} className="flex items-center gap-4 group/seller">
                                    <div className="relative">
                                        <Avatar className="h-10 w-10 border border-[#30363d] rounded-lg p-0.5">
                                            <AvatarImage src={listing.seller.avatar} />
                                            <AvatarFallback className="bg-[#1c2128] text-xs font-bold">{listing.seller.username.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-[#22c55e] border-2 border-[#0d1117] rounded-full" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-white group-hover/seller:text-[#f5a623] transition-colors uppercase tracking-tight">
                                            {listing.seller.username}
                                        </span>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <Star className="w-2.5 h-2.5 text-[#f5a623] fill-[#f5a623]" />
                                            <span className="text-[10px] font-bold text-[#8b949e]">{listing.seller.sellerRating?.toFixed(1) || "5.0"}</span>
                                            <span className="text-[10px] text-[#30363d] mx-1">|</span>
                                            <span className="text-[10px] text-[#8b949e]">{listing.seller.totalSales || 0} Sales</span>
                                        </div>
                                    </div>
                                </Link>
                            </td>
                            <td className="p-5 hidden md:table-cell">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 text-[10px] text-[#8b949e] font-bold uppercase tracking-wider">
                                        <Clock className="w-3 h-3 text-[#f5a623]" />
                                        ~{listing.deliveryTime} Mins delivery
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-[#8b949e] font-bold uppercase tracking-wider">
                                        <Shield className="w-3 h-3 text-[#22c55e]" />
                                        Verified Professional
                                    </div>
                                </div>
                            </td>
                            <td className="p-5">
                                <div className="flex flex-col">
                                    <span className="text-sm font-black text-[#22c55e] tabular-nums">
                                        {listing.stock?.toLocaleString()}
                                    </span>
                                    <span className="text-[9px] text-[#8b949e] font-bold uppercase tracking-widest">
                                        Min: {listing.minQuantity?.toLocaleString()}
                                    </span>
                                </div>
                            </td>
                            <td className="p-5">
                                <div className="flex flex-col">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-lg font-black text-white tabular-nums">
                                            {formatCurrency(Number(listing.price) * 1000)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] text-[#8b949e] font-bold uppercase italic">
                                        <TrendingUp className="w-3 h-3 text-[#f5a623]" />
                                        Market Price
                                    </div>
                                </div>
                            </td>
                            <td className="p-5 text-right">
                                <Link href={`/listing/${listing.slug}`}>
                                    <Button variant="ghost" className="h-10 border border-[#30363d] text-white hover:bg-[#f5a623] hover:text-black hover:border-[#f5a623] font-black uppercase tracking-widest text-[10px] px-6 transition-all rounded-lg group-hover:bg-[#f5a623] group-hover:text-black group-hover:border-[#f5a623]">
                                        Buy Now
                                    </Button>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
