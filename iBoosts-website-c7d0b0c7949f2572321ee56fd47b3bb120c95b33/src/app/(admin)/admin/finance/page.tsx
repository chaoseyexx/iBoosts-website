import { fetchWithdrawals } from "@/app/(admin)/admin/actions";
import { WithdrawalsDataTable } from "../components/WithdrawalsDataTable";
import { DollarSign, TrendingUp, ArrowDownRight, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma/client";
import { cn } from "@/lib/utils";

export default async function AdminFinancePage() {
    // Fetch data
    const withdrawals = await fetchWithdrawals();

    // Calculate stats
    const pendingWithdrawals = withdrawals.filter(w => w.status === "PENDING");
    const totalPendingAmount = pendingWithdrawals.reduce((sum, w) => sum + Number(w.amount), 0);
    const completedWithdrawals = withdrawals.filter(w => w.status === "COMPLETED");
    const totalPaidOut = completedWithdrawals.reduce((sum, w) => sum + Number(w.amount), 0);

    const stats = [
        {
            title: "Pending Withdrawals",
            value: pendingWithdrawals.length.toString(),
            subtitle: `$${totalPendingAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} pending`,
            icon: Wallet,
            color: "amber",
            urgent: pendingWithdrawals.length > 0
        },
        {
            title: "Total Paid Out",
            value: `$${totalPaidOut.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
            subtitle: `${completedWithdrawals.length} completed`,
            icon: ArrowDownRight,
            color: "emerald",
            urgent: false
        },
    ];

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">Finance & Payouts</h1>
                    <p className="text-sm text-[#8b949e]">
                        Manage withdrawal requests and platform finances.
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.title} className={cn(
                            "bg-[#161b22] border-[#30363d] p-5",
                            stat.urgent && "border-amber-500/30"
                        )}>
                            <div className="flex items-start justify-between">
                                <div className={cn(
                                    "p-2.5 rounded-xl",
                                    stat.color === "emerald" ? "bg-emerald-500/10 text-emerald-400" :
                                        stat.color === "amber" ? "bg-amber-500/10 text-amber-500" : "bg-sky-500/10 text-sky-400"
                                )}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                {stat.urgent && (
                                    <span className="px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[10px] font-bold text-amber-400 uppercase">
                                        Needs Attention
                                    </span>
                                )}
                            </div>
                            <div className="mt-4">
                                <p className="text-xs text-[#8b949e] font-medium">{stat.title}</p>
                                <h2 className="text-2xl font-bold text-white mt-1 tabular-nums">{stat.value}</h2>
                                <p className="text-xs text-[#8b949e] mt-1">{stat.subtitle}</p>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Withdrawals Table */}
            <div>
                <h2 className="text-lg font-bold text-white mb-4">Withdrawal Requests</h2>
                <WithdrawalsDataTable withdrawals={withdrawals as any} />
            </div>
        </div>
    );
}
