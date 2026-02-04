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
            title: "Total Revenue",
            value: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            change: "All time",
            trend: "up",
            icon: DollarSign,
            color: "text-[#238636]"
        },
        {
            title: "Active Orders",
            value: activeOrdersCount.toString(),
            change: "Currently in progress",
            trend: "up",
            icon: ShoppingCart,
            color: "text-[#f5a623]"
        },
        {
            title: "New Users",
            value: `+${newUsersCount}`,
            change: "Last 7 days",
            trend: "up",
            icon: Users,
            color: "text-[#58a6ff]"
        },
        {
            title: "Active Disputes",
            value: activeDisputesCount.toString(),
            change: "Requires attention",
            trend: activeDisputesCount > 0 ? "up" : "down",
            icon: AlertCircle,
            color: "text-[#da3633]"
        }
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
                <p className="text-[#8b949e]">Welcome back, Admin. Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {STATS.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.title} className="bg-[#161b22] border-[#30363d] text-[#c9d1d9]">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-[#8b949e]">
                                    {stat.title}
                                </CardTitle>
                                <Icon className={`h-4 w-4 ${stat.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-white">{stat.value}</div>
                                <p className="text-xs text-[#8b949e] flex items-center mt-1">
                                    {stat.trend === "up" ? (
                                        <ArrowUpRight className="h-3 w-3 text-[#238636] mr-1" />
                                    ) : (
                                        <ArrowDownRight className="h-3 w-3 text-[#da3633] mr-1" />
                                    )}
                                    <span className={stat.trend === "up" ? "text-[#238636]" : "text-[#da3633]"}>
                                        {stat.change}
                                    </span>
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Recent Activity Section Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-[#161b22] border-[#30363d] h-[400px]">
                    <CardHeader>
                        <CardTitle className="text-white">Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center h-[300px] text-[#8b949e]">
                        <Activity className="h-8 w-8 mr-2 opacity-50" />
                        Live feed coming soon...
                    </CardContent>
                </Card>

                <Card className="bg-[#161b22] border-[#30363d] h-[400px]">
                    <CardHeader>
                        <CardTitle className="text-white">Revenue Analytics</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center h-[300px] text-[#8b949e]">
                        Chart.js / Recharts placeholder
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
