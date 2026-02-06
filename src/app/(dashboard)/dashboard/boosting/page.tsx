"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    ChevronDown,
    ChevronRight,
    Search,
    ChevronsUp,
    Info,
    HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for My Requests
const myRequests = [
    { id: "1", game: "Valorant", category: "Custom Request", date: "Jan 22, 2026, 3:03:49 AM", offers: 0, status: "cancelled", icon: "/images/placeholder.svg" },
    { id: "2", game: "Rust", category: "Custom Request", date: "Jan 21, 2026, 3:21:37 AM", offers: 0, status: "cancelled", icon: "/images/placeholder.svg" },
    { id: "3", game: "Rust", category: "Custom Request", date: "Jan 21, 2026, 1:34:21 AM", offers: 0, status: "cancelled", icon: "/images/placeholder.svg" },
    { id: "4", game: "Valorant", category: "Rank Boost", date: "Jan 19, 2026, 4:14:32 AM", offers: 6, status: "completed", icon: "/images/placeholder.svg" },
    { id: "5", game: "Roblox", category: "Custom Request", date: "Jan 18, 2026, 9:30:46 AM", offers: 0, status: "cancelled", icon: "/images/placeholder.svg" },
    { id: "6", game: "Star Citizen", category: "Rank Boost", date: "Jan 17, 2026, 10:08:55 PM", offers: 7, status: "completed", icon: "/images/placeholder.svg" },
    { id: "7", game: "Valorant", category: "Rank Boost", date: "Jan 17, 2026, 5:37:38 AM", offers: 6, status: "completed", icon: "/images/placeholder.svg" },
];

// Mock data for Received Requests
const receivedRequests = [
    { id: "r1", game: "Roblox", buyer: "SafeCalm-YRBW", category: "Adopt Me", date: "Feb 3, 2026, 5:12:47 PM", icon: "/images/placeholder.svg" },
    { id: "r2", game: "Valorant", buyer: "CalmAnimist23...", category: "Net Wins", date: "Feb 3, 2026, 5:09:54 PM", icon: "/images/placeholder.svg" },
    { id: "r3", game: "Bee Swarm Simulator", buyer: "FestinoH5", category: "Raid Services", date: "Feb 3, 2026, 5:09:35 PM", icon: "/images/placeholder.svg" },
    { id: "r4", game: "Roblox", buyer: "CrispPear-EZP...", category: "Custom Request", date: "Feb 3, 2026, 5:09:02 PM", icon: "/images/placeholder.svg" },
    { id: "r5", game: "Roblox", buyer: "BuBuL N", category: "Custom Request", date: "Feb 3, 2026, 5:07:51 PM", icon: "/images/placeholder.svg" },
    { id: "r6", game: "Valorant", buyer: "zebuluche", category: "Rank Boost", date: "Feb 3, 2026, 5:06:55 PM", icon: "/images/placeholder.svg" },
    { id: "r7", game: "Roblox", buyer: "LargeSteam-VZ...", category: "Custom Request", date: "Feb 3, 2026, 5:05:23 PM", icon: "/images/placeholder.svg" },
];

function BoostingContent() {
    const searchParams = useSearchParams();
    const type = searchParams.get("type") || "my-requests";
    const isMyRequests = type === "my-requests";
    const title = isMyRequests ? "My Requests" : "Received Requests";

    const [activeTab, setActiveTab] = React.useState(isMyRequests ? "all" : "waiting");

    const myRequestTabs = [
        { id: "all", label: "All requests" },
        { id: "progress", label: "In progress" },
        { id: "completed", label: "Completed" },
        { id: "disputed", label: "Disputed" },
        { id: "cancelled", label: "Canceled" },
    ];

    const receivedRequestTabs = [
        { id: "waiting", label: "Waiting for your offer" },
        { id: "submitted", label: "Offer submitted" },
        { id: "won", label: "Offer won" },
        { id: "lost", label: "Offer lost" },
    ];

    const currentTabs = isMyRequests ? myRequestTabs : receivedRequestTabs;

    return (
        <div className="space-y-6">
            {/* Header Area */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <ChevronsUp className="h-7 w-7 text-[#f5a623]" />
                    <h1 className="text-3xl font-bold text-white tracking-tight">{title}</h1>
                </div>

                <div className="flex items-center gap-3">
                    {isMyRequests ? (
                        <Button className="bg-[#f5a623] hover:bg-[#e09612] text-black font-bold h-10 px-6 rounded-lg transition-all">
                            Create a request
                        </Button>
                    ) : (
                        <>
                            <Button variant="ghost" className="text-white hover:bg-[#1c2128] gap-2 font-bold h-10 border border-[#2d333b]">
                                How does it work?
                            </Button>
                            <Button className="bg-[#f5a623] hover:bg-[#e09612] text-black font-bold h-10 px-6 rounded-lg transition-all">
                                Manage subscriptions
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Filter Controls */}
            <div className="space-y-4">
                <Button variant="secondary" className="bg-[#1c2128] border border-[#2d333b] text-white hover:bg-[#252b33] h-10 px-4 gap-8">
                    All games
                    <ChevronDown className="h-4 w-4 text-[#6b7280]" />
                </Button>

                <div className="flex flex-wrap items-center gap-2">
                    {currentTabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "h-9 px-4 rounded-full text-[13px] font-bold transition-all border",
                                activeTab === tab.id
                                    ? "bg-white text-[#0a0e13] border-white"
                                    : "bg-transparent text-white border-[#2d333b] hover:border-white/40"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table Area */}
            <div className="overflow-x-auto">
                <table className="w-full border-separate border-spacing-0">
                    <thead>
                        <tr className="text-left">
                            <th className="pb-4 px-4 text-[13px] font-bold text-white/90">Game</th>
                            {isMyRequests ? (
                                <>
                                    <th className="pb-4 px-4 text-[13px] font-bold text-white/90">Category</th>
                                    <th className="pb-4 px-4 text-[13px] font-bold text-white/90">Request creation date</th>
                                    <th className="pb-4 px-4 text-[13px] font-bold text-white/90">Offer(s) available</th>
                                    <th className="pb-4 px-4 text-[13px] font-bold text-white/90">Status</th>
                                </>
                            ) : (
                                <>
                                    <th className="pb-4 px-4 text-[13px] font-bold text-white/90">Buyer</th>
                                    <th className="pb-4 px-4 text-[13px] font-bold text-white/90">Category</th>
                                    <th className="pb-4 px-4 text-[13px] font-bold text-white/90">Request creation date</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2d333b]/50">
                        {(isMyRequests ? myRequests : receivedRequests).map((req) => (
                            <tr key={req.id} className="group hover:bg-[#1c2128]/40 transition-colors">
                                <td className="py-4 px-4">
                                    <div className="h-8 w-8 rounded bg-[#0a0e13] flex-shrink-0 relative overflow-hidden flex items-center justify-center p-1.5 border border-[#2d333b]/40">
                                        <img src={req.icon} alt={req.game} className="object-contain" />
                                    </div>
                                </td>

                                {isMyRequests ? (
                                    <>
                                        <td className="py-4 px-4 text-[13px] text-white font-medium">{(req as any).category}</td>
                                        <td className="py-4 px-4 text-[13px] text-white/60">{req.date}</td>
                                        <td className="py-4 px-4 text-[13px] text-white font-medium">{(req as any).offers}</td>
                                        <td className="py-4 px-4">
                                            <div className={cn(
                                                "inline-flex items-center px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider",
                                                (req as any).status === "completed" ? "bg-[#14b8a6] text-[#0a0e13]" : "bg-[#ef4444] text-white"
                                            )}>
                                                {(req as any).status}
                                            </div>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="py-4 px-4 text-[13px] text-[#5c9eff] hover:underline cursor-pointer font-medium">{(req as any).buyer}</td>
                                        <td className="py-4 px-4 text-[13px] text-white font-medium">{(req as any).category}</td>
                                        <td className="py-4 px-4 text-[13px] text-white/60">{req.date}</td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default function BoostingPage() {
    return (
        <React.Suspense fallback={
            <div className="flex items-center justify-center p-12">
                <div className="h-8 w-8 border-2 border-[#f5a623] border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <BoostingContent />
        </React.Suspense>
    );
}
