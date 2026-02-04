"use client";

import * as React from "react";
import {
    Plus,
    Gamepad2,
    Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const GAMES = ["Valorant", "League of Legends", "WoW", "Elden Ring", "Destiny 2"];
const CATEGORIES = ["Boosting", "Accounts", "Items", "Currency", "Coaching"];

export default function AdminCMSPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Content Management</h1>
                <p className="text-[#8b949e]">Manage supported games and service categories.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Games Management */}
                <Card className="bg-[#161b22] border-[#30363d]">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Gamepad2 className="h-5 w-5 text-[#f5a623]" />
                                Supported Games
                            </CardTitle>
                            <CardDescription className="text-[#8b949e]">Games available for listing.</CardDescription>
                        </div>
                        <Button size="sm" className="bg-[#f5a623] text-black hover:bg-[#e09612]">
                            <Plus className="h-4 w-4 mr-2" /> Add Game
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {GAMES.map((game) => (
                                <li key={game} className="flex items-center justify-between p-3 bg-[#0d1117] rounded-lg border border-[#30363d]">
                                    <span className="text-white font-medium">{game}</span>
                                    <Button variant="ghost" size="sm" className="text-[#8b949e] hover:text-white h-7">Edit</Button>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Categories Management */}
                <Card className="bg-[#161b22] border-[#30363d]">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Layers className="h-5 w-5 text-[#58a6ff]" />
                                Service Categories
                            </CardTitle>
                            <CardDescription className="text-[#8b949e]">Types of services sellers can offer.</CardDescription>
                        </div>
                        <Button size="sm" className="bg-[#1f2937] text-white hover:bg-[#30363d] border border-[#30363d]">
                            <Plus className="h-4 w-4 mr-2" /> Add Category
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {CATEGORIES.map((cat) => (
                                <li key={cat} className="flex items-center justify-between p-3 bg-[#0d1117] rounded-lg border border-[#30363d]">
                                    <span className="text-white font-medium">{cat}</span>
                                    <Button variant="ghost" size="sm" className="text-[#8b949e] hover:text-white h-7">Edit</Button>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
