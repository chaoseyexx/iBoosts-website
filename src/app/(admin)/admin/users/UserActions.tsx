"use client";

import * as React from "react";
import {
    MoreHorizontal,
    Shield,
    ShieldBan,
    UserCheck,
    Mail,
    UserCog,
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
import { updateUserStatus, updateUserRole } from "../actions";
import { toast } from "sonner";

export function UserActions({ user }: { user: any }) {
    const [isLoading, setIsLoading] = React.useState(false);

    const handleStatusUpdate = async (newStatus: any) => {
        setIsLoading(true);
        const result = await updateUserStatus(user.id, newStatus);
        setIsLoading(false);
        if (result.success) {
            toast.success(`User status updated to ${newStatus.toLowerCase()}`);
        } else {
            toast.error(result.error || "Failed to update status");
        }
    };

    const handleRoleUpdate = async (newRole: any) => {
        setIsLoading(true);
        const result = await updateUserRole(user.id, newRole);
        setIsLoading(false);
        if (result.success) {
            toast.success(`User role updated to ${newRole.toLowerCase()}`);
        } else {
            toast.error(result.error || "Failed to update role");
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
                <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                <DropdownMenuItem className="hover:bg-[#30363d] cursor-pointer">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-[#30363d]" />

                {/* Role Management */}
                <DropdownMenuLabel className="text-[10px] uppercase text-[#8b949e] font-bold">Change Role</DropdownMenuLabel>
                <DropdownMenuItem
                    className="hover:bg-[#30363d] cursor-pointer"
                    onClick={() => handleRoleUpdate("BUYER")}
                    disabled={user.role === "BUYER"}
                >
                    Set as Buyer
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="hover:bg-[#30363d] cursor-pointer"
                    onClick={() => handleRoleUpdate("SELLER")}
                    disabled={user.role === "SELLER"}
                >
                    Set as Seller
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="hover:bg-[#30363d] cursor-pointer"
                    onClick={() => handleRoleUpdate("ADMIN")}
                    disabled={user.role === "ADMIN"}
                >
                    Set as Admin
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-[#30363d]" />

                {/* Status Management */}
                {user.status === 'ACTIVE' ? (
                    <DropdownMenuItem
                        className="hover:bg-[#30363d] cursor-pointer text-red-400 focus:text-red-400"
                        onClick={() => handleStatusUpdate("BANNED")}
                    >
                        <ShieldBan className="h-4 w-4 mr-2" />
                        Ban User
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem
                        className="hover:bg-[#30363d] cursor-pointer text-green-400 focus:text-green-400"
                        onClick={() => handleStatusUpdate("ACTIVE")}
                    >
                        <Shield className="h-4 w-4 mr-2" />
                        Unban User
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
