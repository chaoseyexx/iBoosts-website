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
                    <h1 className="text-3xl font-bold text-white tracking-tight">Wallet</h1>
                    <p className="text-[#9ca3af]">Manage your earnings and payouts.</p>
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
                                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                            <Wallet className="h-5 w-5 text-[#f5a623]" />
                                            Withdraw Funds
                                        </DialogTitle>
                                        <DialogDescription className="text-[#9ca3af]">
                                            Transfer your earnings to your preferred account.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="grid gap-6 py-4">

                                        {/* Amount Input */}
                                        <div className="space-y-2">
                                            <Label className="text-white">Amount to withdraw</Label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#f5a623] font-bold">$</span>
                                                <Input
                                                    type="number"
                                                    placeholder="0.00"
                                                    value={amount}
                                                    onChange={(e) => setAmount(e.target.value)}
                                                    className="pl-7 bg-[#0a0e13] border-[#2d333b] text-white focus:border-[#f5a623] h-11 text-lg font-bold"
                                                />
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9ca3af]">
                                                    Max: ${availableBalance.toFixed(2)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Method Selection */}
                                        <div className="space-y-2">
                                            <Label className="text-white">Payout Method</Label>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div
                                                    onClick={() => setMethod("paypal")}
                                                    className={cn(
                                                        "cursor-pointer border rounded-lg p-3 flex flex-col items-center justify-center gap-2 transition-all",
                                                        method === "paypal" ? "bg-[#f5a623]/10 border-[#f5a623] text-[#f5a623]" : "bg-[#0a0e13] border-[#2d333b] text-[#9ca3af] hover:border-[#f5a623]/50"
                                                    )}
                                                >
                                                    <CreditCard className="h-6 w-6" />
                                                    <span className="text-xs font-bold">PayPal</span>
                                                </div>
                                                <div
                                                    onClick={() => setMethod("crypto")}
                                                    className={cn(
                                                        "cursor-pointer border rounded-lg p-3 flex flex-col items-center justify-center gap-2 transition-all",
                                                        method === "crypto" ? "bg-[#f5a623]/10 border-[#f5a623] text-[#f5a623]" : "bg-[#0a0e13] border-[#2d333b] text-[#9ca3af] hover:border-[#f5a623]/50"
                                                    )}
                                                >
                                                    <Bitcoin className="h-6 w-6" />
                                                    <span className="text-xs font-bold">Crypto (USDT)</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Fee info */}
                                        <div className="bg-[#0a0e13] p-3 rounded-lg border border-[#2d333b] space-y-2">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-[#9ca3af]">Withdrawal Amount</span>
                                                <span className="text-white font-medium">${amount || '0.00'}</span>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-[#9ca3af]">Transaction Fee (2%)</span>
                                                <span className="text-white font-medium">${(Number(amount || 0) * 0.02).toFixed(2)}</span>
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
                                    <div className="h-16 w-16 rounded-full bg-[#00b67a]/20 flex items-center justify-center">
                                        <CheckCircle2 className="h-8 w-8 text-[#00b67a]" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">Request Submitted!</h3>
                                        <p className="text-[#9ca3af] text-sm mt-1 max-w-[250px]">
                                            Your withdrawal of <span className="text-white font-bold">${amount}</span> is being processed. Funds typically arrive within 24 hours.
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
                <Card className="bg-[#1c2128] border-[#2d333b] p-6 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-32 bg-[#f5a623] opacity-[0.03] rounded-full blur-3xl group-hover:opacity-[0.08] transition-opacity" />

                    <div className="relative z-10 flex justify-between items-start mb-4">
                        <div className="p-3 bg-[#f5a623]/10 rounded-xl">
                            <Wallet className="h-6 w-6 text-[#f5a623]" />
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setBalanceHidden(!balanceHidden)} className="text-[#9ca3af] hover:text-white">
                            {balanceHidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                    </div>

                    <div className="relative z-10">
                        <p className="text-[#9ca3af] text-sm font-medium">Available Balance</p>
                        <h2 className="text-3xl font-extrabold text-white mt-1 tracking-tight">
                            {balanceHidden ? "****" : `$${availableBalance.toFixed(2)}`}
                        </h2>
                        <div className="flex items-center gap-2 mt-2 text-xs text-[#00b67a] bg-[#00b67a]/10 w-fit px-2 py-1 rounded">
                            <ArrowUpRight className="h-3 w-3" />
                            +12% vs last month
                        </div>
                    </div>
                </Card>

                {/* Pending Balance (Escrow) */}
                <Card className="bg-[#1c2128] border-[#2d333b] p-6 relative overflow-hidden">
                    <div className="relative z-10 flex justify-between items-start mb-4">
                        <div className="p-3 bg-[#3b82f6]/10 rounded-xl">
                            <Clock className="h-6 w-6 text-[#3b82f6]" />
                        </div>
                    </div>

                    <div className="relative z-10">
                        <p className="text-[#9ca3af] text-sm font-medium">Pending (Escrow)</p>
                        <h2 className="text-3xl font-extrabold text-white mt-1 tracking-tight">
                            {balanceHidden ? "****" : `$${pendingBalance.toFixed(2)}`}
                        </h2>
                        <p className="text-xs text-[#9ca3af]/70 mt-2">
                            Funds held securely until order completion to ensure safety.
                        </p>
                    </div>
                </Card>

                {/* Total Processed */}
                <Card className="bg-[#1c2128] border-[#2d333b] p-6 relative overflow-hidden">
                    <div className="relative z-10 flex justify-between items-start mb-4">
                        <div className="p-3 bg-[#a855f7]/10 rounded-xl">
                            <Building2 className="h-6 w-6 text-[#a855f7]" />
                        </div>
                    </div>

                    <div className="relative z-10">
                        <p className="text-[#9ca3af] text-sm font-medium">Lifetime Earnings</p>
                        <h2 className="text-3xl font-extrabold text-white mt-1 tracking-tight">
                            {balanceHidden ? "****" : `$4,892.50`}
                        </h2>
                        <p className="text-xs text-[#9ca3af]/70 mt-2">
                            Total amount successfully withdrawn.
                        </p>
                    </div>
                </Card>
            </div>

            {/* Transactions Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Transaction History</h2>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b7280]" />
                            <Input placeholder="Search ID..." className="pl-9 h-9 w-[200px] bg-[#1c2128] border-[#2d333b] text-white text-xs" />
                        </div>
                        <Button variant="outline" className="h-9 border-[#2d333b] bg-[#1c2128] text-white hover:bg-[#252b33]">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>
                    </div>
                </div>

                <Card className="bg-[#1c2128] border-[#2d333b] overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-[#2d333b] bg-[#0a0e13]/50">
                                <th className="p-4 text-xs font-bold text-[#9ca3af] uppercase">Transaction</th>
                                <th className="p-4 text-xs font-bold text-[#9ca3af] uppercase">Type</th>
                                <th className="p-4 text-xs font-bold text-[#9ca3af] uppercase">Amount</th>
                                <th className="p-4 text-xs font-bold text-[#9ca3af] uppercase">Status</th>
                                <th className="p-4 text-xs font-bold text-[#9ca3af] uppercase text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2d333b]">
                            {TRANSACTIONS.map((trx) => (
                                <tr key={trx.id} className="group hover:bg-[#252b33]/50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "h-10 w-10 rounded-full flex items-center justify-center border",
                                                trx.type === 'withdrawal' ? "bg-red-500/10 border-red-500/20 text-red-500" :
                                                    trx.type === 'sale' ? "bg-green-500/10 border-green-500/20 text-green-500" :
                                                        "bg-blue-500/10 border-blue-500/20 text-blue-500"
                                            )}>
                                                {trx.type === 'withdrawal' && <ArrowUpRight className="h-5 w-5" />}
                                                {trx.type === 'sale' && <ArrowDownLeft className="h-5 w-5" />}
                                                {trx.type === 'purchase' && <CreditCard className="h-5 w-5" />}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white">{trx.description}</div>
                                                <div className="text-xs text-[#6b7280]">{trx.method} • {trx.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <Badge variant="outline" className="capitalize border-[#2d333b] text-[#9ca3af]">
                                            {trx.type}
                                        </Badge>
                                    </td>
                                    <td className="p-4">
                                        <span className={cn(
                                            "font-bold",
                                            trx.amount > 0 ? "text-[#00b67a]" : "text-white"
                                        )}>
                                            {trx.amount > 0 ? "+" : ""}{trx.amount.toFixed(2)} USD
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className={cn(
                                            "inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase",
                                            trx.status === 'completed' || trx.status === 'available' ? "bg-[#00b67a]/10 text-[#00b67a]" :
                                                trx.status === 'pending' ? "bg-[#f5a623]/10 text-[#f5a623]" :
                                                    "bg-[#ef4444]/10 text-[#ef4444]"
                                        )}>
                                            {trx.status === 'completed' || trx.status === 'available' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                                            {trx.status}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right text-sm text-[#9ca3af]">
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
