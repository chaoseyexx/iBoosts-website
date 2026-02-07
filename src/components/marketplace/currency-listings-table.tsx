import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Zap } from "lucide-react";

interface Listing {
    id: string;
    title: string;
    price: number;
    stock: number;
    minQuantity?: number;
    seller: {
        username: string;
        rating: number;
        verified: boolean;
    };
    deliveryTime?: number;
}

interface CurrencyListingsTableProps {
    listings: any[];
}

export function CurrencyListingsTable({ listings }: CurrencyListingsTableProps) {
    if (listings.length === 0) {
        return (
            <div className="text-center py-20 border border-dashed border-[#2d333b] rounded-xl bg-[#0d1117]/50">
                <p className="text-[#8b949e]">No listings found for this search.</p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-[#2d333b] bg-[#0d1117] overflow-hidden">
            <div className="overflow-x-auto scrollbar-hide">
                <Table className="min-w-[600px] md:min-w-full">
                    <TableHeader className="bg-[#161b22]">
                        <TableRow className="border-[#2d333b] hover:bg-transparent">
                            <TableHead className="text-[#8b949e] font-bold uppercase text-[11px]">Seller</TableHead>
                            <TableHead className="text-[#8b949e] font-bold uppercase text-[11px]">Pricing</TableHead>
                            <TableHead className="text-[#8b949e] font-bold uppercase text-[11px]">Stock</TableHead>
                            <TableHead className="text-[#8b949e] font-bold uppercase text-[11px]">Delivery</TableHead>
                            <TableHead className="text-right text-[#8b949e] font-bold uppercase text-[11px]">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {listings.map((listing) => (
                            <TableRow key={listing.id} className="border-[#2d333b] hover:bg-[#252b33]/30 transition-colors group">
                                <TableCell>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-1.5 leading-none">
                                            <span className="font-bold text-white group-hover:text-[#f5a623] transition-colors">
                                                {listing.seller.username}
                                            </span>
                                            {listing.seller.verified && <ShieldCheck className="h-3 w-3 text-[#f5a623]" />}
                                        </div>
                                        <div className="flex items-center gap-1 mt-1 text-[10px] text-[#8b949e]">
                                            <span className="text-[#f5a623]">★ {listing.seller.sellerRating || 5.0}</span>
                                            <span>• {listing.seller.totalSales || 0} sales</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="text-lg font-black text-white">$ {listing.price.toFixed(4)}</span>
                                        <span className="text-[10px] text-[#8b949e] uppercase">per unit</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-white">{listing.stock.toLocaleString()}</span>
                                        <span className="text-[10px] text-[#8b949e] uppercase">min. {listing.minQuantity || 1}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1.5">
                                        <Zap className="h-3 w-3 text-[#00b67a]" />
                                        <span className="text-sm text-white font-medium">{listing.deliveryTime || 15} min</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button size="sm" className="bg-[#f5a623] hover:bg-[#e09612] text-black font-extrabold h-9 px-4 glow-olive">
                                        Buy Now
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
