"use client";

import { useTransition } from "react";
import { togglePlatformConfig } from "@/app/(admin)/admin/actions";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

export function PayoutModeToggle({ isManual }: { isManual: boolean }) {
    const [isPending, startTransition] = useTransition();

    const handleToggle = () => {
        startTransition(async () => {
            const result = await togglePlatformConfig("MANUAL_PAYMENTS_ENABLED");
            if (result.success) {
                toast.success(`Manual Payments ${result.newValue ? "Enabled" : "Disabled"}`);
            } else {
                toast.error(result.error || "Failed to toggle");
            }
        });
    };

    return (
        <Button
            onClick={handleToggle}
            disabled={isPending}
            variant="outline"
            className={`h-11 px-6 rounded-2xl border transition-all duration-500 font-black uppercase tracking-widest text-[10px] gap-3 ${isManual
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500/20 shadow-[0_0_20px_rgba(245,166,35,0.1)]"
                    : "bg-emerald-500/10 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                }`}
        >
            {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : isManual ? (
                <ShieldAlert className="h-4 w-4" />
            ) : (
                <ShieldCheck className="h-4 w-4" />
            )}
            PAYOUT MODE: {isManual ? "MANUAL" : "AUTOMATED"}
        </Button>
    );
}
