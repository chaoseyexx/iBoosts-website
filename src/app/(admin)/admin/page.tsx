import Link from "next/link";
import {
    Users,
    ShoppingCart,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    AlertTriangle,
    Clock,
    CheckCircle,
    TrendingUp,
    ExternalLink,
    Shield,
    Wallet,
    FileText
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma/client";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

export default async function AdminDashboardPage() {
    // Fetch all stats
    const [
        totalUsers,
        newUsers7d,
        totalOrders,
        activeOrders,
        pendingWithdrawals,
        openDisputes,
        completedOrders,
        recentOrders
    ] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({
            where: {
                createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
            }
        }),
        prisma.order.count(),
        prisma.order.count({ where: { status: { in: ["ACTIVE", "DELIVERED"] } } }),
        prisma.withdrawal.count({ where: { status: "PENDING" } }),
        prisma.dispute.count({ where: { status: "OPEN" } }),
        prisma.order.findMany({
            where: { status: "COMPLETED" },
            select: { finalAmount: true }
        }),
        prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: {
                buyer: { select: { username: true } },
                seller: { select: { username: true } },
                listing: { select: { title: true } }
            }
        })
    ]);

    const totalRevenue = completedOrders.reduce((sum, order) => sum + Number(order.finalAmount), 0);

    const stats = [
        {
            title: "Total Revenue",
            value: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            subtitle: "All-time earnings",
            icon: DollarSign,
            color: "emerald",
            link: "/admin/finance"
        },
        {
            title: "Active Orders",
            value: activeOrders.toString(),
            subtitle: `${totalOrders} total orders`,
            icon: ShoppingCart,
            color: "amber",
            link: "/admin/orders"
        },
        {
            title: "Total Users",
            value: totalUsers.toString(),
            subtitle: `+${newUsers7d} this week`,
            icon: Users,
            color: "sky",
            link: "/admin/users"
        },
        {
            title: "Open Disputes",
            value: openDisputes.toString(),
            subtitle: "Needs attention",
            icon: AlertTriangle,
            color: openDisputes > 0 ? "rose" : "emerald",
            link: "/admin/disputes"
        }
    ];

    const quickActions = [
        { label: "Pending Withdrawals", value: pendingWithdrawals, link: "/admin/finance", urgent: pendingWithdrawals > 0 },
        { label: "Open Disputes", value: openDisputes, link: "/admin/disputes", urgent: openDisputes > 0 },
        { label: "Manage Games", value: "CMS", link: "/admin/cms", urgent: false },
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-700 relative z-10">
            {/* HUD Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-[#f5a623] shadow-[0_0_8px_rgba(245,166,35,0.6)]" />
                        <span className="text-[10px] font-black text-[#f5a623] uppercase tracking-[0.3em]">Management Matrix</span>
                    </div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Command <span className="text-[#f5a623]">Dashboard</span></h1>
                    <p className="text-white/20 text-xs font-black uppercase tracking-[0.1em] mt-1">Operational Platform Overview & Analytics</p>
                </div>
                <div className="flex items-center gap-4 px-5 py-2.5 bg-[#f5a623]/5 border border-[#f5a623]/20 rounded-2xl backdrop-blur-sm">
                    <div className="flex flex-col items-end">
                        <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">System Health</span>
                        <span className="text-[11px] font-black text-[#f5a623] uppercase tracking-widest leading-none mt-1 text-right">Operational</span>
                    </div>
                    <div className="h-8 w-[1px] bg-white/5" />
                    <div className="h-2 w-2 rounded-full bg-[#f5a623] animate-pulse shadow-[0_0_10px_rgba(245,166,35,0.8)]" />
                </div>
            </div>

            {/* High-Impact Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Link key={stat.title} href={stat.link}>
                            <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl hover:border-[#f5a623]/30 transition-all cursor-pointer group relative overflow-hidden backdrop-blur-sm">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#f5a623]/5 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2 group-hover:bg-[#f5a623]/10 transition-colors" />

                                <div className="flex items-start justify-between relative z-10">
                                    <div className="h-11 w-11 rounded-xl bg-[#f5a623]/10 flex items-center justify-center text-[#f5a623] group-hover:bg-[#f5a623] group-hover:text-black transition-all">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <ArrowUpRight className="h-4 w-4 text-[#f5a623]/40 group-hover:text-[#f5a623] transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </div>
                                <div className="mt-6 relative z-10">
                                    <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em]">{stat.title}</p>
                                    <h2 className="text-3xl font-black text-white mt-1 tabular-nums drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]">{stat.value}</h2>
                                    <p className="text-[10px] text-[#f5a623]/60 font-black uppercase tracking-widest mt-1.5">{stat.subtitle}</p>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Operations Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Critical Alerts / Quick Actions */}
                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 lg:col-span-1 border-rose-500/5 backdrop-blur-sm">
                    <h3 className="text-[11px] font-black text-white/20 uppercase tracking-[0.3em] mb-8 flex items-center justify-between">
                        Tactical Actions
                        <div className="h-[1px] w-24 bg-white/5" />
                    </h3>
                    <div className="space-y-3">
                        {quickActions.map((action, i) => (
                            <Link key={i} href={action.link}>
                                <div className={cn(
                                    "flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer border group",
                                    action.urgent
                                        ? "bg-rose-500/5 border-rose-500/10 hover:border-rose-500/30"
                                        : "bg-white/[0.03] border-white/5 hover:border-[#f5a623]/30"
                                )}>
                                    <div>
                                        <span className="text-[11px] font-black text-white/60 uppercase tracking-widest group-hover:text-white transition-colors">{action.label}</span>
                                        {action.urgent && <div className="text-[9px] font-black text-rose-500 uppercase tracking-tighter mt-0.5">HIGH_PRIORITY</div>}
                                    </div>
                                    <div className={cn(
                                        "h-8 px-3 rounded-lg flex items-center justify-center text-xs font-black",
                                        action.urgent
                                            ? "bg-rose-500/20 text-rose-500"
                                            : "bg-white/5 text-white/20 group-hover:text-[#f5a623] group-hover:bg-[#f5a623]/10 transition-all"
                                    )}>
                                        {action.value}
                                    </div>
                                </div>
                            </Link>
                        ))}

                        <div className="pt-6 grid grid-cols-2 gap-3 mt-4">
                            <Link href="/admin/users">
                                <button className="w-full h-11 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all">
                                    Entity logs
                                </button>
                            </Link>
                            <Link href="/admin/orders">
                                <button className="w-full h-11 bg-[#f5a623]/5 hover:bg-[#f5a623]/10 border border-[#f5a623]/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#f5a623] transition-all">
                                    Registry
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Live Event Feed (Recent Orders) */}
                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 lg:col-span-2 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-[11px] font-black text-white/20 uppercase tracking-[0.3em] flex items-center gap-3">
                            Registry Stream
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        </h3>
                        <Link href="/admin/orders">
                            <button className="text-[10px] font-black text-[#f5a623]/60 hover:text-[#f5a623] uppercase tracking-[0.2em] transition-colors pb-1 border-b border-[#f5a623]/20">
                                Expand Stream
                            </button>
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {recentOrders.length === 0 ? (
                            <div className="py-20 flex flex-col items-center justify-center opacity-10">
                                <ShoppingCart className="h-12 w-12 mb-4" />
                                <p className="text-[10px] font-black uppercase tracking-widest">No Active Sessions</p>
                            </div>
                        ) : (
                            recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-[#f5a623]/20 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="h-11 w-11 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-[#f5a623]/10 group-hover:border-[#f5a623]/20 transition-all">
                                            <ShoppingCart className="h-5 w-5 text-white/20 group-hover:text-[#f5a623]" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black text-white uppercase tracking-widest">{order.orderNumber}</p>
                                            <p className="text-[10px] font-black text-white/20 uppercase tracking-tighter mt-0.5 whitespace-nowrap overflow-hidden">
                                                {order.buyer?.username} <span className="text-[#f5a623]/40 mx-1">→</span> {order.seller?.username}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-[#f5a623] tracking-tight tabular-nums">${Number(order.finalAmount).toFixed(2)}</p>
                                        <div className={cn(
                                            "mt-1 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-[0.2em] inline-block border",
                                            order.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                                order.status === "ACTIVE" ? "bg-sky-500/10 text-sky-400 border-sky-500/20" :
                                                    order.status === "CANCELLED" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                                                        "bg-[#f5a623]/10 text-[#f5a623] border-[#f5a623]/20"
                                        )}>
                                            {order.status}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
