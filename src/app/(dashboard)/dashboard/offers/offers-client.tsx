"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Search,
    ChevronDown,
    Play,
    Pause,
    Edit2,
    Link2,
    Trash2,
    Check,
    TrendingUp,
    ArrowUpDown,
    ChevronsUp
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { deleteListing, toggleListingStatus, updateListingPrice, DashboardOffer } from "./actions";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface OffersClientProps {
    initialOffers: DashboardOffer[];
    categoryQuery?: string;
    categories: Category[];
}

export function OffersClient({ initialOffers, categoryQuery = "all", categories }: OffersClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    // Real data state - initialized with server data
    const [offers, setOffers] = React.useState<DashboardOffer[]>(initialOffers);

    // Sync state when props change (on navigation)
    React.useEffect(() => {
        setOffers(initialOffers);
    }, [initialOffers]);

    // Filter locally for instant feedback if category changes client-side, 
    // though arguably we should rely on URL params and server re-render for categories.
    // For now, if we receive "all" offers but want to filter by prop:
    // Actually, if server passes filtered offers, this filter is redundant but safe.

    // The server already filters by category via the action, so we use 'offers' directly.
    // This avoids double-filtering logic that might cause empty states during transitions.
    const displayOffers = offers;

    const updatePrice = (id: string, newPrice: string) => {
        // Optimistic update for input field
        setOffers(prev => prev.map(o => o.id === id ? { ...o, price: newPrice } : o));
    };

    const confirmPriceUpdate = async (id: string, priceStr: string) => {
        const priceVal = parseFloat(priceStr);
        if (isNaN(priceVal)) return;

        toast.promise(updateListingPrice(id, priceVal), {
            loading: 'Updating price...',
            success: 'Price updated',
            error: 'Failed to update price'
        });
    };

    const toggleStatus = async (id: string) => {
        // Optimistic toggle
        setOffers(prev => prev.map(o => {
            if (o.id === id) {
                return { ...o, status: o.status === 'active' ? 'paused' : 'active' };
            }
            return o;
        }));

        const result = await toggleListingStatus(id);
        if (result.error) {
            toast.error(result.error);
            // Revert on error
            setOffers(prev => prev.map(o => {
                if (o.id === id) {
                    return { ...o, status: o.status === 'active' ? 'paused' : 'active' }; // Re-toggle back
                }
                return o;
            }));
        } else {
            const newStatus = result.newStatus === 'active' ? 'Resumed' : 'Paused';
            toast.success(`Offer ${newStatus}`);
        }
    };

    const deleteOffer = async (id: string) => {
        // Optimistic delete
        const previousOffers = [...offers];
        setOffers(prev => prev.filter(o => o.id !== id));

        const result = await deleteListing(id);
        if (result.error) {
            toast.error(result.error);
            setOffers(previousOffers); // Revert
        } else {
            toast.success("Offer deleted");
        }
    };

    const copyLink = (id: string) => {
        const link = `${window.location.origin}/listing/${id}`;
        navigator.clipboard.writeText(link);
        toast.success("Link copied to clipboard");
    };

    return (
        <div className="relative z-10 space-y-5">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <ChevronsUp className="h-7 w-7 text-[#f5a623]" />
                    <h1 className="text-3xl font-semibold text-white tracking-tighter uppercase">Offers</h1>
                </div>
                <Link href="/dashboard/listings/create">
                    <Button className="bg-[#f5a623] hover:bg-[#e09612] text-black font-bold h-[42px] px-8 rounded-lg transition-all shadow-lg hover:shadow-[#f5a623]/20">
                        New Offer
                    </Button>
                </Link>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-2">
                {categories.map((cat) => (
                    <Button
                        key={cat.id}
                        variant="outline"
                        onClick={() => router.push(`/dashboard/offers?category=${cat.slug}`)}
                        className={cn(
                            "bg-[#13181e] border-[#2d333b] hover:bg-[#1c2128] h-[40px] px-4 gap-3 font-bold rounded-lg border-opacity-50 transition-all text-[13px]",
                            categoryQuery === cat.slug ? "border-[#f5a623] text-[#f5a623] border-opacity-100" : "text-white"
                        )}
                    >
                        {cat.name}
                    </Button>
                ))}

                <div className="relative flex-1 max-w-xs ml-2">
                    <Input
                        id="offers-search"
                        placeholder="Search offers"
                        className="h-[40px] bg-[#13181e] border-[#2d333b] text-white focus:border-[#f5a623] pl-4 pr-10 rounded-lg placeholder:text-[#8b949e] border-opacity-50 text-[13px] font-medium"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8b949e]" />
                </div>
            </div>

            {/* Offers List */}
            <div className="grid gap-4">
                {displayOffers.map((offer) => (
                    <Card
                        key={offer.id}
                        className={cn(
                            "transition-all overflow-hidden group shadow-lg",
                            offer.status === 'paused'
                                ? "bg-[#2a1215] border-[#f85149]/30 hover:border-[#f85149]/50"
                                : "bg-[#13181e] border-[#2d333b]/40 hover:border-[#3d444d]"
                        )}
                    >
                        {/* Inner Padding Container */}
                        <div className="p-4 space-y-4">
                            {/* Top Row: Game Info & Status */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-[13px] font-bold">
                                    <span className="text-[#f5a623] hover:text-[#e09612] cursor-pointer transition-colors tracking-tight uppercase">{offer.game}</span>
                                    {offer.platform && (
                                        <>
                                            <span className="text-[#8b949e] mx-1">:</span>
                                            <span className="text-white tracking-tight">{offer.platform}</span>
                                        </>
                                    )}
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-[11px] text-[#8b949e] font-bold uppercase tracking-wider">Expires in {offer.expiresIn}</span>
                                    <Badge
                                        className={cn(
                                            "capitalize border h-7 px-4 text-[10px] font-semibold rounded-full transition-transform hover:scale-105 cursor-default tracking-widest uppercase",
                                            offer.status === 'active'
                                                ? "bg-[#f5a623]/5 text-[#f5a623] border-[#f5a623]/20 shadow-[0_0_10px_rgba(245,166,35,0.1)]"
                                                : "bg-white/5 text-white/50 border-white/10"
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
                                        <Link href={`/dashboard/listings/${offer.id}/edit`}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-[#9ca3af] hover:text-white hover:bg-[#252b33] transition-all">
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-[#9ca3af] hover:text-white hover:bg-[#252b33] transition-all"
                                            onClick={() => copyLink(offer.id)}
                                        >
                                            <Link2 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-[#9ca3af] hover:text-[#ff4d4f] hover:bg-[#ff4d4f]/10 transition-all"
                                            onClick={() => deleteOffer(offer.id)}
                                        >
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
                                    {offer.category !== 'currency' && (
                                        <h3 className="text-[17px] font-semibold text-white truncate max-w-lg mb-2 group-hover:text-[#f5a623] transition-colors leading-tight tracking-tighter uppercase">
                                            {offer.title}
                                        </h3>
                                    )}
                                    <div className="flex items-center gap-12 text-[12px]">
                                        <div className="flex flex-col">
                                            <span className="text-[#8b949e] font-semibold mb-0.5 text-[10px] uppercase tracking-[0.2em]">Inventory:</span>
                                            <span className="text-white font-semibold tracking-tight">{offer.quantity} UNIT</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[#8b949e] font-semibold mb-0.5 text-[10px] uppercase tracking-[0.2em]">Processing:</span>
                                            <span className="text-white font-semibold tracking-tight">{offer.deliveryTime}</span>
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
                                            className="w-10 bg-transparent text-white font-semibold text-[15px] focus:outline-none placeholder:text-[#8b949e] text-center"
                                        />
                                        <span className="text-[11px] text-[#8b949e] ml-1 font-semibold whitespace-nowrap uppercase">
                                            $/unit
                                        </span>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-[40px] w-[40px] border-[#2d333b] bg-[#1c2128] text-[#8b949e] hover:text-[#f5a623] hover:bg-[#f5a623]/10 hover:border-[#f5a623]/20 transition-all rounded-lg"
                                        onClick={() => confirmPriceUpdate(offer.id, offer.price)}
                                    >
                                        <Check className="h-5 w-5 stroke-[4]" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Empty State Mock */}
            {displayOffers.length === 0 && (
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
    );
}
