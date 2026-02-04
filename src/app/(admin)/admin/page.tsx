"use client";

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

// Mock Stats Data
const STATS = [
    {
        title: "Total Revenue",
        value: "$45,231.89",
        change: "+20.1% from last month",
        trend: "up",
        icon: DollarSign,
        color: "text-[#238636]"
    },
    {
        title: "Active Orders",
        value: "2,350",
        change: "+180 since last hour",
        trend: "up",
        icon: ShoppingCart,
        color: "text-[#f5a623]"
    },
    {
        title: "New Users",
        value: "+573",
        change: "+201 since last week",
        trend: "up",
        icon: Users,
        color: "text-[#58a6ff]"
    },
    {
        title: "Active Disputes",
        value: "12",
        change: "-2 since yesterday",
        trend: "down",
        icon: AlertCircle,
        color: "text-[#da3633]"
    }
];

export default function AdminDashboardPage() {
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
