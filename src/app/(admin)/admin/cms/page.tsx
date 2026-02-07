"use client";

import * as React from "react";
import {
    Plus,
    Gamepad2,
    Layers,
    Loader2,
    Check,
    Pencil,
    Trash2,
    X,
    Upload,
    ImageIcon,
    PauseCircle,
    PlayCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { fetchCategories, fetchGames, createGame, seedCMSData, updateGame, deleteGame, uploadGameIcon, uploadGameBanner, toggleGameStatus } from "@/app/(admin)/admin/actions";
import { toast } from "sonner";
import slugify from "slugify";
import Image from "next/image";

export default function AdminCMSPage() {
    const [loading, setLoading] = React.useState(true);
    const [submitting, setSubmitting] = React.useState(false);
    const [uploading, setUploading] = React.useState(false);
    const [seeding, setSeeding] = React.useState(false);
    const [games, setGames] = React.useState<any[]>([]);
    const [categories, setCategories] = React.useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [editingGame, setEditingGame] = React.useState<any | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = React.useState<string | null>(null);

    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const bannerInputRef = React.useRef<HTMLInputElement>(null);

    // Form state
    const [formData, setFormData] = React.useState({
        name: "",
        slug: "",
        description: "",
        icon: "",
        banner: "",
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
            if (!selectedCategory && fetchedCats && fetchedCats.length > 0) {
                setSelectedCategory(fetchedCats[0].id);
            }
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

    const resetForm = () => {
        setFormData({
            name: "",
            slug: "",
            description: "",
            icon: "",
            banner: "",
            isPopular: false,
            categoryIds: []
        });
        setEditingGame(null);
    };

    const handleNameChange = (name: string) => {
        setFormData(prev => ({
            ...prev,
            name,
            slug: slugify(name, { lower: true, strict: true })
        }));
    };

    const handleCategoryToggle = (id: string) => {
        setFormData(prev => ({
            ...prev,
            categoryIds: prev.categoryIds.includes(id)
                ? prev.categoryIds.filter(i => i !== id)
                : [...prev.categoryIds, id]
        }));
    };

    const handleToggleStatus = async (gameId: string, currentStatus: boolean, gameName: string) => {
        const newStatus = !currentStatus;
        const res = await toggleGameStatus(gameId, newStatus);

        if (res.success) {
            toast.success(`${gameName} is now ${newStatus ? "Active" : "Paused"}`);
            loadData();
        } else {
            toast.error(res.error || "Failed to update status");
        }
    };

    const handleOpenEdit = (game: any) => {
        setEditingGame(game);
        setFormData({
            name: game.name,
            slug: game.slug,
            description: game.description || "",
            icon: game.icon || "",
            banner: game.banner || "",
            isPopular: game.isPopular || false,
            categoryIds: game.categories?.map((c: any) => c.id) || []
        });
        setIsDialogOpen(true);
    };

    const handleOpenNew = () => {
        resetForm();
        setIsDialogOpen(true);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const formDataUpload = new FormData();
            formDataUpload.append("file", file);
            if (editingGame) {
                formDataUpload.append("gameId", editingGame.id);
            }

            const result = await uploadGameIcon(formDataUpload);

            if (result.success && result.url) {
                setFormData(prev => ({ ...prev, icon: result.url }));
                toast.success("Icon uploaded");
                if (editingGame) {
                    loadData(); // Refresh to show updated icon
                }
            } else {
                toast.error(result.error || "Upload failed");
            }
        } catch (error) {
            toast.error("Upload failed");
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const formDataUpload = new FormData();
            formDataUpload.append("file", file);
            if (editingGame) {
                formDataUpload.append("gameId", editingGame.id);
            }

            const result = await uploadGameBanner(formDataUpload);

            if (result.success && result.url) {
                setFormData(prev => ({ ...prev, banner: result.url }));
                toast.success("Banner uploaded");
                if (editingGame) {
                    loadData();
                }
            } else {
                toast.error(result.error || "Upload failed");
            }
        } catch (error) {
            toast.error("Upload failed");
        } finally {
            setUploading(false);
            if (bannerInputRef.current) {
                bannerInputRef.current.value = "";
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || formData.categoryIds.length === 0) {
            toast.error("Please enter a game name and select at least one category");
            return;
        }

        setSubmitting(true);

        if (editingGame) {
            const res = await updateGame(editingGame.id, formData);
            if (res.success) {
                toast.success(`${formData.name} updated successfully`);
                setIsDialogOpen(false);
                resetForm();
                loadData();
            } else {
                toast.error(res.error || "Failed to update game");
            }
        } else {
            const res = await createGame(formData);
            if (res.success) {
                toast.success(`${formData.name} added successfully`);
                setIsDialogOpen(false);
                resetForm();
                loadData();
            } else {
                toast.error(res.error || "Failed to add game");
            }
        }
        setSubmitting(false);
    };

    const handleDelete = async (gameId: string, gameName: string) => {
        const res = await deleteGame(gameId);
        if (res.success) {
            toast.success(`${gameName} deleted`);
            setDeleteConfirmId(null);
            loadData();
        } else {
            toast.error(res.error || "Failed to delete game");
        }
    };

    const filteredGames = selectedCategory
        ? games.filter(g => g.categories.some((c: any) => c.id === selectedCategory))
        : games;

    return (
        <div className="space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase">Games & Categories</h1>
                    <p className="text-[#8b949e] mt-1 font-bold tracking-widest uppercase text-[10px] opacity-60">Manage platform-supported games and marketplace categories.</p>
                </div>
                <div className="flex items-center gap-3">
                    {categories.length === 0 && (
                        <Button
                            variant="outline"
                            className="border-[#f5a623]/20 text-[#f5a623] hover:bg-[#f5a623]/10 font-bold text-xs"
                            onClick={handleSeed}
                            disabled={seeding}
                        >
                            {seeding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Layers className="h-4 w-4 mr-2" />}
                            Seed Data
                        </Button>
                    )}
                    <Button
                        onClick={handleOpenNew}
                        className="bg-[#f5a623] text-black hover:bg-[#e09612] font-black px-6 py-5 rounded-xl shadow-[0_0_30px_rgba(245,166,35,0.2)] group"
                    >
                        <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-500" />
                        Add Game
                    </Button>
                </div>
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-6 border-b border-[#2d333b] pb-0 overflow-x-auto no-scrollbar">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={cn(
                            "flex items-center gap-2 pb-3 text-xs font-bold uppercase tracking-[0.15em] transition-all relative whitespace-nowrap",
                            selectedCategory === cat.id
                                ? "text-[#f5a623]"
                                : "text-[#8b949e] hover:text-white"
                        )}
                    >
                        {cat.name}
                        <span className="text-[10px] text-[#4b5563] ml-1">
                            ({games.filter(g => g.categories.some((c: any) => c.id === cat.id)).length})
                        </span>
                        {selectedCategory === cat.id && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f5a623] shadow-[0_0_10px_rgba(245,166,35,0.5)]" />
                        )}
                    </button>
                ))}
            </div>

            {/* Games List */}
            <div className="space-y-2">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="h-8 w-8 border-2 border-[#f5a623] border-t-transparent rounded-full animate-spin" />
                        <p className="text-[#8b949e] font-bold tracking-widest uppercase text-[10px] animate-pulse">Loading games...</p>
                    </div>
                ) : filteredGames.length > 0 ? (
                    <div className="flex flex-col gap-2">
                        {filteredGames.map((game) => (
                            <div
                                key={game.id}
                                className="group relative bg-[#1c2128] border border-[#2d333b] rounded-xl p-3 transition-all duration-300 hover:border-[#f5a623]/30 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-lg bg-[#0a0e13] border border-[#2d333b] flex items-center justify-center overflow-hidden relative shrink-0">
                                        {game.icon ? (
                                            <Image
                                                src={game.icon}
                                                alt={game.name}
                                                width={48}
                                                height={48}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-xl font-bold text-[#f5a623]">{game.name.charAt(0)}</span>
                                        )}
                                    </div>

                                    <div className="space-y-0.5">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-white text-sm group-hover:text-[#f5a623] transition-colors">{game.name}</h3>
                                            {game.isPopular && (
                                                <span className="text-[8px] font-black text-[#f5a623] bg-[#f5a623]/10 px-1.5 py-0.5 rounded border border-[#f5a623]/20 uppercase tracking-wider">Trending</span>
                                            )}
                                            <span className={cn(
                                                "text-[8px] font-black px-1.5 py-0.5 rounded border uppercase tracking-wider",
                                                game.isActive
                                                    ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                                                    : "text-rose-400 bg-rose-400/10 border-rose-400/20"
                                            )}>
                                                {game.isActive ? "Active" : "Paused"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                                            <p className="text-[#4b5563]">{game.slug}</p>
                                            <div className="h-1 w-1 rounded-full bg-[#2d333b]" />
                                            <div className="flex gap-1.5">
                                                {game.categories?.map((c: any) => (
                                                    <span key={c.id} className="text-[#8b949e]">
                                                        {c.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleToggleStatus(game.id, game.isActive, game.name)}
                                        className={cn(
                                            "h-8 w-8 p-0",
                                            game.isActive
                                                ? "text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                                                : "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                                        )}
                                        title={game.isActive ? "Pause Game" : "Activate Game"}
                                    >
                                        {game.isActive ? <PauseCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleOpenEdit(game)}
                                        className="h-8 px-3 text-sky-400 hover:text-sky-300 hover:bg-sky-500/10 text-xs font-bold"
                                    >
                                        <Pencil className="h-3.5 w-3.5 mr-1.5" />
                                        Edit
                                    </Button>
                                    {deleteConfirmId === game.id ? (
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(game.id, game.name)}
                                                className="h-8 px-3 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-xs font-bold"
                                            >
                                                Confirm
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setDeleteConfirmId(null)}
                                                className="h-8 w-8 p-0 text-[#8b949e] hover:text-white"
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setDeleteConfirmId(game.id)}
                                            className="h-8 w-8 p-0 text-[#8b949e] hover:text-rose-400 hover:bg-rose-500/10"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-[#1c2128]/50 border-2 border-dashed border-[#2d333b] rounded-2xl">
                        <Gamepad2 className="h-10 w-10 text-[#2d333b] mb-3" />
                        <h3 className="text-white font-bold tracking-tight text-sm">No Games Found</h3>
                        <p className="text-[#8b949e] text-xs mt-1">This category has no games yet.</p>
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

            <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleFileUpload}
                className="hidden"
            />
            <input
                ref={bannerInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleBannerUpload}
                className="hidden"
            />

            {/* Add/Edit Game Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
                <DialogContent className="bg-[#0d1117] border-[#2d333b] text-white sm:max-w-[500px] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black tracking-tight uppercase">
                            {editingGame ? "Edit Game" : "Add New Game"}
                        </DialogTitle>
                        <DialogDescription className="text-[#8b949e] font-bold uppercase tracking-widest text-[10px]">
                            {editingGame ? "Update game details and icon." : "Add a new game to the marketplace catalog."}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-5 pt-2">
                        {/* Game Name */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-[#8b949e] uppercase tracking-wider">Game Name</label>
                            <Input
                                placeholder="e.g. Valorant, Roblox"
                                value={formData.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                className="bg-[#0a0e13] border-[#2d333b] text-white focus:border-[#f5a623] h-10 text-sm"
                            />
                        </div>

                        {/* Icon Upload */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-[#8b949e] uppercase tracking-wider">Game Icon</label>
                            <div className="flex gap-3 items-center">
                                {/* Preview */}
                                <div className="h-16 w-16 rounded-xl border border-[#2d333b] bg-[#0a0e13] flex items-center justify-center overflow-hidden shrink-0">
                                    {formData.icon ? (
                                        <Image
                                            src={formData.icon}
                                            alt="Icon Preview"
                                            width={64}
                                            height={64}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <ImageIcon className="h-6 w-6 text-[#4b5563]" />
                                    )}
                                </div>

                                {/* Upload Button */}
                                <div className="flex-1 space-y-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploading}
                                        className="w-full h-10 border-[#2d333b] hover:border-[#f5a623] hover:bg-[#f5a623]/10 text-white text-xs font-bold"
                                    >
                                        {uploading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="h-4 w-4 mr-2" />
                                                Upload Icon
                                            </>
                                        )}
                                    </Button>
                                    <p className="text-[9px] text-[#4b5563] text-center">PNG, JPG, WebP, GIF • Max 2MB</p>
                                </div>
                            </div>
                            <div className="mt-2 text-[10px] text-[#8b949e]">
                                Or manual URL:
                                <input
                                    type="text"
                                    placeholder="https://..."
                                    value={formData.icon}
                                    onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                                    className="w-full bg-[#0a0e13] border border-[#2d333b] text-[#8b949e] focus:border-[#f5a623] focus:text-white h-7 text-xs rounded-md px-2 mt-1 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Banner Upload */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-[#8b949e] uppercase tracking-wider">Game Banner</label>
                            <div className="flex gap-3 items-center">
                                {/* Preview */}
                                <div className="h-16 w-32 rounded-xl border border-[#2d333b] bg-[#0a0e13] flex items-center justify-center overflow-hidden shrink-0 relative">
                                    {formData.banner ? (
                                        <Image
                                            src={formData.banner}
                                            alt="Banner Preview"
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <ImageIcon className="h-6 w-6 text-[#4b5563]" />
                                    )}
                                </div>

                                {/* Upload Button */}
                                <div className="flex-1 space-y-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => bannerInputRef.current?.click()}
                                        disabled={uploading}
                                        className="w-full h-10 border-[#2d333b] hover:border-[#f5a623] hover:bg-[#f5a623]/10 text-white text-xs font-bold"
                                    >
                                        {uploading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="h-4 w-4 mr-2" />
                                                Upload Banner
                                            </>
                                        )}
                                    </Button>
                                    <p className="text-[9px] text-[#4b5563] text-center">PNG, JPG, WebP, GIF • Max 5MB</p>
                                </div>
                            </div>
                            <div className="mt-2 text-[10px] text-[#8b949e]">
                                Or manual URL:
                                <input
                                    type="text"
                                    placeholder="https://..."
                                    value={formData.banner}
                                    onChange={(e) => setFormData(prev => ({ ...prev, banner: e.target.value }))}
                                    className="w-full bg-[#0a0e13] border border-[#2d333b] text-[#8b949e] focus:border-[#f5a623] focus:text-white h-7 text-xs rounded-md px-2 mt-1 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-[#8b949e] uppercase tracking-wider">Description (Optional)</label>
                            <Textarea
                                placeholder="Brief description of the game..."
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                className="bg-[#0a0e13] border-[#2d333b] text-white focus:border-[#f5a623] text-sm min-h-[70px] resize-none"
                            />
                        </div>

                        {/* Popular Toggle */}
                        <div
                            onClick={() => setFormData(prev => ({ ...prev, isPopular: !prev.isPopular }))}
                            className={cn(
                                "flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer",
                                formData.isPopular
                                    ? "bg-[#f5a623]/10 border-[#f5a623]/30"
                                    : "bg-[#0a0e13] border-[#2d333b] hover:border-[#30363d]"
                            )}
                        >
                            <div className={cn(
                                "h-5 w-5 rounded flex items-center justify-center transition-all",
                                formData.isPopular ? "bg-[#f5a623] text-black" : "bg-white/5 text-transparent"
                            )}>
                                <Check className="h-3 w-3 stroke-[3]" />
                            </div>
                            <span className="text-xs font-bold text-[#9ca3af]">Mark as Trending / Popular</span>
                        </div>

                        {/* Categories */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[#8b949e] uppercase tracking-wider">Categories</label>
                            <div className="grid grid-cols-2 gap-2">
                                {categories.map((cat) => (
                                    <div
                                        key={cat.id}
                                        onClick={() => handleCategoryToggle(cat.id)}
                                        className={cn(
                                            "flex items-center gap-2 p-2.5 rounded-lg border transition-all cursor-pointer",
                                            formData.categoryIds.includes(cat.id)
                                                ? "bg-[#f5a623]/10 border-[#f5a623]/30"
                                                : "bg-[#0a0e13] border-[#2d333b] hover:border-[#30363d]"
                                        )}
                                    >
                                        <div className={cn(
                                            "h-4 w-4 rounded flex items-center justify-center transition-all",
                                            formData.categoryIds.includes(cat.id) ? "bg-[#f5a623] text-black" : "bg-white/5 text-transparent"
                                        )}>
                                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                                        </div>
                                        <span className="text-[11px] font-bold text-[#9ca3af]">{cat.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <DialogFooter className="pt-2">
                            <Button
                                type="submit"
                                disabled={submitting}
                                className="w-full h-11 bg-[#f5a623] text-black hover:bg-[#e09612] font-bold rounded-xl text-sm"
                            >
                                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : (editingGame ? "Save Changes" : "Add Game")}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
