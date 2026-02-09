"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Gamepad2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Image from "next/image";

// Flexible game interface that works with both hardcoded and database data
interface Game {
    id: string;
    name: string;
    icon?: string | null;
    href: string;
    isPopular?: boolean;
}

interface MegaMenuProps {
    category: string;
    popularGames: Game[];
    allGames: Game[];
    onClose?: () => void;
}

export function MegaMenu({ category, popularGames, allGames, onClose }: MegaMenuProps) {
    const [searchQuery, setSearchQuery] = React.useState("");

    const filteredGames = React.useMemo(() => {
        if (!searchQuery) return allGames;
        return allGames.filter((game) =>
            game.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [allGames, searchQuery]);

    // Handle closing when clicking a link
    const handleLinkClick = () => {
        if (onClose) onClose();
    };

    const hasPopularGames = popularGames.length > 0;

    return (
        <div className="grid grid-cols-12 w-full min-h-[420px] max-h-[75vh] bg-transparent text-[#c9d1d9] overflow-hidden border-t border-[#30363d] relative">
            {/* Top Glow Accent */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#f5a623]/40 to-transparent z-10" />

            {/* Left Column - Popular Games */}
            {hasPopularGames && (
                <div className="col-span-4 flex flex-col p-5 lg:p-7 border-r border-[#30363d] overflow-y-auto bg-[#0d1117]/80 backdrop-blur-xl relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#f5a623]/5 to-transparent pointer-events-none" />
                    <h3 className="text-[10px] font-black text-[#f5a623] mb-6 uppercase tracking-[0.25em] relative z-10">Popular games</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-2 sm:gap-4 lg:gap-5">
                        {popularGames.map((game) => (
                            <Link
                                key={game.id}
                                href={game.href}
                                onClick={handleLinkClick}
                                className="flex flex-col items-center gap-4 p-4 rounded-2xl bg-[#1c2128]/40 border border-[#30363d]/50 hover:border-[#f5a623]/40 hover:bg-[#1c2128]/80 hover:shadow-[0_0_20px_rgba(245,166,35,0.05)] transition-all duration-300 group text-center"
                            >
                                <Avatar className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 rounded-xl bg-[#21262d] border border-[#30363d] shadow-sm transform group-hover:scale-105 transition-transform mb-1">
                                    <AvatarImage src={game.icon || undefined} alt={game.name} />
                                    <AvatarFallback className="text-xl bg-[#21262d] text-[#8b949e]">
                                        {game.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-xs font-black tracking-tight text-white group-hover:text-[#f5a623] transition-colors relative z-10">
                                    {game.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Right Column - All Games + Search */}
            <div className={cn(
                "flex flex-col bg-[#050506]/95 backdrop-blur-lg",
                hasPopularGames ? "col-span-8" : "col-span-12"
            )}>
                {/* Search Bar */}
                <div className="p-6 border-b border-[#30363d]">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8b949e]" />
                        <input
                            type="text"
                            placeholder="Search for game"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-11 bg-[#161b22]/50 border border-[#30363d] rounded-xl pl-11 pr-4 text-sm text-white placeholder:text-[#8b949e]/60 focus:border-[#f5a623] focus:ring-1 focus:ring-[#f5a623]/10 focus:outline-none transition-all duration-300"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 lg:p-8">
                    <h3 className="text-[10px] font-black text-[#8b949e] mb-6 uppercase tracking-[0.25em] opacity-80">All games</h3>
                    <div className={cn(
                        "grid gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-2 sm:gap-y-3",
                        hasPopularGames ? "grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5"
                    )}>
                        {filteredGames.length > 0 ? (
                            filteredGames.map((game) => (
                                <Link
                                    key={game.id}
                                    href={game.href}
                                    onClick={handleLinkClick}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#1c2128] border border-transparent hover:border-[#30363d] transition-colors group"
                                >
                                    <div className="h-8 w-8 rounded-md bg-[#1c2128] border border-[#30363d] flex items-center justify-center shrink-0 group-hover:border-[#f5a623]/30 transition-colors overflow-hidden relative">
                                        {game.icon ? (
                                            <Image
                                                src={game.icon}
                                                alt={game.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <Gamepad2 className="h-4 w-4 text-[#8b949e] group-hover:text-[#f5a623]" />
                                        )}
                                    </div>
                                    <span className="text-sm font-bold tracking-tight text-[#fdfcf0]/80 group-hover:text-white transition-colors">
                                        {game.name}
                                    </span>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center space-y-6">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-[#f5a623] blur-[40px] opacity-10 rounded-full" />
                                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#1c2128] to-[#0d1117] border border-[#30363d] flex items-center justify-center relative shadow-2xl rotate-3 transform hover:rotate-6 transition-transform duration-500">
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#f5a623]/20 to-transparent rounded-3xl opacity-50" />
                                        <Gamepad2 className="h-10 w-10 text-[#f5a623] drop-shadow-[0_0_15px_rgba(245,166,35,0.5)]" />
                                    </div>
                                    <div className="w-20 h-20 rounded-3xl bg-[#1c2128]/50 border border-[#30363d]/50 absolute -inset-1 -z-10 rotate-12 opacity-40 scale-95" />
                                </div>
                                <div className="space-y-2 max-w-sm">
                                    <h4 className="text-xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
                                        Coming Soon
                                    </h4>
                                    <p className="text-sm font-medium text-[#8b949e] leading-relaxed">
                                        We are actively working on expanding our catalog. Top-tier services for this category are on the way.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
