"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, DollarSign, Package, ShoppingBag, Users } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function SellerDashboardPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-white tracking-tight uppercase">Seller Dashboard</h1>
                    <p className="text-sm font-bold text-[#8b949e] uppercase tracking-[0.2em]">Store Performance & Analytics</p>
                </div>
                <Link href="/dashboard/seller/listings/new">
                    <Button className="bg-[#f5a623] hover:bg-[#e09612] text-black font-bold">
                        + Create New Listing
                    </Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Total Revenue", value: "$12,450.00", change: "+12%", icon: DollarSign },
                    { label: "Active Listings", value: "24", change: "+4", icon: Package },
                    { label: "Total Orders", value: "156", change: "+8%", icon: ShoppingBag },
                    { label: "Profile Views", value: "1.2k", change: "+24%", icon: Users },
                ].map((stat) => (
                    <Card key={stat.label} className="p-6 bg-black/40 border-[#2d333b]">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-10 w-10 rounded-lg bg-white/[0.03] flex items-center justify-center border border-white/[0.05]">
                                <stat.icon className="h-5 w-5 text-[#9ca3af]" />
                            </div>
                            <span className="flex items-center text-[10px] font-semibold text-[#f5a623] bg-[#f5a623]/10 border border-[#f5a623]/20 px-2.5 py-1 rounded-full shadow-[0_0_10px_rgba(245,166,35,0.1)]">
                                {stat.change} <ArrowUpRight className="h-3 w-3 ml-1" />
                            </span>
                        </div>
                        <h3 className="text-2xl font-semibold text-white mb-1 tracking-tight">{stat.value}</h3>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                    </Card>
                ))}
            </div>

            {/* Recent Orders Table (Mock) */}
            <Card className="bg-[#0b0f14] border-[#2d333b] overflow-hidden">
                <div className="p-6 border-b border-[#2d333b] flex items-center justify-between">
                    <h3 className="font-bold text-white">Recent Orders</h3>
                    <Link href="/dashboard/seller/orders" className="text-sm text-[#f5a623] hover:underline">
                        View all
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-[10px] font-semibold text-[#8b949e] uppercase bg-black/40 tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Item</th>
                                <th className="px-6 py-4">Buyer</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2d333b]">
                            {[
                                { id: "#ORD-7829", item: "Level 100 Account", buyer: "SpeedyGamer", status: "Pending", amount: "$150.00" },
                                { id: "#ORD-7828", item: "5000 Gold", buyer: "LootHunter", status: "Delivered", amount: "$45.00" },
                                { id: "#ORD-7827", item: "Rank Boost to Diamond", buyer: "ProWannabe", status: "Completed", amount: "$200.00" },
                                { id: "#ORD-7826", item: "Rare Skin Code", buyer: "Collector99", status: "Completed", amount: "$85.00" },
                            ].map((order) => (
                                <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-5 font-bold text-white tracking-tight">{order.id}</td>
                                    <td className="px-6 py-5 text-white font-medium group-hover:text-[#f5a623] transition-colors">{order.item}</td>
                                    <td className="px-6 py-5 text-[#8b949e] font-bold uppercase text-[11px] tracking-wider">{order.buyer}</td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "inline-flex items-center px-2.5 py-1 rounded text-[10px] font-semibold uppercase tracking-widest",
                                            order.status === "Completed" || order.status === "Delivered"
                                                ? "bg-[#f5a623]/10 text-[#f5a623] border border-[#f5a623]/20 shadow-[0_0_10px_rgba(245,166,35,0.1)]"
                                                : order.status === "Pending"
                                                    ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                                                    : "bg-white/5 text-white/50 border-white/10"
                                        )}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-white font-medium">{order.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
