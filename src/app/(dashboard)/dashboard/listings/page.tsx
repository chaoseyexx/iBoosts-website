"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Filter, Plus, MoreHorizontal } from "lucide-react";
import Link from "next/link";

export default function MyListingsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">My Listings</h1>
                <Link href="/dashboard/seller/listings/new">
                    <Button className="bg-[#f5a623] hover:bg-[#e09612] text-black font-bold">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Listing
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 bg-[#1c2128] p-4 rounded-xl border border-[#2d333b]">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9ca3af]" />
                    <Input
                        placeholder="Search listings..."
                        className="pl-10 bg-[#0f1419] border-[#2d333b] text-white focus:border-[#f5a623]"
                    />
                </div>
                <Button variant="outline" className="border-[#2d333b] text-[#9ca3af] hover:text-white hover:bg-[#252b33]">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                </Button>
            </div>

            {/* Listings Grid */}
            <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <Card key={i} className="p-4 bg-[#1c2128] border-[#2d333b] hover:border-[#2d333b] flex items-center gap-4">
                        {/* Image Placeholder */}
                        <div className="h-16 w-24 bg-[#252b33] rounded-lg shrink-0" />

                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-bold text-white truncate">Level 100 Account - Rare Skins - Unranked</h3>
                                    <p className="text-sm text-[#9ca3af]">Accounts • League of Legends</p>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-white text-lg">$149.99</div>
                                    <div className="text-xs text-[#9ca3af]">Stock: 1</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 border-l border-[#2d333b] pl-4">
                            <div className="px-2 py-1 rounded text-xs font-medium bg-green-500/10 text-green-500">
                                Active
                            </div>
                            <Button variant="ghost" size="icon" className="text-[#9ca3af] hover:text-white">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
