"use client";

import * as React from "react";
import Link from "next/link";
import {
    Search,
    AlertTriangle,
    CheckCircle2,
    Clock,
    MessageSquare,
    ShieldAlert,
    MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// --- Mock Data ---

const DISPUTES = [
    {
        id: "DSP-2024-001",
        orderId: "ORD-9921-MC",
        reason: "Item not delivered",
        status: "open",
        openedBy: "healer_john",
        against: "DungeonMasters",
        amount: 45.00,
        date: "2 hours ago",
        severity: "high"
    },
    {
        id: "DSP-2024-002",
        orderId: "ORD-8821-ZZ",
        reason: "Account banned after boost",
        status: "investigating",
        openedBy: "angry_gamer",
        against: "BoostPro_X",
        amount: 120.00,
        date: "1 day ago",
        severity: "critical"
    },
    {
        id: "DSP-2024-003",
        orderId: "ORD-1122-AA",
        reason: "Seller unresponsive",
        status: "resolved",
        openedBy: "waiting_dude",
        against: "SlowBooster",
        amount: 15.00,
        date: "3 days ago",
        severity: "medium"
    }
];

export default function AdminDisputesPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Dispute Resolution</h1>
                    <p className="text-[#8b949e]">Handle conflicts between buyers and sellers.</p>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-[#161b22] border-[#30363d] p-4 flex items-center gap-4">
                    <div className="p-3 bg-red-500/10 rounded-lg">
                        <AlertTriangle className="h-6 w-6 text-red-500" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-[#8b949e]">Open Disputes</p>
                        <h2 className="text-2xl font-bold text-white">12</h2>
                    </div>
                </Card>
                <Card className="bg-[#161b22] border-[#30363d] p-4 flex items-center gap-4">
                    <div className="p-3 bg-yellow-500/10 rounded-lg">
                        <ShieldAlert className="h-6 w-6 text-yellow-500" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-[#8b949e]">Needs One-Time Review</p>
                        <h2 className="text-2xl font-bold text-white">5</h2>
                    </div>
                </Card>
                <Card className="bg-[#161b22] border-[#30363d] p-4 flex items-center gap-4">
                    <div className="p-3 bg-green-500/10 rounded-lg">
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-[#8b949e]">Resolved This Week</p>
                        <h2 className="text-2xl font-bold text-white">28</h2>
                    </div>
                </Card>
            </div>

            {/* Disputes List */}
            <Card className="bg-[#161b22] border-[#30363d] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-[#c9d1d9]">
                        <thead className="bg-[#0d1117] border-b border-[#30363d] uppercase font-semibold text-xs text-[#8b949e]">
                            <tr>
                                <th className="px-6 py-4">Dispute Info</th>
                                <th className="px-6 py-4">Reason</th>
                                <th className="px-6 py-4">Parties</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#30363d]">
                            {DISPUTES.map((dispute) => (
                                <tr key={dispute.id} className="group hover:bg-[#1f2937]/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-white">{dispute.id}</div>
                                        <div className="text-xs text-[#8b949e] mt-0.5">Order: {dispute.orderId}</div>
                                        <div className="text-xs text-[#8b949e]">{dispute.date}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant="outline" className={cn(
                                            "border-[#30363d] mb-1.5",
                                            dispute.severity === 'critical' ? "text-red-400 border-red-400/20 bg-red-400/10" : "text-[#c9d1d9]"
                                        )}>
                                            {dispute.severity}
                                        </Badge>
                                        <div className="font-medium text-white">{dispute.reason}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1 text-xs">
                                            <div className="flex gap-1">
                                                <span className="text-[#8b949e]">By:</span>
                                                <span className="text-white hover:underline cursor-pointer">{dispute.openedBy}</span>
                                            </div>
                                            <div className="flex gap-1">
                                                <span className="text-[#8b949e]">Vs:</span>
                                                <span className="text-red-400 hover:underline cursor-pointer">{dispute.against}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-white">
                                        ${dispute.amount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge
                                            className={cn(
                                                "capitalize border-0",
                                                dispute.status === "open" ? "bg-red-500/20 text-red-500" :
                                                    dispute.status === "investigating" ? "bg-yellow-500/20 text-yellow-500" :
                                                        "bg-green-500/20 text-green-500"
                                            )}
                                        >
                                            {dispute.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/dashboard/orders/1`}>
                                                <Button size="sm" className="bg-[#f5a623] text-black hover:bg-[#e09612]">
                                                    <MessageSquare className="h-4 w-4 mr-2" />
                                                    View Chat
                                                </Button>
                                            </Link>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-[#8b949e] hover:text-white">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-[#1f2937] border-[#30363d] text-[#c9d1d9]">
                                                    <DropdownMenuLabel>Resolution</DropdownMenuLabel>
                                                    <DropdownMenuItem className="hover:bg-[#30363d] cursor-pointer text-green-400">
                                                        Release Funds to Seller
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="hover:bg-[#30363d] cursor-pointer text-red-400">
                                                        Refund Buyer
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
