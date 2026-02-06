"use client";

import * as React from "react";
import {
    Check,
    X,
    ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const WITHDRAWALS = [
    {
        id: "WTH-551",
        user: "ProBooster_X",
        amount: 520.00,
        method: "PayPal",
        details: "payouts@iboosts.io",
        status: "pending",
        requested: "2.4h"
    },
    {
        id: "WTH-552",
        user: "EldenLord",
        amount: 85.00,
        method: "Crypto (USDT)",
        details: "0x71C8...9A21",
        status: "pending",
        requested: "5.1h"
    },
    {
        id: "WTH-549",
        user: "SoloCarry_KR",
        amount: 1200.00,
        method: "PayPal",
        details: "kr_hub@nexus.com",
        status: "approved",
        requested: "1.2d"
    }
];

export default function AdminFinancePage() {
    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter drop-shadow-md">
                        Treasury <span className="text-white opacity-40">Protocol</span>
                    </h1>
                    <p className="text-[#8b949e] font-medium mt-1">Direct oversight of platform liquidity and merchant payouts.</p>
                </div>
            </div>

            {/* Withdrawals List */}
            <div className="relative group border border-[#30363d]/50 bg-[#161b22]/40 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-[#c9d1d9]">
                        <thead>
                            <tr className="bg-black/40 border-b border-[#30363d]/50">
                                <th className="px-8 py-6">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b949e]">Request Origin</span>
                                </th>
                                <th className="px-8 py-6">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b949e]">Merchant</span>
                                </th>
                                <th className="px-8 py-6">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b949e]">Transfer Method</span>
                                </th>
                                <th className="px-8 py-6">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b949e]">Liquidity Value</span>
                                </th>
                                <th className="px-8 py-6">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b949e]">Verification</span>
                                </th>
                                <th className="px-8 py-6 text-right">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b949e]">Clearance</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#30363d]/30">
                            {WITHDRAWALS.map((req) => (
                                <tr key={req.id} className="group/row hover:bg-white/5 transition-all duration-300">
                                    <td className="px-8 py-6">
                                        <div className="font-black text-white text-base tracking-tighter tabular-nums group-hover/row:text-[#58a6ff] transition-colors">{req.id}</div>
                                        <div className="text-[9px] text-[#8b949e] font-black tracking-widest uppercase opacity-40 mt-1">{req.requested} AGO</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-[10px] font-black text-[#58a6ff]">
                                                {req.user.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="text-xs font-bold text-white tracking-tight">{req.user}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-white uppercase tracking-wider">{req.method}</span>
                                            <span className="text-[10px] text-[#8b949e] font-bold mt-1 opacity-60 tracking-tight">{req.details}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="font-black text-white text-xl tracking-tighter tabular-nums">
                                            ${req.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className={cn(
                                            "inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em]",
                                            req.status === 'pending'
                                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                                                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                        )}>
                                            <div className={cn(
                                                "h-2 w-2 rounded-full animate-pulse",
                                                req.status === 'pending' ? "bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)]" : "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                                            )} />
                                            {req.status}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        {req.status === 'pending' && (
                                            <div className="flex items-center justify-end gap-3">
                                                <Button size="sm" className="bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-black border border-emerald-500/20 h-10 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">
                                                    <Check className="h-4 w-4 mr-2" />
                                                    AUTHORIZE
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-10 w-10 text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 rounded-xl transition-all">
                                                    <X className="h-5 w-5" />
                                                </Button>
                                            </div>
                                        )}
                                        {req.status === 'approved' && (
                                            <div className="flex items-center justify-end gap-2 text-[#8b949e]">
                                                <ExternalLink className="h-4 w-4" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Receipt Verified</span>
                                            </div>
                                        )}
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

