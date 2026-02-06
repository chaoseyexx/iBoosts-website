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
import { fetchCategories, fetchGames, createGame, seedCMSData } from "@/app/(admin)/admin/actions";
import { toast } from "sonner";
import slugify from "slugify";

export default function AdminCMSPage() {
    const [loading, setLoading] = React.useState(true);
    const [submitting, setSubmitting] = React.useState(false);
    const [seeding, setSeeding] = React.useState(false);
    const [games, setGames] = React.useState<any[]>([]);
    const [categories, setCategories] = React.useState<any[]>([]);
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

    const loadData = React.useCallback(async () => {
        setLoading(true);
        try {
            const [fetchedGames, fetchedCats] = await Promise.all([
                fetchGames(),
                fetchCategories()
            ]);
            setGames(fetchedGames);
            setCategories(fetchedCats || []);
        } catch (error) {
            toast.error("Failed to load games data");
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        loadData();
    }, [loadData]);

    const handleSeed = async () => {
        setSeeding(true);
        const res = await seedCMSData();
        if (res.success) {
            toast.success("Sample games and categories added");
            loadData();
        } else {
            toast.error(res.error || "Seed failed");
        }
        setSeeding(false);
    };

    const handleNameChange = (name: string) => {
        setNewGame(prev => ({
            ...prev,
            name,
            slug: slugify(name, { lower: true, strict: true })
        }));
    };

    const handleCategoryToggle = (id: string) => {
        setNewGame(prev => ({
            ...prev,
            categoryIds: prev.categoryIds.includes(id)
                ? prev.categoryIds.filter(i => i !== id)
                : [...prev.categoryIds, id]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newGame.name || newGame.categoryIds.length === 0) {
            toast.error("Please enter a game name and select at least one category");
            return;
        }

        setSubmitting(true);
        const res = await createGame(newGame);
        if (res.success) {
            toast.success(`${newGame.name} added successfully`);
            setIsDialogOpen(false);
            setNewGame({ name: "", slug: "", description: "", icon: "", isPopular: false, categoryIds: [] });
            loadData();
        } else {
            toast.error(res.error || "Failed to add game");
        }
        setSubmitting(false);
    };

    const filteredGames = selectedCategory
        ? games.filter(g => g.categories.some((c: any) => c.id === selectedCategory))
        : games;

    return (
        <div className="space-y-10 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight uppercase">Games & Categories</h1>
                    <p className="text-[#8b949e] mt-2 font-bold tracking-widest uppercase text-xs opacity-60">Manage platform-supported games and marketplace categories.</p>
                </div>
                <div className="flex items-center gap-4">
                    {categories.length === 0 && (
                        <Button
                            variant="outline"
                            className="border-[#f5a623]/20 text-[#f5a623] hover:bg-[#f5a623]/10 font-bold"
                            onClick={handleSeed}
                            disabled={seeding}
                        >
                            {seeding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Layers className="h-4 w-4 mr-2" />}
                            Seed Sample Data
                        </Button>
                    )}
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-[#f5a623] text-black hover:bg-[#e09612] font-black px-8 py-6 rounded-2xl shadow-[0_0_30px_rgba(245,166,35,0.2)] group">
                                <Plus className="h-5 w-5 mr-3 group-hover:rotate-90 transition-transform duration-500" />
                                Add Game
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#0d1117] border-[#2d333b] text-white sm:max-w-[550px] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black tracking-tighter uppercase">Add New Game</DialogTitle>
                                <DialogDescription className="text-[#8b949e] font-bold uppercase tracking-widest text-[10px]">Add a new game to the marketplace catalog.</DialogDescription>
                            </DialogHeader>

                            <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[#8b949e] uppercase tracking-wider">Game Name</label>
                                        <Input
                                            placeholder="e.g. Valorant, Roblox"
                                            value={newGame.name}
                                            onChange={(e) => handleNameChange(e.target.value)}
                                            className="bg-[#0a0e13] border-[#2d333b] text-white focus:border-[#f5a623] h-11"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-[#8b949e] uppercase tracking-wider">Categories</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {categories.map((cat) => (
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
                                                    <span className="text-xs font-bold text-[#9ca3af]">{cat.name}</span>
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
                                        {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Add Game"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Sub-Header & Categories Bar */}
            <div className="space-y-6">
                <div className="flex items-center gap-8 border-b border-[#2d333b] px-2 pb-0 mb-4 overflow-x-auto no-scrollbar">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={cn(
                            "pb-4 text-xs font-bold uppercase tracking-[0.2em] transition-all relative whitespace-nowrap",
                            selectedCategory === null
                                ? "text-[#f5a623]"
                                : "text-[#8b949e] hover:text-white"
                        )}
                    >
                        All Games
                        {selectedCategory === null && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f5a623] shadow-[0_0_10px_rgba(245,166,35,0.5)]" />
                        )}
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={cn(
                                "flex items-center gap-2 pb-4 text-xs font-bold uppercase tracking-[0.2em] transition-all relative whitespace-nowrap",
                                selectedCategory === cat.id
                                    ? "text-[#f5a623]"
                                    : "text-[#8b949e] hover:text-white"
                            )}
                        >
                            <span className="text-sm">{cat.icon}</span>
                            {cat.name}
                            {selectedCategory === cat.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f5a623] shadow-[0_0_10px_rgba(245,166,35,0.5)]" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Games List (1 by 1) */}
                <div className="px-2 space-y-3">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4">
                            <div className="h-10 w-10 border-2 border-[#f5a623] border-t-transparent rounded-full animate-spin" />
                            <p className="text-[#8b949e] font-bold tracking-widest uppercase text-[10px] animate-pulse">Loading games...</p>
                        </div>
                    ) : filteredGames.length > 0 ? (
                        <div className="flex flex-col gap-3">
                            {filteredGames.map((game) => (
                                <div
                                    key={game.id}
                                    className="group relative bg-[#1c2128] border border-[#2d333b] rounded-2xl p-4 transition-all duration-300 hover:border-[#f5a623]/30 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="h-14 w-14 rounded-xl bg-[#0a0e13] border border-[#2d333b] flex items-center justify-center text-2xl shadow-inner shrink-0 overflow-hidden relative" title={game.name}>
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                                            {game.name.charAt(0)}
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3">
                                                <h3 className="font-bold text-white tracking-tight group-hover:text-[#f5a623] transition-colors">{game.name}</h3>
                                                {game.isPopular && (
                                                    <span className="text-[9px] font-black text-[#f5a623] bg-[#f5a623]/10 px-2 py-0.5 rounded border border-[#f5a623]/20 uppercase tracking-widest">Trending</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest">
                                                <p className="text-[#4b5563]">ID: {game.slug}</p>
                                                <div className="h-1 w-1 rounded-full bg-[#2d333b]" />
                                                <div className="flex gap-2">
                                                    {game.categories?.map((c: any) => (
                                                        <span key={c.id} className="text-[#8b949e]">
                                                            {c.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <button className="text-[10px] font-bold text-[#8b949e] hover:text-white uppercase tracking-widest px-4 py-2 border border-[#2d333b] rounded-lg transition-colors">
                                            View Details
                                        </button>
                                        <Button variant="ghost" size="icon" className="h-10 w-10 text-[#8b949e] hover:text-white hover:bg-white/5 rounded-xl">
                                            <UserCog className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 bg-[#1c2128]/50 border-2 border-dashed border-[#2d333b] rounded-3xl">
                            <Gamepad2 className="h-12 w-12 text-[#2d333b] mb-4" />
                            <h3 className="text-white font-bold tracking-tight">No Games Found</h3>
                            <p className="text-[#8b949e] text-sm mt-1">This category has no games yet.</p>
                            {categories.length === 0 && (
                                <Button
                                    variant="ghost"
                                    className="mt-4 text-[#f5a623] hover:bg-[#f5a623]/10 uppercase text-[10px] font-black tracking-widest"
                                    onClick={handleSeed}
                                    disabled={seeding}
                                >
                                    {seeding ? "Adding sample data..." : "Add Sample Data"}
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
