"use client";

import * as React from "react";
import { Search, X, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";

interface NavGame {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
    href: string;
}

interface SearchDropdownProps {
    gamesData: Record<string, { popular: NavGame[]; all: NavGame[] }>;
    className?: string;
    isMobile?: boolean;
}

interface SearchResult {
    gameName: string;
    categoryName: string;
    href: string;
    icon: string | null;
}

export function SearchDropdown({ gamesData, className, isMobile }: SearchDropdownProps) {
    const router = useRouter();
    const [query, setQuery] = React.useState("");
    const [isOpen, setIsOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Flatten and memoize all searchable items
    const allItems = React.useMemo(() => {
        const items: SearchResult[] = [];

        Object.entries(gamesData).forEach(([categoryName, data]) => {
            // Index 'popular' games
            if (data.popular) {
                data.popular.forEach(game => {
                    items.push({
                        gameName: game.name,
                        categoryName: categoryName,
                        href: game.href,
                        icon: game.icon
                    });
                });
            }

            // Index 'all' (rest of) games
            if (data.all) {
                data.all.forEach(game => {
                    items.push({
                        gameName: game.name,
                        categoryName: categoryName,
                        href: game.href,
                        icon: game.icon
                    });
                });
            }
        });
        return items;
    }, [gamesData]);

    // Filter items based on query
    const filteredItems = React.useMemo(() => {
        if (!query.trim()) return [];

        const normalizedQuery = query.toLowerCase().trim();
        return allItems.filter(item =>
            item.gameName.toLowerCase().includes(normalizedQuery) ||
            item.categoryName.toLowerCase().includes(normalizedQuery)
        ).slice(0, 10); // Limit to 10 results for performance/UI
    }, [query, allItems]);

    // Handle clicks outside to close dropdown
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (href: string) => {
        router.push(href);
        setIsOpen(false);
        setQuery("");
        inputRef.current?.blur();
    };

    return (
        <div ref={containerRef} className={cn(
            "relative w-full",
            !isMobile && "max-w-2xl",
            className
        )}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8b949e]" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder={isMobile ? "Search..." : "Search products (e.g. Roblox, WoW)..."}
                    className={cn(
                        "w-full pr-10 bg-[#161b22] border border-[#30363d] rounded-lg text-sm text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-0 transition-all",
                        isMobile ? "h-11 pl-11" : "h-10 pl-10"
                    )}
                />
                {query && (
                    <button
                        onClick={() => {
                            setQuery("");
                            inputRef.current?.focus();
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 hover:bg-[#30363d] rounded-full p-0.5 transition-colors"
                    >
                        <X className="h-3.5 w-3.5 text-[#8b949e] hover:text-white" />
                    </button>
                )}
            </div>

            <AnimatePresence>
                {isOpen && (query.trim().length > 0 || Object.keys(gamesData).length > 0) && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className={cn(
                            "absolute top-[calc(100%+8px)] left-0 w-full bg-[#1c2128] border border-[#30363d] rounded-xl shadow-2xl z-50 overflow-hidden overflow-y-auto",
                            isMobile ? "max-h-[60vh]" : "max-h-[400px]"
                        )}
                    >
                        {filteredItems.length > 0 ? (
                            <div className="py-2">
                                <div className="px-3 py-1.5 text-xs font-bold text-[#8b949e] uppercase tracking-wider">
                                    Search Results
                                </div>
                                {filteredItems.map((item, index) => (
                                    <button
                                        key={`${item.gameName}-${item.categoryName}-${index}`}
                                        onClick={() => handleSelect(item.href)}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#30363d] transition-colors group text-left border-l-2 border-transparent hover:border-[#f5a623]"
                                    >
                                        <div className="h-8 w-8 rounded-lg bg-[#0d1117] border border-[#30363d] flex items-center justify-center shrink-0 overflow-hidden relative">
                                            {item.icon ? (
                                                <img src={item.icon} alt={item.gameName} className="h-full w-full object-cover" />
                                            ) : (
                                                <span className="text-xs font-bold text-[#8b949e]">{item.gameName[0]}</span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-bold text-white group-hover:text-[#f5a623] transition-colors flex items-center gap-2">
                                                {item.gameName}
                                                <span className="text-[10px] bg-[#21262d] text-[#8b949e] px-1.5 py-0.5 rounded border border-[#30363d] uppercase font-bold tracking-wide">
                                                    {item.categoryName}
                                                </span>
                                            </div>
                                            <div className="text-xs text-[#8b949e] truncate">
                                                View all {item.categoryName} offers for {item.gameName}
                                            </div>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-[#8b949e] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                                    </button>
                                ))}
                            </div>
                        ) : query.trim().length > 0 ? (
                            <div className="p-8 text-center text-[#8b949e]">
                                <Search className="h-8 w-8 mx-auto mb-3 opacity-20" />
                                <p className="text-sm">No results found for <span className="text-white font-bold">"{query}"</span></p>
                            </div>
                        ) : (
                            // Default view when focused but empty (optional, maybe popular games?)
                            <div className="py-2">
                                <div className="px-3 py-1.5 text-xs font-bold text-[#8b949e] uppercase tracking-wider">
                                    Popular Suggestions
                                </div>
                                {/* Filter just a few popular ones if available, or just keeping it empty/simple for now since user asked for filtering behavior */}
                                {allItems.filter(i => ["Roblox", "Valorant", "League of Legends"].includes(i.gameName)).slice(0, 5).map((item, index) => (
                                    <button
                                        key={`pop-${index}`}
                                        onClick={() => handleSelect(item.href)}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#30363d] transition-colors group text-left"
                                    >
                                        <Search className="h-4 w-4 text-[#8b949e] group-hover:text-white" />
                                        <span className="text-sm text-[#c9d1d9] group-hover:text-white">
                                            {item.gameName} <span className="text-[#8b949e] text-xs ml-1">in {item.categoryName}</span>
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
