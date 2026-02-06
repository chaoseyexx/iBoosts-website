import * as React from "react";
import {
    Search,
    MoreHorizontal,
    Shield,
    ShieldBan,
    UserCheck,
    Mail,
    UserCog
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
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { prisma } from "@/lib/prisma/client";
import { UserActions } from "./UserActions"; // New client component for actions

export default async function AdminUsersPage({
    searchParams,
}: {
    searchParams: { q?: string };
}) {
    const query = searchParams.q || "";

    const users = await prisma.user.findMany({
        where: query ? {
            OR: [
                { username: { contains: query, mode: 'insensitive' } },
                { email: { contains: query, mode: 'insensitive' } },
            ]
        } : {},
        include: {
            wallet: true
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
                        Identity <span className="text-[#58a6ff]">Matrix</span>
                    </h1>
                    <p className="text-[#8b949e] font-medium mt-1">Direct oversight of platform citizens, roles, and status.</p>
                </div>

                {/* Search / Status Filters */}
                <div className="relative group w-full md:w-96">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#58a6ff]/20 to-transparent rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8b949e] group-hover:text-[#58a6ff] transition-colors" />
                        <form>
                            <Input
                                name="q"
                                defaultValue={query}
                                placeholder="Search by identifier..."
                                className="pl-11 h-12 bg-[#0d1117]/80 backdrop-blur-xl border-[#30363d]/50 text-white rounded-xl focus:border-[#58a6ff]/50 focus:ring-0 font-bold placeholder:text-[#8b949e]/30 transition-all"
                            />
                        </form>
                    </div>
                </div>
            </div>

            {/* Users Table / Data Grid */}
            <div className="relative group border border-[#30363d]/50 bg-[#161b22]/40 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-[#c9d1d9]">
                        <thead>
                            <tr className="bg-black/40 border-b border-[#30363d]/50">
                                <th className="px-8 py-5">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b949e]">Individual</span>
                                </th>
                                <th className="px-8 py-5">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b949e]">Access Level</span>
                                </th>
                                <th className="px-8 py-5">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b949e]">Circuit Status</span>
                                </th>
                                <th className="px-8 py-5">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b949e]">Wallet Reserve</span>
                                </th>
                                <th className="px-8 py-5">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b949e]">Registration</span>
                                </th>
                                <th className="px-8 py-5 text-right">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b949e]">Protocols</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#30363d]/30">
                            {users.map((user) => (
                                <tr key={user.id} className="group/row hover:bg-[#58a6ff]/5 transition-all duration-300">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#30363d] to-[#161b22] border border-[#30363d] flex items-center justify-center font-black text-white overflow-hidden shadow-inner group-hover/row:scale-105 transition-transform">
                                                {user.avatar ? (
                                                    <img src={user.avatar} alt={user.username} className="h-full w-full object-cover" />
                                                ) : (
                                                    user.username.charAt(0).toUpperCase()
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white tracking-tight">{user.username}</div>
                                                <div className="text-[11px] text-[#8b949e] font-medium opacity-60">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className={cn(
                                            "inline-flex items-center px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wider shadow-sm",
                                            user.role === 'ADMIN' ? "text-[#f5a623] border-[#f5a623]/20 bg-[#f5a623]/10" :
                                                user.role === 'SELLER' ? "text-[#58a6ff] border-[#58a6ff]/20 bg-[#58a6ff]/10" :
                                                    "text-[#c9d1d9] border-[#30363d] bg-white/5"
                                        )}>
                                            {user.role}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className={cn(
                                            "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-tight",
                                            user.status === 'ACTIVE'
                                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                : "bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]"
                                        )}>
                                            <div className={cn(
                                                "h-1.5 w-1.5 rounded-full animate-pulse",
                                                user.status === 'ACTIVE' ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" : "bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.5)]"
                                            )} />
                                            {user.status}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="font-black text-white text-lg tracking-tighter tabular-nums">
                                            ${Number(user.wallet?.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-bold text-white">{new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            <span className="text-[10px] text-[#8b949e] font-bold opacity-50 uppercase tracking-widest">{new Date(user.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <UserActions user={user} />
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
