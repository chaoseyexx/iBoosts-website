"use client";

import * as React from "react";
import {
    Check,
    X,
    ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
} from "@/components/ui/card";

const WITHDRAWALS = [
    {
        id: "WTH-551",
        user: "ProBooster_X",
        amount: 520.00,
        method: "PayPal",
        details: "seller@iboosts.com",
        status: "pending",
        requested: "2 hours ago"
    },
    {
        id: "WTH-552",
        user: "EldenLord",
        amount: 85.00,
        method: "Crypto (USDT)",
        details: "0x71C...9A21",
        status: "pending",
        requested: "5 hours ago"
    },
    {
        id: "WTH-549",
        user: "SoloCarry_KR",
        amount: 1200.00,
        method: "PayPal",
        details: "kr_pro@gmail.com",
        status: "approved",
        requested: "1 day ago"
    }
];

export default function AdminFinancePage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Finance & Payouts</h1>
                    <p className="text-[#8b949e]">Review and process withdrawal requests.</p>
                </div>
            </div>

            <Card className="bg-[#161b22] border-[#30363d] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-[#c9d1d9]">
                        <thead className="bg-[#0d1117] border-b border-[#30363d] uppercase font-semibold text-xs text-[#8b949e]">
                            <tr>
                                <th className="px-6 py-4">Request ID</th>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Method</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#30363d]">
                            {WITHDRAWALS.map((req) => (
                                <tr key={req.id} className="group hover:bg-[#1f2937]/50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs">{req.id}</td>
                                    <td className="px-6 py-4 font-medium text-white">{req.user}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-white">{req.method}</span>
                                            <span className="text-xs text-[#8b949e] font-mono">{req.details}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-white">${req.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <Badge className={cn(
                                            "capitalize border-0",
                                            req.status === 'pending' ? "bg-[#f5a623]/20 text-[#f5a623]" : "bg-green-500/20 text-green-500"
                                        )}>
                                            {req.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {req.status === 'pending' && (
                                            <div className="flex items-center justify-end gap-2">
                                                <Button size="sm" className="bg-green-600 hover:bg-green-700 h-8">
                                                    <Check className="h-4 w-4 mr-1" /> Approve
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-red-400 hover:bg-red-400/10">
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
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

function cn(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}
