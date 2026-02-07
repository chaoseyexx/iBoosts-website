"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Gamepad2,
    Upload,
    ChevronRight,
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
    const [description, setDescription] = useState<string>(initialData?.description || "");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const selectedGame = games.find(g => g.id === selectedGameId);
    const selectedCategoryObj = categories.find(c => c.id === selectedCategory);
    const filteredGames = games.filter(g => g.categories.some((c: any) => c.id === selectedCategory));

    // --- Steps Renderers ---

    const renderStep1_Category = () => (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="text-center space-y-2">
                <h1 className="text-2xl font-medium text-[#fdfcf0]">Start selling</h1>
                <p className="text-[#9ca3af]">Choose category</p>
            </div>

            <div className="grid gap-3">
                {categories.map((cat) => (
                    <motion.button
                        key={cat.id}
                        whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.03)" }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => {
                            setSelectedCategory(cat.id);
                            setStep(2);
                        }}
                        className="flex items-center justify-between p-4 w-full bg-[#1c2128] border border-[#2d333b] hover:border-[#f5a623]/50 rounded-lg group transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-[#2d333b]/50 rounded-full group-hover:bg-[#f5a623]/10 transition-colors text-2xl">
                                { /* Render icon if available, safely */}
                                { /* For now just text or generic icon if direct render fails */}
                                <Gamepad2 className="h-6 w-6 text-[#9ca3af]" />
                            </div>
                            <span className="text-lg font-medium text-[#fdfcf0]">{cat.name}</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-[#9ca3af] group-hover:text-[#f5a623]" />
                    </motion.button>
                ))}

                {/* Secondary Categories */}
                <div className="pt-2 border-t border-[#2d333b] mt-2">
                    <button className="flex items-center justify-between p-4 w-full bg-[#1c2128] border border-[#2d333b] hover:border-[#f5a623]/50 rounded-lg group transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-[#2d333b]/50 rounded-full">
                                <Gamepad2 className="h-6 w-6 text-[#9ca3af]" />
                            </div>
                            <span className="text-lg font-medium text-[#fdfcf0]">Steam Games</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-[#9ca3af]" />
                    </button>
                    <button className="flex items-center justify-between p-4 w-full bg-[#1c2128] border border-[#2d333b] hover:border-[#f5a623]/50 rounded-lg group transition-colors mt-3">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-[#2d333b]/50 rounded-full">
                                <Upload className="h-6 w-6 text-[#556b2f]" />
                            </div>
                            <span className="text-lg font-medium text-[#fdfcf0]">Bulk Upload</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-[#9ca3af]" />
                    </button>
                </div>
            </div>
        </div>
    );

    const renderStep2_Game = () => (
        <div className="space-y-8 max-w-xl mx-auto text-center">
            <div className="space-y-2">
                <h1 className="text-2xl font-medium text-[#fdfcf0]">Sell {selectedCategoryObj?.name}</h1>
                <p className="text-[#9ca3af]">Step 2/3</p>
            </div>

            <div className="bg-[#1c2128] p-8 rounded-xl border border-[#2d333b] space-y-6">
                <h3 className="text-lg font-medium text-[#fdfcf0]">Choose Game</h3>

                <div className="relative">
                    <Select onValueChange={(val) => setSelectedGameId(val)} value={selectedGameId || undefined}>
                        <SelectTrigger className="w-full h-12 bg-[#0a0e13] border-[#2d333b] text-[#fdfcf0]">
                            <SelectValue placeholder="Select your game" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1c2128] border-[#2d333b] text-[#fdfcf0]">
                            {filteredGames.map((game) => (
                                <SelectItem key={game.id} value={game.id} className="focus:bg-[#2d333b] focus:text-[#fdfcf0]">
                                    {game.icon && <Image src={game.icon} alt={game.name} width={20} height={20} className="inline mr-2 rounded-full" />}
                                    {game.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-3 pt-4 justify-center">
                    <Button
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="border-[#2d333b] hover:bg-[#2d333b] text-[#fdfcf0]"
                    >
                        Back
                    </Button>
                    <Button
                        disabled={!selectedGameId}
                        onClick={() => setStep(3)}
                        className={cn(
                            "bg-[#2d333b] text-[#9ca3af]",
                            selectedGame && "bg-[#f5a623] text-black hover:bg-[#e09612]"
                        )}
                    >
                        Next
                    </Button>
                </div>
            </div>
            <p className="text-sm text-[#9ca3af]">
                Can't find the game you want to sell? <span className="text-[#f5a623] cursor-pointer hover:underline">Contact our customer support</span> to suggest a game.
            </p>
        </div>
    );

    const renderStep3_Form = () => (
        <div className="space-y-8 max-w-3xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-[#9ca3af]">
                <span className="cursor-pointer hover:text-[#fdfcf0]" onClick={() => setStep(1)}>Home</span>
                <ChevronRight className="h-3 w-3" />
                <span className="cursor-pointer hover:text-[#fdfcf0]" onClick={() => setStep(1)}>{selectedCategoryObj?.name}</span>
                <ChevronRight className="h-3 w-3" />
                <span className="cursor-pointer hover:text-[#fdfcf0]" onClick={() => setStep(2)}>{selectedGame?.name}</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-[#f5a623]">{mode === 'edit' ? 'Edit Listing' : 'Sell Game Currency'}</span>
            </div>

            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-medium text-[#fdfcf0]">{mode === 'edit' ? 'Edit Listing' : 'Sell Game Currency'}</h1>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f5a623]/10 border border-[#f5a623]/20 rounded text-xs text-[#f5a623]">
                    <span className="w-2 h-2 rounded-full bg-[#f5a623]" />
                    {selectedGame?.name}
                </div>
            </div>

            <form action={async (formData) => {
                setIsSubmitting(true);
                // Append current category and game info
                if (selectedCategory) formData.append("categoryId", selectedCategory);
                if (selectedGameId) formData.append("gameId", selectedGameId);
                if (selectedGame) formData.append("gameName", selectedGame.name);

                // Append description manually since RichTextEditor doesn't allow form hook directly yet in this setup
                formData.append("description", description);

                try {
                    const res = await action(null, formData);
                    if (res?.error) {
                        toast.error(res.error);
                    } else if (res?.success) {
                        toast.success(`Listing ${mode === 'edit' ? 'updated' : 'created'} successfully!`);
                        // Redirect to the listing page or dashboard
                        if (mode === 'create') {
                            router.push(`/${selectedCategoryObj?.slug}/${selectedGame?.slug}`);
                        } else {
                            // Refresh logic for Edit if needed or redirect
                            router.push('/dashboard/offers');
                        }
                    }
                } catch (e) {
                    toast.error(`Failed to ${mode} listing`);
                } finally {
                    setIsSubmitting(false);
                }
            }} className="bg-[#1c2128] border-none p-8 space-y-8 rounded-xl border border-[#2d333b]">
                {/* Description */}
                <div className="space-y-3">
                    <div className="flex justify-between">
                        <Label className="text-[#fdfcf0]">Description (Optional)</Label>
                    </div>

                    <RichTextEditor
                        value={description}
                        onChange={setDescription}
                        placeholder="Type description here..."
                        className="min-h-[200px]"
                    />

                    <p className="text-xs text-[#9ca3af] bg-[#2d333b]/30 p-3 rounded">
                        The listing title is generated automatically. Make sure to provide promotion details (e.g., listing description), avoid sharing contact information or external links (e.g., Discord). <span className="text-[#f5a623]">Seller Rules</span>.
                    </p>
                </div>

                {/* Delivery */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-[#fdfcf0]">Delivery</Label>
                        <div className="bg-[#0a0e13] border border-[#2d333b] rounded-lg p-4 flex justify-between items-center">
                            <div>
                                <div className="text-sm text-[#9ca3af]">Guaranteed Delivery Time</div>
                                <Select name="deliveryTime" defaultValue={initialData?.deliveryTime?.toString() || "20m"}>
                                    <SelectTrigger className="border-none bg-transparent h-auto p-0 text-[#fdfcf0] font-medium focus:ring-0">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#1c2128] border-[#2d333b] text-[#fdfcf0]">
                                        <SelectItem value="20m">20 minutes</SelectItem>
                                        <SelectItem value="1h">1 hour</SelectItem>
                                        <SelectItem value="24h">24 hours</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <p className="text-xs text-[#9ca3af]">Buyer checks your average delivery time prior to purchasing ensuring a better experience.</p>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Label className="text-[#fdfcf0]">Delivery method</Label>
                            <Badge variant="outline" className="text-[#f5a623] border-[#f5a623]/20 bg-[#f5a623]/10 text-[10px] h-5">Auto</Badge>
                            <div className="w-4 h-4 rounded-full border border-[#9ca3af] flex items-center justify-center text-[10px] text-[#9ca3af]">?</div>
                        </div>
                        <p className="text-xs text-[#9ca3af]">Choose delivery method:</p>

                        <div className="grid grid-cols-2 gap-3">
                            {["In-Game Mail", "Face to Face", "Auction House", "Mail Trading", "Item Delivery", "Account Share"].map((method) => (
                                <div key={method} className="flex items-center space-x-2">
                                    <Checkbox name="deliveryMethod" value={method} id={method} defaultChecked={initialData?.deliveryMethod?.includes(method)} className="border-[#2d333b] data-[state=checked]:bg-[#f5a623] data-[state=checked]:border-[#f5a623]" />
                                    <label
                                        htmlFor={method}
                                        className="text-sm text-[#9ca3af] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        {method}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quantity */}
                <div className="space-y-3">
                    <Label className="text-[#fdfcf0]">Quantity</Label>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <span className="text-xs text-[#9ca3af]">Total Quantity/Stock value</span>
                            <div className="relative">
                                <Input name="stock" type="number" defaultValue={initialData?.stock || 1} className="bg-[#0a0e13] border-[#2d333b] text-[#fdfcf0] pr-12" />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9ca3af]">Units</span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs text-[#9ca3af]">Minimum Order Quantity</span>
                            <div className="relative">
                                <Input name="minQuantity" type="number" defaultValue={initialData?.minQuantity || 1} className="bg-[#0a0e13] border-[#2d333b] text-[#fdfcf0] pr-12" />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9ca3af]">Units</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Price */}
                <div className="space-y-3">
                    <Label className="text-[#fdfcf0]">Price</Label>
                    <div className="space-y-1">
                        <span className="text-xs text-[#9ca3af]">Price per Unit</span>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#fdfcf0]">$</span>
                            <Input
                                name="price"
                                type="number"
                                step="0.0001"
                                placeholder="0.00"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="bg-[#0a0e13] border-[#2d333b] text-[#fdfcf0] pl-6"
                            />
                        </div>
                        <p className="text-xs text-[#9ca3af]">Competitor prices: Highest $8.75, Avg $8.23, Lowest $7.99</p>
                    </div>
                </div>

                {/* Calculations */}
                <div className="bg-[#0a0e13] p-4 rounded-lg space-y-3">
                    <h4 className="text-[#fdfcf0] text-sm font-medium">Fee breakdown</h4>
                    <div className="flex justify-between text-sm">
                        <span className="text-[#9ca3af]">Fee per unit (10%)</span>
                        <span className="text-[#fdfcf0]">
                            ${((parseFloat(price || "0") * 0.10) || 0).toFixed(2)}
                        </span>
                    </div>
                    <div className="h-px bg-[#2d333b]" />
                    <div className="flex justify-between text-sm font-medium">
                        <span className="text-[#f5a623]">Earnings per unit</span>
                        <span className="text-[#f5a623]">
                            ${((parseFloat(price || "0") * 0.90) || 0).toFixed(2)}
                        </span>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="space-y-4">
                    <div className="flex items-start gap-2">
                        <Checkbox id="terms" required className="mt-1 border-[#2d333b] data-[state=checked]:bg-[#f5a623]" />
                        <label htmlFor="terms" className="text-xs text-[#9ca3af]">
                            I have read and agree to the <span className="text-[#f5a623]">Terms of Service</span>.
                        </label>
                    </div>
                    <div className="flex items-start gap-2">
                        <Checkbox id="rules" required className="mt-1 border-[#2d333b] data-[state=checked]:bg-[#f5a623]" />
                        <label htmlFor="rules" className="text-xs text-[#9ca3af]">
                            I have read and agree to the <span className="text-[#f5a623]">Seller Rules</span>.
                        </label>
                    </div>

                    <div className="flex gap-3 pt-2">
                        {mode === 'create' && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setStep(2)}
                                className="flex-1 border-[#2d333b] hover:bg-[#2d333b] text-[#fdfcf0]"
                            >
                                Back
                            </Button>
                        )}
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-[#f5a623] text-black hover:bg-[#e09612] font-medium"
                        >
                            {isSubmitting ? "Processing..." : (mode === 'edit' ? "Update Offer" : "Create Offer")}
                        </Button>
                    </div>
                </div>

            </form>
        </div>
    );

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
            >
                {step === 1 && renderStep1_Category()}
                {step === 2 && renderStep2_Game()}
                {step === 3 && renderStep3_Form()}
            </motion.div>
        </AnimatePresence>
    );
}
