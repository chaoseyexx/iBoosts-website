"use client";

import * as React from "react";
import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
    Clock,
    ShoppingCart,
    Tags,
    FileCheck,
    XCircle,
    HelpCircle,
    TrendingUp,
    ShieldAlert
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { AddBalanceModal } from "./AddBalanceModal";
import { BanUserModal } from "./BanUserModal";
import {
    activateUser,
    fetchUsersWithStats,
    toggleUserShield,
    updateUserReputation,
    manualApproveKYC
} from "@/app/(admin)/admin/actions";
import { toast } from "sonner";
import { formatDistanceToNow, format } from "date-fns";

type UserWithStats = {
    id: string;
    username: string | null;
    email: string;
    avatar: string | null;
    role: string;
    status: string;
    kycStatus: string;
    createdAt: Date;
    emailVerified: boolean;
    phoneVerified: boolean;
    isShieldActive: boolean;
    reputationScore: number;
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
    const [kycModalUser, setKycModalUser] = useState<UserWithStats | null>(null);

    const pageSize = 50; // Increased to 50 users per page

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

    const handleToggleShield = async (userId: string, active: boolean, username: string) => {
        const result = await toggleUserShield(userId, active);
        if (result.success) {
            toast.success(`iShield ${active ? "enabled" : "disabled"} for ${username}`);
            loadUsers();
        } else {
            toast.error(result.error || "Failed to toggle iShield");
        }
    };

    const handleUpdateReputation = async (userId: string, currentScore: number, username: string) => {
        const input = prompt(`Enter new reputation score for ${username} (Current: ${currentScore})`, currentScore.toString());
        if (input === null) return;
        const newScore = parseInt(input);
        if (isNaN(newScore)) {
            toast.error("Invalid score entered");
            return;
        }

        const result = await updateUserReputation(userId, newScore);
        if (result.success) {
            toast.success(`Reputation updated for ${username}`);
            loadUsers();
        } else {
            toast.error(result.error || "Failed to update reputation");
        }
    };

    const handleManualApproveKYC = async (userId: string, username: string) => {
        if (!confirm(`Are you sure you want to manually approve KYC for ${username}?`)) return;

        const result = await manualApproveKYC(userId);
        if (result.success) {
            toast.success(`KYC approved for ${username}`);
            loadUsers();
        } else {
            toast.error(result.error || "Failed to approve KYC");
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

    const getKycBadge = (kycStatus: string) => {
        const styles: Record<string, { bg: string; icon: React.ReactNode }> = {
            NOT_SUBMITTED: { bg: "bg-gray-500/10 text-gray-400 border-gray-500/20", icon: <HelpCircle className="h-3 w-3" /> },
            PENDING: { bg: "bg-amber-500/10 text-amber-400 border-amber-500/20", icon: <Clock className="h-3 w-3" /> },
            APPROVED: { bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", icon: <CheckCircle className="h-3 w-3" /> },
            REJECTED: { bg: "bg-rose-500/10 text-rose-400 border-rose-500/20", icon: <XCircle className="h-3 w-3" /> },
        };
        return styles[kycStatus] || styles.NOT_SUBMITTED;
    };

    return (
        <>
            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
                <div className="flex flex-1 gap-3 w-full md:w-auto flex-wrap">
                    <div className="relative flex-1 min-w-[250px] max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8b949e]" />
                        <Input
                            placeholder="Search by username, email, or ID..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                            className="pl-10 h-10 bg-[#0d1117] border-[#30363d] text-white text-sm"
                        />
                    </div>

                    <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v === "all" ? "" : v); setPage(0); }}>
                        <SelectTrigger className="w-[130px] h-10 bg-[#0d1117] border-[#30363d] text-white text-sm">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#161b22] border-[#30363d]">
                            <SelectItem value="all" className="text-white">All Status</SelectItem>
                            <SelectItem value="ACTIVE" className="text-emerald-400">Active</SelectItem>
                            <SelectItem value="SUSPENDED" className="text-amber-400">Suspended</SelectItem>
                            <SelectItem value="BANNED" className="text-rose-400">Banned</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v === "all" ? "" : v); setPage(0); }}>
                        <SelectTrigger className="w-[120px] h-10 bg-[#0d1117] border-[#30363d] text-white text-sm">
                            <SelectValue placeholder="Role" />
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

                <div className="text-xs text-[#8b949e]">
                    {isPending ? "Loading..." : `${totalCount} users`}
                </div>
            </div>

            {/* Data Table - More compact */}
            <div className="bg-[#161b22]/40 border border-[#30363d]/50 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="bg-black/40 border-b border-[#30363d]/50">
                                <th className="px-4 py-3">
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#8b949e]">User</span>
                                </th>
                                <th className="px-3 py-3">
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#8b949e]">Role</span>
                                </th>
                                <th className="px-3 py-3">
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#8b949e]">Status</span>
                                </th>
                                <th className="px-3 py-3">
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#8b949e]">KYC</span>
                                </th>
                                <th className="px-3 py-3">
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#8b949e]">Balance</span>
                                </th>
                                <th className="px-3 py-3">
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#8b949e]">Activity</span>
                                </th>
                                <th className="px-3 py-3">
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#8b949e]">Joined</span>
                                </th>
                                <th className="px-3 py-3 text-right">
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#8b949e]">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#30363d]/30">
                            {users.map((user) => {
                                const kycStyle = getKycBadge(user.kycStatus);
                                return (
                                    <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-4 py-2.5">
                                            <div className="flex items-center gap-2.5">
                                                {/* Avatar */}
                                                {user.avatar ? (
                                                    <Image
                                                        src={user.avatar}
                                                        alt={user.username || "User"}
                                                        width={32}
                                                        height={32}
                                                        className="h-8 w-8 rounded-lg object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#f5a623] to-[#f5a623]/60 flex items-center justify-center text-xs font-bold text-black">
                                                        {user.username?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="font-semibold text-white text-sm truncate max-w-[150px]">{user.username || "No username"}</div>
                                                        {user.isShieldActive && (
                                                            <Shield className="h-3 w-3 text-[#f5a623] drop-shadow-[0_0_5px_rgba(245,166,35,0.4)]" />
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="text-[10px] text-[#8b949e] truncate max-w-[150px]">{user.email}</div>
                                                        <div className="text-[9px] font-black text-sky-400 bg-sky-400/10 px-1 rounded uppercase tracking-tighter">REP: {user.reputationScore}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2.5">
                                            <span className={cn("text-[10px] font-bold uppercase", getRoleBadge(user.role))}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2.5">
                                            <Badge className={cn("text-[9px] font-bold uppercase border px-1.5 py-0.5", getStatusBadge(user.status))}>
                                                {user.status}
                                            </Badge>
                                        </td>
                                        <td className="px-3 py-2.5">
                                            <button
                                                onClick={() => setKycModalUser(user)}
                                                className="cursor-pointer hover:opacity-80 transition-opacity"
                                            >
                                                <Badge className={cn("text-[9px] font-bold uppercase border px-1.5 py-0.5 flex items-center gap-1", kycStyle.bg)}>
                                                    {kycStyle.icon}
                                                    {user.kycStatus?.replace("_", " ") || "N/A"}
                                                </Badge>
                                            </button>
                                        </td>
                                        <td className="px-3 py-2.5">
                                            <span className="font-mono font-bold text-emerald-400 text-sm">
                                                ${Number(user.wallet?.balance || 0).toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2.5">
                                            <div className="flex items-center gap-2">
                                                {/* Clickable Orders */}
                                                <Link
                                                    href={`/admin/orders?search=${encodeURIComponent(user.username || user.email)}`}
                                                    className="flex items-center gap-1 text-[#8b949e] hover:text-sky-400 transition-colors"
                                                    title="View Orders"
                                                >
                                                    <ShoppingCart className="h-3 w-3" />
                                                    <span className="text-[10px]">{user._count.buyerOrders + user._count.sellerOrders}</span>
                                                </Link>
                                                {/* Clickable Listings */}
                                                <Link
                                                    href={`/admin/listings?search=${encodeURIComponent(user.username || user.email)}`}
                                                    className="flex items-center gap-1 text-[#8b949e] hover:text-emerald-400 transition-colors"
                                                    title="View Listings"
                                                >
                                                    <Tags className="h-3 w-3" />
                                                    <span className="text-[10px]">{user._count.listings}</span>
                                                </Link>
                                                {/* Disputes (if any) */}
                                                {(user._count.buyerDisputes + user._count.sellerDisputes) > 0 && (
                                                    <Link
                                                        href={`/admin/disputes?search=${encodeURIComponent(user.username || user.email)}`}
                                                        className="flex items-center gap-1 text-rose-400 hover:text-rose-300 transition-colors"
                                                        title="View Disputes"
                                                    >
                                                        <AlertTriangle className="h-3 w-3" />
                                                        <span className="text-[10px]">{user._count.buyerDisputes + user._count.sellerDisputes}</span>
                                                    </Link>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-3 py-2.5">
                                            <span className="text-[10px] text-[#8b949e]">
                                                {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2.5 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => setBalanceModalUser(user)}
                                                    className="h-7 w-7 p-0 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                                                    title="Adjust Balance"
                                                >
                                                    <DollarSign className="h-3.5 w-3.5" />
                                                </Button>

                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-[#8b949e] hover:text-white">
                                                            <MoreHorizontal className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="bg-[#161b22] border-[#30363d] min-w-[160px]">
                                                        <DropdownMenuLabel className="text-[9px] uppercase tracking-widest text-[#8b949e]">
                                                            User Actions
                                                        </DropdownMenuLabel>
                                                        <DropdownMenuSeparator className="bg-[#30363d]" />

                                                        <DropdownMenuItem asChild className="text-white hover:bg-white/5 cursor-pointer text-xs">
                                                            <Link href={`/admin/users/${user.id}`} className="flex items-center gap-2">
                                                                <Eye className="h-3.5 w-3.5" />
                                                                View Profile
                                                            </Link>
                                                        </DropdownMenuItem>

                                                        <DropdownMenuItem
                                                            onClick={() => setKycModalUser(user)}
                                                            className="text-purple-400 hover:bg-purple-500/10 cursor-pointer text-xs"
                                                        >
                                                            <FileCheck className="h-3.5 w-3.5 mr-2" />
                                                            KYC Info
                                                        </DropdownMenuItem>

                                                        <DropdownMenuItem
                                                            onClick={() => setBalanceModalUser(user)}
                                                            className="text-emerald-400 hover:bg-emerald-500/10 cursor-pointer text-xs"
                                                        >
                                                            <DollarSign className="h-3.5 w-3.5 mr-2" />
                                                            Adjust Balance
                                                        </DropdownMenuItem>

                                                        <DropdownMenuSeparator className="bg-[#30363d]" />

                                                        <DropdownMenuItem
                                                            onClick={() => handleToggleShield(user.id, !user.isShieldActive, user.username || user.email)}
                                                            className={cn(
                                                                "cursor-pointer text-xs",
                                                                user.isShieldActive ? "text-rose-400 hover:bg-rose-500/10" : "text-[#f5a623] hover:bg-[#f5a623]/10"
                                                            )}
                                                        >
                                                            <ShieldAlert className="h-3.5 w-3.5 mr-2" />
                                                            {user.isShieldActive ? "Disable iShield" : "Enable iShield"}
                                                        </DropdownMenuItem>

                                                        <DropdownMenuItem
                                                            onClick={() => handleUpdateReputation(user.id, user.reputationScore, user.username || user.email)}
                                                            className="text-sky-400 hover:bg-sky-500/10 cursor-pointer text-xs"
                                                        >
                                                            <TrendingUp className="h-3.5 w-3.5 mr-2" />
                                                            Adjust Reputation ({user.reputationScore})
                                                        </DropdownMenuItem>

                                                        {user.kycStatus !== "APPROVED" && (
                                                            <DropdownMenuItem
                                                                onClick={() => handleManualApproveKYC(user.id, user.username || user.email)}
                                                                className="text-emerald-400 hover:bg-emerald-500/10 cursor-pointer text-xs"
                                                            >
                                                                <UserCheck className="h-3.5 w-3.5 mr-2" />
                                                                Manual Approve KYC
                                                            </DropdownMenuItem>
                                                        )}

                                                        <DropdownMenuSeparator className="bg-[#30363d]" />

                                                        {user.status === "BANNED" || user.status === "SUSPENDED" ? (
                                                            <DropdownMenuItem
                                                                onClick={() => handleActivate(user.id, user.username || user.email)}
                                                                className="text-emerald-400 hover:bg-emerald-500/10 cursor-pointer text-xs"
                                                            >
                                                                <UserCheck className="h-3.5 w-3.5 mr-2" />
                                                                Activate User
                                                            </DropdownMenuItem>
                                                        ) : (
                                                            <DropdownMenuItem
                                                                onClick={() => setBanModalUser(user)}
                                                                className="text-rose-400 hover:bg-rose-500/10 cursor-pointer text-xs"
                                                            >
                                                                <ShieldBan className="h-3.5 w-3.5 mr-2" />
                                                                Suspend / Ban
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-[#30363d]/50 bg-black/20">
                    <div className="text-xs text-[#8b949e]">
                        Showing {page * pageSize + 1} - {Math.min((page + 1) * pageSize, totalCount)} of {totalCount}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setPage(p => Math.max(0, p - 1))}
                            disabled={page === 0}
                            className="h-7 text-xs text-[#8b949e] hover:text-white"
                        >
                            Previous
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setPage(p => p + 1)}
                            disabled={(page + 1) * pageSize >= totalCount}
                            className="h-7 text-xs text-[#8b949e] hover:text-white"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>

            {/* KYC Info Modal */}
            <Dialog open={!!kycModalUser} onOpenChange={(open) => !open && setKycModalUser(null)}>
                <DialogContent className="bg-[#161b22] border-[#30363d] text-white max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold flex items-center gap-2">
                            <FileCheck className="h-5 w-5 text-purple-400" />
                            KYC Information
                        </DialogTitle>
                        <DialogDescription className="text-[#8b949e]">
                            Verification status for {kycModalUser?.username || kycModalUser?.email}
                        </DialogDescription>
                    </DialogHeader>

                    {kycModalUser && (
                        <div className="space-y-4">
                            {/* User Info */}
                            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                                {kycModalUser.avatar ? (
                                    <Image
                                        src={kycModalUser.avatar}
                                        alt={kycModalUser.username || "User"}
                                        width={40}
                                        height={40}
                                        className="h-10 w-10 rounded-lg object-cover"
                                    />
                                ) : (
                                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#f5a623] to-[#f5a623]/60 flex items-center justify-center text-sm font-bold text-black">
                                        {kycModalUser.username?.charAt(0).toUpperCase() || kycModalUser.email.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <p className="font-semibold text-white">{kycModalUser.username || "No username"}</p>
                                    <p className="text-xs text-[#8b949e]">{kycModalUser.email}</p>
                                </div>
                            </div>

                            {/* KYC Status */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-white/5 rounded-xl">
                                    <p className="text-[10px] uppercase tracking-widest text-[#8b949e] mb-1">KYC Status</p>
                                    <Badge className={cn("text-xs font-bold uppercase border flex items-center gap-1.5 w-fit", getKycBadge(kycModalUser.kycStatus).bg)}>
                                        {getKycBadge(kycModalUser.kycStatus).icon}
                                        {kycModalUser.kycStatus?.replace("_", " ") || "N/A"}
                                    </Badge>
                                </div>
                                <div className="p-3 bg-white/5 rounded-xl">
                                    <p className="text-[10px] uppercase tracking-widest text-[#8b949e] mb-1">Account Status</p>
                                    <Badge className={cn("text-xs font-bold uppercase border", getStatusBadge(kycModalUser.status))}>
                                        {kycModalUser.status}
                                    </Badge>
                                </div>
                            </div>

                            {/* Verification Details */}
                            <div className="space-y-2">
                                <p className="text-[10px] uppercase tracking-widest text-[#8b949e]">Verification</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className={cn(
                                        "p-2.5 rounded-lg border flex items-center gap-2",
                                        kycModalUser.emailVerified
                                            ? "bg-emerald-500/10 border-emerald-500/20"
                                            : "bg-white/5 border-[#30363d]"
                                    )}>
                                        {kycModalUser.emailVerified
                                            ? <CheckCircle className="h-4 w-4 text-emerald-400" />
                                            : <XCircle className="h-4 w-4 text-[#8b949e]" />
                                        }
                                        <span className={cn("text-xs font-medium", kycModalUser.emailVerified ? "text-emerald-400" : "text-[#8b949e]")}>
                                            Email
                                        </span>
                                    </div>
                                    <div className={cn(
                                        "p-2.5 rounded-lg border flex items-center gap-2",
                                        kycModalUser.phoneVerified
                                            ? "bg-emerald-500/10 border-emerald-500/20"
                                            : "bg-white/5 border-[#30363d]"
                                    )}>
                                        {kycModalUser.phoneVerified
                                            ? <CheckCircle className="h-4 w-4 text-emerald-400" />
                                            : <XCircle className="h-4 w-4 text-[#8b949e]" />
                                        }
                                        <span className={cn("text-xs font-medium", kycModalUser.phoneVerified ? "text-emerald-400" : "text-[#8b949e]")}>
                                            Phone
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Account Info */}
                            <div className="p-3 bg-white/5 rounded-xl space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-[#8b949e]">User ID</span>
                                    <span className="font-mono text-white">{kycModalUser.id.slice(0, 12)}...</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-[#8b949e]">Joined</span>
                                    <span className="text-white">{format(new Date(kycModalUser.createdAt), "MMM d, yyyy")}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-[#8b949e]">Role</span>
                                    <span className={cn("font-bold uppercase", getRoleBadge(kycModalUser.role))}>{kycModalUser.role}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

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
