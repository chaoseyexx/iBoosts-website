"use client";

import React, { useState, useMemo } from "react";
import { loadConnectAndInitialize } from "@stripe/connect-js";
import {
    ConnectAccountOnboarding,
    ConnectComponentsProvider,
} from "@stripe/react-connect-js";
import { ShieldCheck } from "lucide-react";

interface StripeEmbeddedOnboardingProps {
    accountId: string;
    onExit: () => void;
}

export default function StripeEmbeddedOnboarding({
    accountId,
    onExit,
}: StripeEmbeddedOnboardingProps) {
    const stripeConnectInstance = useMemo(() => {
        return loadConnectAndInitialize({
            publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
            fetchClientSecret: async () => {
                const response = await fetch("/api/stripe/connect/account-session", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ accountId }),
                });
                const data = await response.json();
                if (!response.ok) {
                    console.error("Stripe Session Error:", data.error);
                    throw new Error(data.error || "Failed to fetch client secret");
                }
                return data.client_secret;
            },
            appearance: {
                overlays: "dialog",
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
            <div className="flex-1 min-h-[700px] bg-[#0d1117]">
                <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
                    <ConnectAccountOnboarding
                        onExit={() => {
                            onExit();
                        }}
                    />
                </ConnectComponentsProvider>
            </div>
            <div className="p-4 border-t border-white/5 bg-[#161b22] flex justify-center">
                <p className="text-[9px] font-bold text-[#8b949e] uppercase tracking-[0.2em] flex items-center gap-2">
                    <ShieldCheck className="h-3 w-3" /> Secure verification powered by Stripe
                </p>
            </div>
        </div>
    );
}
