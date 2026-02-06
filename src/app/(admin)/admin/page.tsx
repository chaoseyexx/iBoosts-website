import {
    Users,
    ShoppingCart,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    Activity,
    AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma/client";
import { cn } from "@/lib/utils";

export default async function AdminDashboardPage() {
    // 1. Total Revenue
    const completedOrders = await prisma.order.findMany({
        where: { status: "COMPLETED" },
        select: { finalAmount: true }
    });
    const totalRevenue = completedOrders.reduce((sum, order) => sum + Number(order.finalAmount), 0);

    // 2. Active Orders
    const activeOrdersCount = await prisma.order.count({
        where: {
            status: {
                in: ["ACTIVE", "DELIVERED"]
            }
        }
    });

    // 3. New Users (Last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newUsersCount = await prisma.user.count({
        where: {
            createdAt: {
                gte: sevenDaysAgo
            }
        }
    });

    // 4. Active Disputes
    const activeDisputesCount = await prisma.dispute.count({
        where: {
            status: "OPEN"
        }
    });

    const STATS = [
        {
            title: "Aggregate Revenue",
            value: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            change: "Historical Payouts",
            trend: "up",
            icon: DollarSign,
            color: "emerald"
        },
        {
            title: "Active Transactions",
            value: activeOrdersCount.toString(),
            change: "Real-time Fulfillment",
            trend: "up",
            icon: ShoppingCart,
            color: "amber"
        },
        {
            title: "Network Growth",
            value: `+${newUsersCount}`,
            change: "7-Day Delta",
            trend: "up",
            icon: Users,
            color: "sky"
        },
        {
            title: "Conflict Management",
            value: activeDisputesCount.toString(),
            change: "High-Priority Resolves",
            trend: activeDisputesCount > 0 ? "up" : "down",
            icon: AlertCircle,
            color: "rose"
        }
    ];

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Nexus Command Center</h1>
                    <p className="text-[#9ca3af] mt-1">Platform-wide telemetry and operational oversight.</p>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">System Nominal</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {STATS.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.title} className="bg-[#1c2128] border-[#2d333b] p-6 relative overflow-hidden group hover:border-[#f5a623]/30 transition-all duration-300">
                            <div className="absolute right-0 top-0 p-24 bg-[#f5a623] opacity-[0.02] rounded-full blur-3xl group-hover:opacity-[0.06] transition-opacity" />

                            <div className="relative z-10 flex justify-between items-start mb-4">
                                <div className={cn(
                                    "p-3 rounded-xl",
                                    stat.color === "emerald" ? "bg-emerald-500/10 text-emerald-400" :
                                        stat.color === "amber" ? "bg-amber-500/10 text-amber-500" :
                                            stat.color === "sky" ? "bg-sky-500/10 text-sky-400" : "bg-rose-500/10 text-rose-400"
                                )}>
                                    <Icon className="h-6 w-6" />
                                </div>
                                <div className={cn(
                                    "flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded",
                                    stat.trend === "up" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                                )}>
                                    {stat.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                    TREND
                                </div>
                            </div>

                            <div className="relative z-10">
                                <p className="text-[#9ca3af] text-xs font-bold uppercase tracking-wider opacity-60">{stat.title}</p>
                                <h2 className="text-3xl font-extrabold text-white mt-1 tracking-tight tabular-nums">
                                    {stat.value}
                                </h2>
                                <p className="text-[10px] text-[#9ca3af]/70 mt-2 font-medium">
                                    {stat.change}
                                </p>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Live Feed Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-xl font-bold text-white">Live Operations Feed</h2>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Real-time</span>
                    </div>
                </div>

                <Card className="bg-[#1c2128] border-[#2d333b] overflow-hidden">
                    <div className="divide-y divide-[#2d333b]">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="p-6 flex items-center justify-between group hover:bg-[#252b33]/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-[#0a0e13] border border-[#2d333b] flex items-center justify-center">
                                        <ShoppingCart className="h-6 w-6 text-[#9ca3af] group-hover:text-white transition-colors" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-white uppercase tracking-tight">BOOT-{4829 + i}-TRANS</div>
                                        <div className="flex items-center gap-2 text-xs text-[#9ca3af]">
                                            <span>Universal Elite Protocol</span>
                                            <span className="h-1 w-1 rounded-full bg-[#2d333b]" />
                                            <span className="text-[#58a6ff]">2m ago</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-emerald-400 tabular-nums">$149.00</div>
                                        <div className="text-[10px] font-medium text-[#9ca3af] uppercase tracking-widest">Synchronized</div>
                                    </div>
                                    <div className="h-8 w-8 rounded-lg border border-[#2d333b] flex items-center justify-center hover:bg-[#2d333b] text-[#9ca3af] hover:text-white transition-all cursor-pointer">
                                        <ArrowUpRight className="h-4 w-4" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Footer Link */}
                    <div className="p-4 bg-[#0a0e13]/50 border-t border-[#2d333b] flex justify-center">
                        <button className="text-[10px] font-bold text-[#8b949e] uppercase tracking-[0.2em] hover:text-white transition-colors">
                            View Full Protocol History
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
