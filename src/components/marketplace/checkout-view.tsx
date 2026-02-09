"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    ChevronLeft,
    ShieldCheck,
    Zap,
    Lock,
    Clock,
    CreditCard,
    Bitcoin,
    CheckCircle2,
    AlertCircle,
    Loader2,
    ArrowRight,
    MessageSquare,
    Info
} from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { StripeProvider } from "@/components/stripe/stripe-provider";
import { CheckoutForm } from "@/components/stripe/checkout-form";
import { toast } from "sonner";
import Image from "next/image";
import { calculateOrderTotal } from "@/lib/utils/fees";

interface CheckoutViewProps {
    listing: any;
    isShieldActive?: boolean;
}

export function CheckoutView({ listing, isShieldActive = false }: CheckoutViewProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const quantityParam = searchParams.get("quantity");
    const quantity = quantityParam ? parseInt(quantityParam) : (listing.minQuantity || 1);

    const [paymentMethod, setPaymentMethod] = useState<"card" | "crypto" | "google_pay">("card");
    const [deliveryData, setDeliveryData] = useState("");
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Initial Calculation using shared utility
    const unitPrice = Number(listing.price);
    const subtotal = unitPrice * quantity;
    const initialCalc = calculateOrderTotal(subtotal, isShieldActive);

    // Normalize initial state to match UI expectations
    const [summary, setSummary] = useState({
        subtotal: initialCalc.targetAmount,
        fee: initialCalc.serviceFee,
        discount: initialCalc.discount,
        total: initialCalc.total
    });

    useEffect(() => {
        handleInitiateCheckout(paymentMethod);
    }, []);

    const handleInitiateCheckout = async (method: string) => {
        setIsLoading(true);
        setClientSecret(null);
        console.log(`[Checkout] Initiating ${method} payment...`);
        try {
            const response = await fetch("/api/orders/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    listingId: listing.id,
                    quantity: quantity,
                    paymentMethod: method === "crypto" ? "crypto" : "card",
                    isShieldActive: isShieldActive
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(`[Checkout] Success:`, data);
                setClientSecret(data.clientSecret);
                setOrderId(data.orderId);
                // Update summary with confirmed server data
                setSummary({
                    subtotal: data.subtotal,
                    fee: data.fee,
                    total: data.total,
                    discount: isShieldActive ? (data.subtotal * 0.05) : 0
                });
            } else {
                const err = await response.json();
                console.error(`[Checkout] Error Response:`, err);
                toast.error(err.error || "Failed to initiate checkout");
            }
        } catch (error) {
            console.error(`[Checkout] Fetch Error:`, error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuccess = () => {
        toast.success("Payment successful! Redirecting to your order...");
        setTimeout(() => {
            router.push(`/dashboard/orders/${orderId}`);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-[#0a0e13] text-white font-sans selection:bg-[#f5a623]/30">
            {/* Top Navigation - Compact */}
            <div className="border-b border-white/5 bg-[#0d1117]/40 backdrop-blur-xl sticky top-0 z-50 h-16">
                <div className="max-w-[1000px] mx-auto px-6 h-full flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#8b949e] hover:text-white transition-colors group"
                    >
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-[#f5a623]/20 group-hover:text-[#f5a623] transition-all border border-white/5">
                            <ChevronLeft className="h-4 w-4" />
                        </div>
                        Back
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#f5a623]/10 flex items-center justify-center text-[#f5a623]">
                            <Lock className="h-4 w-4" />
                        </div>
                        <h1 className="text-sm font-black uppercase tracking-wide">Secure Checkout</h1>
                    </div>
                    <div className="w-20 hidden md:block" />
                </div>
            </div>

            <main className="max-w-[1100px] mx-auto px-6 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                        {/* Product Card - Ultra Compact */}
                        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-[#0d1117]/50 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden group hover:border-[#f5a623]/20 transition-all duration-500">
                                <div className="flex flex-col sm:flex-row h-full">
                                    <div className="w-full sm:w-32 aspect-square sm:aspect-auto relative bg-[#010409]">
                                        {listing.images?.[0]?.url ? (
                                            <Image
                                                src={listing.images[0].url}
                                                alt={listing.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1c2128] to-[#0d1117]">
                                                <Zap className="h-8 w-8 text-[#f5a623]/20" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                    </div>
                                    <div className="flex-1 p-4 flex flex-col justify-between gap-2">
                                        <div className="space-y-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h2 className="text-base font-black uppercase tracking-tight leading-tight">{listing.title}</h2>
                                                <Badge className="bg-[#f5a623] text-black border-none font-black uppercase text-[8px] tracking-wider px-1.5 py-0 rounded">
                                                    {listing.game?.name || "Game Assets"}
                                                </Badge>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3 text-[#8b949e] text-[9px] font-bold uppercase tracking-wider">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3 text-[#f5a623]" />
                                                    <span>{listing.deliveryTime} DELIVERY</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Zap className="h-3 w-3 text-blue-400" />
                                                    <span>{quantity} UNITS</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                                            <div className="relative w-6 h-6 rounded-full bg-[#f5a623]/20 border border-white/10 overflow-hidden">
                                                {listing.seller?.avatar ? (
                                                    <Image src={listing.seller.avatar} alt={listing.seller.username} fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center font-black text-[#f5a623] text-[10px]">
                                                        {listing.seller?.username?.[0].toUpperCase() || "S"}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-[10px] font-bold text-white/70">{listing.seller?.username || "Trusted Seller"}</span>
                                            {isShieldActive && (
                                                <div className="ml-auto flex items-center gap-1 text-[#22c55e] text-[8px] font-black uppercase tracking-wider bg-green-500/5 px-1.5 py-0.5 rounded border border-green-500/10">
                                                    <ShieldCheck className="h-2.5 w-2.5" />
                                                    Shield
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Payment Methods - Compact Grid */}
                        <section className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
                            <div className="flex items-center gap-2">
                                <CreditCard className="h-3 w-3 text-[#8b949e]" />
                                <h3 className="text-[10px] font-black uppercase tracking-wider text-[#8b949e]">Select Payment</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                {[
                                    { id: "card", label: "Card", icon: <CreditCard className="h-4 w-4" /> },
                                    { id: "google_pay", label: "GPay", icon: <span className="font-black text-[10px]">GPay</span> },
                                    { id: "crypto", label: "Crypto", icon: <Bitcoin className="h-4 w-4" /> }
                                ].map((method) => (
                                    <button
                                        key={method.id}
                                        onClick={() => {
                                            setPaymentMethod(method.id as any);
                                            handleInitiateCheckout(method.id);
                                        }}
                                        className={cn(
                                            "flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border transition-all duration-300",
                                            paymentMethod === method.id
                                                ? "bg-[#f5a623]/10 border-[#f5a623] text-white"
                                                : "bg-[#0d1117]/50 border-white/5 text-[#8b949e] hover:bg-white/5"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-7 h-7 rounded-lg flex items-center justify-center transition-colors",
                                            paymentMethod === method.id ? "bg-[#f5a623] text-black" : "bg-white/5"
                                        )}>
                                            {method.icon}
                                        </div>
                                        <span className="text-[9px] font-black uppercase tracking-wider">{method.label}</span>
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Stripe Form Overlay */}
                        {paymentMethod === "card" && clientSecret && deliveryData && (
                            <section className="animate-in zoom-in-95 fade-in duration-300">
                                <div className="bg-[#0d1117]/50 backdrop-blur-md border border-[#f5a623]/20 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#f5a623] to-transparent" />
                                    <div className="flex items-center gap-2 mb-4">
                                        <Lock className="h-3 w-3 text-[#f5a623]" />
                                        <h3 className="text-[10px] font-black uppercase tracking-wider text-white">Secure Card Entry</h3>
                                    </div>
                                    <StripeProvider clientSecret={clientSecret}>
                                        <CheckoutForm
                                            amount={summary?.total || initialCalc.total}
                                            onSuccess={handleSuccess}
                                        />
                                    </StripeProvider>
                                    <div className="flex items-center justify-center gap-1 mt-4 text-[8px] text-[#8b949e] font-bold uppercase tracking-widest opacity-60">
                                        <Lock className="h-2 w-2" />
                                        Encrypted SSL Secure Processing
                                    </div>
                                </div>
                            </section>
                        )}

                        {paymentMethod === "crypto" && (
                            <section className="animate-in zoom-in-95 fade-in duration-300">
                                <div className="bg-[#0d1117]/50 border border-white/5 p-4 rounded-2xl backdrop-blur-sm">
                                    <div className="p-3 rounded-xl bg-[#f5a623]/5 border border-[#f5a623]/20 space-y-2 text-center">
                                        <Bitcoin className="h-6 w-6 text-[#f5a623] mx-auto opacity-50" />
                                        <div className="font-mono text-[10px] bg-black p-2 rounded-lg break-all text-center border border-white/10 select-all text-[#f5a623]">
                                            1A2b3C4d5E6f7
                                        </div>
                                        <p className="text-[8px] text-[#8b949e] font-black uppercase tracking-widest leading-none">Payments processed after confirmation.</p>
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column: Delivery + Summary */}
                    <div className="space-y-4">
                        {/* Delivery Details - Moved Above Summary */}
                        <section className="space-y-2 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="flex items-center gap-2">
                                <MessageSquare className="h-3 w-3 text-[#8b949e]" />
                                <h3 className="text-[10px] font-black uppercase tracking-wider text-[#8b949e]">Delivery Details</h3>
                            </div>
                            <div className="bg-[#0d1117]/50 border border-white/5 p-4 rounded-2xl space-y-2 backdrop-blur-sm">
                                <Input
                                    placeholder="Character Name / Account Details..."
                                    className="h-10 bg-[#010409] border-white/5 focus:border-[#f5a623]/50 focus:ring-0 text-white font-medium rounded-xl transition-all px-3 text-xs"
                                    value={deliveryData}
                                    onChange={(e) => setDeliveryData(e.target.value)}
                                />
                                <div className="flex items-start gap-1.5">
                                    <Info className="h-2.5 w-2.5 text-[#f5a623] mt-0.5" />
                                    <p className="text-[9px] font-bold text-[#8b949e] uppercase tracking-wide leading-tight">Double check your details to ensure instant delivery.</p>
                                </div>
                            </div>
                        </section>

                        <div className="sticky top-20 space-y-4 animate-in fade-in slide-in-from-right-4 duration-500 delay-150">
                            <div className="bg-[#0d1117] border border-[#f5a623]/20 rounded-2xl p-5 space-y-5 shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#f5a623] to-transparent" />

                                <h3 className="text-sm font-black uppercase tracking-tight">Order Summary</h3>

                                <div className="space-y-2.5">
                                    <div className="space-y-2 pt-2 border-t border-white/5">
                                        <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-wider">
                                            <span className="text-[#8b949e]">Subtotal</span>
                                            <span className="text-white">${formatPrice(summary?.subtotal || subtotal, 2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-wider">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-[#8b949e]">Service Fees</span>
                                                <div className="group relative cursor-help">
                                                    <Info className="h-2.5 w-2.5 text-[#8b949e]" />
                                                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-32 p-2 bg-black border border-white/10 rounded-lg text-[8px] text-center hidden group-hover:block z-50">
                                                        Includes verification & secure processing
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="text-white">${formatPrice(summary?.fee || initialCalc.serviceFee, 2)}</span>
                                        </div>
                                        {isShieldActive && (
                                            <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-wider text-[#f5a623]">
                                                <span>iShield Discount</span>
                                                <span>-${formatPrice(summary?.discount || (initialCalc.targetAmount - initialCalc.total + initialCalc.serviceFee), 2)}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-3 border-t border-white/5 flex justify-between items-end">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#f5a623]">Total</span>
                                        <span className="text-2xl font-black text-white leading-none tracking-tighter">
                                            <span className="text-sm text-[#f5a623] mr-0.5">$</span>
                                            {formatPrice(summary?.total || initialCalc.total, 2)}
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    {(paymentMethod !== "card" || !clientSecret) && (
                                        <Button
                                            disabled={isLoading || isProcessing || !deliveryData}
                                            className={cn(
                                                "w-full h-11 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 relative overflow-hidden group shadow-lg",
                                                paymentMethod === "card" ? "bg-[#f5a623] hover:bg-[#e09612] text-black" : "bg-white hover:bg-white/90 text-black"
                                            )}
                                            onClick={() => {
                                                if (paymentMethod === "crypto") {
                                                    toast.info("Initializing crypto gateway...");
                                                } else if (paymentMethod === "card" && !clientSecret) {
                                                    handleInitiateCheckout("card");
                                                }
                                            }}
                                        >
                                            <div className="relative z-10 flex items-center justify-center gap-1.5">
                                                {isLoading ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <>
                                                        {paymentMethod === "card" && !clientSecret ? "Initialize Card" : paymentMethod === "card" ? "Pay Now" : "Confirm Order"}
                                                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                                                    </>
                                                )}
                                            </div>
                                        </Button>
                                    )}

                                    {!deliveryData && (
                                        <div className="flex justify-center items-center gap-1.5 mt-3 p-1.5 bg-[#df1b41]/5 border border-[#df1b41]/10 rounded-lg">
                                            <AlertCircle className="h-2.5 w-2.5 text-[#df1b41]" />
                                            <p className="text-[8px] font-bold text-[#df1b41] uppercase tracking-wide">
                                                Fill Details to Pay
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center justify-center gap-1 pt-1 text-[8px] text-[#8b949e] font-bold uppercase tracking-widest opacity-60">
                                    <Lock className="h-2 w-2" />
                                    SSL Secure
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
