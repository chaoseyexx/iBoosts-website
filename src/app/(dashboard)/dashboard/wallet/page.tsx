"use client";

import * as React from "react";
import {
    Wallet,
    ArrowUpRight,
    ArrowDownLeft,
    DollarSign,
    Clock,
    CreditCard,
    Building2,
    Bitcoin,
    ChevronDown,
    Search,
    Download,
    Eye,
    EyeOff,
    CheckCircle2,
    XCircle,
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// --- Mock Data ---

const TRANSACTIONS = [
    {
        id: "TRX-9982",
        type: "withdrawal",
        amount: -150.00,
        status: "pending",
        method: "PayPal",
        date: "Today, 10:30 AM",
        description: "Payout to seller@email.com"
    },
    {
        id: "TRX-8821",
        type: "sale",
        amount: 45.00,
        status: "completed",
        method: "Balance",
        date: "Yesterday, 2:15 PM",
        description: "Sale: Level 1-70 Powerleveling"
    },
    {
        id: "TRX-7732",
        type: "purchase",
        amount: -12.50,
        status: "completed",
        method: "CC ending 4242",
        date: "Oct 22, 2024",
        description: "Purchase: 1000 Gold"
    },
    {
        id: "TRX-6621",
        type: "sale",
        amount: 142.00,
        status: "available", // funds cleared
        method: "Balance",
        date: "Oct 20, 2024",
        description: "Sale: Rare Mount Drop"
    }
];

export default function WalletPage() {
    const [balanceHidden, setBalanceHidden] = React.useState(false);
    const [withdrawOpen, setWithdrawOpen] = React.useState(false);
    const [withdrawStep, setWithdrawStep] = React.useState(1);

    // Withdrawal Form State
    const [amount, setAmount] = React.useState("");
    const [method, setMethod] = React.useState("paypal");

    const availableBalance = 245.50;
    const pendingBalance = 150.00;

    const handleWithdrawSubmit = () => {
        setWithdrawStep(2); // Show success state
        setTimeout(() => {
            setWithdrawOpen(false);
            setWithdrawStep(1);
            setAmount("");
        }, 2000);
    };

    return (
        <div className="space-y-8 pb-12">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-white">Wallet</h1>
                    <p className="text-sm text-[#8b949e]">Manage your global earnings & payouts</p>
                </div>
                <div className="flex items-center gap-3">
                    <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-[#f5a623] hover:bg-[#e09612] text-black font-bold h-11 px-6 shadow-lg shadow-[#f5a623]/20">
                                <ArrowUpRight className="h-4 w-4 mr-2" />
                                Withdraw Funds
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#1c2128] border-[#2d333b] text-white sm:max-w-[425px]">
                            {withdrawStep === 1 ? (
                                <>
                                    <DialogHeader>
                                        <DialogTitle className="text-xl font-bold flex items-center gap-2 text-white">
                                            <Wallet className="h-5 w-5 text-[#f5a623]" />
                                            Withdraw Funds
                                        </DialogTitle>
                                        <DialogDescription className="text-[#9ca3af] font-medium">
                                            Transfer your earnings to your preferred account.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="grid gap-6 py-4">

                                        {/* Amount Input */}
                                        <div className="space-y-2">
                                            <Label className="text-white font-bold">Amount to withdraw</Label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#f5a623] font-bold">$</span>
                                                <Input
                                                    type="number"
                                                    placeholder="0.00"
                                                    value={amount}
                                                    onChange={(e) => setAmount(e.target.value)}
                                                    className="pl-7 bg-[#0a0e13] border-[#2d333b] text-white focus:border-[#f5a623] h-11 text-lg font-bold shadow-sm"
                                                />
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9ca3af] font-bold">
                                                    Max: ${availableBalance.toFixed(2)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Method Selection */}
                                        <div className="space-y-2">
                                            <Label className="text-white font-bold">Payout Method</Label>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div
                                                    onClick={() => setMethod("paypal")}
                                                    className={cn(
                                                        "cursor-pointer border rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all",
                                                        method === "paypal" ? "bg-[#f5a623]/10 border-[#f5a623] text-[#f5a623] shadow-inner" : "bg-[#0a0e13] border-[#2d333b] text-[#8b949e] hover:border-[#f5a623]/50 hover:bg-[#1c2128]"
                                                    )}
                                                >
                                                    <CreditCard className="h-6 w-6" />
                                                    <span className="text-xs font-bold">PayPal</span>
                                                </div>
                                                <div
                                                    onClick={() => setMethod("crypto")}
                                                    className={cn(
                                                        "cursor-pointer border rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all",
                                                        method === "crypto" ? "bg-[#f5a623]/10 border-[#f5a623] text-[#f5a623] shadow-inner" : "bg-[#0a0e13] border-[#2d333b] text-[#8b949e] hover:border-[#f5a623]/50 hover:bg-[#1c2128]"
                                                    )}
                                                >
                                                    <Bitcoin className="h-6 w-6" />
                                                    <span className="text-xs font-bold">Crypto (USDT)</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Fee info */}
                                        <div className="bg-[#0a0e13] p-4 rounded-xl border border-[#2d333b] space-y-3">
                                            <div className="flex justify-between text-xs font-medium">
                                                <span className="text-[#9ca3af]">Withdrawal Amount</span>
                                                <span className="text-white font-bold">${amount || '0.00'}</span>
                                            </div>
                                            <div className="flex justify-between text-xs font-medium">
                                                <span className="text-[#9ca3af]">Transaction Fee (2%)</span>
                                                <span className="text-white font-bold">${(Number(amount || 0) * 0.02).toFixed(2)}</span>
                                            </div>
                                            <div className="h-px bg-[#2d333b]" />
                                            <div className="flex justify-between text-sm font-bold">
                                                <span className="text-[#f5a623]">You Receive</span>
                                                <span className="text-[#f5a623]">${(Number(amount || 0) * 0.98).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <DialogFooter>
                                        <Button
                                            onClick={handleWithdrawSubmit}
                                            className="w-full bg-[#f5a623] hover:bg-[#e09612] text-black font-bold h-11"
                                            disabled={!amount || Number(amount) <= 0 || Number(amount) > availableBalance}
                                        >
                                            Submit Request
                                        </Button>
                                    </DialogFooter>
                                </>
                            ) : (
                                <div className="py-12 flex flex-col items-center text-center space-y-4">
                                    <div className="h-20 w-20 rounded-full bg-[#f5a623]/10 flex items-center justify-center shadow-[0_0_20px_rgba(245,166,35,0.2)] border border-[#f5a623]/20">
                                        <CheckCircle2 className="h-10 w-10 text-[#f5a623]" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-semibold text-white tracking-tight uppercase">Request Submitted!</h3>
                                        <p className="text-sm font-bold text-[#8b949e] uppercase tracking-widest max-w-[280px]">
                                            Your withdrawal of <span className="text-white font-semibold">${amount}</span> is being processed.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Balances Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Available Balance */}
                <Card className="bg-gradient-to-br from-[#0d1117] to-black border-[#f5a623]/20 p-5 relative overflow-hidden group shadow-2xl hover:border-[#f5a623]/40 transition-all duration-500 backdrop-blur-xl">
                    <div className="absolute -right-4 -top-4 p-24 bg-[#f5a623] opacity-[0.05] rounded-full blur-3xl group-hover:opacity-[0.1] transition-opacity" />
                    <div className="absolute -left-4 -bottom-4 p-24 bg-[#00d2ff] opacity-[0.02] rounded-full blur-3xl" />

                    <div className="relative z-10 flex justify-between items-start mb-4">
                        <div className="h-10 w-10 bg-white/[0.03] rounded-xl border border-white/[0.05] flex items-center justify-center backdrop-blur-md shadow-inner">
                            <Wallet className="h-5 w-5 text-[#f5a623] drop-shadow-[0_0_8px_rgba(245,166,35,0.4)]" />
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setBalanceHidden(!balanceHidden)} className="text-[#8b949e] hover:text-white transition-colors">
                            {balanceHidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                    </div>

                    <div className="relative z-10">
                        <p className="text-[10px] font-semibold text-[#f5a623] tracking-[0.2em] uppercase mb-1">Available Balance</p>
                        <h2 className="text-3xl font-semibold text-white tracking-tighter">
                            {balanceHidden ? "****" : `$${availableBalance.toFixed(2)}`}
                        </h2>
                        <div className="flex items-center gap-2 mt-4 text-[10px] font-semibold text-white bg-white/[0.04] w-fit px-3 py-1.5 rounded-full border border-white/[0.05] backdrop-blur-sm">
                            <ArrowUpRight className="h-3.5 w-3.5 text-[#f5a623]" />
                            <span className="uppercase tracking-widest">+12.4% <span className="text-[#8b949e] ml-1">THIS MONTH</span></span>
                        </div>
                    </div>
                </Card>

                {/* Pending Balance (Escrow) */}
                <Card className="bg-[#0a0e13]/80 border-white/[0.05] p-5 relative overflow-hidden backdrop-blur-xl shadow-2xl hover:border-white/[0.1] transition-all group">
                    <div className="relative z-10 flex justify-between items-start mb-4">
                        <div className="h-10 w-10 bg-white/[0.03] rounded-xl border border-white/[0.05] flex items-center justify-center">
                            <Clock className="h-5 w-5 text-[#8b949e] group-hover:text-white transition-colors" />
                        </div>
                    </div>

                    <div className="relative z-10">
                        <p className="text-[10px] font-semibold text-[#8b949e] tracking-[0.2em] uppercase mb-1">Pending (Escrow)</p>
                        <h2 className="text-3xl font-semibold text-white tracking-tighter">
                            {balanceHidden ? "****" : `$${pendingBalance.toFixed(2)}`}
                        </h2>
                        <p className="text-[9px] font-semibold text-[#8b949e] mt-4 flex items-center gap-2 uppercase tracking-[0.2em]">
                            <AlertCircle className="h-3.5 w-3.5 text-[#f5a623]" />
                            Funds secured by iboosts
                        </p>
                    </div>
                </Card>

                {/* Total Processed */}
                <Card className="bg-[#0a0e13]/80 border-white/[0.05] p-5 relative overflow-hidden backdrop-blur-xl shadow-2xl hover:border-white/[0.1] transition-all group">
                    <div className="relative z-10 flex justify-between items-start mb-4">
                        <div className="h-10 w-10 bg-white/[0.03] rounded-xl border border-white/[0.05] flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-[#8b949e] group-hover:text-white transition-colors" />
                        </div>
                    </div>

                    <div className="relative z-10">
                        <p className="text-[10px] font-semibold text-[#8b949e] tracking-[0.2em] uppercase mb-1">Lifetime Earnings</p>
                        <h2 className="text-3xl font-semibold text-white tracking-tighter">
                            {balanceHidden ? "****" : `$4,892.50`}
                        </h2>
                        <p className="text-[9px] font-semibold text-[#8b949e] mt-4 flex items-center gap-2 uppercase tracking-[0.2em]">
                            <ArrowUpRight className="h-3.5 w-3.5 text-[#f5a623]" />
                            Global platform total
                        </p>
                    </div>
                </Card>
            </div>

            {/* Transactions Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white tracking-tighter uppercase">Transaction History</h2>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8b949e]" />
                            <Input placeholder="SEARCH TRANSACTION..." className="pl-9 h-11 w-[240px] bg-[#0d1117] border-white/[0.05] text-white text-[10px] font-semibold tracking-widest shadow-inner focus:border-[#f5a623]/50 focus:ring-0" />
                        </div>
                        <Button variant="outline" className="h-11 border-[#2d333b] bg-[#1c2128] text-[#9ca3af] hover:text-white hover:bg-[#212832] font-bold px-6 border-dashed">
                            <Download className="h-4 w-4 mr-2" />
                            Export CSV
                        </Button>
                    </div>
                </div>

                <Card className="bg-[#0d1117] border-[#2d333b] overflow-hidden shadow-2xl">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-[#2d333b] bg-white/[0.02]">
                                <th className="p-4 text-[10px] font-semibold text-[#8b949e] uppercase tracking-[0.2em]">Transaction Details</th>
                                <th className="p-4 text-[10px] font-semibold text-[#8b949e] uppercase tracking-[0.2em]">Type</th>
                                <th className="p-4 text-[10px] font-semibold text-[#8b949e] uppercase tracking-[0.2em]">Amount (USD)</th>
                                <th className="p-4 text-[10px] font-semibold text-[#8b949e] uppercase tracking-[0.2em]">Status</th>
                                <th className="p-4 text-[10px] font-semibold text-[#8b949e] uppercase tracking-[0.2em] text-right">Date & Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2d333b]/30">
                            {TRANSACTIONS.map((trx) => (
                                <tr key={trx.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "h-12 w-12 rounded-2xl flex items-center justify-center border transition-all duration-300 shadow-xl",
                                                trx.type === 'withdrawal' ? "bg-red-500/5 border-red-500/20 text-red-500" :
                                                    trx.type === 'sale' ? "bg-[#f5a623]/10 border-[#f5a623]/20 text-[#f5a623]" :
                                                        "bg-white/5 border-white/10 text-white"
                                            )}>
                                                {trx.type === 'withdrawal' && <ArrowUpRight className="h-5 w-5" />}
                                                {trx.type === 'sale' && <ArrowDownLeft className="h-5 w-5" />}
                                                {trx.type === 'purchase' && <CreditCard className="h-5 w-5" />}
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-white tracking-tight uppercase">{trx.description}</div>
                                                <div className="text-[9px] font-semibold text-[#8b949e] uppercase tracking-[0.15em] mt-0.5">{trx.method} • <span className="text-white/20">{trx.id}</span></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <Badge variant="outline" className="capitalize border-white/10 text-[#8b949e] font-semibold bg-white/[0.02] text-[9px] px-2.5 py-1 tracking-widest rounded-md uppercase">
                                            {trx.type}
                                        </Badge>
                                    </td>
                                    <td className="p-4">
                                        <span className={cn(
                                            "text-lg font-semibold tracking-tighter",
                                            trx.amount > 0 ? "text-[#f5a623]" : "text-white"
                                        )}>
                                            {trx.amount > 0 ? "+" : ""}{trx.amount.toFixed(2)}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className={cn(
                                            "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-semibold uppercase tracking-[0.15em] border backdrop-blur-md shadow-lg",
                                            trx.status === 'completed' || trx.status === 'available' ? "bg-[#f5a623]/5 text-[#f5a623] border-[#f5a623]/20" :
                                                trx.status === 'pending' ? "bg-white/5 text-white/50 border-white/10" :
                                                    "bg-red-500/5 text-red-500 border-red-500/20"
                                        )}>
                                            {trx.status === 'completed' || trx.status === 'available' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                                            {trx.status}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right text-[10px] font-semibold text-[#8b949e] uppercase tracking-wider">
                                        {trx.date}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            </div>

        </div>
    );
}
