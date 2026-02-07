"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    ChevronDown,
    Download,
    Search,
    ShoppingBag,
    Check
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Order {
    id: string;
    game: string;
    productName: string;
    type: string;
    user: string;
    date: string;
    status: "completed" | "cancelled" | "active" | "delivered";
    quantity: string | number;
    price: number;
    discount?: number;
    icon: string;
}

const mockPurchased: Order[] = [
    { id: "1", game: "Valorant", productName: "Boosting", type: "Boosting", user: "Ned6", date: "Jan 19, 2026, 4:16:18 AM", status: "completed", quantity: 1, price: 1.00, discount: 0.00, icon: "https://i.imgur.com/8N48l8b.png" },
    { id: "2", game: "Marvel Rivals", productName: "Boosting", type: "Boosting", user: "FerchasBOOSTING", date: "Jan 17, 2026, 10:11:14 PM", status: "completed", quantity: 1, price: 5.00, discount: 0.00, icon: "https://i.imgur.com/vHq8S9s.png" },
    { id: "3", game: "Valorant", productName: "Boosting", type: "Boosting", user: "kittyBoosting", date: "Jan 17, 2026, 5:40:28 AM", status: "completed", quantity: 1, price: 4.00, discount: 0.00, icon: "https://i.imgur.com/8N48l8b.png" },
    { id: "4", game: "Valorant", productName: "Boosting", type: "Boosting", user: "remmyuh", date: "Jan 17, 2026, 3:29:43 AM", status: "completed", quantity: 1, price: 6.00, discount: 0.00, icon: "https://i.imgur.com/8N48l8b.png" },
    { id: "5", game: "Rocket League", productName: "Boosting", type: "Boosting", user: "Lagumixu", date: "Jan 15, 2026, 7:51:17 PM", status: "completed", quantity: 1, price: 1.00, discount: 0.00, icon: "https://i.imgur.com/h9v9s8B.png" },
    { id: "6", game: "Star Citizen", productName: "Currency", type: "Currency", user: "Retroshooter94", date: "Jan 15, 2026, 5:01:46 AM", status: "cancelled", quantity: "1,000 M", price: 0.50, discount: 0.00, icon: "https://i.imgur.com/u7FvX8B.png" },
    { id: "7", game: "Valorant", productName: "Boosting", type: "Boosting", user: "TrimCoin-NoMz", date: "Jan 14, 2026, 7:41:09 PM", status: "completed", quantity: 1, price: 1.00, discount: 0.00, icon: "https://i.imgur.com/8N48l8b.png" },
];

const mockSold: Order[] = [
    { id: "s1", game: "Roblox", productName: "TAXI BOSS - $10 Million", type: "Items", user: "24apricot", date: "Feb 1, 2026, 3:24:04 PM", status: "cancelled", quantity: 1, price: 3.00, icon: "https://i.imgur.com/39A8n8A.png" },
    { id: "s2", game: "Roblox", productName: "TAXI BOSS - $10 Million", type: "Items", user: "24apricot", date: "Feb 1, 2026, 2:54:17 PM", status: "cancelled", quantity: 1, price: 3.00, icon: "https://i.imgur.com/39A8n8A.png" },
    { id: "s3", game: "Bee Swarm Simulator", productName: "Boost, 20 bees & Starter Hive | Honey, Quests & Badges Grind", type: "Items", user: "ApthyQuiz-6mYK", date: "Jan 31, 2026, 5:37:25 PM", status: "cancelled", quantity: 1, price: 22.00, icon: "https://i.imgur.com/pYVjL4z.png" },
    { id: "s4", game: "Roblox", productName: "Boosting", type: "Boosting", user: "Luvvz", date: "Jan 30, 2026, 9:07:51 PM", status: "cancelled", quantity: 1, price: 4.25, icon: "https://i.imgur.com/39A8n8A.png" },
    { id: "s5", game: "Roblox", productName: "TAXI BOSS - $10 Million", type: "Items", user: "KindPlum-11aO", date: "Jan 30, 2026, 5:26:21 AM", status: "cancelled", quantity: 1, price: 3.00, icon: "https://i.imgur.com/39A8n8A.png" },
    { id: "s6", game: "Roblox", productName: "TAXI BOSS - $10 Million", type: "Items", user: "PrimeEcho-ught", date: "Jan 29, 2026, 7:54:11 PM", status: "completed", quantity: 3, price: 9.00, icon: "https://i.imgur.com/39A8n8A.png" },
    { id: "s7", game: "Roblox", productName: "TAXI BOSS - $10 Million", type: "Items", user: "PrimeEcho-ught", date: "Jan 29, 2026, 6:25:02 PM", status: "cancelled", quantity: 3, price: 9.00, icon: "https://i.imgur.com/39A8n8A.png" },
];

const statusOptions = [
    { label: "All statuses", value: "all", count: null },
    { label: "Pending delivery", value: "pending_delivery", count: 0 },
    { label: "Disputed", value: "disputed", count: 0 },
    { label: "Delivered", value: "delivered", count: 0 },
    { label: "Received", value: "received", count: 0 },
    { label: "Completed", value: "completed", count: 10 },
    { label: "Canceled", value: "cancelled", count: 4 },
];

const timeOptions = [
    { label: "Recent", value: "recent" },
    { label: "3 months or older", value: "older" },
];

function OrdersContent() {
    const searchParams = useSearchParams();
    const type = searchParams.get("type") || "purchased";
    const orders = type === "purchased" ? mockPurchased : mockSold;
    const title = type === "purchased" ? "Purchased orders" : "Sold orders";

    const [statusFilter, setStatusFilter] = React.useState("all");
    const [statusOpen, setStatusOpen] = React.useState(false);
    const [timeFilter, setTimeFilter] = React.useState("recent");
    const [timeOpen, setTimeOpen] = React.useState(false);

    // Refs for clicking outside
    const statusRef = React.useRef<HTMLDivElement>(null);
    const timeRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
                setStatusOpen(false);
            }
            if (timeRef.current && !timeRef.current.contains(event.target as Node)) {
                setTimeOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const activeStatusLabel = statusOptions.find(o => o.value === statusFilter)?.label || "All statuses";
    const activeTimeLabel = timeOptions.find(o => o.value === timeFilter)?.label || "Recent";

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex items-center gap-3">
                <ChevronDown className="h-6 w-6 text-[#f5a623] rotate-[-90deg]" />
                <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-3">
                {/* Status Dropdown */}
                <div className="relative" ref={statusRef}>
                    <Button
                        variant="secondary"
                        onClick={() => setStatusOpen(!statusOpen)}
                        className={cn(
                            "bg-black/20 border text-white hover:bg-black/30 h-10 px-4 min-w-[160px] flex items-center justify-between transition-all outline-none",
                            statusOpen ? "border-[#f5a623] ring-1 ring-[#f5a623]" : "border-[#2d333b]"
                        )}
                    >
                        {activeStatusLabel}
                        <ChevronDown className={cn("h-4 w-4 text-[#6b7280] transition-transform", statusOpen && "rotate-180")} />
                    </Button>

                    {statusOpen && (
                        <div className="absolute top-[calc(100%+4px)] left-0 w-64 bg-[#0d1117] border border-[#2d333b] rounded-lg shadow-2xl z-50 py-1.5 animate-in fade-in zoom-in-95 duration-100">
                            {statusOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => {
                                        setStatusFilter(opt.value);
                                        setStatusOpen(false);
                                    }}
                                    className="w-full flex items-center justify-between px-4 py-2 text-[13px] text-white hover:bg-[#252b33] transition-colors group"
                                >
                                    <span className={cn(statusFilter === opt.value && "text-white font-medium")}>
                                        {opt.label} {opt.count !== null && `(${opt.count})`}
                                    </span>
                                    {statusFilter === opt.value && <Check className="h-4 w-4 text-[#f5a623]" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Time Dropdown */}
                <div className="relative" ref={timeRef}>
                    <Button
                        variant="secondary"
                        onClick={() => setTimeOpen(!timeOpen)}
                        className={cn(
                            "bg-black/20 border text-white hover:bg-black/30 h-10 px-4 min-w-[140px] flex items-center justify-between transition-all outline-none",
                            timeOpen ? "border-[#f5a623] ring-1 ring-[#f5a623]" : "border-[#2d333b]"
                        )}
                    >
                        {activeTimeLabel}
                        <ChevronDown className={cn("h-4 w-4 text-[#6b7280] transition-transform", timeOpen && "rotate-180")} />
                    </Button>

                    {timeOpen && (
                        <div className="absolute top-[calc(100%+4px)] left-0 w-48 bg-[#0d1117] border border-[#2d333b] rounded-lg shadow-2xl z-50 py-1.5 animate-in fade-in zoom-in-95 duration-100">
                            {timeOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => {
                                        setTimeFilter(opt.value);
                                        setTimeOpen(false);
                                    }}
                                    className="w-full flex items-center justify-between px-4 py-2 text-[13px] text-white hover:bg-[#252b33] transition-colors"
                                >
                                    <span className={cn(timeFilter === opt.value && "text-white font-medium")}>
                                        {opt.label}
                                    </span>
                                    {timeFilter === opt.value && <Check className="h-4 w-4 text-[#f5a623]" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="relative flex-1 min-w-[200px]">
                    <input
                        type="text"
                        placeholder="Search Orders"
                        className="h-10 w-full rounded-lg border border-[#2d333b] bg-black/20 pl-4 pr-10 text-sm text-white placeholder:text-[#6b7280] focus:border-[#f5a623] focus:outline-none focus:ring-1 focus:ring-[#f5a623]"
                    />
                    <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7280]" />
                </div>

                {type === "sold" && (
                    <div className="ml-auto">
                        <Button variant="outline" className="border-[#2d333b] text-white hover:bg-black/20 h-10 gap-2 font-semibold">
                            Download invoice
                            <Download className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
                <table className="w-full border-separate border-spacing-0">
                    <thead>
                        <tr className="text-left border-b border-[#2d333b]">
                            <th className="pb-4 px-4 text-[11px] font-bold text-white/60 uppercase tracking-tight">
                                <div className="flex items-center gap-1">
                                    Order name
                                    <ChevronDown className="h-3 w-3 text-[#f5a623]" />
                                </div>
                            </th>
                            <th className="pb-4 px-4 text-[11px] font-bold text-white/60 uppercase tracking-tight">Type</th>
                            <th className="pb-4 px-4 text-[11px] font-bold text-white/60 uppercase tracking-tight">{type === "purchased" ? "Seller" : "Buyer"}</th>
                            <th className="pb-4 px-4 text-[11px] font-bold text-white/60 uppercase tracking-tight">Ordered date</th>
                            <th className="pb-4 px-4 text-[11px] font-bold text-white/60 uppercase tracking-tight">Order status</th>
                            <th className="pb-4 px-4 text-[11px] font-bold text-white/60 uppercase tracking-tight">Quantity</th>
                            <th className="pb-4 px-4 text-[11px] font-bold text-white/60 uppercase tracking-tight">Price ($)</th>
                            {type === "purchased" && (
                                <th className="pb-4 px-4 text-[11px] font-bold text-white/60 uppercase tracking-tight">Discount</th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2d333b]/50">
                        {orders.map((order) => (
                            <tr
                                key={order.id}
                                onClick={() => window.location.href = `/dashboard/orders/${order.id}`}
                                className="group hover:bg-white/[0.02] transition-colors cursor-pointer"
                            >
                                <td className="py-2.5 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded bg-[#0a0e13] flex-shrink-0 relative overflow-hidden flex items-center justify-center p-1.5 border border-[#2d333b]/40">
                                            <img src={order.icon} alt={order.game} className="object-contain" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-[10px] font-bold text-[#6b7280] uppercase leading-none mb-1">{order.game}</div>
                                            <div className="text-[13px] text-white font-medium truncate max-w-[200px]">{order.productName}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-2.5 px-4 text-[13px] text-white/80">{order.type}</td>
                                <td className="py-2.5 px-4 text-[13px] text-[#5c9eff] hover:underline cursor-pointer" onClick={(e) => e.stopPropagation()}>{order.user}</td>
                                <td className="py-2.5 px-4 text-[13px] text-white/80 whitespace-nowrap">{order.date}</td>
                                <td className="py-2.5 px-4">
                                    <div className={cn(
                                        "inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider",
                                        order.status === "completed" ? "bg-[#14b8a6] text-[#0a0e13]" :
                                            order.status === "cancelled" ? "bg-[#ef4444] text-white" :
                                                "bg-[#3b82f6] text-white"
                                    )}>
                                        {order.status === "cancelled" ? "Canceled" : order.status}
                                    </div>
                                </td>
                                <td className="py-2.5 px-4 text-[13px] text-white/80">{order.quantity}</td>
                                <td className="py-2.5 px-4 text-[13px] text-white font-bold">${order.price.toFixed(2)}</td>
                                {type === "purchased" && (
                                    <td className="py-2.5 px-4 text-[13px] text-white/80">${order.discount?.toFixed(2)}</td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default function OrdersPage() {
    return (
        <React.Suspense fallback={
            <div className="flex items-center justify-center p-12">
                <div className="h-8 w-8 border-2 border-[#f5a623] border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <OrdersContent />
        </React.Suspense>
    );
}
