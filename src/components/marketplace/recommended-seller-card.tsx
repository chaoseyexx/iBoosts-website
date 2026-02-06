import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Zap, Star, TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface RecommendedSellerCardProps {
    listing: any;
}

export function RecommendedSellerCard({ listing }: RecommendedSellerCardProps) {
    if (!listing) return null;

    return (
        <Card className="relative overflow-hidden bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#f5a623]/20 shadow-2xl">
            {/* Spotlight Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#f5a623]/10 rounded-full blur-[40px] -mr-16 -mt-16" />

            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    {/* Left: Seller Info */}
                    <div className="flex items-start gap-4">
                        <div className="relative">
                            <Avatar className="h-16 w-16 border-2 border-[#f5a623]">
                                <AvatarImage src={listing.seller.avatar || undefined} alt={listing.seller.username} />
                                <AvatarFallback className="bg-[#21262d] text-xl text-white">
                                    {listing.seller.username.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 bg-[#f5a623] text-black rounded-full p-1 shadow-lg">
                                <TrendingUp className="h-3 w-3 stroke-[3]" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="bg-[#f5a623]/10 text-[#f5a623] border-[#f5a623]/20 text-[10px] font-bold uppercase tracking-wider">
                                    Best Value
                                </Badge>
                                <span className="text-xs text-[#8b949e]">Recommended by system</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-xl font-black text-white">{listing.seller.username}</h3>
                                {listing.seller.verified && <ShieldCheck className="h-5 w-5 text-[#f5a623]" />}
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 text-[#f5a623]">
                                    <Star className="h-3.5 w-3.5 fill-[#f5a623]" />
                                    <span className="text-sm font-bold">{listing.seller.sellerRating || 5.0}</span>
                                </div>
                                <span className="text-[#8b949e] text-sm">• {listing.seller.totalSales || 0} Successful Deals</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Pricing & CTA */}
                    <div className="flex flex-col items-end gap-3 text-right">
                        <div className="space-y-0.5">
                            <span className="text-sm text-[#8b949e] uppercase font-bold tracking-tighter">Current Best Price</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-white">$ {listing.price.toFixed(4)}</span>
                                <span className="text-sm text-[#8b949e]">/ unit</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] text-[#00b67a] font-bold uppercase">Stock Available</span>
                                <span className="text-sm font-bold text-white">{listing.stock.toLocaleString()}</span>
                            </div>
                            <Button className="bg-[#f5a623] hover:bg-[#e09612] text-black font-extrabold h-12 px-8 text-base shadow-[0_0_20px_rgba(245,166,35,0.3)] hover:shadow-[0_0_30px_rgba(245,166,35,0.4)] transition-all">
                                Buy Now
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Bottom Perks */}
                <div className="mt-6 pt-6 border-t border-[#2d333b] grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 text-[#8b949e]">
                        <Zap className="h-4 w-4 text-[#f5a623]" />
                        <span className="text-xs font-medium uppercase">Instant Delivery</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#8b949e]">
                        <ShieldCheck className="h-4 w-4 text-[#f5a623]" />
                        <span className="text-xs font-medium uppercase">Secured by iBoosts</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#8b949e]">
                        <Star className="h-4 w-4 text-[#f5a623]" />
                        <span className="text-xs font-medium uppercase">Top-Tier Merchant</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
