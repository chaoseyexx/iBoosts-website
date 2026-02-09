"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, Globe, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import {
    ConnectAccountOnboarding,
    ConnectComponentsProvider,
} from "@stripe/react-connect-js";
import { loadConnectAndInitialize } from "@stripe/connect-js";

interface PayoutSetupFormProps {
    onSuccess: () => void;
}

const SUPPORTED_COUNTRIES = [
    { code: "US", name: "United States", flag: "🇺🇸" },
    { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
    { code: "CA", name: "Canada", flag: "🇨🇦" },
    { code: "AU", name: "Australia", flag: "🇦🇺" },
    { code: "DE", name: "Germany", flag: "🇩🇪" },
    { code: "FR", name: "France", flag: "🇫🇷" },
    { code: "NL", name: "Netherlands", flag: "🇳🇱" },
    { code: "BE", name: "Belgium", flag: "🇧🇪" },
    { code: "AT", name: "Austria", flag: "🇦🇹" },
    { code: "ES", name: "Spain", flag: "🇪🇸" },
    { code: "IT", name: "Italy", flag: "🇮🇹" },
    { code: "PT", name: "Portugal", flag: "🇵🇹" },
    { code: "IE", name: "Ireland", flag: "🇮🇪" },
    { code: "SE", name: "Sweden", flag: "🇸🇪" },
    { code: "NO", name: "Norway", flag: "🇳🇴" },
    { code: "DK", name: "Denmark", flag: "🇩🇰" },
    { code: "FI", name: "Finland", flag: "🇫🇮" },
    { code: "CH", name: "Switzerland", flag: "🇨🇭" },
    { code: "PL", name: "Poland", flag: "🇵🇱" },
    { code: "NZ", name: "New Zealand", flag: "🇳🇿" },
    { code: "SG", name: "Singapore", flag: "🇸🇬" },
    { code: "HK", name: "Hong Kong", flag: "🇭🇰" },
    { code: "JP", name: "Japan", flag: "🇯🇵" },
    { code: "MX", name: "Mexico", flag: "🇲🇽" },
    { code: "BR", name: "Brazil", flag: "🇧🇷" },
];

export function PayoutSetupForm({ onSuccess }: PayoutSetupFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [country, setCountry] = useState("");
    const [stripeConnectInstance, setStripeConnectInstance] = useState<any>(null);
    const [showOnboarding, setShowOnboarding] = useState(false);

    const initializeStripeConnect = useCallback(async () => {
        if (!country) {
            toast.error("Please select your country");
            return;
        }

        setIsLoading(true);
        try {
            // Get account session from backend
            const response = await fetch("/api/stripe/connect/account-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ country }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to initialize");
            }

            // Initialize Stripe Connect
            const instance = await loadConnectAndInitialize({
                publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
                fetchClientSecret: async () => data.clientSecret,
                appearance: {
                    overlays: "dialog",
                    variables: {
                        colorPrimary: "#f5a623",
                        colorBackground: "#0d1117",
                        colorText: "#ffffff",
                        colorDanger: "#ef4444",
                        fontFamily: "system-ui, sans-serif",
                        borderRadius: "12px",
                        spacingUnit: "4px",
                    },
                },
            });

            setStripeConnectInstance(instance);
            setShowOnboarding(true);
        } catch (error: any) {
            toast.error(error.message || "Failed to initialize payout setup");
        } finally {
            setIsLoading(false);
        }
    }, [country]);

    const handleReset = async () => {
        if (!confirm("This will clear your current Stripe account setup. Continue?")) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch("/api/stripe/connect/reset", {
                method: "POST",
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to reset");
            }

            toast.success("Account reset. Select your country to set up again.");
            setShowOnboarding(false);
            setStripeConnectInstance(null);
            setCountry("");
        } catch (error: any) {
            toast.error(error.message || "Failed to reset account");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOnboardingComplete = () => {
        toast.success("Payout setup completed!");
        onSuccess();
    };

    const selectedCountry = SUPPORTED_COUNTRIES.find(c => c.code === country);

    // Show embedded onboarding
    if (showOnboarding && stripeConnectInstance) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#f5a623]/10 flex items-center justify-center text-[#f5a623]">
                            <CheckCircle className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-white uppercase tracking-tight">Complete Setup</h3>
                            <p className="text-[10px] text-[#8b949e] font-bold uppercase tracking-widest">
                                {selectedCountry?.flag} {selectedCountry?.name}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleReset}
                        disabled={isLoading}
                        className="text-[10px] text-[#8b949e] hover:text-red-400 transition-colors uppercase tracking-widest font-bold"
                    >
                        Wrong country? Reset
                    </button>
                </div>

                <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
                    <ConnectAccountOnboarding
                        onExit={handleOnboardingComplete}
                    />
                </ConnectComponentsProvider>
            </div>
        );
    }

    // Country selection step
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#f5a623]/10 flex items-center justify-center text-[#f5a623]">
                    <Globe className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">Setup Payouts</h3>
                    <p className="text-[10px] text-[#8b949e] font-bold uppercase tracking-widest">Connect Your Bank Account</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-[#8b949e]">
                        Select Your Country
                    </Label>
                    <Select value={country} onValueChange={setCountry}>
                        <SelectTrigger className="h-14 bg-white/[0.03] border-white/10 text-base">
                            <SelectValue placeholder="Choose your country..." />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                            {SUPPORTED_COUNTRIES.map((c) => (
                                <SelectItem key={c.code} value={c.code} className="py-3">
                                    <span className="flex items-center gap-2">
                                        <span>{c.flag}</span>
                                        <span>{c.name}</span>
                                    </span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {selectedCountry && (
                        <p className="text-[11px] text-green-400 flex items-center gap-1">
                            ✓ {selectedCountry.name} is supported
                        </p>
                    )}
                </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <p className="text-[11px] text-[#8b949e]">
                    You'll need to provide your legal name, date of birth, address, and bank account details to receive payouts.
                </p>
            </div>

            <Button
                onClick={initializeStripeConnect}
                disabled={isLoading || !country}
                className="w-full h-14 bg-[#f5a623] hover:bg-[#e09612] text-black font-bold uppercase tracking-widest text-sm"
            >
                {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                    "Continue"
                )}
            </Button>
        </div>
    );
}
