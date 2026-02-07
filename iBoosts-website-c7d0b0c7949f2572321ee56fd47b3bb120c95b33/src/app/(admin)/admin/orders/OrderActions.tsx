"use client";

import * as React from "react";
import {
    MoreHorizontal,
    CheckCircle2,
    XCircle,
    Eye,
    ShieldAlert,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { adminManageOrder } from "../actions";
import { toast } from "sonner";

export function OrderActions({ order }: { order: any }) {
    const [isLoading, setIsLoading] = React.useState(false);

    const handleAdminAction = async (action: "FORCE_COMPLETE" | "FORCE_CANCEL_REFUND") => {
        setIsLoading(true);
        const result = await adminManageOrder(order.id, action);
        setIsLoading(false);
        if (result.success) {
            toast.success(`Order action successful: ${action.replace("_", " ").toLowerCase()}`);
        } else {
            toast.error(result.error || "Failed to perform action");
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-[#8b949e] hover:text-white" disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#1f2937] border-[#30363d] text-[#c9d1d9]">
                <DropdownMenuLabel>Order Management</DropdownMenuLabel>
                <DropdownMenuItem className="hover:bg-[#30363d] cursor-pointer">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-[#30363d] cursor-pointer">
                    <ShieldAlert className="h-4 w-4 mr-2" />
                    Supervise Chat
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-[#30363d]" />
                <DropdownMenuLabel className="text-[10px] uppercase text-[#8b949e] font-bold text-red-400">Admin Override</DropdownMenuLabel>

                <DropdownMenuItem
                    className="hover:bg-[#30363d] cursor-pointer text-green-400 focus:text-green-400"
                    onClick={() => handleAdminAction("FORCE_COMPLETE")}
                    disabled={order.status === "COMPLETED"}
                >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Force Complete
                </DropdownMenuItem>

                <DropdownMenuItem
                    className="hover:bg-[#30363d] cursor-pointer text-red-400 focus:text-red-400"
                    onClick={() => handleAdminAction("FORCE_CANCEL_REFUND")}
                    disabled={order.status === "CANCELLED" || order.status === "REFUNDED"}
                >
                    <XCircle className="h-4 w-4 mr-2" />
                    Force Cancel & Refund
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
