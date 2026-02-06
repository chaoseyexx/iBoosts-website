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
    const params = await searchParams;
    const query = params.q || "";
    const statusFilter = params.status || "ALL";

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
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter drop-shadow-md">
                        Ledger <span className="text-[#f5a623]">Protocol</span>
                    </h1>
                    <p className="text-[#8b949e] font-medium mt-1">Supervise the high-frequency transaction flow across all sectors.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 flex-1 lg:max-w-2xl justify-end">
                    <div className="relative group flex-1">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#f5a623]/20 to-transparent rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8b949e] group-hover:text-[#f5a623] transition-colors" />
                            <form>
                                <Input
                                    name="q"
                                    defaultValue={query}
                                    placeholder="Order ID / Username..."
                                    className="pl-11 h-12 bg-[#0d1117]/80 backdrop-blur-xl border-[#30363d]/50 text-white rounded-xl focus:border-[#f5a623]/50 focus:ring-0 font-bold placeholder:text-[#8b949e]/30 transition-all"
                                />
                            </form>
                        </div>
                    </div>

                    <div className="flex items-center p-1.5 bg-[#161b22]/80 backdrop-blur-xl border border-[#30363d]/50 rounded-2xl overflow-x-auto no-scrollbar whitespace-nowrap">
                        {["ALL", "ACTIVE", "COMPLETED", "DISPUTED"].map((status) => (
                            <a
                                key={status}
                                href={`?status=${status}${query ? `&q=${query}` : ""}`}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                    statusFilter === status
                                        ? "bg-[#f5a623] text-black shadow-[0_0_15px_rgba(245,166,35,0.3)]"
                                        : "text-[#8b949e] hover:text-white hover:bg-white/5"
                                )}
                            >
                                {status}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Orders Grid / Data Grid */}
            <div className="relative group border border-[#30363d]/50 bg-[#161b22]/40 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-[#c9d1d9]">
                        <thead>
                            <tr className="bg-black/40 border-b border-[#30363d]/50">
                                <th className="px-8 py-6">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b949e]">Order Reference</span>
                                </th>
                                <th className="px-8 py-6">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b949e]">Assets</span>
                                </th>
                                <th className="px-8 py-6">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b949e]">Participants</span>
                                </th>
                                <th className="px-8 py-6">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b949e]">Value</span>
                                </th>
                                <th className="px-8 py-6">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b949e]">Status Cycle</span>
                                </th>
                                <th className="px-8 py-6 text-right">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b949e]">Override</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#30363d]/30">
                            {orders.map((order) => (
                                <tr key={order.id} className="group/row hover:bg-[#f5a623]/5 transition-all duration-300">
                                    <td className="px-8 py-6">
                                        <div className="font-black text-white text-base tracking-tighter tabular-nums group-hover/row:text-[#f5a623] transition-colors">
                                            #{order.id.slice(-8).toUpperCase()}
                                        </div>
                                        <div className="text-[9px] text-[#8b949e] font-black tracking-widest uppercase opacity-40 mt-1">{order.id}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/5 flex items-center justify-center text-xl shadow-inner group-hover/row:scale-110 transition-transform">
                                                <Gamepad2 className="h-6 w-6 text-[#f5a623]" />
                                            </div>
                                            <div>
                                                <div className="text-white font-black text-xs uppercase tracking-wider">{order.listing?.category?.name || "Generic Sector"}</div>
                                                <div className="text-[10px] text-[#8b949e] font-bold mt-0.5 line-clamp-1 max-w-[180px]">{order.listing?.title || "Classified Item"}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3 group/buyer">
                                                <div className="h-5 w-5 rounded bg-white/5 border border-white/10 flex items-center justify-center text-[9px] font-black text-[#58a6ff]">B</div>
                                                <span className="text-xs font-bold text-white group-hover/buyer:text-[#58a6ff] transition-colors">{order.buyer?.username || "GUEST_ALPHA"}</span>
                                            </div>
                                            <div className="flex items-center gap-3 group/seller">
                                                <div className="h-5 w-5 rounded bg-white/5 border border-white/10 flex items-center justify-center text-[9px] font-black text-[#f5a623]">S</div>
                                                <span className="text-xs font-bold text-white group-hover/seller:text-[#f5a623] transition-colors">{order.seller?.username || "GUEST_OMEGA"}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 font-black text-white text-xl tracking-tighter tabular-nums">
                                        ${Number(order.finalAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className={cn(
                                            "inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em]",
                                            order.status === 'COMPLETED' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                                                order.status === 'ACTIVE' ? "bg-[#f5a623]/10 text-[#f5a623] border border-[#f5a623]/20" :
                                                    order.status === 'DELIVERED' ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" :
                                                        order.status === 'DISPUTED' ? "bg-rose-500/10 text-rose-400 border border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.1)]" :
                                                            "bg-white/5 text-[#8b949e] border border-white/10"
                                        )}>
                                            <div className={cn(
                                                "h-2 w-2 rounded-full animate-pulse",
                                                order.status === 'COMPLETED' ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" :
                                                    order.status === 'ACTIVE' ? "bg-[#f5a623] shadow-[0_0_8px_rgba(245,166,35,0.5)]" :
                                                        order.status === 'DISPUTED' ? "bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.5)]" :
                                                            "bg-[#8b949e]"
                                            )} />
                                            {order.status}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <OrderActions order={order} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
