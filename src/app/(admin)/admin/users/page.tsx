"use client";

import * as React from "react";
import {
    Search,
    MoreHorizontal,
    Shield,
    ShieldBan,
    UserCheck,
    Mail
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

// --- Mock Data ---

const USERS = [
    {
        id: "USR-9921",
        username: "ProBooster_X",
        email: "booster@iboosts.com",
        role: "seller",
        status: "active",
        balance: 1450.50,
        joined: "Jan 12, 2024"
    },
    {
        id: "USR-8822",
        username: "cool_kid_99",
        email: "buyer@gmail.com",
        role: "user",
        status: "active",
        balance: 0.00,
        joined: "Feb 01, 2024"
    },
    {
        id: "USR-7733",
        username: "Scammer_Alert",
        email: "sus@fake.com",
        role: "user",
        status: "banned",
        balance: 12.00,
        joined: "Dec 10, 2023"
    },
    {
        id: "USR-1122",
        username: "Admin_Dave",
        email: "dave@iboosts.com",
        role: "admin",
        status: "active",
        balance: 0.00,
        joined: "Nov 05, 2023"
    },
];

export default function AdminUsersPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">User Management</h1>
                    <p className="text-[#8b949e]">Manage access and roles for all platform members.</p>
                </div>
            </div>

            {/* Filters & Search */}
            <Card className="bg-[#161b22] border-[#30363d]">
                <CardContent className="p-4 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8b949e]" />
                        <Input
                            placeholder="Search by Username or Email..."
                            className="pl-9 h-10 bg-[#0d1117] border-[#30363d] text-white focus:border-[#f5a623]"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card className="bg-[#161b22] border-[#30363d] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-[#c9d1d9]">
                        <thead className="bg-[#0d1117] border-b border-[#30363d] uppercase font-semibold text-xs text-[#8b949e]">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Wallet Balance</th>
                                <th className="px-6 py-4">Joined</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#30363d]">
                            {USERS.map((user) => (
                                <tr key={user.id} className="group hover:bg-[#1f2937]/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-[#30363d] flex items-center justify-center font-bold text-white">
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-medium text-white">{user.username}</div>
                                                <div className="text-xs text-[#8b949e]">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant="outline" className={cn(
                                            "border-[#30363d] capitalize",
                                            user.role === 'admin' ? "text-[#f5a623] border-[#f5a623]/20 bg-[#f5a623]/10" :
                                                user.role === 'seller' ? "text-[#58a6ff] border-[#58a6ff]/20 bg-[#58a6ff]/10" :
                                                    "text-[#c9d1d9]"
                                        )}>
                                            {user.role}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={cn(
                                            "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
                                            user.status === 'active' ? "bg-green-500/10 text-green-500" :
                                                "bg-red-500/10 text-red-500"
                                        )}>
                                            {user.status === 'active' ? <Shield className="h-3 w-3" /> : <ShieldBan className="h-3 w-3" />}
                                            <span className="capitalize">{user.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-white">
                                        ${user.balance.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-[#8b949e]">
                                        {user.joined}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-[#8b949e] hover:text-white">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-[#1f2937] border-[#30363d] text-[#c9d1d9]">
                                                <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                                                <DropdownMenuItem className="hover:bg-[#30363d] cursor-pointer">
                                                    <Mail className="h-4 w-4 mr-2" />
                                                    Send Email
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="hover:bg-[#30363d] cursor-pointer">
                                                    <UserCheck className="h-4 w-4 mr-2" />
                                                    Verify ID
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-[#30363d]" />
                                                {user.status === 'active' ? (
                                                    <DropdownMenuItem className="hover:bg-[#30363d] cursor-pointer text-red-400 focus:text-red-400">
                                                        <ShieldBan className="h-4 w-4 mr-2" />
                                                        Ban User
                                                    </DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem className="hover:bg-[#30363d] cursor-pointer text-green-400 focus:text-green-400">
                                                        <Shield className="h-4 w-4 mr-2" />
                                                        Unban User
                                                    </DropdownMenuItem>
                                                )}

                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
