"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Lock, AlertCircle, Loader2, CheckCircle2, Clock, Camera, FileText, ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";

interface KYCViewProps {
    initialStatus: "NOT_SUBMITTED" | "PENDING" | "APPROVED" | "REJECTED";
}

export default function KYCView({ initialStatus }: KYCViewProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState(initialStatus);
    const [isConnecting, setIsConnecting] = useState(false);
    const [verificationUrl, setVerificationUrl] = useState<string | null>(null);

    // Fetch fresh status in background
    useEffect(() => {
        const syncStatus = async () => {
            try {
                const response = await fetch("/api/user/status");
                if (response.ok) {
                    const data = await response.json();
                    if (data.kycStatus === "APPROVED") setStatus("APPROVED");
                    else if (data.kycStatus === "PENDING") setStatus("PENDING");
                    else setStatus("NOT_SUBMITTED");
                }
            } catch (error) {
                console.error("Failed to sync KYC status", error);
            }
        };

        // Check for Didit callback query params
        const diditStatus = searchParams.get("status");
        if (diditStatus === "Approved" || diditStatus === "In Review") {
            toast.success("Identity submitted! We are processing your verification.");
            // Optimistic update
            setStatus("PENDING");
            // Also trigger sync to capture any backend changes
            syncStatus();
        } else if (diditStatus === "Declined") {
            toast.error("Verification was declined. Please try again.");
            setStatus("NOT_SUBMITTED");
        } else {
            // Normal load, just sync
            syncStatus();
        }
    }, [searchParams]);

    const handleReset = async () => {
        if (!confirm("Are you sure? This will delete your current verification progress.")) return;
        setIsConnecting(true);
        try {
            const response = await fetch("/api/user/reset-stripe", { method: "POST" });
            if (response.ok) {
                toast.success("Verification reset");
                setStatus("NOT_SUBMITTED");
                setVerificationUrl(null);
                // Clear query params by replacing route
                router.replace("/dashboard/kyc");
                // Fetch fresh status
                const res = await fetch("/api/user/status");
                if (res.ok) {
                    const data = await res.json();
                    if (data.kycStatus === "APPROVED") setStatus("APPROVED");
                    else if (data.kycStatus === "PENDING") setStatus("PENDING");
                    else setStatus("NOT_SUBMITTED");
                }
            }
        } catch (error) {
            toast.error("Failed to reset");
        } finally {
            setIsConnecting(false);
        }
    };

    const handleStartVerification = async () => {
        setIsConnecting(true);
        try {
            const response = await fetch("/api/user/kyc-session", { method: "POST" });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to start verification");
            }

            // Set URL to show in iframe
            setVerificationUrl(data.url);
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to initiate verification flow");
            setIsConnecting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12 px-4 relative">
            {/* Embedded Verification Overlay */}
            {verificationUrl && (
                <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col p-4 md:p-8 animate-in fade-in duration-300">
                    <div className="max-w-4xl w-full mx-auto flex-1 flex-col flex bg-[#0d1117] border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-[#f5a623]/10">
                        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#0f1419]">
                            <div className="flex items-center gap-3">
                                <div className="h-6 w-6 bg-[#f5a623]/10 rounded flex items-center justify-center">
                                    <ShieldCheck className="h-3 w-3 text-[#f5a623]" />
                                </div>
                                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Secure Identity Verification</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setVerificationUrl(null)}
                                className="text-[#8b949e] hover:text-white text-[10px] font-bold uppercase"
                            >
                                Cancel Flow
                            </Button>
                        </div>
                        <div className="flex-1 bg-white">
                            <iframe
                                src={verificationUrl}
                                className="w-full h-full border-none"
                                allow="camera; microphone; geolocation"
                            />
                        </div>
                    </div>
                    <p className="text-center mt-4 text-[10px] text-[#8b949e] uppercase tracking-[0.2em]">
                        Your verification progress is automatically saved
                    </p>
                </div>
            )}

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-8">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-[#f5a623]/10 rounded-lg flex items-center justify-center border border-[#f5a623]/20">
                            <ShieldCheck className="h-4 w-4 text-[#f5a623]" />
                        </div>
                        <h1 className="text-xl font-bold text-white uppercase tracking-tight">Identity Verification</h1>
                    </div>
                    <p className="text-[10px] font-bold text-[#8b949e] uppercase tracking-[0.2em] ml-11">
                        Powered by Didit Identity
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleReset}
                        className="text-red-500/70 hover:text-red-500 text-[10px] font-bold uppercase tracking-widest px-4 h-9 rounded-lg hover:bg-white/5 transition-all"
                        disabled={isConnecting}
                    >
                        Reset
                    </Button>
                </div>
            </div>

            {/* Progress Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                <div className="bg-[#0f1419] border border-white/5 rounded-2xl p-6 space-y-4">
                    <div className="h-10 w-10 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20">
                        <FileText className="h-5 w-5 text-blue-500" />
                    </div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-tight">Fast Onboarding</h3>
                    <p className="text-[10px] text-[#8b949e] font-medium leading-relaxed italic">"Verify your ID in less than 2 minutes using Didit's secure flow."</p>
                </div>
                <div className="bg-[#0f1419] border border-white/5 rounded-2xl p-6 space-y-4">
                    <div className="h-10 w-10 bg-purple-500/10 rounded-lg flex items-center justify-center border border-purple-500/20">
                        <Lock className="h-5 w-5 text-purple-500" />
                    </div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-tight">Secure & Private</h3>
                    <p className="text-[10px] text-[#8b949e] font-medium leading-relaxed italic">"Your data is encrypted and handled by world-class security standards."</p>
                </div>
                <div className="bg-[#0f1419] border border-white/5 rounded-2xl p-6 space-y-4">
                    <div className="h-10 w-10 bg-green-500/10 rounded-lg flex items-center justify-center border border-green-500/20">
                        <ShieldCheck className="h-5 w-5 text-green-500" />
                    </div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-tight">Verified Badge</h3>
                    <p className="text-[10px] text-[#8b949e] font-medium leading-relaxed italic">"Instantly unlock the Verified Seller badge once approved."</p>
                </div>
            </div>

            {/* Status Content */}
            <div className="bg-[#0d1117] border border-white/5 rounded-2xl p-10 max-w-3xl mx-auto space-y-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <ShieldCheck className="h-64 w-64 text-white" />
                </div>

                <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                    <div className={cn(
                        "h-24 w-24 rounded-3xl flex items-center justify-center transform rotate-12 transition-all duration-500 shadow-2xl",
                        status === "APPROVED" ? "bg-green-500/10 text-green-500 shadow-green-500/20" :
                            status === "PENDING" ? "bg-blue-500/10 text-blue-500 shadow-blue-500/20" :
                                "bg-[#f5a623]/10 text-[#f5a623] shadow-[#f5a623]/20"
                    )}>
                        {status === "APPROVED" ? <CheckCircle2 className="h-12 w-12" /> :
                            status === "PENDING" ? <Clock className="h-12 w-12" /> :
                                <ShieldCheck className="h-12 w-12" />}
                    </div>

                    <div className="space-y-2">
                        <span className="text-[10px] font-bold text-[#8b949e] uppercase tracking-[0.3em]">Official Seller Verification</span>
                        <h2 className="text-3xl font-bold text-white uppercase tracking-tight">
                            {status === "NOT_SUBMITTED" ? "Verification Required" :
                                status === "PENDING" ? "Review Pending" :
                                    "Identity Verified"}
                        </h2>
                        <p className="text-sm text-[#8b949e] max-w-md mx-auto">
                            {status === "NOT_SUBMITTED" ? "To protect our community and unlock seller features, some basic identity checks are required." :
                                status === "PENDING" ? "We've received your application. Our security partners are finalizing the review." :
                                    "Congratulations! You've successfully verified your identity."}
                        </p>
                    </div>
                </div>

                <div className="space-y-6 relative z-10">
                    {status === "NOT_SUBMITTED" && (
                        <div className="space-y-4">
                            <Button
                                className="w-full bg-[#f5a623] hover:bg-[#e09612] text-black font-bold h-14 rounded-2xl text-[12px] uppercase tracking-widest transition-all shadow-xl shadow-[#f5a623]/20 group"
                                onClick={handleStartVerification}
                                disabled={isConnecting}
                            >
                                {isConnecting ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Connecting to Didit...
                                    </>
                                ) : (verificationUrl ? "Verification in Progress..." : (
                                    <>
                                        Start Verification Center
                                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                ))}
                            </Button>
                            <p className="text-center text-[10px] text-[#8b949e] uppercase tracking-widest">
                                Safe & SECURE • WORLDWIDE COVERAGE • <span className="text-white">FREE</span>
                            </p>
                        </div>
                    )}

                    {status === "PENDING" && (
                        <div className="bg-[#161b22] border border-blue-500/10 rounded-2xl p-6 flex flex-col items-center text-center space-y-4">
                            <div className="flex items-center gap-2 text-blue-500">
                                <Clock className="h-4 w-4" />
                                <span className="text-xs font-bold uppercase tracking-widest">Awaiting Decision</span>
                            </div>
                            <p className="text-[11px] font-medium text-[#8b949e] leading-relaxed italic max-w-sm">
                                "Didit is currently matching your ID with your biometric face scan. This process is usually automated and takes less than 1 hour."
                            </p>
                            <Button
                                variant="outline"
                                className="border-white/5 text-[#8b949e] hover:text-white hover:bg-white/5 h-10 px-6 rounded-xl text-[10px] uppercase tracking-widest"
                                onClick={() => window.location.reload()}
                            >
                                Refresh Status
                            </Button>
                        </div>
                    )}

                    {status === "APPROVED" && (
                        <div className="bg-green-500/5 border border-green-500/10 rounded-2xl p-8 flex flex-col items-center text-center space-y-4">
                            <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mb-2">
                                <CheckCircle2 className="h-6 w-6" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-white uppercase tracking-tight">Seller Badge Active</p>
                                <p className="text-[11px] font-medium text-[#8b949e]">Your identity has been verified. You can now list items and withdraw earnings.</p>
                            </div>
                            <Button
                                className="mt-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 h-10 px-8 rounded-xl text-[10px] uppercase tracking-widest"
                                onClick={() => router.push("/dashboard/wallet")}
                            >
                                Manage Wallet
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Simple FAQ/Footer info */}
            <div className="max-w-xl mx-auto text-center space-y-4 pt-4">
                <div className="flex items-center justify-center gap-4 text-[#8b949e]">
                    <div className="flex items-center gap-1.5 grayscale opacity-50">
                        <ShieldCheck className="h-4 w-4" />
                        <span className="text-[10px] font-bold uppercase tracking-tighter">Encrypted</span>
                    </div>
                    <div className="h-1 w-1 rounded-full bg-white/10" />
                    <div className="flex items-center gap-1.5 grayscale opacity-50">
                        <Lock className="h-4 w-4" />
                        <span className="text-[10px] font-bold uppercase tracking-tighter">Compliance</span>
                    </div>
                </div>
                <p className="text-[9px] text-[#8b949e] uppercase tracking-widest leading-loose max-w-xs mx-auto">
                    By proceeding, you agree to the ID verification terms provided by Didit on behalf of Chaos Labs.
                </p>
            </div>
        </div>
    );
}
