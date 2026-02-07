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
        <div className="space-y-8 max-w-7xl mx-auto pb-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                    <p className="text-[#8b949e] text-sm mt-1">Platform overview and quick actions.</p>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span className="text-xs font-bold text-emerald-400">All Systems Operational</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Link key={stat.title} href={stat.link}>
                            <Card className="bg-[#161b22] border-[#30363d] p-5 hover:border-[#f5a623]/30 transition-all cursor-pointer group">
                                <div className="flex items-start justify-between">
                                    <div className={cn(
                                        "p-2.5 rounded-xl",
                                        stat.color === "emerald" ? "bg-emerald-500/10 text-emerald-400" :
                                            stat.color === "amber" ? "bg-amber-500/10 text-amber-500" :
                                                stat.color === "sky" ? "bg-sky-500/10 text-sky-400" : "bg-rose-500/10 text-rose-400"
                                    )}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <ArrowUpRight className="h-4 w-4 text-[#8b949e] opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="mt-4">
                                    <p className="text-xs text-[#8b949e] font-medium">{stat.title}</p>
                                    <h2 className="text-2xl font-bold text-white mt-1 tabular-nums">{stat.value}</h2>
                                    <p className="text-xs text-[#8b949e] mt-1">{stat.subtitle}</p>
                                </div>
                            </Card>
                        </Link>
                    );
                })}
            </div>

            {/* Quick Actions & Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <Card className="bg-[#161b22] border-[#30363d] lg:col-span-1">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-bold text-[#8b949e] uppercase tracking-wider">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {quickActions.map((action, i) => (
                            <Link key={i} href={action.link}>
                                <div className={cn(
                                    "flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer",
                                    action.urgent
                                        ? "bg-rose-500/5 border border-rose-500/20 hover:bg-rose-500/10"
                                        : "bg-white/5 hover:bg-white/10"
                                )}>
                                    <span className="text-sm font-medium text-white">{action.label}</span>
                                    <Badge className={cn(
                                        "text-xs font-bold",
                                        action.urgent
                                            ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                                            : "bg-white/10 text-[#8b949e] border-white/10"
                                    )}>
                                        {action.value}
                                    </Badge>
                                </div>
                            </Link>
                        ))}

                        <div className="pt-3 border-t border-[#30363d]/50 mt-4">
                            <div className="grid grid-cols-2 gap-2">
                                <Link href="/admin/users">
                                    <Button variant="outline" className="w-full h-10 text-xs font-bold border-[#30363d] hover:bg-white/5">
                                        <Users className="h-4 w-4 mr-2" />
                                        Users
                                    </Button>
                                </Link>
                                <Link href="/admin/orders">
                                    <Button variant="outline" className="w-full h-10 text-xs font-bold border-[#30363d] hover:bg-white/5">
                                        <ShoppingCart className="h-4 w-4 mr-2" />
                                        Orders
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Orders */}
                <Card className="bg-[#161b22] border-[#30363d] lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-sm font-bold text-[#8b949e] uppercase tracking-wider">Recent Orders</CardTitle>
                        <Link href="/admin/orders">
                            <Button variant="ghost" size="sm" className="text-xs text-[#8b949e] hover:text-white">
                                View All <ExternalLink className="h-3 w-3 ml-1" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recentOrders.length === 0 ? (
                                <p className="text-center text-[#8b949e] py-8">No orders yet</p>
                            ) : (
                                recentOrders.map((order) => (
                                    <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-[#0d1117] flex items-center justify-center">
                                                <ShoppingCart className="h-4 w-4 text-[#8b949e]" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white">{order.orderNumber}</p>
                                                <p className="text-xs text-[#8b949e]">
                                                    {order.buyer?.username} → {order.seller?.username}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-emerald-400">${Number(order.finalAmount).toFixed(2)}</p>
                                            <Badge className={cn(
                                                "text-[9px] font-bold uppercase",
                                                order.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                                    order.status === "ACTIVE" ? "bg-sky-500/10 text-sky-400 border-sky-500/20" :
                                                        order.status === "CANCELLED" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                                                            "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                            )}>
                                                {order.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
