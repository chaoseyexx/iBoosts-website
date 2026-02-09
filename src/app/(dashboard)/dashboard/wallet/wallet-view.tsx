"use client";

import * as React from "react";
import {
    Wallet,
    ArrowUpRight,
    Search,
    Download,
    Eye,
    EyeOff,
    ShieldCheck,
    Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BalanceBar } from "@/components/dashboard/wallet-components";
import { useRouter } from "next/navigation";

interface Transaction {
    id: string;
    amount: any;
    type: string;
    description: string;
    createdAt: string | Date;
    metadata: any;
}

interface WalletData {
    balance: number;
    pendingBalance: number;
    transactions: Transaction[];
}

interface UserData {
    role: string;
    kycStatus: string;
}

interface WalletViewProps {
    initialWallet: WalletData;
    initialUser: UserData;
}

export default function WalletView({ initialWallet, initialUser }: WalletViewProps) {
    const router = useRouter();
    const [balanceHidden, setBalanceHidden] = React.useState(false);

    // User State initialized with server data
    const [kycStatus, setKycStatus] = React.useState<string>(initialUser.kycStatus);
    const [role, setRole] = React.useState<string | null>(initialUser.role);

    // Wallet State initialized with server data
    const [transactions, setTransactions] = React.useState<Transaction[]>(initialWallet.transactions);
    const [availableBalance, setAvailableBalance] = React.useState(initialWallet.balance);
    const [pendingBalance, setPendingBalance] = React.useState(initialWallet.pendingBalance);

    // Fetch fresh data in background
    React.useEffect(() => {
        const fetchFreshData = async () => {
            try {
                // Fetch status to sync with Stripe/Didit (background check)
                const userRes = await fetch("/api/user/status");
                if (userRes.ok) {
                    const data = await userRes.json();
                    setKycStatus(data.kycStatus || "NOT_SUBMITTED");
                    setRole(data.role || "BUYER");
                }

                // Fetch latest wallet transaction data
                const walletRes = await fetch("/api/wallet/data");
                if (walletRes.ok) {
                    const data = await walletRes.json();
                    setAvailableBalance(data.wallet?.balance ? Number(data.wallet.balance) : 0);
                    setPendingBalance(data.wallet?.pendingBalance ? Number(data.wallet.pendingBalance) : 0);
                    setTransactions(data.transactions || []);
                }
            } catch (error) {
                console.error("Failed to sync wallet data", error);
            }
        };

        fetchFreshData();
    }, []);

    const handleWithdrawClick = () => {
        if (kycStatus !== "APPROVED") {
            router.push("/dashboard/kyc");
            return;
        }
        router.push("/dashboard/wallet/withdraw");
    };

    return (
        <div className="w-full space-y-6 pb-12 px-4 md:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-lg font-medium text-white tracking-tight">Wallet</h1>
                    <p className="text-[10px] font-medium text-[#8b949e] uppercase tracking-widest">Balance & Payouts</p>
                </div>
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#8b949e] hover:text-white text-[10px] font-medium uppercase tracking-widest h-8"
                        onClick={() => setBalanceHidden(!balanceHidden)}
                    >
                        {balanceHidden ? <EyeOff className="h-3 w-3 mr-2" /> : <Eye className="h-3 w-3 mr-2" />}
                        {balanceHidden ? "Show Balance" : "Hide Balance"}
                    </Button>
                </div>
            </div>

            <div className={`grid grid-cols-1 ${role !== "SELLER" ? "lg:grid-cols-3" : ""} gap-4`}>
                <div className={`${role !== "SELLER" ? "lg:col-span-2" : ""} space-y-4`}>
                    <div className="bg-[#0d1117] border border-white/5 rounded-3xl p-6 flex flex-col justify-between min-h-[220px] relative overflow-hidden shadow-xl group">
                        <div className="absolute top-0 right-0 w-60 h-60 bg-[#f5a623]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-[#f5a623]/10 transition-all duration-700" />

                        <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                            <div className="flex justify-between items-start">
                                <div className="space-y-4">
                                    <div className="h-10 w-10 bg-[#f5a623]/10 rounded-xl flex items-center justify-center border border-[#f5a623]/20 shadow-lg shadow-black/20">
                                        <Wallet className="h-5 w-5 text-[#f5a623]" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-[10px] font-medium text-[#8b949e] uppercase tracking-[0.3em]">Current Balance</h3>
                                        <div className="flex items-center gap-3">
                                            <h4 className="text-4xl font-medium text-white tracking-tighter">
                                                {balanceHidden ? "••••••" : `US$${availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                                            </h4>
                                            <button onClick={() => setBalanceHidden(!balanceHidden)} className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-white/5 text-[#8b949e] hover:text-white transition-all">
                                                {balanceHidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 items-end gap-8 pt-6 border-t border-white/5">
                                <div className="space-y-3">
                                    <BalanceBar
                                        available={balanceHidden ? 0 : availableBalance}
                                        incoming={balanceHidden ? 0 : pendingBalance}
                                        className="!space-y-3"
                                    />
                                </div>
                                {role === "SELLER" && (
                                    <div className="flex justify-end">
                                        <Button
                                            onClick={handleWithdrawClick}
                                            className={cn(
                                                "font-medium h-12 px-8 rounded-xl shadow-lg transition-all w-full md:w-auto text-[10px] uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98]",
                                                kycStatus !== "APPROVED"
                                                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20"
                                                    : "bg-[#f5a623] hover:bg-[#e09612] text-black shadow-[#f5a623]/20 hover:shadow-[#f5a623]/40"
                                            )}
                                        >
                                            {kycStatus !== "APPROVED" ? (
                                                <>
                                                    <ShieldCheck className="mr-2 h-4 w-4" />
                                                    Verify Identity
                                                </>
                                            ) : (
                                                <>
                                                    <ArrowUpRight className="mr-2 h-4 w-4" />
                                                    Withdraw Funds
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {role !== "SELLER" && (
                    <div className="lg:col-span-1 flex flex-col gap-4">
                        <div className="bg-[#161b22] border border-[#f5a623]/20 rounded-3xl p-6 flex flex-col justify-between h-full relative overflow-hidden group cursor-pointer hover:border-[#f5a623]/40 transition-all shadow-xl" onClick={() => router.push("/dashboard/kyc")}>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#f5a623]/5 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-[#f5a623]/10 transition-all duration-700" />

                            <div className="space-y-4 relative z-10">
                                <div className="h-10 w-10 bg-[#f5a623]/10 rounded-xl flex items-center justify-center border border-[#f5a623]/20 shadow-lg">
                                    <Briefcase className="h-5 w-5 text-[#f5a623]" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-medium text-white tracking-tighter">Become a Seller</h3>
                                    <p className="text-[11px] font-normal text-[#8b949e] leading-relaxed">
                                        Start earning by selling your services or digital assets. Complete verification to enable payouts.
                                    </p>
                                </div>
                            </div>

                            <div className="pt-6 relative z-10">
                                <div className="flex items-center gap-2 text-[#f5a623] font-medium uppercase text-[9px] tracking-[0.2em] group-hover:gap-3 transition-all">
                                    Start Application <ArrowUpRight className="h-3 w-3" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-6 pt-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h2 className="text-lg font-medium text-white tracking-tighter">Recent Activity</h2>
                        <p className="text-[10px] font-medium text-[#8b949e] uppercase tracking-[0.2em]">Transaction history and logs</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <div className="relative w-full sm:w-[280px] group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8b949e] group-focus-within:text-[#f5a623] transition-colors" />
                            <Input
                                placeholder="Search transactions..."
                                className="pl-10 h-10 w-full bg-[#0d1117] border-white/5 text-white text-[10px] font-medium tracking-widest focus:border-[#f5a623]/30 transition-all rounded-xl placeholder:text-white/10"
                            />
                        </div>
                        <Button variant="outline" className="h-10 bg-[#0d1117] border-white/5 text-[#8b949e] hover:text-white hover:border-white/10 font-medium uppercase text-[10px] tracking-widest px-6 rounded-xl shrink-0 transition-all">
                            <Download className="h-3.5 w-3.5 mr-2" />
                            Export CSV
                        </Button>
                    </div>
                </div>

                <div className="bg-[#0d1117]/60 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.03]">
                                    <th className="p-4 text-left text-[10px] font-medium text-[#8b949e] uppercase tracking-[0.2em]">Amount</th>
                                    <th className="p-4 text-left text-[10px] font-medium text-[#8b949e] uppercase tracking-[0.2em]">Type</th>
                                    <th className="p-4 text-left text-[10px] font-medium text-[#8b949e] uppercase tracking-[0.2em]">Description</th>
                                    <th className="p-4 text-left text-[10px] font-medium text-[#8b949e] uppercase tracking-[0.2em] text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {transactions.length > 0 ? transactions.map((trx) => {
                                    const amount = Number(trx.amount);
                                    let displayAmount = amount;
                                    let displayFee = trx.metadata?.fee ? Number(trx.metadata.fee) : (trx.type === 'SALE' ? -amount * 0.1 : 0);

                                    // Special handling for withdrawal display: Show Net Amount
                                    if (trx.type === 'WITHDRAWAL') {
                                        // Metadata has { fee, netAmount, grossAmount }
                                        // Display Amount should be the NET amount (what user receives).
                                        const net = trx.metadata?.netAmount ? Number(trx.metadata.netAmount) : (amount - (displayFee || 0));
                                        displayAmount = net;
                                    }

                                    const typeLabel = trx.type === 'SALE' ? 'Charge' : trx.type === 'WITHDRAWAL' ? 'Transfer' : trx.type === 'FEE' ? 'Collected fee' : trx.type;

                                    // Color Logic
                                    const isIncoming = ['SALE', 'DEPOSIT', 'CREDIT', 'BONUS'].includes(trx.type);
                                    const isOutgoing = ['WITHDRAWAL', 'PURCHASE', 'DEBIT', 'FEE'].includes(trx.type);

                                    // Using standard colors: Green for Income, Red for Expense
                                    // Using !text-green-500 etc to enforce color
                                    const amountColor = isIncoming ? "text-green-500" : isOutgoing ? "text-red-500" : "text-white";

                                    return (
                                        <tr key={trx.id} className="group hover:bg-white/[0.02] transition-all">
                                            <td className="p-4">
                                                <span className={cn("text-sm font-medium tracking-tight", amountColor)}>
                                                    {isIncoming ? "+" : isOutgoing ? "-" : ""}US${Math.abs(displayAmount).toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        "px-2.5 py-0.5 text-[8px] font-medium uppercase tracking-[0.2em] border-white/10 bg-white/5",
                                                        isIncoming ? "text-green-500/80" : isOutgoing ? "text-red-500/80" : "text-[#8b949e]"
                                                    )}
                                                >
                                                    {typeLabel}
                                                </Badge>
                                            </td>
                                            <td className="p-4">
                                                <div className="space-y-1">
                                                    <div className="text-[11px] font-medium text-white tracking-tight">{trx.description}</div>
                                                    <div className="text-[8px] font-normal uppercase tracking-widest text-[#8b949e]/40">
                                                        REF: {trx.id.substring(0, 8).toUpperCase()}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <span className="text-[10px] font-medium text-[#8b949e] uppercase tracking-widest">
                                                    {new Date(trx.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan={4} className="p-10 text-center">
                                            <p className="text-[9px] font-medium text-[#8b949e] uppercase tracking-widest">No activity recorded yet</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div >
    );
}
