"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, DollarSign, Package, ShoppingBag, Users } from "lucide-react";
import Link from "next/link";

export default function SellerDashboardPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Seller Dashboard</h1>
                    <p className="text-[#9ca3af]">Overview of your store performance</p>
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
                    <Card key={stat.label} className="p-6 bg-[#1c2128] border-[#2d333b]">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-10 w-10 rounded-lg bg-[#252b33] flex items-center justify-center">
                                <stat.icon className="h-5 w-5 text-[#9ca3af]" />
                            </div>
                            <span className="flex items-center text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                                {stat.change} <ArrowUpRight className="h-3 w-3 ml-1" />
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                        <p className="text-sm text-[#9ca3af]">{stat.label}</p>
                    </Card>
                ))}
            </div>

            {/* Recent Orders Table (Mock) */}
            <Card className="bg-[#1c2128] border-[#2d333b] overflow-hidden">
                <div className="p-6 border-b border-[#2d333b] flex items-center justify-between">
                    <h3 className="font-bold text-white">Recent Orders</h3>
                    <Link href="/dashboard/seller/orders" className="text-sm text-[#f5a623] hover:underline">
                        View all
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-[#9ca3af] uppercase bg-[#0f1419]">
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
                                <tr key={order.id} className="hover:bg-[#252b33]/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">{order.id}</td>
                                    <td className="px-6 py-4 text-[#e5e7eb]">{order.item}</td>
                                    <td className="px-6 py-4 text-[#9ca3af]">{order.buyer}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === "Completed" ? "bg-green-500/10 text-green-500" :
                                            order.status === "Pending" ? "bg-yellow-500/10 text-yellow-500" :
                                                "bg-blue-500/10 text-blue-500"
                                            }`}>
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
