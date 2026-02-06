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
        reason: "Asset Transmission Failure",
        status: "open",
        openedBy: "healer_john",
        against: "DungeonMasters",
        amount: 45.00,
        date: "2.4 hours ago",
        severity: "high"
    },
    {
        id: "DSP-2024-002",
        orderId: "ORD-8821-ZZ",
        reason: "Terminal License Revocation",
        status: "investigating",
        openedBy: "angry_gamer",
        against: "BoostPro_X",
        amount: 120.00,
        date: "1.2 days ago",
        severity: "critical"
    },
    {
        id: "DSP-2024-003",
        orderId: "ORD-1122-AA",
        reason: "Merchant Unresponsive",
        status: "resolved",
        openedBy: "waiting_dude",
        against: "SlowBooster",
        amount: 15.00,
        date: "3.5 days ago",
        severity: "medium"
    }
];

export default function AdminDisputesPage() {
    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter drop-shadow-md">
                        Arbitration <span className="text-rose-500">Protocol</span>
                    </h1>
                    <p className="text-[#8b949e] font-medium mt-1">Mediate high-stakes conflicts and maintain marketplace integrity.</p>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Active Disputes", value: "12", icon: AlertTriangle, color: "rose", bg: "rose-500/10", border: "rose-500/20" },
                    { label: "Review Required", value: "05", icon: ShieldAlert, color: "amber", bg: "amber-500/10", border: "amber-500/20" },
                    { label: "Resolved Cycle", value: "28", icon: CheckCircle2, color: "emerald", bg: "emerald-500/10", border: "emerald-500/20" },
                ].map((stat, i) => (
                    <div key={i} className="relative group">
                        <div className={cn("absolute -inset-0.5 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500", `bg-${stat.color}-500`)} />
                        <Card className="relative bg-[#161b22]/80 backdrop-blur-xl border-[#30363d]/50 rounded-3xl overflow-hidden p-6">
                            <div className="flex items-center gap-5">
                                <div className={cn("p-4 rounded-2xl flex items-center justify-center", stat.bg)}>
                                    <stat.icon className={cn("h-7 w-7", `text-${stat.color}-500`)} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b949e] mb-1">{stat.label}</p>
                                    <h2 className="text-3xl font-black text-white tracking-tighter tabular-nums">{stat.value}</h2>
                                </div>
                            </div>
                        </Card>
                    </div>
                ))}
            </div>

            {/* Disputes List */}
            <div className="relative group border border-[#30363d]/50 bg-[#161b22]/40 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-[#c9d1d9]">
                        <thead>
                            <tr className="bg-black/40 border-b border-[#30363d]/50">
                                <th className="px-8 py-6">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b949e]">Dispute Identifier</span>
                                </th>
                                <th className="px-8 py-6">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b949e]">Breach Analysis</span>
                                </th>
                                <th className="px-8 py-6">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b949e]">Involved Entities</span>
                                </th>
                                <th className="px-8 py-6">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b949e]">Value</span>
                                </th>
                                <th className="px-8 py-6">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b949e]">Current Phase</span>
                                </th>
                                <th className="px-8 py-6 text-right">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b949e]">Protocol</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#30363d]/30">
                            {DISPUTES.map((dispute) => (
                                <tr key={dispute.id} className="group/row hover:bg-rose-500/5 transition-all duration-300">
                                    <td className="px-8 py-6">
                                        <div className="font-black text-white text-base tracking-tighter tabular-nums group-hover/row:text-rose-400 transition-colors">{dispute.id}</div>
                                        <div className="text-[9px] text-[#8b949e] font-black tracking-widest uppercase opacity-40 mt-1">Order: {dispute.orderId}</div>
                                        <div className="text-[9px] text-rose-500 font-bold mt-1 uppercase tracking-tight">{dispute.date}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className={cn(
                                            "inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider mb-2",
                                            dispute.severity === 'critical' ? "text-rose-400 bg-rose-500/10 border border-rose-500/20" :
                                                dispute.severity === 'high' ? "text-amber-400 bg-amber-500/10 border border-amber-500/20" :
                                                    "text-[#c9d1d9] bg-white/5 border border-white/10"
                                        )}>
                                            {dispute.severity} priority
                                        </div>
                                        <div className="font-bold text-white tracking-tight">{dispute.reason}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3 group/buyer">
                                                <div className="h-5 w-5 rounded bg-white/5 border border-white/10 flex items-center justify-center text-[9px] font-black text-[#58a6ff]">PL</div>
                                                <span className="text-xs font-bold text-white group-hover/buyer:text-[#58a6ff] transition-colors">{dispute.openedBy}</span>
                                            </div>
                                            <div className="flex items-center gap-3 group/seller">
                                                <div className="h-5 w-5 rounded bg-white/5 border border-white/10 flex items-center justify-center text-[9px] font-black text-rose-500">DF</div>
                                                <span className="text-xs font-bold text-white group-hover/seller:text-rose-500 transition-colors">{dispute.against}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 font-black text-white text-xl tracking-tighter tabular-nums">
                                        ${dispute.amount.toFixed(2)}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className={cn(
                                            "inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em]",
                                            dispute.status === "open" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.1)]" :
                                                dispute.status === "investigating" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                                                    "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                        )}>
                                            <div className={cn(
                                                "h-2 w-2 rounded-full animate-pulse",
                                                dispute.status === "open" ? "bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.5)]" :
                                                    dispute.status === "investigating" ? "bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)]" :
                                                        "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                                            )} />
                                            {dispute.status}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <Link href={`/dashboard/orders/1`}>
                                                <Button size="sm" className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-black text-[10px] uppercase tracking-widest h-10 px-4 transition-all">
                                                    <MessageSquare className="h-4 w-4 mr-2 text-rose-500" />
                                                    Intercept
                                                </Button>
                                            </Link>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button size="icon" variant="ghost" className="h-10 w-10 text-[#8b949e] hover:text-white hover:bg-white/5 rounded-xl transition-all">
                                                        <MoreHorizontal className="h-5 w-5" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-[#0d1117]/95 backdrop-blur-2xl border-[#30363d]/50 text-[#c9d1d9] rounded-2xl p-2 min-w-[200px] shadow-2xl overflow-hidden">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                                                    <DropdownMenuLabel className="font-black text-[10px] uppercase tracking-widest text-[#8b949e] px-4 py-3 text-center border-b border-white/5 mb-1">Arbitration Protocol</DropdownMenuLabel>
                                                    <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-500/10 cursor-pointer transition-all group group-hover:text-emerald-400 text-xs font-bold">
                                                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                                        EXECUTE SETTLEMENT
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-rose-500/10 cursor-pointer transition-all group group-hover:text-rose-400 text-xs font-bold">
                                                        <AlertTriangle className="h-4 w-4 text-rose-500" />
                                                        EXECUTE REVERSAL
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
            </div>
        </div>
    );
}
