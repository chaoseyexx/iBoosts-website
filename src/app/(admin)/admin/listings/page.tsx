"use client";

import * as React from "react";
import {
    Search,
    MoreHorizontal,
    Trash2,
    Eye,
    Edit
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
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// --- Mock Data ---

const LISTINGS = [
    {
        id: "LST-001",
        title: "Valorant Radiant Rank Boost (Cheap)",
        game: "Valorant",
        seller: "ProBooster_X",
        price: 150.00,
        status: "active",
        created: "Jan 12, 2024"
    },
    {
        id: "LST-002",
        title: "50 Million Runes Service",
        game: "Elden Ring",
        seller: "EldenLord",
        price: 10.00,
        status: "active",
        created: "Jan 10, 2024"
    },
    {
        id: "LST-003",
        title: "Apex Legends Predator Boost",
        game: "Apex Legends",
        seller: "Predator_1",
        price: 250.00,
        status: "inactive",
        created: "Dec 05, 2023"
    },
];

export default function AdminListingsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Listings Management</h1>
                    <p className="text-[#8b949e]">Oversee all active offers on the marketplace.</p>
                </div>
            </div>

            {/* Filters */}
            <Card className="bg-[#161b22] border-[#30363d]">
                <CardContent className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8b949e]" />
                        <Input
                            placeholder="Search listings by title, game, or seller..."
                            className="pl-9 h-10 bg-[#0d1117] border-[#30363d] text-white focus:border-[#f5a623]"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <Card className="bg-[#161b22] border-[#30363d] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-[#c9d1d9]">
                        <thead className="bg-[#0d1117] border-b border-[#30363d] uppercase font-semibold text-xs text-[#8b949e]">
                            <tr>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Game</th>
                                <th className="px-6 py-4">Seller</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#30363d]">
                            {LISTINGS.map((item) => (
                                <tr key={item.id} className="group hover:bg-[#1f2937]/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-white">{item.title}</div>
                                        <div className="text-xs text-[#8b949e]">{item.id}</div>
                                    </td>
                                    <td className="px-6 py-4 text-[#c9d1d9]">{item.game}</td>
                                    <td className="px-6 py-4 text-[#58a6ff] hover:underline cursor-pointer">{item.seller}</td>
                                    <td className="px-6 py-4 font-bold text-white">${item.price.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <Badge variant="outline" className={item.status === 'active' ? "text-green-400 border-green-400/20" : "text-[#8b949e] border-[#8b949e]/20"}>
                                            {item.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-[#8b949e] hover:text-white">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-[#1f2937] border-[#30363d] text-[#c9d1d9]">
                                                <DropdownMenuItem className="hover:bg-[#30363d] cursor-pointer">
                                                    <Eye className="h-4 w-4 mr-2" /> View Listing
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="hover:bg-[#30363d] cursor-pointer">
                                                    <Edit className="h-4 w-4 mr-2" /> Edit Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="hover:bg-[#30363d] cursor-pointer text-red-400 focus:text-red-400">
                                                    <Trash2 className="h-4 w-4 mr-2" /> Force Delete
                                                </DropdownMenuItem>
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
