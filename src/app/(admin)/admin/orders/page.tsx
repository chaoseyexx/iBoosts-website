"use client";

import * as React from "react";
import Link from "next/link";
import {
    Search,
    Filter,
    MoreHorizontal,
    Eye,
    AlertTriangle,
    CheckCircle2,
    Clock,
    XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// --- Mock Data ---

const ALL_ORDERS = [
    {
        id: "ORD-7782-XJ",
        game: "Valorant",
        product: "Radiant Rank Boost",
        buyer: "cool_kid_99",
        seller: "ProBooster_X",
        price: 150.00,
        status: "active",
        date: "2 mins ago",
        hasDispute: false
    },
    {
        id: "ORD-9921-MC",
        game: "WoW",
        product: "Mythic+ 20 Run",
        buyer: "healer_john",
        seller: "DungeonMasters",
        price: 45.00,
        status: "disputed",
        date: "1 hour ago",
        hasDispute: true
    },
    {
        id: "ORD-3321-KL",
        game: "League of Legends",
        product: "Placement Matches",
        buyer: "feed_or_afk",
        seller: "SoloCarry_KR",
        price: 25.00,
        status: "completed",
        date: "3 hours ago",
        hasDispute: false
    },
    {
        id: "ORD-1129-PP",
        game: "Elden Ring",
        product: "Runes Drop (50M)",
        buyer: "tarnished_one",
        seller: "EldenLord",
        price: 10.00,
        status: "delivered",
        date: "5 hours ago",
        hasDispute: false
    },
    {
        id: "ORD-5541-ZZ",
        game: "Escape from Tarkov",
        product: "Red Keycard",
        buyer: "rat_attack",
        seller: "ChadGamer",
        price: 220.00,
        status: "cancelled",
        date: "1 day ago",
        hasDispute: false
    },
];

const STATUS_FILTERS = [
    { label: "All Orders", value: "all" },
    { label: "Active", value: "active" },
    { label: "Disputed", value: "disputed" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
];

export default function AdminOrdersPage() {
    const [filter, setFilter] = React.useState("all");
    const [search, setSearch] = React.useState("");

    const filteredOrders = ALL_ORDERS.filter(order => {
        const matchesFilter = filter === "all" || order.status === filter;
        const matchesSearch =
            order.id.toLowerCase().includes(search.toLowerCase()) ||
            order.buyer.toLowerCase().includes(search.toLowerCase()) ||
            order.seller.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Order Management</h1>
                    <p className="text-[#8b949e]">View and manage all marketplace transactions.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="border-[#30363d] text-[#c9d1d9] bg-[#161b22] hover:bg-[#1f2937]">
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* Filters & Search */}
            <Card className="bg-[#161b22] border-[#30363d]">
                <CardContent className="p-4 space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8b949e]" />
                            <Input
                                placeholder="Search by Order ID, Buyer, or Seller..."
                                className="pl-9 h-10 bg-[#0d1117] border-[#30363d] text-white focus:border-[#f5a623]"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                            {STATUS_FILTERS.map((s) => (
                                <Button
                                    key={s.value}
                                    variant="ghost"
                                    onClick={() => setFilter(s.value)}
                                    className={cn(
                                        "h-10 rounded-full px-4 text-sm font-medium transition-colors whitespace-nowrap",
                                        filter === s.value
                                            ? "bg-[#f5a623]/10 text-[#f5a623] hover:bg-[#f5a623]/20"
                                            : "text-[#8b949e] hover:text-white hover:bg-[#1f2937]"
                                    )}
                                >
                                    {s.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Orders Table */}
            <Card className="bg-[#161b22] border-[#30363d] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-[#c9d1d9]">
                        <thead className="bg-[#0d1117] border-b border-[#30363d] uppercase font-semibold text-xs text-[#8b949e]">
                            <tr>
                                <th className="px-6 py-4">Order Details</th>
                                <th className="px-6 py-4">Participants</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#30363d]">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-[#8b949e]">
                                        <div className="flex flex-col items-center gap-2">
                                            <Search className="h-8 w-8 opacity-20" />
                                            <p>No orders found matching your criteria.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="group hover:bg-[#1f2937]/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded bg-[#0d1117] border border-[#30363d] flex items-center justify-center text-[#8b949e] font-bold">
                                                    {order.game.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-white">{order.product}</div>
                                                    <div className="text-xs text-[#8b949e]">
                                                        {order.id} • {order.game} • {order.date}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-xs">
                                                    <span className="text-[#8b949e] w-10">Buyer:</span>
                                                    <span className="text-white hover:underline cursor-pointer">{order.buyer}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs">
                                                    <span className="text-[#8b949e] w-10">Seller:</span>
                                                    <span className="text-[#58a6ff] hover:underline cursor-pointer">{order.seller}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-white">
                                            ${order.price.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge
                                                className={cn(
                                                    "capitalize border-0",
                                                    order.status === "active" ? "bg-[#f5a623]/20 text-[#f5a623] hover:bg-[#f5a623]/30" :
                                                        order.status === "completed" ? "bg-[#238636]/20 text-[#238636] hover:bg-[#238636]/30" :
                                                            order.status === "delivered" ? "bg-[#1f6feb]/20 text-[#1f6feb] hover:bg-[#1f6feb]/30" :
                                                                order.status === "disputed" ? "bg-[#da3633]/20 text-[#da3633] hover:bg-[#da3633]/30" :
                                                                    "bg-[#8b949e]/20 text-[#8b949e] hover:bg-[#8b949e]/30"
                                                )}
                                            >
                                                {order.hasDispute && <AlertTriangle className="h-3 w-3 mr-1" />}
                                                {order.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/dashboard/orders/1`}>
                                                    {/* Linking to mock ID 1 since we're using mock admin data for now. In real app, it would be order.id */}
                                                    <Button size="sm" variant="outline" className="border-[#30363d] text-[#c9d1d9] hover:text-white hover:bg-[#30363d]">
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        Supervise
                                                    </Button>
                                                </Link>

                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-[#8b949e] hover:text-white">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="bg-[#1f2937] border-[#30363d] text-[#c9d1d9]">
                                                        <DropdownMenuLabel>Admin Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem className="hover:bg-[#30363d] cursor-pointer">
                                                            Force Complete
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="hover:bg-[#30363d] cursor-pointer text-red-400 focus:text-red-400">
                                                            Force Cancel & Refund
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-[#30363d]" />
                                                        <DropdownMenuItem className="hover:bg-[#30363d] cursor-pointer">
                                                            View Logs
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card >
        </div >
    );
}

function Download(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="15" y2="3" />
        </svg>
    )
}
