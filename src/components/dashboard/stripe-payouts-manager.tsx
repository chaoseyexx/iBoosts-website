"use client";

import React, { useMemo } from "react";
import { loadConnectAndInitialize } from "@stripe/connect-js";
import {
    ConnectPayouts,
    ConnectComponentsProvider,
} from "@stripe/react-connect-js";
import { ShieldCheck, Landmark } from "lucide-react";

interface StripePayoutsManagerProps {
    accountId: string;
}

export default function StripePayoutsManager({
    accountId,
}: StripePayoutsManagerProps) {
    const stripeConnectInstance = useMemo(() => {
        return loadConnectAndInitialize({
            publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
            fetchClientSecret: async () => {
                const response = await fetch("/api/stripe/connect/payouts-session", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ accountId }),
                });
                const data = await response.json();
                if (!response.ok) {
                    console.error("Payout Session Error:", data.error);
                    throw new Error(data.error || "Failed to fetch client secret");
                }
                return data.client_secret;
            },
            appearance: {
                variables: {
                    colorPrimary: "#f5a623",
                    colorBackground: "#0d1117",
                    colorText: "#ffffff",
                    colorSecondaryText: "#8b949e",
                    colorBorder: "#30363d",
                    borderRadius: "12px",
                },
            },
        });
    }, [accountId]);

    return (
        <div className="w-full bg-[#0d1117] border border-white/5 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#161b22]">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-[#f5a623]/10 rounded-lg flex items-center justify-center border border-[#f5a623]/20">
                        <Landmark className="h-4 w-4 text-[#f5a623]" />
                    </div>
                    <div className="space-y-0.5">
                        <h2 className="text-xs font-bold text-white uppercase tracking-tight">Withdrawal Methods</h2>
                        <p className="text-[9px] font-bold text-[#8b949e] uppercase tracking-widest">Manage Bank Accounts</p>
                    </div>
                </div>
            </div>
            <div className="flex-1 min-h-[500px] bg-[#0d1117] p-2">
                <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
                    <ConnectPayouts />
                </ConnectComponentsProvider>
            </div>
            <div className="p-4 border-t border-white/5 bg-[#161b22] flex justify-center">
                <p className="text-[9px] font-bold text-[#8b949e] uppercase tracking-[0.2em] flex items-center gap-2">
                    <ShieldCheck className="h-3 w-3" /> Encrypted Payout Management
                </p>
            </div>
        </div>
    );
}
