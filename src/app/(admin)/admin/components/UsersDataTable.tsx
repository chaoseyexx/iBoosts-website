"use client";

import * as React from "react";
import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import {
    Search,
    MoreHorizontal,
    Shield,
    ShieldBan,
    UserCheck,
    DollarSign,
    Eye,
    Filter,
    ChevronDown,
    Users,
    AlertTriangle,
    CheckCircle,
    Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { AddBalanceModal } from "./AddBalanceModal";
import { BanUserModal } from "./BanUserModal";
import { activateUser, fetchUsersWithStats } from "@/app/(admin)/admin/actions";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

type UserWithStats = {
    id: string;
    username: string | null;
    email: string;
    avatar: string | null;
    role: string;
    status: string;
    createdAt: Date;
    wallet: { balance: any; pendingBalance: any } | null;
    _count: {
        buyerOrders: number;
        sellerOrders: number;
        listings: number;
        buyerDisputes: number;
        sellerDisputes: number;
    };
};

export function UsersDataTable({ initialUsers, initialTotal }: {
    initialUsers: UserWithStats[];
    initialTotal: number;
}) {
    const [users, setUsers] = useState<UserWithStats[]>(initialUsers);
    const [totalCount, setTotalCount] = useState(initialTotal);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [roleFilter, setRoleFilter] = useState<string>("");
    const [page, setPage] = useState(0);
    const [isPending, startTransition] = useTransition();

    // Modal states
    const [balanceModalUser, setBalanceModalUser] = useState<UserWithStats | null>(null);
    const [banModalUser, setBanModalUser] = useState<UserWithStats | null>(null);

    const pageSize = 25;

    const loadUsers = () => {
        startTransition(async () => {
            const result = await fetchUsersWithStats({
                search: search || undefined,
                status: statusFilter || undefined,
                role: roleFilter || undefined,
                limit: pageSize,
                offset: page * pageSize
            });
            setUsers(result.users as UserWithStats[]);
            setTotalCount(result.totalCount);
        });
    };

    useEffect(() => {
        const debounce = setTimeout(() => {
            loadUsers();
        }, 300);
        return () => clearTimeout(debounce);
    }, [search, statusFilter, roleFilter, page]);

    const handleActivate = async (userId: string, username: string) => {
        const result = await activateUser(userId);
        if (result.success) {
            toast.success(`${username} has been activated`);
            loadUsers();
        } else {
            toast.error(result.error || "Failed to activate user");
        }
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            ACTIVE: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
            SUSPENDED: "bg-amber-500/10 text-amber-400 border-amber-500/20",
            BANNED: "bg-rose-500/10 text-rose-400 border-rose-500/20",
            FROZEN: "bg-sky-500/10 text-sky-400 border-sky-500/20",
            PENDING_VERIFICATION: "bg-purple-500/10 text-purple-400 border-purple-500/20"
        };
        return styles[status] || "bg-gray-500/10 text-gray-400 border-gray-500/20";
    };

    const getRoleBadge = (role: string) => {
        const colors: Record<string, string> = {
            ADMIN: "text-rose-400",
            MODERATOR: "text-amber-400",
            SUPPORT: "text-sky-400",
            SELLER: "text-emerald-400",
            BUYER: "text-[#8b949e]"
        };
        return colors[role] || "text-[#8b949e]";
    };

    return (
        <>
            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
                <div className="flex flex-1 gap-3 w-full md:w-auto">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8b949e]" />
                        <Input
                            placeholder="Search by username, email, or ID..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                            className="pl-10 h-11 bg-[#0d1117] border-[#30363d] text-white"
                        />
                    </div>

                    <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v === "all" ? "" : v); setPage(0); }}>
                        <SelectTrigger className="w-[160px] h-11 bg-[#0d1117] border-[#30363d] text-white">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#161b22] border-[#30363d]">
                            <SelectItem value="all" className="text-white">All Status</SelectItem>
                            <SelectItem value="ACTIVE" className="text-emerald-400">Active</SelectItem>
                            <SelectItem value="SUSPENDED" className="text-amber-400">Suspended</SelectItem>
                            <SelectItem value="BANNED" className="text-rose-400">Banned</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v === "all" ? "" : v); setPage(0); }}>
                        <SelectTrigger className="w-[140px] h-11 bg-[#0d1117] border-[#30363d] text-white">
                            <SelectValue placeholder="All Roles" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#161b22] border-[#30363d]">
                            <SelectItem value="all" className="text-white">All Roles</SelectItem>
                            <SelectItem value="ADMIN" className="text-rose-400">Admin</SelectItem>
                            <SelectItem value="MODERATOR" className="text-amber-400">Moderator</SelectItem>
                            <SelectItem value="SELLER" className="text-emerald-400">Seller</SelectItem>
                            <SelectItem value="BUYER" className="text-white">Buyer</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="text-sm text-[#8b949e]">
                    {isPending ? "Loading..." : `${totalCount} users`}
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-[#161b22]/40 border border-[#30363d]/50 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-black/40 border-b border-[#30363d]/50">
                                <th className="px-6 py-4">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e]">User</span>
                                </th>
                                <th className="px-6 py-4">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e]">Role</span>
                                </th>
                                <th className="px-6 py-4">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e]">Status</span>
                                </th>
                                <th className="px-6 py-4">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e]">Balance</span>
                                </th>
                                <th className="px-6 py-4">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e]">Activity</span>
                                </th>
                                <th className="px-6 py-4">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e]">Joined</span>
                                </th>
                                <th className="px-6 py-4 text-right">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e]">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#30363d]/30">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#f5a623] to-[#f5a623]/60 flex items-center justify-center text-sm font-bold text-black">
                                                {user.username?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white">{user.username || "No username"}</div>
                                                <div className="text-xs text-[#8b949e]">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn("text-xs font-bold uppercase", getRoleBadge(user.role))}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className={cn("text-[10px] font-bold uppercase border", getStatusBadge(user.status))}>
                                            {user.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-mono font-bold text-emerald-400">
                                            ${Number(user.wallet?.balance || 0).toFixed(2)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4 text-xs text-[#8b949e]">
                                            <span title="Orders">{user._count.buyerOrders + user._count.sellerOrders} orders</span>
                                            <span title="Listings">{user._count.listings} listings</span>
                                            {(user._count.buyerDisputes + user._count.sellerDisputes) > 0 && (
                                                <span className="text-rose-400">{user._count.buyerDisputes + user._count.sellerDisputes} disputes</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs text-[#8b949e]">
                                            {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => setBalanceModalUser(user)}
                                                className="h-8 px-3 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                                            >
                                                <DollarSign className="h-4 w-4" />
                                            </Button>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-[#8b949e] hover:text-white">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-[#161b22] border-[#30363d] min-w-[180px]">
                                                    <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-[#8b949e]">
                                                        User Actions
                                                    </DropdownMenuLabel>
                                                    <DropdownMenuSeparator className="bg-[#30363d]" />

                                                    <DropdownMenuItem asChild className="text-white hover:bg-white/5 cursor-pointer">
                                                        <Link href={`/admin/users/${user.id}`} className="flex items-center gap-2">
                                                            <Eye className="h-4 w-4" />
                                                            View Profile
                                                        </Link>
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem
                                                        onClick={() => setBalanceModalUser(user)}
                                                        className="text-emerald-400 hover:bg-emerald-500/10 cursor-pointer"
                                                    >
                                                        <DollarSign className="h-4 w-4 mr-2" />
                                                        Adjust Balance
                                                    </DropdownMenuItem>

                                                    <DropdownMenuSeparator className="bg-[#30363d]" />

                                                    {user.status === "BANNED" || user.status === "SUSPENDED" ? (
                                                        <DropdownMenuItem
                                                            onClick={() => handleActivate(user.id, user.username || user.email)}
                                                            className="text-emerald-400 hover:bg-emerald-500/10 cursor-pointer"
                                                        >
                                                            <UserCheck className="h-4 w-4 mr-2" />
                                                            Activate User
                                                        </DropdownMenuItem>
                                                    ) : (
                                                        <DropdownMenuItem
                                                            onClick={() => setBanModalUser(user)}
                                                            className="text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                                                        >
                                                            <ShieldBan className="h-4 w-4 mr-2" />
                                                            Suspend / Ban
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-[#30363d]/50 bg-black/20">
                    <div className="text-sm text-[#8b949e]">
                        Showing {page * pageSize + 1} - {Math.min((page + 1) * pageSize, totalCount)} of {totalCount}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setPage(p => Math.max(0, p - 1))}
                            disabled={page === 0}
                            className="text-[#8b949e] hover:text-white"
                        >
                            Previous
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setPage(p => p + 1)}
                            disabled={(page + 1) * pageSize >= totalCount}
                            className="text-[#8b949e] hover:text-white"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {balanceModalUser && (
                <AddBalanceModal
                    isOpen={!!balanceModalUser}
                    onClose={() => setBalanceModalUser(null)}
                    user={{
                        id: balanceModalUser.id,
                        username: balanceModalUser.username || balanceModalUser.email,
                        currentBalance: Number(balanceModalUser.wallet?.balance || 0)
                    }}
                    onSuccess={loadUsers}
                />
            )}

            {banModalUser && (
                <BanUserModal
                    isOpen={!!banModalUser}
                    onClose={() => setBanModalUser(null)}
                    user={{
                        id: banModalUser.id,
                        username: banModalUser.username || banModalUser.email
                    }}
                    onSuccess={loadUsers}
                />
            )}
        </>
    );
}
