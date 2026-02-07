"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ChevronRight,
    Gamepad2,
    Check,
    Coins,
    User,
    Zap,
    Sword,
    Rocket,
    Gift
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
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
// import { toast } from "sonner";

// --- Mock Data for Edit ---
const MOCK_LISTING = {
    id: "123",
    category: "currency",
    game: "World of Warcraft",
    description: "Gold for sale. Fast delivery. 24/7 Support.",
    deliveryTime: "20m",
    deliveryMethods: ["In-Game Mail", "Auction House"],
    stock: 100000,
    minOrder: 1000,
    pricePerUnit: 8.23,
};

type CategoryId = "currency" | "accounts" | "topups" | "items" | "boosting" | "giftcards";

interface Category {
    id: CategoryId;
    title: string;
    icon: React.ReactNode;
}

const CATEGORIES: Category[] = [
    { id: "currency", title: "Currency", icon: <Coins className="h-6 w-6 text-[#f5a623]" /> },
    { id: "accounts", title: "Accounts", icon: <User className="h-6 w-6 text-[#f5a623]" /> },
    { id: "topups", title: "Top Ups", icon: <Zap className="h-6 w-6 text-[#f5a623]" /> },
    { id: "items", title: "Items", icon: <Sword className="h-6 w-6 text-[#f5a623]" /> },
    { id: "boosting", title: "Boosting", icon: <Rocket className="h-6 w-6 text-[#f5a623]" /> },
    { id: "giftcards", title: "Gift Card", icon: <Gift className="h-6 w-6 text-[#f5a623]" /> },
];

export default function EditListingPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Form State (initialized with Mock Data)
    const [description, setDescription] = useState(MOCK_LISTING.description);
    const [deliveryTime, setDeliveryTime] = useState(MOCK_LISTING.deliveryTime);
    const [deliveryMethods, setDeliveryMethods] = useState<string[]>(MOCK_LISTING.deliveryMethods);
    const [stock, setStock] = useState(MOCK_LISTING.stock);
    const [minOrder, setMinOrder] = useState(MOCK_LISTING.minOrder);
    const [price, setPrice] = useState(MOCK_LISTING.pricePerUnit);

    const listingCategory = CATEGORIES.find(c => c.id === MOCK_LISTING.category);

    const handleDeliveryMethodToggle = (method: string) => {
        setDeliveryMethods(prev =>
            prev.includes(method)
                ? prev.filter(m => m !== method)
                : [...prev, method]
        );
    };

    const handleSave = async () => {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoading(false);
        // Toast success (if you have a toaster, otherwise alert)
        // alert("Listing updated successfully!");
        router.push("/dashboard/offers");
    };

    // Calculations
    const fee = price * 0.10;
    const earnings = price - fee;

    return (
        <div className="min-h-screen bg-[#0a0e13] pb-20">
            {/* Header Banner */}
            <div className="w-full h-32 bg-gradient-to-r from-blue-600 to-blue-500 relative overflow-hidden mb-12">
                <div className="absolute inset-0 opacity-10 bg-[url('/grid.svg')]" />
                <div className="absolute inset-x-0 bottom-0 h-1 bg-[#00ffcc]" />
            </div>

            <main className="container max-w-3xl mx-auto px-4">
                <div className="space-y-8">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-sm text-[#8b949e]">
                        <span className="cursor-pointer hover:text-white" onClick={() => router.push("/dashboard/offers")}>Offers</span>
                        <ChevronRight className="h-3 w-3" />
                        <span className="text-[#f5a623] font-bold">Edit Listing</span>
                    </div>

                    <div className="space-y-2 text-center">
                        <h1 className="text-2xl font-medium text-[#fdfcf0]">Edit Listing #{MOCK_LISTING.id}</h1>
                        {/* Static Game Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f5a623]/10 border border-[#f5a623]/20 rounded text-xs text-[#f5a623]">
                            <span className="w-2 h-2 rounded-full bg-[#f5a623]" />
                            {MOCK_LISTING.game}
                        </div>
                    </div>

                    <Card className="bg-[#1c2128] border-none p-8 space-y-8">
                        {/* Locked Info */}
                        <div className="p-4 bg-[#0a0e13] rounded-lg border border-[#2d333b] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {listingCategory?.icon}
                                <span className="text-white font-black uppercase tracking-tight">{listingCategory?.title}</span>
                            </div>
                            <span className="text-[10px] text-[#8b949e] font-black uppercase tracking-widest">Locked Category</span>
                        </div>

                        {/* Description */}
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <Label className="text-[#fdfcf0]">Description (Optional)</Label>
                                <span className="text-xs text-[#9ca3af]">{description.length}/500</span>
                            </div>
                            <Textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Type here..."
                                className="bg-[#0a0e13] border-[#2d333b] min-h-[100px] text-[#fdfcf0] focus:border-[#f5a623]/50"
                            />
                        </div>

                        {/* Delivery */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[#fdfcf0]">Delivery</Label>
                                <div className="bg-[#0a0e13] border border-[#2d333b] rounded-lg p-4 flex justify-between items-center">
                                    <div>
                                        <div className="text-sm text-[#9ca3af]">Guaranteed Delivery Time</div>
                                        <Select value={deliveryTime} onValueChange={setDeliveryTime}>
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
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Label className="text-[#fdfcf0]">Delivery method</Label>
                                    <Badge variant="outline" className="text-[#f5a623] border-[#f5a623]/20 bg-[#f5a623]/10 text-[10px] h-5">Auto</Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {["In-Game Mail", "Face to Face", "Auction House", "Mail Trading", "Item Delivery", "Account Share"].map((method) => (
                                        <div key={method} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={method}
                                                checked={deliveryMethods.includes(method)}
                                                onCheckedChange={() => handleDeliveryMethodToggle(method)}
                                                className="border-[#2d333b] data-[state=checked]:bg-[#f5a623] data-[state=checked]:border-[#f5a623]"
                                            />
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
                                        <Input
                                            type="number"
                                            value={stock}
                                            onChange={(e) => setStock(Number(e.target.value))}
                                            className="bg-[#0a0e13] border-[#2d333b] text-[#fdfcf0] pr-12"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9ca3af]">Units</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs text-[#9ca3af]">Minimum Order Quantity</span>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            value={minOrder}
                                            onChange={(e) => setMinOrder(Number(e.target.value))}
                                            className="bg-[#0a0e13] border-[#2d333b] text-[#fdfcf0] pr-12"
                                        />
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
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(Number(e.target.value))}
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
                                <span className="text-[#fdfcf0]">${fee.toFixed(2)}</span>
                            </div>
                            <div className="h-px bg-[#2d333b]" />
                            <div className="flex justify-between text-sm font-medium">
                                <span className="text-[#f5a623]">Earnings per unit</span>
                                <span className="text-[#f5a623]">${earnings.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <Button
                                variant="outline"
                                onClick={() => router.back()}
                                className="flex-1 border-[#2d333b] hover:bg-[#2d333b] text-[#fdfcf0]"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={loading}
                                className="flex-1 bg-[#f5a623] text-black hover:bg-[#e09612] font-medium"
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>

                    </Card>
                </div>
            </main>
        </div>
    );
}
