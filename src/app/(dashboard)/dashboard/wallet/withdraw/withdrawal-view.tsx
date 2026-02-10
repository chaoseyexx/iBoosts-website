"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    ChevronLeft,
    Check,
    Building2,
    Loader2,
    CreditCard,
    Zap,
    Coins
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { PayoutSetupForm } from "@/components/dashboard/payout-setup-form";

interface BankInfo {
    bankName: string;
    last4: string;
    currency: string;
    country: string;
}

interface WalletWithdrawalViewProps {
    balance: number;
    stripeConnected: boolean;
    bankInfo: BankInfo | null;
}

const WITHDRAWAL_METHODS = [
    {
        id: 'stripe' as const,
        label: 'Bank Transfer',
        sublabel: 'Connect via Stripe',
        icon: <Building2 className="h-4 w-4" />,
        minAmount: 10,
        feeFlat: 2.00,
        feePercent: 0.04,
        details: [
            "Direct transfer to your connected bank account.",
            "Funds arrive within 1-3 business days.",
            "Standard payouts: 4% fee + $2.00 flat."
        ]
    },
    {
        id: 'crypto_usdt' as const,
        label: 'USDT (TRC20)',
        sublabel: 'Tether Stablecoin',
        icon: <Zap className="h-4 w-4" />,
        minAmount: 50,
        feeFlat: 10.00,
        feePercent: 0.04,
        details: [
            "Fast settlement via TRON (TRC20) network.",
            "Usually processed within 24 hours.",
            "Standard Crypto fee: 4% + $10.00 flat."
        ]
    },
    {
        id: 'crypto_ltc' as const,
        label: 'Litecoin (LTC)',
        sublabel: 'Low Network Fee',
        icon: <Coins className="h-4 w-4" />,
        minAmount: 30,
        feeFlat: 10.00,
        feePercent: 0.04,
        details: [
            "Litecoin network settlement.",
            "Usually processed within 12 hours.",
            "Standard Crypto fee: 4% + $10.00 flat."
        ]
    }
];

export function WalletWithdrawalView({ balance, stripeConnected, bankInfo }: WalletWithdrawalViewProps) {
    const [amount, setAmount] = useState<string>("");
    const [selectedMethodId, setSelectedMethodId] = useState<string>(WITHDRAWAL_METHODS[0].id);
    const [cryptoAddress, setCryptoAddress] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showSetupForm, setShowSetupForm] = useState(false);
    const [withdrawSuccess, setWithdrawSuccess] = useState<{ amount: number; received: number; method: string } | null>(null);

    const selectedMethod = WITHDRAWAL_METHODS.find(m => m.id === selectedMethodId) || WITHDRAWAL_METHODS[0];

    const numAmount = Number(amount) || 0;
    const fees = useMemo(() => {
        if (numAmount === 0) return 0;
        return selectedMethod.feeFlat + (numAmount * selectedMethod.feePercent);
    }, [numAmount, selectedMethod]);

    const receiveAmount = Math.max(0, numAmount - fees);

    const handleSubmit = async () => {
        if (numAmount < selectedMethod.minAmount) {
            toast.error(`Minimum withdrawal for ${selectedMethod.label} is $${selectedMethod.minAmount}`);
            return;
        }
        if (numAmount > balance) {
            toast.error("Insufficient balance");
            return;
        }

        if (selectedMethodId === 'stripe' && !stripeConnected) {
            toast.error("Please connect your payout method first.");
            return;
        }

        if (selectedMethodId.startsWith('crypto') && !cryptoAddress) {
            toast.error("Please enter your crypto wallet address.");
            return;
        }

        setIsLoading(true);
        try {
            const apiEndpoint = selectedMethodId === 'stripe' ? "/api/stripe/payout" : "/api/wallet/withdraw";
            const response = await fetch(apiEndpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: numAmount,
                    method: selectedMethodId.toUpperCase(),
                    destination: selectedMethodId === 'stripe' ? "BANK" : cryptoAddress
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Withdrawal failed");

            // Show success state
            setWithdrawSuccess({
                amount: numAmount,
                received: receiveAmount,
                method: selectedMethod.label
            });
            setAmount("");
            setCryptoAddress("");
        } catch (error: any) {
            toast.error(error.message || "Failed to submit request");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-[1000px] mx-auto py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Nav */}
            <Link
                href="/dashboard/wallet"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-[#8b949e] hover:text-white hover:bg-white/10 transition-all"
            >
                <ChevronLeft className="h-3 w-3" />
                Back to wallet
            </Link>

            {/* Main Container */}
            <div className="bg-[#0d1117]/60 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                {withdrawSuccess ? (
                    <div className="p-16 flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 animate-[bounce_1s_infinite]">
                                <Check className="h-12 w-12" />
                            </div>
                            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse" />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Withdrawal Initiated</h2>
                            <p className="text-[#8b949e] max-w-md mx-auto">
                                Your funds are on the way to your connected bank account.
                            </p>
                        </div>

                        <div className="flex flex-col gap-1 p-6 bg-white/5 rounded-2xl border border-white/5 w-full max-w-sm">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e]">Total Withdrawn</span>
                            <div className="text-4xl font-black text-white">
                                ${withdrawSuccess.amount.toFixed(2)}
                            </div>
                            <div className="flex items-center justify-between text-xs text-[#8b949e] pt-4 mt-2 border-t border-white/5">
                                <span>Est. Arrival</span>
                                <span className="text-white font-bold">1-3 Business Days</span>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button
                                variant="outline"
                                onClick={() => window.location.reload()} // Refresh to update balance
                                className="h-12 px-8 border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-widest rounded-xl hover:text-white"
                            >
                                Make Another
                            </Button>
                            <Link href="/dashboard/wallet">
                                <Button
                                    className="h-12 px-8 bg-[#f5a623] hover:bg-[#e09612] text-black font-bold uppercase tracking-widest rounded-xl"
                                >
                                    Back to Wallet
                                </Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="p-10 space-y-10">
                        {/* Header */}
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#f5a623]/10 flex items-center justify-center text-[#f5a623]">
                                <Building2 className="h-6 w-6" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Withdraw Funds</h1>
                                <p className="text-[#8b949e] font-bold uppercase tracking-wider text-xs mt-1">Available Balance: <span className="text-[#f5a623]">${balance.toFixed(2)}</span></p>
                            </div>
                        </div>

                        {/* Method Selection */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {WITHDRAWAL_METHODS.map((method) => (
                                <button
                                    key={method.id}
                                    onClick={() => setSelectedMethodId(method.id)}
                                    className={`p-6 rounded-2xl border transition-all text-left flex flex-col gap-3 group ${selectedMethodId === method.id
                                        ? 'bg-[#f5a623]/10 border-[#f5a623] shadow-[0_0_20px_rgba(245,166,35,0.1)]'
                                        : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${selectedMethodId === method.id ? 'bg-[#f5a623] text-black shadow-[0_0_15px_rgba(245,166,35,0.4)]' : 'bg-white/5 text-white/40'}`}>
                                        {method.icon}
                                    </div>
                                    <div>
                                        <h3 className={`text-sm font-black uppercase tracking-tight ${selectedMethodId === method.id ? 'text-white' : 'text-white/60'}`}>{method.label}</h3>
                                        <p className="text-[10px] text-[#8b949e] font-bold uppercase tracking-widest mt-0.5">{method.sublabel}</p>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {selectedMethodId === 'stripe' && !stripeConnected && (
                            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white">
                                            <Building2 className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black text-white uppercase tracking-tight">Setup Required</h3>
                                            <p className="text-[10px] text-[#8b949e] font-bold uppercase tracking-widest">
                                                Connect your bank account via Stripe to enable transfers.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {stripeConnected && bankInfo && selectedMethodId === 'stripe' && (
                            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                                        <CreditCard className="h-6 w-6 text-blue-400" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-sm font-bold text-white">{bankInfo.bankName}</h4>
                                            <span className="px-2 py-0.5 rounded text-[8px] font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                {bankInfo.currency}
                                            </span>
                                        </div>
                                        <p className="text-xs text-[#8b949e] mt-0.5 font-mono">
                                            •••• •••• •••• {bankInfo.last4}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-[#8b949e]">
                                            {bankInfo.country}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            {/* Form Side */}
                            <div className="space-y-8">
                                {selectedMethodId === 'stripe' && !stripeConnected ? (
                                    showSetupForm ? (
                                        <div className="p-6 border border-white/10 rounded-2xl bg-white/[0.02]">
                                            <PayoutSetupForm onSuccess={() => window.location.reload()} />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center p-8 border border-dashed border-white/10 rounded-2xl bg-white/[0.02] space-y-4 text-center">
                                            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                                <Building2 className="h-6 w-6" />
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="text-sm font-bold text-white uppercase tracking-tight">Connect with Stripe</h3>
                                                <p className="text-[11px] text-[#8b949e]">Add your bank account to receive automated payouts.</p>
                                            </div>
                                            <Button
                                                onClick={() => setShowSetupForm(true)}
                                                className="h-12 bg-[#f5a623] hover:bg-[#e09612] text-black font-bold uppercase text-[10px] tracking-widest px-8"
                                            >
                                                Setup Payouts
                                            </Button>
                                        </div>
                                    )
                                ) : (
                                    <div className="space-y-6">
                                        {selectedMethodId.startsWith('crypto') && (
                                            <div className="space-y-4">
                                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b949e]">{selectedMethod.label} Address</Label>
                                                <Input
                                                    placeholder={`Enter your ${selectedMethod.label} address...`}
                                                    className="h-14 bg-white/[0.03] border-white/5 focus:border-[#f5a623]/50 rounded-2xl"
                                                    value={cryptoAddress}
                                                    onChange={(e) => setCryptoAddress(e.target.value)}
                                                />
                                            </div>
                                        )}

                                        <div className="space-y-4">
                                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b949e]">Amount to withdraw (USD)</Label>
                                            <div className="relative">
                                                <Input
                                                    type="number"
                                                    placeholder="0.00"
                                                    className="h-16 w-full bg-white/[0.03] border-white/5 focus:border-[#f5a623]/50 text-left pl-6 font-black text-2xl rounded-2xl"
                                                    value={amount}
                                                    onChange={(e) => setAmount(e.target.value)}
                                                />
                                                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-sm font-black text-white/20">USD</div>
                                            </div>
                                        </div>

                                        <div className="space-y-3 pt-4">
                                            <div className="flex justify-between items-center text-sm font-bold text-[#8b949e]">
                                                <span>Processing Fees</span>
                                                <span className="text-white">${fees.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center pt-2 border-t border-white/5">
                                                <span className="text-sm font-black text-white uppercase">You will receive</span>
                                                <span className="text-2xl font-black text-[#f5a623]">
                                                    ${receiveAmount.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>

                                        <Button
                                            onClick={handleSubmit}
                                            disabled={isLoading || !amount || Number(amount) <= 0}
                                            className="w-full h-16 bg-[#f5a623] hover:bg-[#e09612] text-black font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-[#f5a623]/10 transition-all hover:scale-[1.02] active:scale-[0.98] mt-4"
                                        >
                                            {isLoading ? (
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    Verify & Withdraw
                                                    <Check className="h-4 w-4" />
                                                </div>
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Info Side */}
                            <div className="bg-black/40 rounded-[2rem] border border-white/5 p-8 self-start space-y-6">
                                <div className="pb-4 border-b border-white/5">
                                    <h3 className="text-lg font-black text-white uppercase tracking-tight">Withdrawal Terms</h3>
                                </div>
                                <ul className="space-y-4">
                                    {selectedMethod.details.map((detail, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-[#8b949e] leading-relaxed">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#f5a623] shrink-0" />
                                            {detail}
                                        </li>
                                    ))}
                                    <li className="flex gap-3 text-xs text-[#8b949e]/50 italic border-t border-white/5 pt-4">
                                        Minimum withdrawal for {selectedMethod.label} is ${selectedMethod.minAmount}.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
