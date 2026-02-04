import * as React from "react";
import {
    Search,
    Clock,
    Gamepad2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { prisma } from "@/lib/prisma/client";
import { OrderActions } from "./OrderActions";

export default async function AdminOrdersPage({
    searchParams,
}: {
    searchParams: { q?: string, status?: string };
}) {
    const query = (await searchParams).q || "";
    const statusFilter = (await searchParams).status || "ALL";

    const orders = await prisma.order.findMany({
        where: {
            AND: [
                query ? {
                    OR: [
                        { id: { contains: query, mode: 'insensitive' } },
                        { buyer: { username: { contains: query, mode: 'insensitive' } } },
                        { seller: { username: { contains: query, mode: 'insensitive' } } },
                        { listing: { title: { contains: query, mode: 'insensitive' } } },
                    ]
                } : {},
                statusFilter !== "ALL" ? { status: statusFilter as any } : {}
            ]
        },
        include: {
            buyer: true,
            seller: true,
            listing: {
                include: {
                    category: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Order Management</h1>
                    <p className="text-[#8b949e]">Supervise and control all transactions on the platform.</p>
                </div>
            </div>

            {/* Filters & Search */}
            <Card className="bg-[#161b22] border-[#30363d]">
                <CardContent className="p-4 flex flex-wrap gap-4">
                    <form className="relative flex-1 min-w-[300px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8b949e]" />
                        <Input
                            name="q"
                            defaultValue={query}
                            placeholder="Search by Order ID, Buyer, or Seller..."
                            className="pl-9 h-10 bg-[#0d1117] border-[#30363d] text-white focus:border-[#f5a623]"
                        />
                    </form>
                    <div className="flex gap-2">
                        {["ALL", "ACTIVE", "DELIVERED", "COMPLETED", "DISPUTED", "CANCELLED"].map((status) => (
                            <a
                                key={status}
                                href={`?status=${status}${query ? `&q=${query}` : ""}`}
                                className={cn(
                                    "px-3 py-2 rounded-lg text-xs font-medium transition-colors border",
                                    statusFilter === status
                                        ? "bg-[#1f2937] text-white border-[#f5a623]"
                                        : "text-[#8b949e] border-[#30363d] hover:text-white hover:bg-[#1f2937]"
                                )}
                            >
                                {status}
                            </a>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Orders Table */}
            <Card className="bg-[#161b22] border-[#30363d] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-[#c9d1d9]">
                        <thead className="bg-[#0d1117] border-b border-[#30363d] uppercase font-semibold text-xs text-[#8b949e]">
                            <tr>
                                <th className="px-6 py-4">Order Details</th>
                                <th className="px-6 py-4">Game & Product</th>
                                <th className="px-6 py-4">Buyer / Seller</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#30363d]">
                            {orders.map((order) => (
                                <tr key={order.id} className="group hover:bg-[#1f2937]/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-white">#{order.id.slice(-8).toUpperCase()}</div>
                                        <div className="text-[10px] text-[#8b949e] font-mono mt-0.5">{order.id}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Gamepad2 className="h-4 w-4 text-[#f5a623]" />
                                            <div>
                                                <div className="text-white font-medium">{order.listing?.category?.name || "Unknown Game"}</div>
                                                <div className="text-xs text-[#8b949e]">{order.listing?.title || "Unknown Product"}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5">
                                                <Badge variant="outline" className="text-[10px] h-4 px-1 rounded-sm border-[#30363d] text-[#8b949e]">B</Badge>
                                                <span className="text-white">{order.buyer?.username || "Guest"}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Badge variant="outline" className="text-[10px] h-4 px-1 rounded-sm border-[#30363d] text-[#8b949e]">S</Badge>
                                                <span className="text-white">{order.seller?.username || "Guest"}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-white">
                                        ${Number(order.finalAmount).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={cn(
                                            "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                            order.status === 'COMPLETED' ? "bg-green-500/10 text-green-500 border border-green-500/20" :
                                                order.status === 'ACTIVE' ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" :
                                                    order.status === 'DELIVERED' ? "bg-purple-500/10 text-purple-500 border border-purple-500/20" :
                                                        order.status === 'DISPUTED' ? "bg-red-500/10 text-red-500 border border-red-500/20" :
                                                            "bg-gray-500/10 text-gray-500 border border-gray-500/20"
                                        )}>
                                            {order.status}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-[#8b949e] whitespace-nowrap">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="h-3.5 w-3.5" />
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <OrderActions order={order} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
