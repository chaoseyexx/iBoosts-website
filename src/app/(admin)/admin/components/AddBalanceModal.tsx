"use client";

import * as React from "react";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Minus, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { addUserBalance, subtractUserBalance } from "@/app/(admin)/admin/actions";
import { toast } from "sonner";

interface AddBalanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: {
        id: string;
        username: string;
        currentBalance?: number;
    };
    onSuccess?: () => void;
}

export function AddBalanceModal({ isOpen, onClose, user, onSuccess }: AddBalanceModalProps) {
    const [action, setAction] = useState<"add" | "subtract">("add");
    const [amount, setAmount] = useState("");
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }
        if (!reason.trim()) {
            toast.error("Please provide a reason");
            return;
        }

        setLoading(true);
        try {
            const result = action === "add"
                ? await addUserBalance(user.id, numAmount, reason)
                : await subtractUserBalance(user.id, numAmount, reason);

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(`Successfully ${action === "add" ? "added" : "subtracted"} $${numAmount.toFixed(2)} ${action === "add" ? "to" : "from"} ${user.username}'s balance`);
                onSuccess?.();
                onClose();
                setAmount("");
                setReason("");
            }
        } catch (error) {
            toast.error("Failed to update balance");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#161b22] border-[#30363d] text-white max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-emerald-400" />
                        Adjust Balance
                    </DialogTitle>
                    <DialogDescription className="text-[#8b949e]">
                        Update wallet balance for <span className="text-white font-semibold">{user.username}</span>
                        {user.currentBalance !== undefined && (
                            <span className="block mt-1">Current balance: <span className="text-emerald-400 font-mono">${user.currentBalance.toFixed(2)}</span></span>
                        )}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Action Toggle */}
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            onClick={() => setAction("add")}
                            className={cn(
                                "flex-1 h-12 font-bold",
                                action === "add"
                                    ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                                    : "bg-white/5 hover:bg-white/10 text-[#8b949e] border border-[#30363d]"
                            )}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add
                        </Button>
                        <Button
                            type="button"
                            onClick={() => setAction("subtract")}
                            className={cn(
                                "flex-1 h-12 font-bold",
                                action === "subtract"
                                    ? "bg-rose-500 hover:bg-rose-600 text-white"
                                    : "bg-white/5 hover:bg-white/10 text-[#8b949e] border border-[#30363d]"
                            )}
                        >
                            <Minus className="h-4 w-4 mr-2" />
                            Subtract
                        </Button>
                    </div>

                    {/* Amount Input */}
                    <div className="space-y-2">
                        <Label className="text-sm font-bold text-[#8b949e] uppercase tracking-wider">Amount (USD)</Label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b949e] font-bold">$</span>
                            <Input
                                type="number"
                                step="0.01"
                                min="0.01"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="pl-8 h-12 bg-[#0d1117] border-[#30363d] text-white font-mono text-lg"
                            />
                        </div>
                    </div>

                    {/* Reason Input */}
                    <div className="space-y-2">
                        <Label className="text-sm font-bold text-[#8b949e] uppercase tracking-wider">Reason (Required)</Label>
                        <Input
                            type="text"
                            placeholder="e.g., Compensation for delayed order, Manual refund..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="h-12 bg-[#0d1117] border-[#30363d] text-white"
                        />
                    </div>

                    <DialogFooter className="gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            className="text-[#8b949e] hover:text-white hover:bg-white/5"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading || !amount || !reason}
                            className={cn(
                                "min-w-[120px] font-bold",
                                action === "add"
                                    ? "bg-emerald-500 hover:bg-emerald-600"
                                    : "bg-rose-500 hover:bg-rose-600"
                            )}
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    {action === "add" ? <Plus className="h-4 w-4 mr-2" /> : <Minus className="h-4 w-4 mr-2" />}
                                    {action === "add" ? "Add" : "Subtract"} ${amount || "0.00"}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
