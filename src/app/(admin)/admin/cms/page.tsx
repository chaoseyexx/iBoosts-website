"use client";

import * as React from "react";
import {
    Plus,
    Gamepad2,
    Layers,
    Loader2,
    Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

export default function AdminCMSPage() {
    const [loading, setLoading] = React.useState(true);
    const [submitting, setSubmitting] = React.useState(false);
    const [games, setGames] = React.useState<any[]>([]);
    const [categories, setCategories] = React.useState<any[]>([]);
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
        const [fetchedGames, fetchedCategories] = await Promise.all([
            fetchGames(),
            fetchCategories()
        ]);
        setGames(fetchedGames);
        setCategories(fetchedCategories);
        setLoading(false);
    };

    React.useEffect(() => {
        loadData();
    }, []);

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
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Content Management</h1>
                    <p className="text-[#8b949e]">Manage supported games and service categories.</p>
                </div>
                <div className="flex gap-4">
                    {/* Game Dialog */}
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-[#f5a623] text-black hover:bg-[#e09612] font-bold">
                                <Plus className="h-4 w-4 mr-2" /> Add New Game
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#161b22] border-[#30363d] text-white">
                            <DialogHeader>
                                <DialogTitle>Add New Game</DialogTitle>
                                <DialogDescription className="text-[#8b949e]">
                                    Adding a new game will automatically notify all active users.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[#c9d1d9]">Game Name</label>
                                    <Input
                                        placeholder="e.g. Roblox, Marvel Rivals"
                                        value={newGame.name}
                                        onChange={(e) => handleNameChange(e.target.value)}
                                        className="bg-[#0d1117] border-[#30363d]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[#c9d1d9]">Slug</label>
                                    <Input
                                        placeholder="roblox"
                                        value={newGame.slug}
                                        readOnly
                                        className="bg-[#0d1117] border-[#30363d] opacity-50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[#c9d1d9]">Categories</label>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        {categories.map((cat) => (
                                            <div key={cat.id} className="flex items-center space-x-2 p-2 bg-[#0d1117] rounded-md border border-[#30363d]">
                                                <Checkbox
                                                    id={`cat-${cat.id}`}
                                                    checked={newGame.categoryIds.includes(cat.id)}
                                                    onCheckedChange={() => handleCategoryToggle(cat.id)}
                                                />
                                                <label htmlFor={`cat-${cat.id}`} className="text-xs text-[#8b949e] cursor-pointer">
                                                    {cat.name}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 pt-2">
                                    <Checkbox
                                        id="isPopular"
                                        checked={newGame.isPopular}
                                        onCheckedChange={(checked) => setNewGame(prev => ({ ...prev, isPopular: !!checked }))}
                                    />
                                    <label htmlFor="isPopular" className="text-sm font-medium text-[#c9d1d9] cursor-pointer">
                                        Mark as Popular (appears in mega-menu left column)
                                    </label>
                                </div>
                                <DialogFooter className="pt-4">
                                    <Button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full bg-[#f5a623] text-black hover:bg-[#e09612] font-bold"
                                    >
                                        {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                                        Create & Notify Users
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Games Management */}
                <Card className="bg-[#161b22] border-[#30363d]">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2 text-lg">
                            <Gamepad2 className="h-5 w-5 text-[#f5a623]" />
                            Supported Games
                        </CardTitle>
                        <CardDescription className="text-[#8b949e]">Games currently live on the platform.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin text-[#f5a623]" />
                            </div>
                        ) : games.length > 0 ? (
                            <ul className="space-y-2">
                                {games.map((game) => (
                                    <li key={game.id} className="flex items-center justify-between p-3 bg-[#0d1117] rounded-lg border border-[#30363d]">
                                        <div className="flex flex-col">
                                            <span className="text-white font-medium flex items-center gap-2">
                                                {game.name}
                                                {game.isPopular && <span className="text-[10px] px-1.5 py-0.5 bg-[#f5a623]/10 text-[#f5a623] border border-[#f5a623]/20 rounded uppercase font-bold">Popular</span>}
                                            </span>
                                            <span className="text-[10px] text-[#8b949e]">
                                                {game.categories.map((c: any) => c.name).join(", ")}
                                            </span>
                                        </div>
                                        <Button variant="ghost" size="sm" className="text-[#8b949e] hover:text-white h-7">Edit</Button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-8 text-[#8b949e]">No games added yet.</div>
                        )}
                    </CardContent>
                </Card>

                {/* Categories Management */}
                <Card className="bg-[#161b22] border-[#30363d]">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2 text-lg">
                            <Layers className="h-5 w-5 text-[#58a6ff]" />
                            Service Categories
                        </CardTitle>
                        <CardDescription className="text-[#8b949e]">Active marketplace categories.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin text-[#58a6ff]" />
                            </div>
                        ) : categories.length > 0 ? (
                            <ul className="space-y-2">
                                {categories.map((cat) => (
                                    <li key={cat.id} className="flex items-center justify-between p-3 bg-[#0d1117] rounded-lg border border-[#30363d]">
                                        <span className="text-white font-medium">{cat.name}</span>
                                        <div className="flex gap-2">
                                            <span className="text-[10px] px-1.5 py-0.5 bg-[#58a6ff]/10 text-[#58a6ff] border border-[#58a6ff]/20 rounded uppercase font-bold self-center">
                                                Active
                                            </span>
                                            <Button variant="ghost" size="sm" className="text-[#8b949e] hover:text-white h-7">Edit</Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-8 text-[#8b949e]">No categories found.</div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
