"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, ShieldCheck, Clock, Zap, ShoppingCart, Info } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface RecommendedSellerCardProps {
    listing: any;
}

export function RecommendedSellerCard({ listing }: RecommendedSellerCardProps) {
    const [quantity, setQuantity] = useState(listing.minQuantity || 1000);
    const [totalPrice, setTotalPrice] = useState(0);

    const pricePerUnit = Number(listing.price);
    const pricePerK = pricePerUnit * 1000;

    useEffect(() => {
        setTotalPrice(quantity * pricePerUnit);
    }, [quantity, pricePerUnit]);

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value) || 0;
        setQuantity(value);
    };

    return (
        <Card className="relative overflow-hidden bg-gradient-to-br from-[#1c2128] to-[#0d1117] border-[#f5a623]/30 shadow-[0_0_50px_rgba(245,166,35,0.05)] p-0 group">
            {/* Gloss Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#f5a623]/5 via-transparent to-transparent pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Left Side: Seller Info */}
                <div className="lg:col-span-4 p-8 border-b lg:border-b-0 lg:border-r border-[#30363d]/50 bg-[#0d1117]/50">
                    <div className="flex flex-col items-center text-center">
                        <div className="relative mb-6">
                            <div className="absolute -inset-4 bg-[#f5a623]/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <Avatar className="h-24 w-24 rounded-2xl border-2 border-[#f5a623]/40 p-1 bg-[#0d1117] relative">
                                <AvatarImage src={listing.seller.avatar} alt={listing.seller.username} />
                                <AvatarFallback className="bg-[#1c2128] text-2xl font-black text-white">
                                    {listing.seller.username.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-2 -right-2 bg-[#22c55e] border-4 border-[#0d1117] rounded-full p-1.5 shadow-lg">
                                <ShieldCheck className="w-4 h-4 text-white" />
                            </div>
                        </div>

                        <h3 className="text-2xl font-black text-white mb-2 tracking-tight uppercase">{listing.seller.username}</h3>

                        <div className="flex items-center gap-1.5 mb-6 bg-[#161b22] px-3 py-1 rounded-full border border-[#30363d]">
                            <Star className="w-4 h-4 text-[#f5a623] fill-[#f5a623]" />
                            <span className="text-sm font-black text-white">{listing.seller.sellerRating?.toFixed(1) || "5.0"}</span>
                            <span className="text-[10px] text-[#8b949e] font-bold ml-1 uppercase">{listing.seller.totalSales || 0} Sales</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 w-full">
                            <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d] flex flex-col items-center gap-1">
                                <Clock className="w-4 h-4 text-[#8b949e]" />
                                <span className="text-[10px] text-[#8b949e] font-black uppercase tracking-wider">Delivery</span>
                                <span className="text-xs font-bold text-white whitespace-nowrap">{listing.deliveryTime} Mins</span>
                            </div>
                            <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d] flex flex-col items-center gap-1">
                                <Zap className="w-4 h-4 text-[#22c55e]" />
                                <span className="text-[10px] text-[#8b949e] font-black uppercase tracking-wider">Status</span>
                                <span className="text-xs font-bold text-[#22c55e] uppercase">Online</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Pricing & Interaction */}
                <div className="lg:col-span-8 p-8 flex flex-col justify-center">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Badge className="bg-[#f5a623] hover:bg-[#f5a623] text-black font-black uppercase tracking-wider px-3 py-1 text-[10px]">
                                    Best Value
                                </Badge>
                                <span className="text-[10px] text-[#8b949e] font-black uppercase tracking-widest flex items-center gap-1">
                                    <Info className="w-3 h-3" /> price per 1,000 units
                                </span>
                            </div>
                            <div className="flex items-baseline gap-3">
                                <span className="text-5xl font-black text-white tracking-tighter tabular-nums">
                                    {formatCurrency(pricePerK)}
                                </span>
                                <span className="text-xl text-[#8b949e] font-bold uppercase tracking-tight">/ 1k units</span>
                            </div>
                        </div>

                        <div className="text-right">
                            <span className="text-[10px] text-[#8b949e] font-black uppercase tracking-widest block mb-2">Quantity in Stock</span>
                            <span className="text-2xl font-black text-[#22c55e] tracking-tight tabular-nums">{listing.stock?.toLocaleString()} units</span>
                        </div>
                    </div>

                    <div className="bg-[#050506] rounded-2xl border border-[#30363d] p-6 lg:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                            <div className="space-y-3">
                                <label className="text-[10px] text-[#8b949e] font-black uppercase tracking-[0.2em]">Purchase Amount</label>
                                <div className="relative group">
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={handleQuantityChange}
                                        min={listing.minQuantity}
                                        max={listing.stock}
                                        className="w-full h-14 bg-[#0d1117] border border-[#30363d] rounded-xl px-4 text-lg font-black text-white focus:border-[#f5a623] focus:ring-1 focus:ring-[#f5a623]/20 focus:outline-none transition-all tabular-nums"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-[#8b949e] uppercase tracking-wider group-hover:text-[#f5a623] transition-colors pointer-events-none">
                                        Units
                                    </span>
                                </div>
                                <p className="text-[10px] text-[#8b949e] font-bold uppercase italic">
                                    Min: {listing.minQuantity?.toLocaleString()} | Max: {listing.maxQuantity?.toLocaleString()}
                                </p>
                            </div>

                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between px-2">
                                    <span className="text-[10px] text-[#8b949e] font-black uppercase tracking-[0.2em]">Total Price</span>
                                    {quantity > 10000 && (
                                        <span className="text-[10px] text-[#22c55e] font-black uppercase tracking-wider">-5% Bulk Applied</span>
                                    )}
                                </div>
                                <div className="h-14 bg-[#161b22] border border-[#30363d]/50 rounded-xl px-5 flex items-center justify-between">
                                    <span className="text-sm font-black text-[#8b949e] uppercase tracking-widest">Subtotal</span>
                                    <span className="text-2xl font-black text-[#f5a623] tracking-tighter tabular-nums">{formatCurrency(totalPrice)}</span>
                                </div>
                            </div>
                        </div>

                        <Button className="w-full h-16 mt-8 bg-[#f5a623] hover:bg-[#f5a623]/90 text-black font-black uppercase tracking-[0.2em] text-sm rounded-xl shadow-[0_10px_30px_rgba(245,166,35,0.2)] hover:shadow-[0_15px_40px_rgba(245,166,35,0.3)] hover:-translate-y-0.5 transition-all">
                            <ShoppingCart className="w-5 h-5 mr-3" />
                            Secure Purchase Now
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
}
