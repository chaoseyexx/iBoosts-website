"use client";

import React, { useState, useEffect } from "react";
import { Star, ShieldCheck, Zap, TrendingUp, Info } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface RecommendedSellerCardProps {
    listing: any;
}

export function RecommendedSellerCard({ listing }: RecommendedSellerCardProps) {
    const [quantity, setQuantity] = useState(10); // Default to 10k
    const [totalPrice, setTotalPrice] = useState(0);

    const unitPrice = Number(listing.price);
    const pricePerK = unitPrice * 1000;

    useEffect(() => {
        setTotalPrice(quantity * pricePerK);
    }, [quantity, pricePerK]);

    return (
        <div className="relative group">
            {/* Background Glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#f5a623] to-[#ffb347] rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000" />

            <div className="relative flex flex-col lg:flex-row bg-[#0d1117] border border-[#f5a623]/30 rounded-3xl overflow-hidden shadow-2xl">
                {/* Left Side: Seller Info */}
                <div className="w-full lg:w-2/5 p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-[#30363d]/50 bg-gradient-to-br from-[#161b22] to-transparent">
                    <div className="flex items-start gap-6 mb-8">
                        <div className="relative">
                            <Avatar className="h-20 w-20 rounded-2xl border-2 border-[#f5a623] shadow-lg shadow-[#f5a623]/10">
                                <AvatarImage src={listing.seller.avatar} />
                                <AvatarFallback className="text-xl font-bold bg-[#1c2128] text-white">
                                    {listing.seller.username?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-2 -right-2 bg-[#f5a623] text-black p-1.5 rounded-lg shadow-lg">
                                <ShieldCheck className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-xl font-black text-white uppercase tracking-tight">
                                    {listing.seller.username}
                                </h3>
                                <Badge className="bg-[#f5a623]/10 text-[#f5a623] border-[#f5a623]/20 hover:bg-[#f5a623]/20 text-[10px] uppercase font-black px-2 py-0">
                                    Pro
                                </Badge>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center text-[#f5a623]">
                                    <Star className="w-3.5 h-3.5 fill-current" />
                                    <span className="ml-1 text-sm font-black">{listing.seller.sellerRating?.toFixed(1) || "5.0"}</span>
                                </div>
                                <span className="text-[#30363d]">|</span>
                                <span className="text-xs text-[#8b949e] font-medium">
                                    {listing.seller.totalSales || 0} Successful Sales
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-[#050506] rounded-2xl border border-[#30363d]/50">
                            <div className="flex items-center gap-2 text-[#8b949e] text-[10px] font-black uppercase tracking-wider mb-1">
                                <Zap className="w-3 h-3 text-[#f5a623]" />
                                Delivery
                            </div>
                            <div className="text-white font-bold text-sm">~{listing.deliveryTime} mins</div>
                        </div>
                        <div className="p-4 bg-[#050506] rounded-2xl border border-[#30363d]/50">
                            <div className="flex items-center gap-2 text-[#8b949e] text-[10px] font-black uppercase tracking-wider mb-1">
                                <TrendingUp className="w-3 h-3 text-[#22c55e]" />
                                Stock
                            </div>
                            <div className="text-white font-bold text-sm">{listing.stock.toLocaleString()} K</div>
                        </div>
                    </div>

                    <div className="mt-8 flex items-center gap-2 text-[#8b949e] text-xs pt-6 border-t border-[#30363d]/50">
                        <Info className="w-3.5 h-3.5" />
                        <span>Seller is currently active & responding fast.</span>
                    </div>
                </div>

                {/* Right Side: Price Calculator */}
                <div className="flex-1 p-8 lg:p-10 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h4 className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest mb-1">Base Price</h4>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-black text-white">{formatCurrency(pricePerK)}</span>
                                    <span className="text-xs text-[#8b949e]">/ 1,000 units</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <Badge className="bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/20 text-[10px] uppercase font-black mb-1">In Stock</Badge>
                                <div className="text-[10px] text-[#8b949e] uppercase font-bold">Verified Listing</div>
                            </div>
                        </div>

                        <div className="space-y-4 mb-10">
                            <div className="flex items-center justify-between text-xs font-black text-[#8b949e] uppercase tracking-wider">
                                <span>Select Quantity (in K units)</span>
                                <span className="text-white">{quantity.toLocaleString()} K Units</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max={Math.min(listing.stock, 500)}
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                className="w-full h-1.5 bg-[#1c2128] rounded-full appearance-none cursor-pointer accent-[#f5a623]"
                            />
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    className="h-12 bg-[#050506] border-[#30363d] text-white font-black text-center"
                                />
                                <span className="text-[#8b949e] font-black uppercase text-[10px]">K Units</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-6 bg-[#f5a623] rounded-2xl shadow-xl shadow-[#f5a623]/5">
                            <div>
                                <span className="text-[10px] font-black text-black/60 uppercase tracking-widest block mb-0.5">Grand Total</span>
                                <span className="text-3xl font-black text-black leading-none">{formatCurrency(totalPrice)}</span>
                            </div>
                            <Button className="h-12 px-8 bg-black hover:bg-black/90 text-white font-black uppercase tracking-tighter text-sm rounded-xl">
                                Buy Instantly
                            </Button>
                        </div>
                        <p className="text-center text-[10px] text-[#8b949e] uppercase font-black tracking-widest">
                            Secure Escrow Protected Payment
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
