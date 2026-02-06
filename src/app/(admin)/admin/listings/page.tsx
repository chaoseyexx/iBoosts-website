import * as React from "react";
import {
    Search,
    MoreHorizontal,
    Trash2,
    Eye,
    Edit,
    Gamepad2,
    Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { prisma } from "@/lib/prisma/client";

export default async function AdminListingsPage({
    searchParams,
}: {
    searchParams: { q?: string };
}) {
    const params = await searchParams;
    const query = params.q || "";

    const listings = await prisma.listing.findMany({
        where: query ? {
            OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { category: { name: { contains: query, mode: 'insensitive' } } },
                { seller: { username: { contains: query, mode: 'insensitive' } } },
            ]
        } : {},
        include: {
            seller: true,
            category: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter drop-shadow-md">
                        Listings <span className="text-[#f5a623]">Management</span>
                    </h1>
                    <p className="text-[#8b949e] font-medium mt-1">Manage all active marketplace listings.</p>
                </div>

                {/* Search / Status Filters */}
                <div className="relative group w-full md:w-96">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#f5a623]/20 to-transparent rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8b949e] group-hover:text-[#f5a623] transition-colors" />
                        <form>
                            <Input
                                name="q"
                                defaultValue={query}
                                placeholder="Search by title, sector, or seller..."
                                className="pl-11 h-12 bg-[#0d1117]/80 backdrop-blur-xl border-[#30363d]/50 text-white rounded-xl focus:border-[#f5a623]/50 focus:ring-0 font-bold placeholder:text-[#8b949e]/30 transition-all"
                            />
                        </form>
                    </div>
                </div>
            </div>

            {/* Table / Data Grid */}
            <div className="relative group border border-[#30363d]/50 bg-[#161b22]/40 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-[#c9d1d9]">
                        <thead>
                            <tr className="bg-black/40 border-b border-[#30363d]/50">
                                <th className="px-8 py-6">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b949e]">Marketplace Asset</span>
                                </th>
                                <th className="px-8 py-6">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b949e]">Category</span>
                                </th>
                                <th className="px-8 py-6">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b949e]">Merchant</span>
                                </th>
                                <th className="px-8 py-6">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b949e]">Price</span>
                                </th>
                                <th className="px-8 py-6">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b949e]">Status</span>
                                </th>
                                <th className="px-8 py-6 text-right">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b949e]">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#30363d]/30">
                            {listings.map((item) => (
                                <tr key={item.id} className="group/row hover:bg-[#f5a623]/5 transition-all duration-300">
                                    <td className="px-8 py-6">
                                        <div className="font-black text-white text-base tracking-tight group-hover/row:text-[#f5a623] transition-colors">{item.title}</div>
                                        <div className="text-[9px] text-[#8b949e] font-black tracking-widest uppercase opacity-40 mt-1">{item.id}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center">
                                                <Gamepad2 className="h-4 w-4 text-[#f5a623]" />
                                            </div>
                                            <span className="text-xs font-bold text-white uppercase tracking-wider">{item.category?.name || "Uncategorized"}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3 group/seller">
                                            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#30363d] to-black border border-white/10 flex items-center justify-center text-[10px] font-black text-[#58a6ff]">
                                                {item.seller?.username?.charAt(0).toUpperCase() || "G"}
                                            </div>
                                            <span className="text-xs font-bold text-white group-hover/seller:text-[#58a6ff] transition-colors">
                                                {item.seller?.username || "Unknown"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="font-black text-white text-lg tracking-tighter tabular-nums">
                                            ${Number(item.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className={cn(
                                            "inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em]",
                                            item.status === 'ACTIVE'
                                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(52,211,153,0.1)]"
                                                : "bg-white/5 text-[#8b949e] border border-white/10"
                                        )}>
                                            <div className={cn(
                                                "h-2 w-2 rounded-full animate-pulse",
                                                item.status === 'ACTIVE' ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" : "bg-[#8b949e]"
                                            )} />
                                            {item.status}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-10 w-10 text-[#8b949e] hover:text-white hover:bg-white/5 rounded-xl transition-all"
                                                >
                                                    <MoreHorizontal className="h-5 w-5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                align="end"
                                                className="bg-[#0d1117]/95 backdrop-blur-2xl border-[#30363d]/50 text-[#c9d1d9] rounded-2xl p-2 min-w-[200px] shadow-2xl overflow-hidden"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                                                <DropdownMenuLabel className="font-black text-[10px] uppercase tracking-widest text-[#8b949e] px-4 py-3">Listing Actions</DropdownMenuLabel>

                                                <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group">
                                                    <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-[#f5a623]/20 transition-colors text-[#f5a623]">
                                                        <Eye className="h-4 w-4" />
                                                    </div>
                                                    <span className="font-bold text-sm">View Listing</span>
                                                </DropdownMenuItem>

                                                <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group">
                                                    <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-[#58a6ff]/20 transition-colors text-[#58a6ff]">
                                                        <Edit className="h-4 w-4" />
                                                    </div>
                                                    <span className="font-bold text-sm">Edit Listing</span>
                                                </DropdownMenuItem>

                                                <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-rose-500/10 cursor-pointer transition-all group mt-2 text-rose-400 focus:text-rose-400">
                                                    <div className="h-8 w-8 rounded-lg bg-rose-500/5 flex items-center justify-center group-hover:bg-rose-500/20 transition-colors">
                                                        <Trash2 className="h-4 w-4 shadow-[0_0_8px_rgba(244,63,94,0.3)]" />
                                                    </div>
                                                    <span className="font-black text-xs uppercase tracking-tighter">Delete Listing</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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
