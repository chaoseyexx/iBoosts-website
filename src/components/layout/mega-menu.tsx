"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Gamepad2 } from "lucide-react";
import { Game } from "@/lib/constants/games-data";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
        <div className="flex w-full h-[500px] bg-[#161b22] text-[#c9d1d9] overflow-hidden rounded-b-xl shadow-2xl border-t border-[#30363d] overflow-x-hidden">
            {/* Left Column - Popular Games */}
            {hasPopularGames && (
                <div className="w-[300px] xl:w-[450px] 2xl:w-[550px] flex-shrink-0 p-6 xl:p-10 border-r border-[#30363d] overflow-y-auto bg-[#1c2128]/30">
                    <h3 className="text-sm font-semibold text-white mb-6 xl:mb-8 uppercase tracking-widest opacity-60">Popular games</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 xl:gap-6">
                        {popularGames.map((game) => (
                            <Link
                                key={game.id}
                                href={game.href}
                                onClick={handleLinkClick}
                                className="flex flex-col items-center gap-3 p-3 rounded-xl hover:bg-[#1c2128] transition-all group text-center"
                            >
                                <Avatar className="h-12 w-12 rounded-lg bg-[#21262d] border border-[#30363d] shadow-sm transform group-hover:scale-105 transition-transform">
                                    <AvatarImage src={game.icon} alt={game.name} />
                                    <AvatarFallback className="text-xs bg-[#21262d] text-[#8b949e]">
                                        {game.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-xs font-semibold group-hover:text-[#f5a623] transition-colors line-clamp-1">
                                    {game.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Right Column - All Games + Search */}
            <div className="flex-1 flex flex-col bg-[#0d1117]">
                {/* Search Bar */}
                <div className="p-6 border-b border-[#30363d]">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8b949e]" />
                        <input
                            type="text"
                            placeholder="Search for game"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-10 bg-[#161b22] border border-[#30363d] rounded-lg pl-10 pr-4 text-sm text-white placeholder:text-[#8b949e] focus:border-[#f5a623] focus:ring-1 focus:ring-[#f5a623] focus:outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 xl:p-10">
                    <h3 className="text-sm font-semibold text-white mb-6 xl:mb-8 uppercase tracking-widest opacity-60">All games</h3>
                    <div className={cn(
                        "grid gap-x-6 xl:gap-x-10 gap-y-3",
                        hasPopularGames ? "grid-cols-2 xl:grid-cols-3" : "grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                    )}>
                        {filteredGames.length > 0 ? (
                            filteredGames.map((game) => (
                                <Link
                                    key={game.id}
                                    href={game.href}
                                    onClick={handleLinkClick}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#1c2128] transition-colors group"
                                >
                                    <div className="h-8 w-8 rounded-md bg-[#21262d] border border-[#30363d] flex items-center justify-center shrink-0">
                                        {/* Use a generic icon if no specific image is available for 'all games' list to save load */}
                                        <Gamepad2 className="h-4 w-4 text-[#8b949e]" />
                                    </div>
                                    <span className="text-sm font-medium text-[#8b949e] group-hover:text-white transition-colors">
                                        {game.name}
                                    </span>
                                </Link>
                            ))
                        ) : (
                            <div className="text-center py-8 text-[#8b949e]">
                                No games found
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
