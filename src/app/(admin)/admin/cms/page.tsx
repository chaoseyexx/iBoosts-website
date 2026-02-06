"use client";

import * as React from "react";
import {
    Plus,
    Gamepad2,
    Layers,
    Loader2,
    Check,
    UserCog
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { fetchCategories, fetchGames, createGame } from "@/app/(admin)/admin/actions";
import { toast } from "sonner";
import slugify from "slugify";

const HARDCODED_CATEGORIES = [
    { id: "currency", name: "Currency", icon: "💰" },
    { id: "accounts", name: "Accounts", icon: "👤" },
    { id: "top-ups", name: "Top Ups", icon: "⬆️" },
    { id: "items", name: "Items", icon: "🎁" },
    { id: "gift-cards", name: "Gift Cards", icon: "🎴" },
    { id: "boosting", name: "Boosting", icon: "🚀" }
];

export default function AdminCMSPage() {
    const [loading, setLoading] = React.useState(true);
    const [submitting, setSubmitting] = React.useState(false);
    const [games, setGames] = React.useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    // Form state
    const [newGame, setNewGame] = React.useState({
        name: "",
        slug: "",
        description: "",
        icon: "",
        isPopular: false,
        categoryIds: [] as string[]
    });

    const loadData = async () => {
        setLoading(true);
        const fetchedGames = await fetchGames();
        setGames(fetchedGames);
        setLoading(false);
    };

    React.useEffect(() => {
        loadData();
    }, []);

    const filteredGames = selectedCategory
        ? games.filter(game => game.categories?.some((c: any) => c.id === selectedCategory))
        : games;

    const handleNameChange = (name: string) => {
        setNewGame(prev => ({
            ...prev,
            name,
            slug: slugify(name, { lower: true, strict: true })
        }));
    };

    const handleCategoryToggle = (categoryId: string) => {
        setNewGame(prev => ({
            ...prev,
            categoryIds: prev.categoryIds.includes(categoryId)
                ? prev.categoryIds.filter(id => id !== categoryId)
                : [...prev.categoryIds, categoryId]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newGame.name || newGame.categoryIds.length === 0) {
            toast.error("Please fill in the game name and select at least one category.");
            return;
        }

        setSubmitting(true);
        const result = await createGame(newGame);
        setSubmitting(false);

        if (result.success) {
            toast.success("Game added successfully! Notifications sent to all users.");
            setIsDialogOpen(false);
            setNewGame({
                name: "",
                slug: "",
                description: "",
                icon: "",
                isPopular: false,
                categoryIds: []
            });
            loadData();
        } else {
            toast.error(result.error || "Failed to add game");
        }
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Game Content Management</h1>
                    <p className="text-[#9ca3af] mt-1">Configure platform-supported games, categories, and elite protocols.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#f5a623] hover:bg-[#e09612] text-black font-extrabold h-11 px-6 rounded-xl transition-all shadow-lg shadow-[#f5a623]/10">
                            <Plus className="h-4 w-4 mr-2" /> Add Protocol Entry
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#1c2128] border-[#2d333b] text-white max-w-lg rounded-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold tracking-tight">Expand Library</DialogTitle>
                            <DialogDescription className="text-[#9ca3af]">
                                Deploy a new game entry. All active users will be notified instantly.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-[#8b949e] uppercase tracking-wider">Game Identity</label>
                                    <Input
                                        placeholder="e.g. Valorant, Roblox"
                                        value={newGame.name}
                                        onChange={(e) => handleNameChange(e.target.value)}
                                        className="bg-[#0a0e13] border-[#2d333b] text-white focus:border-[#f5a623] h-11"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-[#8b949e] uppercase tracking-wider">Marketplace Segments</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {HARDCODED_CATEGORIES.map((cat) => (
                                            <div
                                                key={cat.id}
                                                onClick={() => handleCategoryToggle(cat.id)}
                                                className={cn(
                                                    "flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer",
                                                    newGame.categoryIds.includes(cat.id)
                                                        ? "bg-[#f5a623]/10 border-[#f5a623]/30"
                                                        : "bg-[#0a0e13] border-[#2d333b] hover:border-[#30363d]"
                                                )}
                                            >
                                                <div className={cn(
                                                    "h-5 w-5 rounded flex items-center justify-center transition-all",
                                                    newGame.categoryIds.includes(cat.id) ? "bg-[#f5a623] text-black" : "bg-white/5 text-transparent"
                                                )}>
                                                    <Check className="h-3 w-3 stroke-[3]" />
                                                </div>
                                                <span className="text-sm font-bold text-[#9ca3af]">{cat.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full h-12 bg-[#f5a623] text-black hover:bg-[#e09612] font-bold rounded-xl"
                                >
                                    {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Deploy Protocol"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Sub-Header & Categories Bar */}
            <div className="space-y-6">
                <div className="flex items-center gap-4 overflow-x-auto pb-4 no-scrollbar px-2">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={cn(
                            "px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap border",
                            selectedCategory === null
                                ? "bg-[#f5a623] text-black border-[#f5a623] shadow-lg shadow-[#f5a623]/10"
                                : "bg-[#1c2128] text-[#8b949e] border-[#2d333b] hover:text-white hover:border-[#30363d]"
                        )}
                    >
                        Collective Library
                    </button>
                    {HARDCODED_CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={cn(
                                "flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap border",
                                selectedCategory === cat.id
                                    ? "bg-[#f5a623] text-black border-[#f5a623] shadow-lg shadow-[#f5a623]/10"
                                    : "bg-[#1c2128] text-[#8b949e] border-[#2d333b] hover:text-white hover:border-[#30363d]"
                            )}
                        >
                            <span className="text-lg leading-none">{cat.icon}</span>
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Games Grid */}
                <div className="px-2">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4">
                            <div className="h-10 w-10 border-2 border-[#f5a623] border-t-transparent rounded-full animate-spin" />
                            <p className="text-[#8b949e] font-bold tracking-widest uppercase text-[10px] animate-pulse">Syncing Matrix...</p>
                        </div>
                    ) : filteredGames.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredGames.map((game) => (
                                <div
                                    key={game.id}
                                    className="group relative bg-[#1c2128] border border-[#2d333b] rounded-3xl p-6 transition-all duration-300 hover:border-[#f5a623]/50 hover:-translate-y-1 overflow-hidden"
                                >
                                    {/* Game Image Background */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-[#f5a623]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="relative z-10 space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div className="h-16 w-16 rounded-2xl bg-[#0a0e13] border border-[#2d333b] flex items-center justify-center text-3xl shadow-inner group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                                                {/* In a real app, use game.imageUrl here */}
                                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                                                {game.name.charAt(0)}
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-9 w-9 text-[#8b949e] hover:text-white hover:bg-white/5 rounded-xl border border-transparent hover:border-[#2d333b]">
                                                <UserCog className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-white text-lg tracking-tight group-hover:text-[#f5a623] transition-colors">{game.name}</h3>
                                            <p className="text-[10px] font-bold text-[#58a6ff] uppercase tracking-widest mt-0.5 opacity-60">ID: {game.slug}</p>
                                        </div>

                                        <div className="flex flex-wrap gap-1.5 min-h-[24px]">
                                            {game.categories?.map((c: any) => (
                                                <span
                                                    key={c.id}
                                                    className="text-[9px] font-black text-[#8b949e] bg-[#0a0e13] px-2 py-1 rounded-md border border-[#2d333b] group-hover:border-[#f5a623]/20 uppercase tracking-tighter"
                                                >
                                                    {c.name}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="pt-4 border-t border-[#2d333b] flex items-center justify-between">
                                            {game.isPopular ? (
                                                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#f5a623]/10 border border-[#f5a623]/20">
                                                    <div className="h-1 w-1 rounded-full bg-[#f5a623] animate-pulse" />
                                                    <span className="text-[9px] font-black text-[#f5a623] uppercase tracking-widest">Trending</span>
                                                </div>
                                            ) : <div />}
                                            <button className="text-[10px] font-bold text-[#8b949e] hover:text-white underline underline-offset-4 decoration-[#f5a623]/30 transition-colors uppercase">
                                                View Matrix
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 bg-[#1c2128]/50 border-2 border-dashed border-[#2d333b] rounded-3xl">
                            <Gamepad2 className="h-12 w-12 text-[#2d333b] mb-4" />
                            <h3 className="text-white font-bold tracking-tight">Zero Protocols Found</h3>
                            <p className="text-[#8b949e] text-sm mt-1">This segment of the marketplace has no operational data.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
