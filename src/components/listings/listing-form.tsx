"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Gamepad2,
    Upload,
    ChevronRight,
    ChevronLeft,
    CheckCircle2,
    Clock,
    Zap,
    ShieldCheck,
    Info,
    AlertCircle,
    Trash2,
    Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Image from "next/image";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

interface ListingFormProps {
    initialData?: any; // Start loosely typed, refine later
    categories: any[];
    games: any[];
    action: (prevState: any, formData: FormData) => Promise<any>;
    mode: "create" | "edit";
}

export function ListingForm({ initialData, categories, games, action, mode }: ListingFormProps) {
    const router = useRouter();
    const [step, setStep] = useState<1 | 2 | 3>(initialData ? 3 : 1);

    // Form State
    const [selectedCategory, setSelectedCategory] = useState<string | null>(initialData?.categoryId || null);
    const [selectedGameId, setSelectedGameId] = useState<string | null>(initialData?.gameId || null);
    const [price, setPrice] = useState<string>(initialData?.price?.toString() || "");
    const [stock, setStock] = useState<number>(initialData?.stock || 1);
    const [description, setDescription] = useState<string>(initialData?.description || "");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Automatic Delivery State
    const [deliveryMethod, setDeliveryMethod] = useState<"MANUAL" | "AUTOMATIC">("MANUAL");
    const [accountItems, setAccountItems] = useState<{ login?: string, password?: string, extra?: string }[]>([{ login: "", password: "", extra: "" }]);

    const [giftCardKeys, setGiftCardKeys] = useState<string>("");

    // Image Upload State
    const [uploadedImages, setUploadedImages] = useState<string[]>(initialData?.images?.map((img: any) => img.url) || []);
    const [isUploading, setIsUploading] = useState(false);

    const selectedGame = games.find(g => g.id === selectedGameId);
    const selectedCategoryObj = categories.find(c => c.id === selectedCategory);

    const isAccountCategory = selectedCategoryObj?.name?.toLowerCase().includes("account");
    const isKeyCategory = selectedCategoryObj?.name?.toLowerCase().includes("gift") || selectedCategoryObj?.name?.toLowerCase().includes("key") || selectedCategoryObj?.name?.toLowerCase().includes("card");
    const isCurrencyCategory = selectedCategoryObj?.name?.toLowerCase().includes("currency") || selectedCategoryObj?.name?.toLowerCase().includes("top") || selectedCategoryObj?.name?.toLowerCase().includes("boosting");
    const isItemCategory = selectedCategoryObj?.name?.toLowerCase().includes("item") || isAccountCategory; // Items and Accounts need images

    const getDeliveryTimeValue = () => {
        if (!initialData?.deliveryTime) return "20m";
        const minutes = parseInt(initialData.deliveryTime);
        if (minutes === 0) return "instant";
        if (minutes === 20) return "20m";
        if (minutes === 60) return "1h";
        if (minutes === 1440) return "24h";
        return "20m";
    };

    React.useEffect(() => {
        if (isKeyCategory) setDeliveryMethod("AUTOMATIC");
    }, [isKeyCategory]);

    // Auto-calculate stock for Automatic Delivery
    React.useEffect(() => {
        if (deliveryMethod === "AUTOMATIC") {
            if (isAccountCategory) {
                setStock(accountItems.length);
            } else {
                setStock(giftCardKeys.split('\n').filter(k => k.trim()).length);
            }
        }
    }, [deliveryMethod, accountItems, giftCardKeys, isAccountCategory]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size must be less than 5MB");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/listings/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();
            setUploadedImages([...uploadedImages, data.url]);
            toast.success("Image uploaded!");
        } catch (error) {
            toast.error("Failed to upload image");
            console.error(error);
        } finally {
            setIsUploading(false);
        }
    };

    const removeImage = (index: number) => {
        setUploadedImages(uploadedImages.filter((_, i) => i !== index));
    };

    const filteredGames = games.filter(g => g.categories.some((c: any) => c.id === selectedCategory));

    const steps = [
        { id: 1, label: "Category" },
        { id: 2, label: "Game" },
        { id: 3, label: "Details" }
    ];

    // --- Steps Renderers ---

    const renderStepper = () => (
        <div className="mb-4">
            <div className="flex items-center justify-between max-w-md mx-auto relative px-4 text-center">
                <div className="absolute top-1/2 left-0 right-0 h-px bg-white/5 -translate-y-1/2 z-0 mx-6" />
                <motion.div
                    className="absolute top-1/2 left-0 h-px bg-[#f5a623] -translate-y-1/2 z-0 mx-6 transition-all duration-500"
                    initial={false}
                    animate={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                    style={{ left: "1.5rem", right: "1.5rem" }}
                />

                {steps.map((s) => (
                    <div key={s.id} className="relative z-10 flex flex-col items-center gap-1.5">
                        <motion.button
                            onClick={() => {
                                if (s.id < step) setStep(s.id as any);
                            }}
                            className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-500 font-semibold text-[10px]",
                                step === s.id
                                    ? "bg-[#f5a623] border-[#f5a623] text-black shadow-[0_0_15px_rgba(245,166,35,0.3)]"
                                    : step > s.id
                                        ? "bg-[#1c2128] border-[#f5a623] text-[#f5a623]"
                                        : "bg-[#0a0e13] border-white/5 text-[#8b949e]"
                            )}
                        >
                            {step > s.id ? "✓" : s.id}
                        </motion.button>
                        <span className={cn(
                            "text-[8px] font-bold uppercase tracking-wider transition-colors",
                            step === s.id ? "text-[#f5a623]" : "text-[#8b949e]"
                        )}>
                            {s.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderStep1_Category = () => (
        <div className="space-y-4 max-w-5xl mx-auto">
            <div className="text-center space-y-1">
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xl font-bold text-white uppercase tracking-tight"
                >
                    Select <span className="text-[#f5a623]">Category</span>
                </motion.h1>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {categories.map((cat, idx) => (
                    <motion.button
                        key={cat.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ y: -2, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            setSelectedCategory(cat.id);
                            setStep(2);
                        }}
                        className="relative group h-32 overflow-hidden rounded-xl border border-white/5 bg-[#0d1117]/50 backdrop-blur-sm p-4 text-left transition-all hover:border-[#f5a623]/30"
                    >
                        <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-[#f5a623]/5 rounded-full blur-2xl group-hover:bg-[#f5a623]/10 transition-colors" />

                        <div className="relative h-full flex flex-col justify-between">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#f5a623] group-hover:bg-[#f5a623] group-hover:text-black transition-all">
                                <Gamepad2 className="h-4 w-4" />
                            </div>
                            <div className="space-y-0.5">
                                <h3 className="text-xs font-bold text-white uppercase truncate">{cat.name}</h3>
                                <p className="text-[9px] text-[#8b949e] font-bold uppercase tracking-widest flex items-center gap-1 group-hover:text-[#f5a623] transition-colors">
                                    Select
                                    <ChevronRight className="h-2.5 w-2.5" />
                                </p>
                            </div>
                        </div>
                    </motion.button>
                ))}

                {/* Bulk Action Card */}
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: categories.length * 0.05 }}
                    className="relative group h-32 overflow-hidden rounded-xl border border-dashed border-white/10 bg-transparent p-4 text-left transition-all hover:bg-white/5 hover:border-white/20"
                >
                    <div className="h-full flex flex-col justify-center items-center gap-2 text-center">
                        <div className="w-8 h-8 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center text-[#8b949e]">
                            <Upload className="h-4 w-4" />
                        </div>
                        <div className="space-y-0.5">
                            <h3 className="text-xs font-black text-white uppercase">Bulk</h3>
                            <p className="text-[8px] text-[#8b949e] font-bold uppercase tracking-widest">
                                Upload CSV
                            </p>
                        </div>
                    </div>
                </motion.button>
            </div>
        </div>
    );

    const renderStep2_Game = () => (
        <div className="space-y-4 max-w-6xl mx-auto">
            <div className="text-center space-y-1">
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xl font-bold text-white uppercase tracking-tight"
                >
                    Select <span className="text-[#f5a623]">Game</span>
                </motion.h1>
                <div className="flex items-center justify-center gap-2">
                    <Badge variant="outline" className="bg-[#f5a623]/10 text-[#f5a623] border-[#f5a623]/20 font-bold uppercase py-0.5 px-2 text-[10px]">
                        {selectedCategoryObj?.name}
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {filteredGames.map((game, idx) => (
                    <motion.button
                        key={game.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.02 }}
                        whileHover={{ y: -2, scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            setSelectedGameId(game.id);
                            setStep(3);
                        }}
                        className={cn(
                            "relative aspect-[3/4] overflow-hidden rounded-xl border transition-all group",
                            selectedGameId === game.id ? "border-[#f5a623] shadow-[0_0_15px_rgba(245,166,35,0.2)]" : "border-white/5 hover:border-white/20"
                        )}
                    >
                        <Image
                            src={game.icon || "/placeholder-game.jpg"}
                            alt={game.name}
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                        <div className="absolute bottom-2 left-2 right-2 text-center">
                            <span className="text-[9px] font-bold text-white uppercase leading-tight line-clamp-2">{game.name}</span>
                        </div>

                        {selectedGameId === game.id && (
                            <div className="absolute top-2 right-2 bg-[#f5a623] text-black rounded-full p-0.5 shadow-xl">
                                <CheckCircle2 className="h-3 w-3" />
                            </div>
                        )}
                    </motion.button>
                ))}
            </div>

            <div className="flex justify-center pt-2">
                <Button
                    variant="link"
                    onClick={() => setStep(1)}
                    className="text-[#8b949e] hover:text-[#f5a623] font-bold uppercase tracking-widest text-[10px] flex items-center gap-1 h-auto py-1"
                >
                    <ChevronLeft className="h-3 w-3" />
                    Back
                </Button>
            </div>
        </div>
    );

    const renderStep3_Form = () => (
        <div className="space-y-4 max-w-6xl mx-auto">
            {/* Breadcrumb - Super Compact */}
            <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-[#8b949e] mb-2">
                <button onClick={() => setStep(1)} className="hover:text-white transition-colors">Start</button>
                <ChevronRight className="h-2 w-2" />
                <button onClick={() => setStep(1)} className="hover:text-white transition-colors">{selectedCategoryObj?.name}</button>
                <ChevronRight className="h-2 w-2" />
                <button onClick={() => setStep(2)} className="hover:text-white transition-colors">{selectedGame?.name}</button>
                <ChevronRight className="h-2 w-2" />
                <span className="text-[#f5a623]">{mode === 'edit' ? 'Edit' : 'Create'}</span>
            </div>

            <form action={async (formData) => {
                setIsSubmitting(true);
                if (selectedCategory) formData.append("categoryId", selectedCategory);
                if (selectedGameId) formData.append("gameId", selectedGameId);
                if (selectedGame) formData.append("gameName", selectedGame.name);
                formData.append("description", description);
                formData.append("imageUrls", JSON.stringify(uploadedImages)); // Append images!

                // Validate images for items/accounts
                if (isItemCategory && uploadedImages.length === 0) {
                    toast.error("Please upload at least one image for this category.");
                    setIsSubmitting(false);
                    return;
                }

                try {
                    const res = await action(null, formData);
                    if (res?.error) {
                        toast.error(res.error);
                    } else if (res?.success) {
                        toast.success(`Listing ${mode === 'edit' ? 'updated' : 'created'} successfully!`);
                        if (mode === 'create') {
                            router.push(`/${selectedCategoryObj?.slug}/${selectedGame?.slug}`);
                        } else {
                            router.push('/dashboard/offers');
                        }
                    }
                } catch (e) {
                    toast.error(`Failed to ${mode} listing`);
                } finally {
                    setIsSubmitting(false);
                }
            }}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    {/* Left Column: Details & Delivery (8 cols) */}
                    <div className="lg:col-span-8 space-y-4">
                        {/* Description Section */}
                        <div className="bg-[#0d1117]/50 backdrop-blur-sm border border-white/5 rounded-2xl p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="p-1 rounded bg-[#f5a623]/10 text-[#f5a623]">
                                        <Info className="h-3 w-3" />
                                    </div>
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">Offer Details</h3>
                                </div>
                                <span className="text-[9px] font-bold text-[#8b949e] italic">Min 20 chars</span>
                            </div>

                            <RichTextEditor
                                value={description}
                                onChange={setDescription}
                                placeholder="Describe your offer..."
                                className="min-h-[120px] max-h-[200px] overflow-y-auto bg-[#010409] border-[#2d333b] rounded-xl text-sm"
                            />

                            <div className="flex gap-2 items-start py-2 px-3 bg-white/5 rounded-xl border border-white/5">
                                <AlertCircle className="h-3.5 w-3.5 text-[#f5a623] shrink-0 mt-0.5" />
                                <p className="text-[10px] font-medium text-[#8b949e] leading-tight">
                                    Title is auto-generated. Describe <span className="text-white">delivery speed</span> & <span className="text-white">bonuses</span>. No links.
                                </p>
                            </div>
                        </div>

                        {/* Image Upload Section - Conditional */}
                        {isItemCategory ? (
                            <div className="bg-[#0d1117]/50 backdrop-blur-sm border border-white/5 rounded-2xl p-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1 rounded bg-purple-500/10 text-purple-500">
                                            <Upload className="h-3 w-3" />
                                        </div>
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-white">Images</h3>
                                    </div>
                                    <span className="text-[9px] font-bold text-[#8b949e]">Max 5MB • JPG/PNG</span>
                                </div>

                                <div className="grid grid-cols-4 gap-4">
                                    {uploadedImages.map((url, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group">
                                            <Image src={url} alt="Uploaded" fill className="object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(idx)}
                                                className="absolute top-1 right-1 p-1 bg-black/50 hover:bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}

                                    {uploadedImages.length < 5 && (
                                        <label className="aspect-square rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#f5a623]/50 hover:bg-[#f5a623]/5 transition-all text-[#8b949e] hover:text-[#f5a623]">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                disabled={isUploading}
                                            />
                                            {isUploading ? (
                                                <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
                                            ) : (
                                                <>
                                                    <Upload className="h-5 w-5" />
                                                    <span className="text-[9px] font-bold uppercase tracking-widest">Upload</span>
                                                </>
                                            )}
                                        </label>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-[#0d1117]/50 backdrop-blur-sm border border-white/5 rounded-2xl p-4 flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-[#f5a623]/10 text-[#f5a623]">
                                    <Gamepad2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">Game Image Used</h3>
                                    <p className="text-[10px] text-[#8b949e] font-medium">
                                        Listings in this category automatically use the official game artwork.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Delivery Section - Dynamic based on Category */}
                        <div className="bg-[#0d1117]/50 backdrop-blur-sm border border-white/5 rounded-2xl p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="p-1 rounded bg-blue-500/10 text-blue-500">
                                        <Clock className="h-3 w-3" />
                                    </div>
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">Delivery Method</h3>
                                </div>
                                {isKeyCategory && <Badge className="bg-[#f5a623] text-black hover:bg-[#f5a623]">Automatic Only</Badge>}
                            </div>

                            {/* Delivery Method Toggle for Accounts */}
                            {(isAccountCategory || isKeyCategory) ? (
                                <div className="space-y-4">
                                    {isAccountCategory && (
                                        <div className="flex bg-[#010409] p-1 rounded-xl border border-white/5">
                                            <button
                                                type="button"
                                                onClick={() => setDeliveryMethod("MANUAL")}
                                                className={cn(
                                                    "flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all",
                                                    deliveryMethod === "MANUAL" ? "bg-[#161b22] text-white shadow-sm border border-white/5" : "text-[#8b949e] hover:text-white"
                                                )}
                                            >
                                                Manual Handover
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setDeliveryMethod("AUTOMATIC")}
                                                className={cn(
                                                    "flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all",
                                                    deliveryMethod === "AUTOMATIC" ? "bg-[#f5a623] text-black shadow-sm" : "text-[#8b949e] hover:text-white"
                                                )}
                                            >
                                                Automatic Delivery
                                            </button>
                                        </div>
                                    )}

                                    {/* Automatic Delivery Inputs */}
                                    {deliveryMethod === "AUTOMATIC" && (
                                        <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2">
                                            {isAccountCategory ? (
                                                <div className="space-y-3">
                                                    {accountItems.map((item, idx) => (
                                                        <div key={idx} className="space-y-2 p-3 bg-[#010409] rounded-xl border border-dashed border-white/10 relative group">
                                                            <div className="flex gap-2">
                                                                <Input
                                                                    placeholder="Login / Email"
                                                                    value={item.login}
                                                                    onChange={(e) => {
                                                                        const newItems = [...accountItems];
                                                                        newItems[idx].login = e.target.value;
                                                                        setAccountItems(newItems);
                                                                    }}
                                                                    className="h-8 bg-[#161b22] border-white/5 text-xs"
                                                                />
                                                                <Input
                                                                    placeholder="Password"
                                                                    value={item.password}
                                                                    onChange={(e) => {
                                                                        const newItems = [...accountItems];
                                                                        newItems[idx].password = e.target.value;
                                                                        setAccountItems(newItems);
                                                                    }}
                                                                    className="h-8 bg-[#161b22] border-white/5 text-xs"
                                                                />
                                                            </div>
                                                            <Input
                                                                placeholder="Extra Info (PIN, Security Answer, etc.)"
                                                                value={item.extra}
                                                                onChange={(e) => {
                                                                    const newItems = [...accountItems];
                                                                    newItems[idx].extra = e.target.value;
                                                                    setAccountItems(newItems);
                                                                }}
                                                                className="h-8 bg-[#161b22] border-white/5 text-xs"
                                                            />
                                                            {accountItems.length > 1 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setAccountItems(accountItems.filter((_, i) => i !== idx))}
                                                                    className="absolute -top-2 -right-2 p-1 bg-red-500/10 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                                >
                                                                    <Trash2 className="h-3 w-3" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => setAccountItems([...accountItems, { login: "", password: "", extra: "" }])}
                                                        className="w-full h-8 text-[10px] uppercase font-bold border-dashed border-white/10 hover:bg-white/5"
                                                    >
                                                        <Plus className="h-3 w-3 mr-1" /> Add Another Account
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <Label className="text-[9px] font-black uppercase tracking-widest text-[#8b949e]">License Keys / Codes (One per line)</Label>
                                                    <textarea
                                                        value={giftCardKeys}
                                                        onChange={(e) => setGiftCardKeys(e.target.value)}
                                                        className="w-full h-32 bg-[#010409] border border-white/5 rounded-xl p-3 text-xs font-mono text-white resize-none focus:outline-none focus:border-[#f5a623]/50"
                                                        placeholder="XXXX-XXXX-XXXX-XXXX&#10;YYYY-YYYY-YYYY-YYYY"
                                                    />
                                                    <p className="text-[10px] text-[#8b949e]">Detected stock: <span className="text-[#f5a623] font-bold">{giftCardKeys.split('\n').filter(k => k.trim()).length}</span></p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* Default Manual Delivery Options for other categories */
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1 space-y-2">
                                        <Label className="text-[9px] font-black uppercase tracking-widest text-[#8b949e] pl-1">Time Guarantee</Label>
                                        <Select name="deliveryTime" defaultValue={getDeliveryTimeValue()}>
                                            <SelectTrigger className="h-10 bg-[#010409] border-white/5 rounded-xl text-white font-bold text-xs px-3 focus:ring-[#f5a623]/20">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#161b22] border-white/10 text-white rounded-lg">
                                                <SelectItem value="instant" className="font-bold text-xs">Instant</SelectItem>
                                                <SelectItem value="20m" className="font-bold text-xs">20 Mins</SelectItem>
                                                <SelectItem value="1h" className="font-bold text-xs">1 Hour</SelectItem>
                                                <SelectItem value="24h" className="font-bold text-xs">24 Hours</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex-[2] space-y-2">
                                        <div className="flex items-center gap-2 pl-1">
                                            <Label className="text-[9px] font-black uppercase tracking-widest text-[#8b949e]">Methods</Label>
                                            <Badge variant="outline" className="text-[8px] border-[#f5a623]/20 text-[#f5a623] font-black uppercase px-1 py-0 h-3.5">Auto</Badge>
                                        </div>
                                        <div className="flex gap-2">
                                            {["Face to Face", "Mail", "Auction"].map((method) => (
                                                <label key={method} className="flex-1 flex items-center justify-center gap-2 p-2 bg-[#010409] border border-white/5 rounded-xl cursor-pointer hover:border-white/10 transition-colors group h-10">
                                                    <Checkbox name="deliveryMethod" value={method} className="w-3.5 h-3.5 bg-transparent border-[#2d333b] data-[state=checked]:bg-[#f5a623] data-[state=checked]:border-[#f5a623]" />
                                                    <span className="text-[10px] font-bold text-[#8b949e] group-hover:text-white transition-colors whitespace-nowrap">{method}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Pricing & Submit (4 cols) */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className="bg-[#0d1117] border border-[#f5a623]/20 rounded-2xl p-4 space-y-4 sticky top-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Pricing & Stock</h3>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-[9px] font-black uppercase tracking-widest text-[#8b949e] pl-1">Stock</Label>
                                    <div className="relative">
                                        <Input
                                            name="stock"
                                            type="number"
                                            value={stock}
                                            onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                                            readOnly={deliveryMethod === "AUTOMATIC"}
                                            className={cn(
                                                "h-10 bg-[#010409] border-white/5 rounded-xl text-sm font-black text-white px-3 pr-8",
                                                deliveryMethod === "AUTOMATIC" && "opacity-50 cursor-not-allowed focus:ring-0"
                                            )}
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-[#8b949e]">Qty</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[9px] font-black uppercase tracking-widest text-[#8b949e] pl-1">Min Order</Label>
                                    <div className="relative">
                                        <Input name="minQuantity" type="number" defaultValue={initialData?.minQuantity || 1} className="h-10 bg-[#010409] border-white/5 rounded-xl text-sm font-black text-white px-3 pr-8" />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-[#8b949e]">Qty</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 pt-2 border-t border-white/5">
                                <Label className="text-[9px] font-black uppercase tracking-widest text-[#8b949e] pl-1">Unit Price ($)</Label>
                                <Input
                                    name="price"
                                    type="number"
                                    step="0.0001"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="h-12 bg-[#010409] border-[#f5a623]/30 rounded-xl text-2xl font-black text-white focus:border-[#f5a623] focus:ring-0"
                                />
                                <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest px-1">
                                    <span className="text-[#8b949e]">Fee: <span className="text-red-400">-${((parseFloat(price || "0") * 0.10) || 0).toFixed(2)}</span></span>
                                    <span className="text-[#f5a623]">Earn: ${((parseFloat(price || "0") * 0.90) || 0).toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="space-y-3 pt-2">
                                <div className="flex items-center gap-2">
                                    <Checkbox id="terms" required className="w-3.5 h-3.5 border-white/10 data-[state=checked]:bg-[#f5a623]" />
                                    <label htmlFor="terms" className="text-[9px] font-medium text-[#8b949e]">
                                        Agree to <span className="text-[#f5a623] cursor-pointer hover:underline">Rules</span>
                                    </label>
                                </div>

                                <Button
                                    disabled={isSubmitting}
                                    type="submit"
                                    className="w-full h-12 bg-[#f5a623] hover:bg-[#e09612] text-black text-sm font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#f5a623]/20"
                                >
                                    {isSubmitting ? "..." : (mode === 'edit' ? "Update" : "Go Live")}
                                </Button>

                                <button type="button" onClick={() => setStep(2)} className="w-full text-[9px] font-bold uppercase text-[#8b949e] hover:text-white">
                                    Back
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Hidden Inputs */}
                    <div className="hidden">
                        <input type="hidden" name="deliveryMethodType" value={deliveryMethod} />
                        <input type="hidden" name="accountItems" value={JSON.stringify(accountItems)} />
                        <input type="hidden" name="giftCardKeys" value={giftCardKeys} />
                        {initialData?.id && <input type="hidden" name="listingId" value={initialData.id} />}
                    </div>
                </div>
            </form>
        </div>
    );

    return (
        <div className="space-y-8">
            {renderStepper()}
            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    {step === 1 && renderStep1_Category()}
                    {step === 2 && renderStep2_Game()}
                    {step === 3 && renderStep3_Form()}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
