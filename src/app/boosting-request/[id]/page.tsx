import * as React from "react";
import {
    XCircle,
    ShoppingBag,
    VolumeX,
    ShieldCheck
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MainNavbar } from "@/components/layout/main-navbar";
import { Footer } from "@/components/layout/footer";

type RequestStatus = "available" | "sold" | "cancelled";

interface RequestData {
    id: string;
    game: string;
    type: string;
    shortDesc: string;
    description: string;
    price: string;
    status: RequestStatus;
    user: {
        username: string;
        avatar?: string;
        rating: number;
        reviews: number;
        verified: boolean;
    };
    created: string;
    expires: string;
    details?: { label: string; value: string }[];
    icon: string;
}

// Mock data based on provided IDs
const mockRequests: Record<string, RequestData> = {
    "1": {
        id: "1",
        game: "Warframe",
        type: "Credit Farming",
        shortDesc: "I need someone who can farm 10M credits for me.",
        description: "Looking for an experienced player to farm 10 million credits on my account. I have boosters active.",
        price: "$15.00",
        status: "available",
        user: { username: "ExcaliburPrime", rating: 99.8, reviews: 1422, verified: true },
        created: "Feb 3, 2026, 2:32:03 PM",
        expires: "Feb 10, 2026, 2:32:03 PM",
        icon: "/images/placeholder.svg",
    },
    "2": {
        id: "2",
        game: "Valorant",
        type: "Rank Boost",
        shortDesc: "Platinum III to Ascendant II",
        description: "Need a solo boost from Plat 3 to Ascendant 2. Must play Reyna/Jett and have high ADR.",
        price: "$45.00",
        status: "sold",
        user: { username: "FestinoHS", rating: 99.8, reviews: 1194, verified: true },
        created: "Feb 3, 2026, 2:32:03 PM",
        expires: "Feb 10, 2026, 2:32:03 PM",
        details: [
            { label: "Current rank", value: "Platinum III" },
            { label: "Desired rank", value: "Ascendant II" },
            { label: "Server", value: "EU" },
            { label: "Method", value: "Solo" }
        ],
        icon: "/images/placeholder.svg",
    },
    "3": {
        id: "3",
        game: "Valorant",
        type: "Rank Boost",
        shortDesc: "Ascendant II to Immortal I",
        description: "NA Server. Need a quick boost to Immortal 1. I am currently Ascendant 2 with good RR.",
        price: "$65.00",
        status: "available",
        user: { username: "AgileRing-caqq", rating: 98.5, reviews: 342, verified: false },
        created: "Feb 3, 2026, 2:29:25 PM",
        expires: "Feb 10, 2026, 2:29:25 PM",
        details: [
            { label: "Current rank", value: "Ascendant II" },
            { label: "Desired rank", value: "Immortal I" },
            { label: "Server", value: "NA" }
        ],
        icon: "/images/placeholder.svg",
    },
    "4": {
        id: "4",
        game: "Fisch",
        type: "Rod Services",
        shortDesc: "I want the masterline rod",
        description: "I need someone who can pop megalodon hunt totem in my priv server for 50 cent",
        price: "$0.50",
        status: "available",
        user: { username: "CleanCoast-rE2g", rating: 100, reviews: 54, verified: false },
        created: "Feb 3, 2026, 2:32:03 PM",
        expires: "Feb 10, 2026, 2:32:03 PM",
        icon: "/images/placeholder.svg",
    },
    "6": {
        id: "6",
        game: "Valorant",
        type: "Rank Boost",
        shortDesc: "Ascendant III to Ascendant III",
        description: "Need someone to win games only with stream £3. Solo play requested.",
        price: "$8.00",
        status: "cancelled",
        user: { username: "AgileRing-caqq", rating: 95.2, reviews: 88, verified: false },
        created: "Feb 3, 2026, 2:29:25 PM",
        expires: "Feb 10, 2026, 2:29:25 PM",
        details: [
            { label: "Current rank", value: "Ascendant III" },
            { label: "Current RR", value: "0" },
            { label: "Desired rank", value: "Ascendant III" },
            { label: "Server", value: "EU" },
            { label: "Method", value: "Solo" }
        ],
        icon: "/images/placeholder.svg",
    }
};

export default async function BoostingRequestPage({ params }: { params: { id: string } }) {
    const { id } = await Promise.resolve(params);
    const request = mockRequests[id] || mockRequests["4"]; // Default to Fisch if not found

    return (
        <div className="min-h-screen bg-[#0a0e13] text-white selection:bg-[#f5a623]/30">
            <MainNavbar variant="landing" />

            <div className="pt-24 max-w-5xl mx-auto px-6 py-12 space-y-8">

                {/* Header Content */}
                <div className="flex items-start gap-4">
                    <div className="h-12 w-12 shrink-0 rounded-lg bg-[#1c2128] border border-[#2d333b] p-2">
                        <Image
                            src={request.icon}
                            alt={request.game}
                            width={40}
                            height={40}
                            className="object-contain"
                        />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-xl font-bold flex items-center gap-2">
                            {request.game} <span className="text-[#8b949e] font-medium">— {request.type}</span>
                        </h1>
                        <p className="text-[#9ca3af] text-sm mt-1">{request.shortDesc}</p>
                    </div>
                    {request.status !== "cancelled" && (
                        <Button variant="outline" className="h-9 border-[#2d333b] bg-[#1c2128] text-[#9ca3af] hover:text-white hover:bg-[#252b33] gap-2">
                            Chat with buyer
                        </Button>
                    )}
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
                    <div className="space-y-6">
                        {/* Request Details Card */}
                        <div className="rounded-xl border border-[#2d333b] bg-[#0d1117] overflow-hidden">
                            <div className="p-6 space-y-6">
                                {/* Details Header */}
                                <div className="space-y-4">
                                    <h2 className="text-sm font-bold uppercase tracking-wider text-white">Request Details</h2>
                                    <div className="grid grid-cols-2 gap-4 text-[11px] text-[#4b5563]">
                                        <div>
                                            <p className="font-bold uppercase tracking-tighter">Created: {request.created}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold uppercase tracking-tighter">Expires: {request.expires}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* User Row */}
                                <div className="flex items-center justify-between py-4 border-t border-[#2d333b]/30">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10 border border-[#2d333b]">
                                            <AvatarImage src={request.user.avatar || undefined} alt={request.user.username} />
                                            <AvatarFallback className="bg-[#21262d] text-sm text-[#4b5563]">
                                                {request.user.username.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="flex items-center gap-1.5 leading-none">
                                                <span className="font-bold text-sm">{request.user.username}</span>
                                                {request.user.verified && <ShieldCheck className="h-3 w-3 text-[#f5a623]" />}
                                            </div>
                                            <div className="flex items-center gap-1 mt-1">
                                                <span className="text-[#f5a623] text-xs">👍 {request.user.rating}%</span>
                                                <Link href="#" className="text-[#3b82f6] text-xs hover:underline">{request.user.reviews} reviews</Link>
                                            </div>
                                        </div>
                                    </div>
                                    {request.status !== "cancelled" && (
                                        <Button variant="ghost" size="sm" className="text-[#4b5563] hover:text-white h-8 gap-2 uppercase text-[10px] font-bold">
                                            <VolumeX className="h-3 w-3" /> Mute
                                        </Button>
                                    )}
                                </div>

                                {/* Custom Fields (Rank, Server etc) */}
                                {request.details && (
                                    <div className="space-y-4 py-4 border-t border-[#2d333b]/30">
                                        {request.details.map((detail, idx) => (
                                            <div key={idx} className="flex justify-between items-center text-sm">
                                                <span className="text-[#8b949e]">{detail.label}</span>
                                                <span className="font-bold text-white">{detail.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Description */}
                                <div className="space-y-2 py-4 border-t border-[#2d333b]/30">
                                    <h3 className="text-[12px] font-bold text-[#4b5563] uppercase">Request description</h3>
                                    <p className="text-[13px] text-white leading-relaxed text-right font-medium">
                                        {request.description}
                                    </p>
                                    {request.price && (
                                        <p className="text-right font-bold text-[#f5a623] mt-2">for {request.price}</p>
                                    )}
                                </div>

                                {/* Actions */}
                                {request.status === "available" && (
                                    <div className="flex items-center gap-2 pt-4 border-t border-[#2d333b]/30">
                                        <Button variant="secondary" className="bg-[#1c2128] border border-[#2d333b] text-white font-bold h-11 px-6">
                                            Chat
                                        </Button>
                                        <Button className="bg-[#f5a623] hover:bg-[#e09612] text-black font-extrabold h-11 px-8 flex-1">
                                            Create offer
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Offers Live Feed */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-[#2d333b]/30 pb-2">
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <span className="relative flex h-2 w-2">
                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00b67a] opacity-75"></span>
                                            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00b67a]"></span>
                                        </span>
                                    </div>
                                    <span className="text-[11px] font-bold uppercase tracking-widest text-white">Offers live feed</span>
                                </div>
                                <div className="flex gap-4 text-[10px] font-medium text-[#4b5563] uppercase">
                                    <span>Notified sellers: 160</span>
                                    <span>Seen by: {Math.floor(Math.random() * 20)}</span>
                                    <span>Offers created: {request.status === "sold" ? "2" : "1"}</span>
                                </div>
                            </div>

                            {/* Offers List */}
                            <div className="rounded-xl border border-[#2d333b] bg-[#0d1117] overflow-hidden divide-y divide-[#2d333b]/30">
                                {request.status === "cancelled" ? (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <XCircle className="h-12 w-12 text-[#ef4444] mb-4 stroke-[1.5]" />
                                        <p className="text-sm font-bold text-[#8b949e] uppercase tracking-wide">Boosting request is canceled</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Mock Offer 1 */}
                                        <div className="p-4 flex items-center justify-between group hover:bg-[#1c2128]/20 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src="/images/placeholder.svg" alt="pouting" />
                                                    <AvatarFallback>P</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="flex items-center gap-1.5 leading-none">
                                                        <span className="font-bold text-sm">pouting</span>
                                                        <ShieldCheck className="h-3 w-3 text-[#00b67a]" />
                                                    </div>
                                                    <div className="flex items-center gap-1 mt-0.5">
                                                        <span className="text-[#f5a623] text-[10px]">👍 96.3%</span>
                                                        <span className="text-[#3b82f6] text-[10px]">54 reviews</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[10px] text-[#4b5563] uppercase font-bold">Delivery time</p>
                                                <p className="text-xs font-bold mt-0.5">1 day</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-black text-white text-base">$8.00 / <span className="text-[#8b949e]">€6.98</span></p>
                                            </div>
                                        </div>

                                        {/* Mock Offer 2 (Only if sold or multiple) */}
                                        <div className="p-4 flex items-center justify-between group bg-[#1c2128]/10 border-l-2 border-[#f5a623]">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src="/images/placeholder.svg" alt="XeN0o0" />
                                                    <AvatarFallback>X</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="flex items-center gap-1.5 leading-none">
                                                        <span className="font-bold text-sm">XeN0o0</span>
                                                        <ShieldCheck className="h-3 w-3 text-[#00b67a]" />
                                                    </div>
                                                    <div className="flex items-center gap-1 mt-0.5">
                                                        <span className="text-[#f5a623] text-[10px]">👍 99.7%</span>
                                                        <span className="text-[#3b82f6] text-[10px]">338 reviews</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[10px] text-[#4b5563] uppercase font-bold">Delivery time</p>
                                                <p className="text-xs font-bold mt-0.5">20 min</p>
                                            </div>
                                            <div className="text-right flex items-center gap-3">
                                                <p className="font-black text-white text-base">$0.50</p>
                                                {request.status === "sold" && (
                                                    <span className="text-[10px] font-black bg-[#00b67a]/20 text-[#00b67a] px-1.5 py-0.5 rounded uppercase">Sold</span>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar - System Stats or Placeholder */}
                    <div className="space-y-6 hidden lg:block">
                        <div className="rounded-xl border border-[#2d333b] bg-[#0d1117] p-6 text-center space-y-4">
                            <ShoppingBag className="h-12 w-12 text-[#2d333b] mx-auto opacity-50" />
                            <div>
                                <h4 className="text-sm font-bold text-white uppercase italic">Market Overview</h4>
                                <p className="text-xs text-[#4b5563] mt-2">Active requests in {request.game}: 1,242</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
