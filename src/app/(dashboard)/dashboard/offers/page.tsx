"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Plus,
    Search,
    ChevronDown,
    Play,
    Pause,
    Edit2,
    Link2,
    Trash2,
    Check,
    Coins,
    ChevronsUp,
    TrendingUp,
    ArrowUpDown,
    Filter,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

function OffersContent() {
    const searchParams = useSearchParams();
    const categoryQuery = searchParams.get("category") || "all";

    // Mock data with state to allow interactivity
    const [offers, setOffers] = React.useState([
        {
            id: "1",
            game: "Rust",
            platform: "PC",
            title: "Farming per hour | Guaranteed loot+",
            quantity: "5,000",
            deliveryTime: "1 h",
            price: "4.5",
            status: "paused",
            expiresIn: "11d 8h",
            category: "items",
            image: "https://i.imgur.com/u7FvX8B.png",
        },
        {
            id: "2",
            game: "Bee Swarm Simulator",
            title: "Boost, 20 bees & Starter Hive | Honey, Quests & Badges Grind",
            quantity: "997",
            deliveryTime: "1 day",
            price: "22",
            status: "active",
            expiresIn: "20d 7h",
            category: "items",
            image: "https://i.imgur.com/8N48l8b.png",
        },
        {
            id: "3",
            game: "Roblox",
            title: "JAILBREAK - 1M Cash",
            quantity: "999",
            deliveryTime: "1 day",
            price: "5",
            status: "paused",
            expiresIn: "11d 8h",
            category: "currency",
            image: "https://i.imgur.com/39A8n8A.png",
        }
    ]);

    const filteredOffers = offers.filter(o => categoryQuery === "all" || o.category === categoryQuery);

    const updatePrice = (id: string, newPrice: string) => {
        setOffers(prev => prev.map(o => o.id === id ? { ...o, price: newPrice } : o));
    };

    const toggleStatus = (id: string) => {
        setOffers(prev => prev.map(o => o.id === id ? { ...o, status: o.status === 'active' ? 'paused' : 'active' } : o));
    };

    return (
        <div className="relative min-h-screen">
            {/* Background Image / Illustration (Subtle) */}
            <div className="absolute top-0 right-[-100px] w-[800px] h-[700px] opacity-[0.05] pointer-events-none z-0">
                <Image
                    src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1000"
                    alt="Background Decor"
                    fill
                    className="object-contain object-right-top grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-[#0a0e13] via-transparent to-[#0a0e13]" />
            </div>

            <div className="relative z-10 space-y-5">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <ChevronsUp className="h-7 w-7 text-[#f5a623]" />
                        <h1 className="text-3xl font-extrabold text-white tracking-tight">Offers</h1>
                    </div>
                    <Link href="/dashboard/listings/create">
                        <Button className="bg-[#f5a623] hover:bg-[#e09612] text-black font-bold h-[42px] px-8 rounded-lg transition-all shadow-lg hover:shadow-[#f5a623]/20">
                            New Offer
                        </Button>
                    </Link>
                </div>

                {/* Filter Bar */}
                <div className="flex flex-wrap items-center gap-2">
                    <Button variant="outline" className="bg-[#13181e] border-[#2d333b] text-white hover:bg-[#1c2128] h-[40px] px-4 gap-3 font-bold rounded-lg border-opacity-50 transition-all text-[13px]">
                        Select Game <ChevronDown className="h-4 w-4 text-[#4b5563]" />
                    </Button>
                    <Button variant="outline" className="bg-[#13181e] border-[#2d333b] text-white hover:bg-[#1c2128] h-[40px] px-5 gap-3 font-bold rounded-lg border-opacity-50 transition-all text-[13px] min-w-[80px]">
                        All <ChevronDown className="h-4 w-4 text-[#4b5563]" />
                    </Button>
                    <Button variant="outline" className="bg-[#13181e] border-[#2d333b] text-white hover:bg-[#1c2128] h-[40px] px-4 gap-3 font-bold rounded-lg border-opacity-50 transition-all text-[13px]">
                        Bulk actions <ChevronDown className="h-4 w-4 text-[#4b5563]" />
                    </Button>

                    <div className="relative flex-1 max-w-xs ml-2">
                        <Input
                            placeholder="Search offers"
                            className="h-[40px] bg-[#13181e] border-[#2d333b] text-white focus:border-[#f5a623] pl-4 pr-10 rounded-lg placeholder:text-[#4b5563] border-opacity-50 text-[13px] font-medium"
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4b5563]" />
                    </div>

                    <div className="flex items-center ml-auto">
                        <Button variant="ghost" className="text-[#9ca3af] hover:text-white h-[40px] gap-2 font-bold transition-colors">
                            <ArrowUpDown className="h-4 w-4" /> <span className="text-[14px]">Recommended</span> <ChevronDown className="h-4 w-4 text-[#4b5563]" />
                        </Button>
                    </div>
                </div>

                {/* Offers List */}
                <div className="grid gap-4">
                    {filteredOffers.map((offer) => (
                        <Card key={offer.id} className="bg-[#13181e] border-[#2d333b]/40 hover:border-[#3d444d] transition-all overflow-hidden group shadow-lg">
                            {/* Inner Padding Container */}
                            <div className="p-4 space-y-4">
                                {/* Top Row: Game Info & Status */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[13px] font-bold">
                                        <span className="text-white hover:text-[#f5a623] cursor-pointer transition-colors tracking-tight">{offer.game}</span>
                                        {offer.platform && (
                                            <>
                                                <span className="text-[#4b5563] mx-1">:</span>
                                                <span className="text-white tracking-tight">{offer.platform}</span>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-[11px] text-[#4b5563] font-bold uppercase tracking-wider">Expires in {offer.expiresIn}</span>
                                        <Badge
                                            className={cn(
                                                "capitalize border-0 h-6 px-4 text-[11px] font-black rounded-lg transition-transform hover:scale-105 cursor-default",
                                                offer.status === 'active'
                                                    ? "bg-[#00b67a] text-[#0a0e13]"
                                                    : "bg-[#5c9eff] text-[#0a0e13]"
                                            )}
                                        >
                                            {offer.status}
                                        </Badge>

                                        {/* Action Icons */}
                                        <div className="flex items-center gap-0.5 ml-4 border-l border-[#2d333b] pl-4 border-opacity-50">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-[#9ca3af] hover:text-white hover:bg-[#252b33] transition-all"
                                                onClick={() => toggleStatus(offer.id)}
                                            >
                                                {offer.status === 'active' ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-[#9ca3af] hover:text-white hover:bg-[#252b33] transition-all">
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-[#9ca3af] hover:text-white hover:bg-[#252b33] transition-all">
                                                <Link2 className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-[#9ca3af] hover:text-[#ff4d4f] hover:bg-[#ff4d4f]/10 transition-all">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Row: Offer Details & Price */}
                                <div className="flex items-center gap-6">
                                    {/* Offer Image */}
                                    <div className="relative w-[64px] h-[64px] rounded-lg bg-[#0a0e13] border border-[#2d333b] flex-shrink-0 flex items-center justify-center p-2.5 transition-transform group-hover:scale-105 border-opacity-50 shadow-inner overflow-hidden">
                                        <Image
                                            src={offer.image}
                                            alt={offer.game}
                                            width={50}
                                            height={50}
                                            className="object-contain"
                                        />
                                    </div>

                                    {/* Description & Stats */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-[14px] font-bold text-white truncate max-w-lg mb-2 group-hover:text-[#f5a623] transition-colors leading-snug">
                                            {offer.title}
                                        </h3>
                                        <div className="flex items-center gap-12 text-[12px]">
                                            <div className="flex flex-col">
                                                <span className="text-[#4b5563] font-bold mb-0.5 text-[10px] uppercase">Quantity:</span>
                                                <span className="text-white font-black">{offer.quantity}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[#4b5563] font-bold mb-0.5 text-[10px] uppercase">Delivery time:</span>
                                                <span className="text-white font-black">{offer.deliveryTime}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Price & Unit */}
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center bg-[#1c2128] border border-[#2d333b] rounded-lg h-[40px] px-3 transition-colors focus-within:border-[#f5a623]/40">
                                            <input
                                                type="text"
                                                value={offer.price}
                                                onChange={(e) => updatePrice(offer.id, e.target.value)}
                                                className="w-10 bg-transparent text-white font-black text-[15px] focus:outline-none placeholder:text-[#4b5563] text-center"
                                            />
                                            <span className="text-[11px] text-[#4b5563] ml-1 font-black whitespace-nowrap uppercase">
                                                $/unit
                                            </span>
                                        </div>
                                        <Button variant="outline" size="icon" className="h-[40px] w-[40px] border-[#2d333b] bg-[#1c2128] text-[#4b5563] hover:text-[#00b67a] hover:bg-[#1c2128]/50 transition-all rounded-lg">
                                            <Check className="h-5 w-5 stroke-[4]" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Empty State Mock */}
                {filteredOffers.length === 0 && (
                    <div className="py-32 text-center bg-[#13181e] border border-dashed border-[#2d333b] rounded-2xl">
                        <TrendingUp className="h-12 w-12 text-[#2d333b] mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-white mb-1">No offers available</h3>
                        <p className="text-[#9ca3af]">Start selling by creating your first offer.</p>
                        <Link href="/dashboard/listings/create">
                            <Button className="mt-6 bg-[#f5a623] hover:bg-[#e09612] text-black font-bold h-11 px-8">
                                Let's get started
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function OffersPage() {
    return (
        <React.Suspense fallback={
            <div className="flex items-center justify-center p-12">
                <div className="h-8 w-8 border-2 border-[#f5a623] border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <OffersContent />
        </React.Suspense>
    );
}

// Helper function for class merging
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
