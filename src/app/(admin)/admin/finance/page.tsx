import { fetchWithdrawals, fetchPlatformConfigs } from "@/app/(admin)/admin/actions";
import { WithdrawalsDataTable } from "../components/WithdrawalsDataTable";
import { PayoutModeToggle } from "../components/PayoutModeToggle";
import { DollarSign, TrendingUp, ArrowDownRight, Wallet, Clock, TrendingDown, Percent, CreditCard, CheckCircle, Calculator } from "lucide-react";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma/client";
import { cn } from "@/lib/utils";
import { getExactStripeFee } from "@/lib/utils/stripe-fees";

export const dynamic = "force-dynamic";

export default async function AdminFinancePage() {
    // Fetch data
    const withdrawals = await fetchWithdrawals();
    const configs = await fetchPlatformConfigs();
    const isManualPay = configs.find(c => c.key === "MANUAL_PAYMENTS_ENABLED")?.value === true;

    // Fetch detailed order stats for revenue breakdown
    const completedOrders = await prisma.order.findMany({
        where: { status: "COMPLETED" },
        select: {
            subtotal: true,
            finalAmount: true,
            platformFee: true,
            sellerEarnings: true,
            discount: true,
            stripePaymentIntentId: true
        }
    });

    // Calculate core financial stats
    const totalOrderVolume = completedOrders.reduce((sum, o) => sum + Number(o.finalAmount), 0);
    const totalPlatformRevenue = completedOrders.reduce((sum, o) => sum + Number(o.platformFee), 0);
    const totalSellerRevenue = completedOrders.reduce((sum, o) => sum + Number(o.sellerEarnings), 0);

    // EXACT Stripe Fees
    const feePromises = completedOrders.map(async (o) => {
        if (o.stripePaymentIntentId) {
            return await getExactStripeFee(o.stripePaymentIntentId);
        }
        const amount = Number(o.finalAmount);
        return amount > 0 ? (amount * 0.029 + 0.30) : 0;
    });

    const individualFees = await Promise.all(feePromises);
    const totalExactStripeFees = individualFees.reduce((sum, fee) => sum + fee, 0);

    // Detailed Fee Breakdown
    const totalBuyerServiceFees = completedOrders.reduce((sum, o) => sum + (Number(o.finalAmount) - Number(o.subtotal) + Number(o.discount || 0)), 0);
    const totalSellerCommissions = completedOrders.reduce((sum, o) => sum + (Number(o.subtotal) - Number(o.sellerEarnings)), 0);
    const totalWithdrawalFees = withdrawals.filter(w => w.status === "COMPLETED").reduce((sum, w) => sum + Number(w.fee), 0);
    const netTake = (totalPlatformRevenue + totalWithdrawalFees) - totalExactStripeFees;

    const pendingWithdrawals = withdrawals.filter(w => w.status === "PENDING");
    const totalPendingAmount = pendingWithdrawals.reduce((sum, w) => sum + Number(w.amount), 0);

    return (
        <div className="space-y-10 animate-in fade-in duration-700 relative z-10">
            {/* HUD Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-[#f5a623] shadow-[0_0_8px_rgba(245,166,35,0.6)]" />
                        <span className="text-[10px] font-black text-[#f5a623] uppercase tracking-[0.3em]">Financial Matrix</span>
                    </div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Finance <span className="text-[#f5a623]">& Registry</span></h1>
                    <p className="text-white/20 text-xs font-black uppercase tracking-[0.1em] mt-1">Management of withdrawals and platform revenue flow</p>
                </div>

                <div className="flex items-center gap-4">
                    <PayoutModeToggle isManual={isManualPay} />
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Order Volume */}
                <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl backdrop-blur-sm group hover:border-[#f5a623]/30 transition-all">
                    <div className="h-10 w-10 rounded-xl bg-white/5 text-[#f5a623] flex items-center justify-center mb-4 group-hover:bg-[#f5a623] group-hover:text-black transition-all">
                        <TrendingUp className="h-5 w-5" />
                    </div>
                    <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em]">Order Volume</p>
                    <h2 className="text-2xl font-black text-white mt-1 tabular-nums tracking-tighter">
                        ${totalOrderVolume.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </h2>
                    <p className="text-[9px] text-[#f5a623]/60 font-black uppercase tracking-widest mt-1.5">Gross Transaction Value</p>
                </div>

                {/* 2. Platform Revenue */}
                <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl backdrop-blur-sm group hover:border-[#f5a623]/30 transition-all">
                    <div className="h-10 w-10 rounded-xl bg-white/5 text-[#f5a623] flex items-center justify-center mb-4 group-hover:bg-[#f5a623] group-hover:text-black transition-all">
                        <DollarSign className="h-5 w-5" />
                    </div>
                    <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em]">Platform Revenue</p>
                    <h2 className="text-2xl font-black text-white mt-1 tabular-nums tracking-tighter">
                        ${(totalPlatformRevenue + totalWithdrawalFees).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </h2>
                    <p className="text-[9px] text-[#f5a623]/60 font-black uppercase tracking-widest mt-1.5">Gross Income (Market + Withdraw)</p>
                </div>

                {/* 3. Seller Revenue */}
                <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl backdrop-blur-sm group hover:border-[#f5a623]/30 transition-all">
                    <div className="h-10 w-10 rounded-xl bg-white/5 text-emerald-500 flex items-center justify-center mb-4 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                        <Wallet className="h-5 w-5" />
                    </div>
                    <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em]">Seller Revenue</p>
                    <h2 className="text-2xl font-black text-white mt-1 tabular-nums tracking-tighter">
                        ${totalSellerRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </h2>
                    <p className="text-[9px] text-emerald-500/60 font-black uppercase tracking-widest mt-1.5">Credits Allocated to Users</p>
                </div>

                {/* 4. Fees Card (Detailed Breakdown) */}
                <div className="bg-[#f5a623]/5 border border-[#f5a623]/20 p-6 rounded-3xl backdrop-blur-sm group transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-10 w-20 h-full bg-gradient-to-r from-transparent via-[#f5a623]/5 to-transparent skew-x-12 animate-[scan_3s_linear_infinite]" />

                    <div className="h-10 w-10 rounded-xl bg-[#f5a623] text-black flex items-center justify-center mb-4">
                        <Calculator className="h-5 w-5" />
                    </div>
                    <p className="text-[10px] text-[#f5a623] font-black uppercase tracking-[0.2em]">Fees Breakdown</p>

                    <div className="mt-4 space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tight">
                            <span className="text-white/40">Buyer Service:</span>
                            <span className="text-white">${totalBuyerServiceFees.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tight">
                            <span className="text-white/40">Seller Comm:</span>
                            <span className="text-white">${totalSellerCommissions.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tight border-b border-white/5 pb-2">
                            <span className="text-white/40">Withdraw Fees:</span>
                            <span className="text-white">${totalWithdrawalFees.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tight pt-1">
                            <span className="text-rose-400/60 italic">Stripe Cut:</span>
                            <span className="text-rose-400">-${totalExactStripeFees.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs font-black uppercase tracking-tighter pt-2 border-t border-[#f5a623]/20">
                            <span className="text-[#f5a623]">Net Yield:</span>
                            <span className="text-white">${netTake.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
            {/* Withdrawals Stream */}
            <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-8 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-[11px] font-black text-white/20 uppercase tracking-[0.3em] flex items-center gap-3">
                        Registry Archive
                        <div className="h-1.5 w-1.5 rounded-full bg-[#f5a623]/40" />
                    </h3>
                </div>
                <WithdrawalsDataTable withdrawals={withdrawals as any} />
            </div>
        </div>
    );
}
