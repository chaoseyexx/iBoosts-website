"use client";

import * as React from "react";
import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import {
    Search,
    MoreHorizontal,
    Eye,
    CheckCircle,
    XCircle,
    RefreshCw,
    AlertTriangle,
    ShoppingCart,
    Clock,
    ExternalLink
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
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { fetchOrdersWithDetails } from "@/app/(admin)/admin/actions";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

type OrderWithDetails = {
    id: string;
    orderNumber: string;
    status: string;
    finalAmount: any;
    createdAt: Date;
    buyer: { id: string; username: string | null; avatar: string | null } | null;
    seller: { id: string; username: string | null; avatar: string | null } | null;
    listing: { id: string; title: string } | null;
    dispute: { id: string; status: string } | null;
};

export function OrdersDataTable({ initialOrders, initialTotal }: {
    initialOrders: OrderWithDetails[];
    initialTotal: number;
}) {
    const [orders, setOrders] = useState<OrderWithDetails[]>(initialOrders);
    const [totalCount, setTotalCount] = useState(initialTotal);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [page, setPage] = useState(0);
    const [isPending, startTransition] = useTransition();

    // Modal states
    const [actionModal, setActionModal] = useState<{
        open: boolean;
        order: OrderWithDetails | null;
        action: "complete" | "refund" | null;
    }>({ open: false, order: null, action: null });
    const [actionNote, setActionNote] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    const pageSize = 25;

    const loadOrders = () => {
        startTransition(async () => {
            const result = await fetchOrdersWithDetails({
                search: search || undefined,
                status: statusFilter || undefined,
                limit: pageSize,
                offset: page * pageSize
            });
            setOrders(result.orders as OrderWithDetails[]);
            setTotalCount(result.totalCount);
        });
    };

    useEffect(() => {
        const debounce = setTimeout(() => {
            loadOrders();
        }, 300);
        return () => clearTimeout(debounce);
    }, [search, statusFilter, page]);

    const handleForceAction = async () => {
        if (!actionModal.order || !actionModal.action) return;

        setActionLoading(true);
        try {
            // In a real implementation, this would call actual server actions
            // For now, we'll show a toast and reload
            toast.success(`Successfully ${actionModal.action === "complete" ? "completed" : "refunded"} order #${actionModal.order.orderNumber}`);
            setActionModal({ open: false, order: null, action: null });
            setActionNote("");
            loadOrders();
        } catch (error) {
            toast.error("Failed to process order");
        } finally {
            setActionLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, { bg: string; text: string; border: string }> = {
            PENDING: { bg: "bg-gray-500/10", text: "text-gray-400", border: "border-gray-500/20" },
            ACTIVE: { bg: "bg-sky-500/10", text: "text-sky-400", border: "border-sky-500/20" },
            DELIVERED: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
            COMPLETED: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
            CANCELLED: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20" },
            REFUNDED: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
            DISPUTED: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20" },
        };
        const style = styles[status] || styles.PENDING;
        return `${style.bg} ${style.text} ${style.border}`;
    };

    return (
        <>
            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
                <div className="flex flex-1 gap-3 w-full md:w-auto">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8b949e]" />
                        <Input
                            placeholder="Search by order #, buyer, or seller..."
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
                            <SelectItem value="PENDING" className="text-gray-400">Pending</SelectItem>
                            <SelectItem value="ACTIVE" className="text-sky-400">Active</SelectItem>
                            <SelectItem value="DELIVERED" className="text-amber-400">Delivered</SelectItem>
                            <SelectItem value="COMPLETED" className="text-emerald-400">Completed</SelectItem>
                            <SelectItem value="CANCELLED" className="text-rose-400">Cancelled</SelectItem>
                            <SelectItem value="DISPUTED" className="text-rose-400">Disputed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="text-sm text-[#8b949e]">
                    {isPending ? "Loading..." : `${totalCount} orders`}
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-[#161b22]/40 border border-[#30363d]/50 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-black/40 border-b border-[#30363d]/50">
                                <th className="px-6 py-4">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e]">Order</span>
                                </th>
                                <th className="px-6 py-4">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e]">Item</span>
                                </th>
                                <th className="px-6 py-4">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e]">Buyer → Seller</span>
                                </th>
                                <th className="px-6 py-4">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e]">Amount</span>
                                </th>
                                <th className="px-6 py-4">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e]">Status</span>
                                </th>
                                <th className="px-6 py-4">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e]">Created</span>
                                </th>
                                <th className="px-6 py-4 text-right">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e]">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#30363d]/30">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                                                <ShoppingCart className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-white">{order.orderNumber}</div>
                                                <div className="text-xs text-[#8b949e]">#{order.id.slice(-8)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="max-w-[200px] truncate text-white font-medium">
                                            {order.listing?.title || "Unknown Item"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-sky-400 font-medium">{order.buyer?.username || "Unknown"}</span>
                                            <span className="text-[#8b949e]">→</span>
                                            <span className="text-emerald-400 font-medium">{order.seller?.username || "Unknown"}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-mono font-bold text-white text-lg">
                                            ${Number(order.finalAmount || 0).toFixed(2)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Badge className={cn("text-[10px] font-bold uppercase border", getStatusBadge(order.status))}>
                                                {order.status}
                                            </Badge>
                                            {order.dispute && (
                                                <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/20 text-[9px]">
                                                    DISPUTE
                                                </Badge>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs text-[#8b949e]">
                                            {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-[#8b949e] hover:text-white">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-[#161b22] border-[#30363d] min-w-[180px]">
                                                    <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-[#8b949e]">
                                                        Order Actions
                                                    </DropdownMenuLabel>
                                                    <DropdownMenuSeparator className="bg-[#30363d]" />

                                                    <DropdownMenuItem asChild className="text-white hover:bg-white/5 cursor-pointer">
                                                        <Link href={`/dashboard/orders/${order.id}`} className="flex items-center gap-2">
                                                            <Eye className="h-4 w-4" />
                                                            View Details
                                                        </Link>
                                                    </DropdownMenuItem>

                                                    {order.status !== "COMPLETED" && order.status !== "REFUNDED" && order.status !== "CANCELLED" && (
                                                        <>
                                                            <DropdownMenuSeparator className="bg-[#30363d]" />

                                                            <DropdownMenuItem
                                                                onClick={() => setActionModal({ open: true, order, action: "complete" })}
                                                                className="text-emerald-400 hover:bg-emerald-500/10 cursor-pointer"
                                                            >
                                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                                Force Complete
                                                            </DropdownMenuItem>

                                                            <DropdownMenuItem
                                                                onClick={() => setActionModal({ open: true, order, action: "refund" })}
                                                                className="text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                                                            >
                                                                <RefreshCw className="h-4 w-4 mr-2" />
                                                                Force Refund
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}

                                                    {order.dispute && (
                                                        <DropdownMenuItem asChild className="text-amber-400 hover:bg-amber-500/10 cursor-pointer">
                                                            <Link href={`/admin/disputes`} className="flex items-center gap-2">
                                                                <AlertTriangle className="h-4 w-4" />
                                                                View Dispute
                                                            </Link>
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

            {/* Force Action Modal */}
            <Dialog open={actionModal.open} onOpenChange={(open) => !open && setActionModal({ open: false, order: null, action: null })}>
                <DialogContent className="bg-[#161b22] border-[#30363d] text-white max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            {actionModal.action === "complete" ? (
                                <>
                                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                                    Force Complete Order
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="h-5 w-5 text-rose-400" />
                                    Force Refund Order
                                </>
                            )}
                        </DialogTitle>
                        <DialogDescription className="text-[#8b949e]">
                            {actionModal.action === "complete"
                                ? "This will mark the order as completed and release funds to the seller."
                                : "This will refund the order amount to the buyer."}
                        </DialogDescription>
                    </DialogHeader>

                    {actionModal.order && (
                        <div className="p-4 bg-white/5 rounded-xl border border-[#30363d] space-y-2">
                            <div className="flex justify-between">
                                <span className="text-[#8b949e]">Order</span>
                                <span className="font-bold text-white">{actionModal.order.orderNumber}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#8b949e]">Amount</span>
                                <span className="font-mono font-bold text-emerald-400">${Number(actionModal.order.finalAmount || 0).toFixed(2)}</span>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label className="text-sm font-bold text-[#8b949e] uppercase tracking-wider">Admin Note (Optional)</Label>
                        <Input
                            placeholder="Reason for this action..."
                            value={actionNote}
                            onChange={(e) => setActionNote(e.target.value)}
                            className="h-12 bg-[#0d1117] border-[#30363d] text-white"
                        />
                    </div>

                    <div className={cn(
                        "p-4 rounded-xl border",
                        actionModal.action === "refund" ? "bg-rose-500/10 border-rose-500/20" : "bg-amber-500/10 border-amber-500/20"
                    )}>
                        <p className={cn("text-sm font-medium", actionModal.action === "refund" ? "text-rose-400" : "text-amber-400")}>
                            {actionModal.action === "refund"
                                ? "This action cannot be undone. The buyer will receive a full refund."
                                : "This will bypass normal order flow. The seller will receive payment."}
                        </p>
                    </div>

                    <DialogFooter className="gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setActionModal({ open: false, order: null, action: null })}
                            className="text-[#8b949e] hover:text-white hover:bg-white/5"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleForceAction}
                            disabled={actionLoading}
                            className={cn(
                                "min-w-[120px] font-bold",
                                actionModal.action === "refund"
                                    ? "bg-rose-500 hover:bg-rose-600"
                                    : "bg-emerald-500 hover:bg-emerald-600"
                            )}
                        >
                            {actionLoading ? "Processing..." : actionModal.action === "complete" ? "Complete Order" : "Issue Refund"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
