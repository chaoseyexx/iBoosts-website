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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, ShieldBan, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { banUser, suspendUser } from "@/app/(admin)/admin/actions";
import { toast } from "sonner";

const BAN_REASONS = [
    { value: "fraud", label: "Fraud / Scam" },
    { value: "chargeback", label: "Chargeback Abuse" },
    { value: "tos", label: "Terms of Service Violation" },
    { value: "spam", label: "Spam / Abuse" },
    { value: "harassment", label: "Harassment" },
    { value: "other", label: "Other" },
];

interface BanUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: {
        id: string;
        username: string;
    };
    onSuccess?: () => void;
}

export function BanUserModal({ isOpen, onClose, user, onSuccess }: BanUserModalProps) {
    const [action, setAction] = useState<"ban" | "suspend">("suspend");
    const [reason, setReason] = useState("");
    const [customNote, setCustomNote] = useState("");
    const [duration, setDuration] = useState<"7_DAYS" | "30_DAYS" | "PERMANENT">("7_DAYS");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!reason) {
            toast.error("Please select a reason");
            return;
        }

        const fullReason = customNote ? `${BAN_REASONS.find(r => r.value === reason)?.label}: ${customNote}` : BAN_REASONS.find(r => r.value === reason)?.label || reason;

        setLoading(true);
        try {
            const result = action === "ban"
                ? await banUser(user.id, fullReason, duration)
                : await suspendUser(user.id, fullReason);

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(`Successfully ${action === "ban" ? "banned" : "suspended"} ${user.username}`);
                onSuccess?.();
                onClose();
                setReason("");
                setCustomNote("");
            }
        } catch (error) {
            toast.error("Failed to update user status");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#161b22] border-[#30363d] text-white max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <ShieldBan className="h-5 w-5 text-rose-500" />
                        Moderate User
                    </DialogTitle>
                    <DialogDescription className="text-[#8b949e]">
                        Take action against <span className="text-white font-semibold">{user.username}</span>
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Action Toggle */}
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            onClick={() => setAction("suspend")}
                            className={cn(
                                "flex-1 h-12 font-bold",
                                action === "suspend"
                                    ? "bg-amber-500 hover:bg-amber-600 text-black"
                                    : "bg-white/5 hover:bg-white/10 text-[#8b949e] border border-[#30363d]"
                            )}
                        >
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Suspend
                        </Button>
                        <Button
                            type="button"
                            onClick={() => setAction("ban")}
                            className={cn(
                                "flex-1 h-12 font-bold",
                                action === "ban"
                                    ? "bg-rose-500 hover:bg-rose-600 text-white"
                                    : "bg-white/5 hover:bg-white/10 text-[#8b949e] border border-[#30363d]"
                            )}
                        >
                            <ShieldBan className="h-4 w-4 mr-2" />
                            Ban
                        </Button>
                    </div>

                    {/* Duration (only for ban) */}
                    {action === "ban" && (
                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-[#8b949e] uppercase tracking-wider">Duration</Label>
                            <Select value={duration} onValueChange={(v) => setDuration(v as typeof duration)}>
                                <SelectTrigger className="h-12 bg-[#0d1117] border-[#30363d] text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#161b22] border-[#30363d]">
                                    <SelectItem value="7_DAYS" className="text-white hover:bg-white/5">7 Days</SelectItem>
                                    <SelectItem value="30_DAYS" className="text-white hover:bg-white/5">30 Days</SelectItem>
                                    <SelectItem value="PERMANENT" className="text-rose-400 hover:bg-white/5">Permanent</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Reason Select */}
                    <div className="space-y-2">
                        <Label className="text-sm font-bold text-[#8b949e] uppercase tracking-wider">Reason</Label>
                        <Select value={reason} onValueChange={setReason}>
                            <SelectTrigger className="h-12 bg-[#0d1117] border-[#30363d] text-white">
                                <SelectValue placeholder="Select a reason..." />
                            </SelectTrigger>
                            <SelectContent className="bg-[#161b22] border-[#30363d]">
                                {BAN_REASONS.map((r) => (
                                    <SelectItem key={r.value} value={r.value} className="text-white hover:bg-white/5">
                                        {r.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Custom Note */}
                    <div className="space-y-2">
                        <Label className="text-sm font-bold text-[#8b949e] uppercase tracking-wider">Additional Notes (Optional)</Label>
                        <Input
                            type="text"
                            placeholder="Provide additional context..."
                            value={customNote}
                            onChange={(e) => setCustomNote(e.target.value)}
                            className="h-12 bg-[#0d1117] border-[#30363d] text-white"
                        />
                    </div>

                    {/* Warning */}
                    <div className={cn(
                        "p-4 rounded-xl border",
                        action === "ban" ? "bg-rose-500/10 border-rose-500/20" : "bg-amber-500/10 border-amber-500/20"
                    )}>
                        <p className={cn("text-sm font-medium", action === "ban" ? "text-rose-400" : "text-amber-400")}>
                            {action === "ban"
                                ? duration === "PERMANENT"
                                    ? "This will permanently ban the user from the platform."
                                    : `This user will be banned for ${duration === "7_DAYS" ? "7 days" : "30 days"}.`
                                : "Suspended users cannot access their account until an admin reactivates it."}
                        </p>
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
                            disabled={loading || !reason}
                            className={cn(
                                "min-w-[120px] font-bold",
                                action === "ban"
                                    ? "bg-rose-500 hover:bg-rose-600"
                                    : "bg-amber-500 hover:bg-amber-600 text-black"
                            )}
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    {action === "ban" ? <ShieldBan className="h-4 w-4 mr-2" /> : <AlertTriangle className="h-4 w-4 mr-2" />}
                                    {action === "ban" ? "Ban User" : "Suspend User"}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
