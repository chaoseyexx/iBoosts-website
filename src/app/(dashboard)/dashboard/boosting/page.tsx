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
    { id: "1", game: "Valorant", category: "Custom Request", date: "Jan 22, 2026, 3:03:49 AM", offers: 0, status: "cancelled", icon: "https://i.imgur.com/8N48l8b.png" },
    { id: "2", game: "Rust", category: "Custom Request", date: "Jan 21, 2026, 3:21:37 AM", offers: 0, status: "cancelled", icon: "https://i.imgur.com/vHq8S9s.png" },
    { id: "3", game: "Rust", category: "Custom Request", date: "Jan 21, 2026, 1:34:21 AM", offers: 0, status: "cancelled", icon: "https://i.imgur.com/vHq8S9s.png" },
    { id: "4", game: "Valorant", category: "Rank Boost", date: "Jan 19, 2026, 4:14:32 AM", offers: 6, status: "completed", icon: "https://i.imgur.com/8N48l8b.png" },
    { id: "5", game: "Roblox", category: "Custom Request", date: "Jan 18, 2026, 9:30:46 AM", offers: 0, status: "cancelled", icon: "https://i.imgur.com/39A8n8A.png" },
    { id: "6", game: "Star Citizen", category: "Rank Boost", date: "Jan 17, 2026, 10:08:55 PM", offers: 7, status: "completed", icon: "https://i.imgur.com/u7FvX8B.png" },
    { id: "7", game: "Valorant", category: "Rank Boost", date: "Jan 17, 2026, 5:37:38 AM", offers: 6, status: "completed", icon: "https://i.imgur.com/8N48l8b.png" },
];

// Mock data for Received Requests
const receivedRequests = [
    { id: "r1", game: "Roblox", buyer: "SafeCalm-YRBW", category: "Adopt Me", date: "Feb 3, 2026, 5:12:47 PM", icon: "https://i.imgur.com/39A8n8A.png" },
    { id: "r2", game: "Valorant", buyer: "CalmAnimist23...", category: "Net Wins", date: "Feb 3, 2026, 5:09:54 PM", icon: "https://i.imgur.com/8N48l8b.png" },
    { id: "r3", game: "Bee Swarm Simulator", buyer: "FestinoH5", category: "Raid Services", date: "Feb 3, 2026, 5:09:35 PM", icon: "https://i.imgur.com/pYVjL4z.png" },
    { id: "r4", game: "Roblox", buyer: "CrispPear-EZP...", category: "Custom Request", date: "Feb 3, 2026, 5:09:02 PM", icon: "https://i.imgur.com/39A8n8A.png" },
    { id: "r5", game: "Roblox", buyer: "BuBuL N", category: "Custom Request", date: "Feb 3, 2026, 5:07:51 PM", icon: "https://i.imgur.com/39A8n8A.png" },
    { id: "r6", game: "Valorant", buyer: "zebuluche", category: "Rank Boost", date: "Feb 3, 2026, 5:06:55 PM", icon: "https://i.imgur.com/8N48l8b.png" },
    { id: "r7", game: "Roblox", buyer: "LargeSteam-VZ...", category: "Custom Request", date: "Feb 3, 2026, 5:05:23 PM", icon: "https://i.imgur.com/39A8n8A.png" },
];

import { fetchBoostingRequests } from "./actions";

function BoostingContent() {
    const searchParams = useSearchParams();
    const type = searchParams.get("type") || "my-requests";
    const isMyRequests = type === "my-requests";
    const title = isMyRequests ? "My Requests" : "Received Requests";

    const [activeTab, setActiveTab] = React.useState(isMyRequests ? "all" : "waiting");
    const [requests, setRequests] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                if (isMyRequests) {
                    const data = await fetchBoostingRequests();
                    setRequests(data);
                } else {
                    setRequests(receivedRequests); // Still using mock for received for now
                }
            } catch (error) {
                console.error("Error fetching requests:", error);
                setRequests(isMyRequests ? myRequests : receivedRequests);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [isMyRequests]);

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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="h-8 w-8 border-2 border-[#f5a623] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Area */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <ChevronsUp className="h-7 w-7 text-[#f5a623]" />
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase">{title}</h1>
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
                                    ? "bg-[#f5a623] text-black border-[#f5a623] shadow-[0_0_15px_rgba(245,166,35,0.2)]"
                                    : "bg-[#0a0e13] text-[#9ca3af] border-[#2d333b] hover:border-white/40 hover:text-white"
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
                        <tr className="text-left bg-[#0d1117]/80">
                            <th className="py-4 px-4 text-[10px] font-bold text-[#8b949e] uppercase tracking-[0.2em] first:rounded-tl-xl">Game</th>
                            {isMyRequests ? (
                                <>
                                    <th className="py-4 px-4 text-[10px] font-black text-[#8b949e] uppercase tracking-[0.2em]">Category</th>
                                    <th className="py-4 px-4 text-[10px] font-black text-[#8b949e] uppercase tracking-[0.2em]">Created At</th>
                                    <th className="py-4 px-4 text-[10px] font-black text-[#8b949e] uppercase tracking-[0.2em]">Proposals</th>
                                    <th className="py-4 px-4 text-[10px] font-black text-[#8b949e] uppercase tracking-[0.2em] text-right last:rounded-tr-xl">Status</th>
                                </>
                            ) : (
                                <>
                                    <th className="py-4 px-4 text-[10px] font-black text-[#8b949e] uppercase tracking-[0.2em]">Buyer Account</th>
                                    <th className="py-4 px-4 text-[10px] font-black text-[#8b949e] uppercase tracking-[0.2em]">Service Category</th>
                                    <th className="py-4 px-4 text-[10px] font-black text-[#8b949e] uppercase tracking-[0.2em] last:rounded-tr-xl text-right">Creation Date</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2d333b]/30">
                        {requests.map((req) => (
                            <tr key={req.id} className="group hover:bg-white/[0.02] transition-colors rounded-xl">
                                <td className="py-4 px-4">
                                    <div className="h-8 w-8 rounded bg-[#0a0e13] flex-shrink-0 relative overflow-hidden flex items-center justify-center p-1.5 border border-[#2d333b]/40">
                                        <img src={req.icon} alt={req.game} className="object-contain" />
                                    </div>
                                </td>

                                {isMyRequests ? (
                                    <>
                                        <td className="py-5 px-4 text-[13px] text-white font-black uppercase tracking-tight">{(req as any).category}</td>
                                        <td className="py-5 px-4 text-[12px] text-[#8b949e] font-black uppercase tracking-[0.2em]">{req.date}</td>
                                        <td className="py-5 px-4 text-[13px] text-white font-black truncate">{(req as any).offers} OFFERS</td>
                                        <td className="py-5 px-4 text-right">
                                            <div className={cn(
                                                "inline-flex items-center px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border backdrop-blur-md shadow-lg",
                                                (req as any).status === "completed" ? "bg-[#f5a623]/5 text-[#f5a623] border-[#f5a623]/20 shadow-[0_0_10px_rgba(245,166,35,0.1)]" : "bg-red-500/5 text-red-500 border-red-500/20"
                                            )}>
                                                {(req as any).status}
                                            </div>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="py-5 px-4 text-[13px] text-[#f5a623] hover:text-[#ffb845] transition-colors cursor-pointer font-black uppercase tracking-tight">{(req as any).buyer}</td>
                                        <td className="py-5 px-4 text-[13px] text-white font-black alphabet tracking-tighter uppercase">{(req as any).category}</td>
                                        <td className="py-5 px-4 text-[12px] text-[#8b949e] font-black uppercase tracking-[0.2em]">{req.date}</td>
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
