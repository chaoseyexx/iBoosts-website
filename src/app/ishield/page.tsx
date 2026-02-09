"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    ShieldCheck,
    Zap,
    Gift,
    Clock,
    Check,
    ArrowRight,
    Sparkles,
    HeartHandshake
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

import { useSearchParams } from "next/navigation";

export default function IShieldPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("monthly");
    const [isShieldActive, setIsShieldActive] = useState<boolean | null>(null);
    const [checkingStatus, setCheckingStatus] = useState(true);
    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams.get("success")) {
            toast.success("Welcome to iShield Pro! Your subscription is active.");
        }
        if (searchParams.get("canceled")) {
            toast.error("Subscription process was canceled.");
        }
    }, [searchParams]);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const res = await fetch("/api/user/status");
                if (res.ok) {
                    const data = await res.json();
                    setIsShieldActive(data.isShieldActive);
                }
            } catch (e) {
                console.error("Failed to fetch status", e);
            } finally {
                setCheckingStatus(false);
            }
        };
        checkStatus();
    }, []);

    const handleUpgrade = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/stripe/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan: selectedPlan })
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                toast.error(data.error || "Failed to start checkout");
            }
        } catch (error) {
            toast.error("Failed to upgrade");
        } finally {
            setIsLoading(false);
        }
    };

    const handleManage = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/stripe/portal", { method: "POST" });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                toast.error(data.error || "Failed to open portal");
            }
        } catch (error) {
            toast.error("Failed to manage subscription");
        } finally {
            setIsLoading(false);
        }
    };

    if (checkingStatus) {
        return <div className="min-h-screen flex items-center justify-center text-white/50 text-sm font-bold uppercase tracking-widest animate-pulse">Checking Eligibility...</div>;
    }

    if (isShieldActive) {
        return (
            <div className="max-w-[800px] mx-auto py-20 px-6 text-center space-y-8 animate-in fade-in zoom-in duration-500 min-h-[calc(100vh-120px)] flex flex-col justify-center">
                <div className="w-24 h-24 mx-auto rounded-full bg-[#f5a623]/10 flex items-center justify-center border border-[#f5a623]/20 shadow-[0_0_50px_rgba(245,166,35,0.2)]">
                    <ShieldCheck className="h-12 w-12 text-[#f5a623]" />
                </div>
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f5a623] text-black border border-[#f5a623]">
                        <Sparkles className="h-4 w-4" />
                        <span className="text-xs font-black uppercase tracking-widest">Active Member</span>
                    </div>
                    <h1 className="text-5xl font-black text-white uppercase tracking-tighter">You are Protected</h1>
                    <p className="text-[#8b949e] font-medium max-w-[500px] mx-auto">
                        Your iShield Pro membership is active. You are enjoying 5% discounts, lifetime guarantees, and priority support.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto w-full">
                    <div className="p-6 rounded-3xl bg-[#0d1117]/50 border border-white/5 space-y-2">
                        <div className="text-[10px] font-bold text-[#8b949e] uppercase tracking-widest">Status</div>
                        <div className="text-xl font-black text-[#22c55e] flex items-center justify-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
                            Active
                        </div>
                    </div>
                    <div className="p-6 rounded-3xl bg-[#0d1117]/50 border border-white/5 space-y-2">
                        <div className="text-[10px] font-bold text-[#8b949e] uppercase tracking-widest">Current Plan</div>
                        <div className="text-xl font-black text-white">iShield Pro</div>
                    </div>
                </div>

                <div className="pt-8">
                    <Button
                        onClick={handleManage}
                        disabled={isLoading}
                        className="h-14 px-8 bg-white text-black hover:bg-white/90 font-black uppercase tracking-widest rounded-2xl transition-all hover:scale-105 active:scale-95"
                    >
                        {isLoading ? "Loading Portal..." : "Manage Subscription"}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[1100px] mx-auto py-8 px-6 animate-in fade-in slide-in-from-bottom-2 duration-1000 min-h-[calc(100vh-120px)] flex items-center">
            <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-12 items-center">

                {/* Left Column: Value Prop */}
                <div className="xl:col-span-12 xl:col-span-7 space-y-8">
                    <div className="space-y-4 text-center xl:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f5a623]/10 border border-[#f5a623]/20">
                            <Sparkles className="h-3.5 w-3.5 text-[#f5a623]" />
                            <span className="text-[9px] font-bold uppercase tracking-widest text-[#f5a623]">iShield Pro Membership</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tighter leading-none">
                            Protection for <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f5a623] to-[#ffc107]">
                                Elite Players.
                            </span>
                        </h1>

                        <p className="text-sm font-medium text-[#8b949e] max-w-[500px] mx-auto xl:mx-0 leading-relaxed">
                            Unlock lifetime order guarantees, platform-wide discounts, and priority support. The standard for serious boosters.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { icon: <ShieldCheck className="h-4 w-4" />, title: "Lifetime Guarantee", desc: "Permanent coverage on all orders." },
                            { icon: <Zap className="h-4 w-4" />, title: "5% Discount", desc: "Automatic marketplace savings." },
                            { icon: <HeartHandshake className="h-4 w-4" />, title: "Priority Support", desc: "Tickets handled first by seniors." },
                            { icon: <Sparkles className="h-4 w-4" />, title: "Pro Badge", desc: "Visual verification of elite status." }
                        ].map((f, i) => (
                            <div key={i} className="p-4 rounded-2xl bg-[#0d1117]/40 border border-white/5 space-y-2">
                                <div className="text-[#f5a623]">{f.icon}</div>
                                <h3 className="text-[11px] font-bold text-white uppercase tracking-tight">{f.title}</h3>
                                <p className="text-[10px] text-[#8b949e] leading-tight font-medium">{f.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-6 p-4 rounded-3xl bg-white/[0.02] border border-white/5 max-w-fit mx-auto xl:mx-0">
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full bg-[#1c2128] border-2 border-[#0a0e13] flex items-center justify-center text-[10px] font-bold text-white">U</div>
                            ))}
                        </div>
                        <p className="text-[10px] font-bold text-[#8b949e] uppercase tracking-widest">Joined by 842 Pro boosters this week</p>
                    </div>
                </div>

                {/* Right Column: Pricing Plans */}
                <div className="xl:col-span-12 xl:col-span-5 space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                        {/* Monthly Plan */}
                        <button
                            onClick={() => setSelectedPlan("monthly")}
                            className={cn(
                                "relative p-6 rounded-[2rem] border-2 text-left transition-all duration-300",
                                selectedPlan === "monthly"
                                    ? "bg-[#0d1117] border-[#f5a623] shadow-[0_0_30px_rgba(245,166,35,0.1)]"
                                    : "bg-white/[0.02] border-white/5 hover:border-white/10"
                            )}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="text-xs font-bold text-[#8b949e] uppercase tracking-widest mb-1">Monthly Plan</h4>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-bold text-white">$10.00</span>
                                        <span className="text-xs text-[#8b949e] font-medium">/mo</span>
                                    </div>
                                </div>
                                <div className={cn(
                                    "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                                    selectedPlan === "monthly" ? "bg-[#f5a623] border-[#f5a623]" : "border-white/10"
                                )}>
                                    {selectedPlan === "monthly" && <Check className="h-3 w-3 text-black" />}
                                </div>
                            </div>
                        </button>

                        {/* Yearly Plan */}
                        <button
                            onClick={() => setSelectedPlan("yearly")}
                            className={cn(
                                "relative p-6 rounded-[2rem] border-2 text-left transition-all duration-300 overflow-hidden",
                                selectedPlan === "yearly"
                                    ? "bg-[#0d1117] border-[#f5a623] shadow-[0_0_30px_rgba(245,166,35,0.1)]"
                                    : "bg-white/[0.02] border-white/5 hover:border-white/10"
                            )}
                        >
                            <div className="absolute top-4 right-6">
                                <Badge className="bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/20 font-bold text-[9px] uppercase tracking-widest px-2 py-0.5">Most Popular</Badge>
                            </div>

                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="text-xs font-bold text-[#8b949e] uppercase tracking-widest mb-1">Yearly Plan</h4>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-bold text-white">$100.00</span>
                                        <span className="text-xs text-[#8b949e] font-medium">/yr</span>
                                    </div>
                                </div>
                                <div className={cn(
                                    "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                                    selectedPlan === "yearly" ? "bg-[#f5a623] border-[#f5a623]" : "border-white/10"
                                )}>
                                    {selectedPlan === "yearly" && <Check className="h-3 w-3 text-black" />}
                                </div>
                            </div>
                        </button>
                    </div>

                    <div className="bg-[#0a0e13] rounded-3xl p-8 border border-white/5 space-y-6 shadow-2xl">
                        <div className="space-y-4">
                            <h5 className="text-[10px] font-bold text-[#8b949e] uppercase tracking-widest">Included Benefits:</h5>
                            <div className="grid grid-cols-1 gap-3">
                                {[
                                    "Lifetime Order Protection",
                                    "Automatic 5% Discount",
                                    "Elite Pro Badge",
                                    "VIP Support Line"
                                ].map(benefit => (
                                    <div key={benefit} className="flex items-center gap-3">
                                        <div className="w-4 h-4 rounded-full bg-[#f5a623]/10 flex items-center justify-center">
                                            <Check className="h-2.5 w-2.5 text-[#f5a623]" />
                                        </div>
                                        <span className="text-xs font-medium text-white/90">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Button
                            onClick={handleUpgrade}
                            disabled={isLoading}
                            className="w-full h-14 bg-[#f5a623] hover:bg-[#e09612] text-black font-bold uppercase tracking-widest rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {isLoading ? "Processing..." : `Upgrade Now — ${selectedPlan === 'monthly' ? '$10.00' : '$100.00'}`}
                        </Button>

                        <p className="text-[9px] text-center text-[#8b949e] font-medium leading-relaxed">
                            By subscribing you agree to our Terms. <br />
                            Cancel any time via your Dashboard settings.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
