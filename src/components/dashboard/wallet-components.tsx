"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

interface BalanceBarProps {
    available: number;
    incoming: number;
    className?: string;
}

export function BalanceBar({ available, incoming, className }: BalanceBarProps) {
    const total = available + Math.max(0, incoming);
    const availableWidth = total > 0 ? (available / total) * 100 : 0;
    const incomingWidth = total > 0 ? (Math.max(0, incoming) / total) * 100 : 0;

    return (
        <div className={cn("space-y-4", className)}>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex">
                <div
                    className="h-full bg-[#f5a623] transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(245,166,35,0.2)]"
                    style={{ width: `${availableWidth}%` }}
                />
                <div
                    className="h-full bg-[#f5a623]/20 transition-all duration-1000 ease-out"
                    style={{ width: `${incomingWidth}%` }}
                />
            </div>

            <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-[#f5a623]/20" />
                    <div className="space-y-0">
                        <span className="text-[9px] font-medium uppercase tracking-widest text-[#8b949e]">Incoming</span>
                        <div className="text-xs font-medium text-white">US${incoming.toFixed(2)}</div>
                    </div>
                </div>
                <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-[#f5a623]" />
                    <div className="space-y-0">
                        <span className="text-[9px] font-medium uppercase tracking-widest text-[#8b949e]">Available</span>
                        <div className="text-xs font-medium text-white">US${available.toFixed(2)}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function WalletAlert({ icon: Icon, title, description, action }: { icon: any, title: string, description: string, action?: React.ReactNode }) {
    return (
        <div className="bg-[#0d1117]/50 border border-white/5 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center gap-5 group hover:border-white/10 transition-all">
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-[#8b949e] group-hover:text-white transition-colors">
                <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-0.5">
                <div className="flex items-center gap-2">
                    <h4 className="text-xs font-medium uppercase tracking-tight text-white">{title}</h4>
                    <Info className="h-3 w-3 text-[#8b949e]" />
                </div>
                <p className="text-[11px] font-medium text-[#8b949e] leading-relaxed max-w-2xl">{description}</p>
            </div>
            {action && <div className="shrink-0">{action}</div>}
        </div>
    );
}
