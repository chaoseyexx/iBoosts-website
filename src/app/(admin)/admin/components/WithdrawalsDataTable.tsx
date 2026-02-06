"use client";

import * as React from "react";
import { useState, useTransition } from "react";
import {
    Check,
    X,
    MoreHorizontal,
    Wallet,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { processWithdrawal } from "@/app/(admin)/admin/actions";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

type WithdrawalWithUser = {
    id: string;
    amount: any;
    fee: any;
    netAmount: any;
    method: string;
    status: string;
    createdAt: Date;
    user: { id: string; username: string | null; email: string; avatar: string | null } | null;
};

export function WithdrawalsDataTable({ withdrawals: initialWithdrawals }: {
    withdrawals: WithdrawalWithUser[];
}) {
    const [withdrawals, setWithdrawals] = useState<WithdrawalWithUser[]>(initialWithdrawals);
    const [isPending, startTransition] = useTransition();

    // Modal states  
    const [rejectModal, setRejectModal] = useState<{ open: boolean; withdrawal: WithdrawalWithUser | null }>({ open: false, withdrawal: null });
    const [rejectReason, setRejectReason] = useState("");
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const handleApprove = async (withdrawal: WithdrawalWithUser) => {
        setActionLoading(withdrawal.id);
        try {
            const result = await processWithdrawal(withdrawal.id, "APPROVE");
            if (result.success) {
                toast.success(`Approved withdrawal of $${Number(withdrawal.amount).toFixed(2)} for ${withdrawal.user?.username || "user"}`);
                setWithdrawals(prev => prev.map(w => w.id === withdrawal.id ? { ...w, status: "COMPLETED" } : w));
            } else {
                toast.error(result.error || "Failed to approve");
            }
        } catch (error) {
            toast.error("Failed to approve withdrawal");
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async () => {
        if (!rejectModal.withdrawal) return;

        setActionLoading(rejectModal.withdrawal.id);
        try {
            const result = await processWithdrawal(rejectModal.withdrawal.id, "REJECT", rejectReason);
            if (result.success) {
                toast.success(`Rejected withdrawal for ${rejectModal.withdrawal.user?.username || "user"}`);
                setWithdrawals(prev => prev.map(w => w.id === rejectModal.withdrawal!.id ? { ...w, status: "REJECTED" } : w));
                setRejectModal({ open: false, withdrawal: null });
                setRejectReason("");
            } else {
                toast.error(result.error || "Failed to reject");
            }
        } catch (error) {
            toast.error("Failed to reject withdrawal");
        } finally {
            setActionLoading(null);
        }
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, { bg: string; text: string; border: string; icon: React.ReactNode }> = {
            PENDING: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", icon: <Clock className="h-3 w-3" /> },
            PROCESSING: { bg: "bg-sky-500/10", text: "text-sky-400", border: "border-sky-500/20", icon: <Loader2 className="h-3 w-3 animate-spin" /> },
            COMPLETED: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", icon: <CheckCircle className="h-3 w-3" /> },
            REJECTED: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20", icon: <XCircle className="h-3 w-3" /> },
            FAILED: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20", icon: <AlertCircle className="h-3 w-3" /> },
        };
        return styles[status] || styles.PENDING;
    };

    const pendingCount = withdrawals.filter(w => w.status === "PENDING").length;

    return (
        <>
            {/* Stats Bar */}
            <div className="flex items-center gap-6 mb-6">
                <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <span className="text-xs font-bold text-amber-400">{pendingCount} Pending Approval</span>
                </div>
                <div className="text-sm text-[#8b949e]">
                    {withdrawals.length} total withdrawals
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
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e]">Amount</span>
                                </th>
                                <th className="px-6 py-4">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e]">Net (After Fee)</span>
                                </th>
                                <th className="px-6 py-4">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e]">Method</span>
                                </th>
                                <th className="px-6 py-4">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e]">Status</span>
                                </th>
                                <th className="px-6 py-4">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e]">Requested</span>
                                </th>
                                <th className="px-6 py-4 text-right">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e]">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#30363d]/30">
                            {withdrawals.map((withdrawal) => {
                                const status = getStatusBadge(withdrawal.status);
                                return (
                                    <tr key={withdrawal.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                                                    <Wallet className="h-5 w-5 text-white" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white">{withdrawal.user?.username || "Unknown"}</div>
                                                    <div className="text-xs text-[#8b949e]">{withdrawal.user?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-mono font-bold text-white text-lg">
                                                ${Number(withdrawal.amount || 0).toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-mono font-bold text-emerald-400">
                                                ${Number(withdrawal.netAmount || 0).toFixed(2)}
                                            </span>
                                            <span className="text-xs text-[#8b949e] ml-1">(-${Number(withdrawal.fee || 0).toFixed(2)} fee)</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-white uppercase">{withdrawal.method}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge className={cn("text-[10px] font-bold uppercase border flex items-center gap-1.5 w-fit", status.bg, status.text, status.border)}>
                                                {status.icon}
                                                {withdrawal.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs text-[#8b949e]">
                                                {formatDistanceToNow(new Date(withdrawal.createdAt), { addSuffix: true })}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {withdrawal.status === "PENDING" ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleApprove(withdrawal)}
                                                        disabled={actionLoading === withdrawal.id}
                                                        className="h-8 px-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold"
                                                    >
                                                        {actionLoading === withdrawal.id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <>
                                                                <Check className="h-4 w-4 mr-1" />
                                                                Approve
                                                            </>
                                                        )}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => setRejectModal({ open: true, withdrawal })}
                                                        disabled={actionLoading === withdrawal.id}
                                                        className="h-8 px-3 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
                                                    >
                                                        <X className="h-4 w-4 mr-1" />
                                                        Reject
                                                    </Button>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-[#8b949e]">No actions</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            {withdrawals.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center">
                                        <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                                        <p className="text-[#8b949e]">No withdrawal requests</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Reject Modal */}
            <Dialog open={rejectModal.open} onOpenChange={(open) => !open && setRejectModal({ open: false, withdrawal: null })}>
                <DialogContent className="bg-[#161b22] border-[#30363d] text-white max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <XCircle className="h-5 w-5 text-rose-500" />
                            Reject Withdrawal
                        </DialogTitle>
                        <DialogDescription className="text-[#8b949e]">
                            Provide a reason for rejecting this withdrawal request.
                        </DialogDescription>
                    </DialogHeader>

                    {rejectModal.withdrawal && (
                        <div className="p-4 bg-white/5 rounded-xl border border-[#30363d] space-y-2">
                            <div className="flex justify-between">
                                <span className="text-[#8b949e]">User</span>
                                <span className="font-bold text-white">{rejectModal.withdrawal.user?.username}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#8b949e]">Amount</span>
                                <span className="font-mono font-bold text-emerald-400">${Number(rejectModal.withdrawal.amount || 0).toFixed(2)}</span>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label className="text-sm font-bold text-[#8b949e] uppercase tracking-wider">Reason (Required)</Label>
                        <Input
                            placeholder="e.g., Insufficient KYC, Suspicious activity..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            className="h-12 bg-[#0d1117] border-[#30363d] text-white"
                        />
                    </div>

                    <DialogFooter className="gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setRejectModal({ open: false, withdrawal: null })}
                            className="text-[#8b949e] hover:text-white hover:bg-white/5"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleReject}
                            disabled={actionLoading !== null || !rejectReason.trim()}
                            className="min-w-[120px] font-bold bg-rose-500 hover:bg-rose-600"
                        >
                            {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reject Withdrawal"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
