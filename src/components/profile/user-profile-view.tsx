"use client";

import * as React from "react";
import { MainNavbar } from "@/components/layout/main-navbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    Shield,
    Check,
    Search,
    ShoppingBag,
    Coins,
    Package,
    Gamepad2,
    Gift,
    Flag,
    ThumbsUp,
    ThumbsDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

// Mock products
const products = [
    {
        id: 1,
        title: "Fresh Account - PC",
        game: "Marvel Rivals",
        category: "Steam Fresh Account",
        price: 1.00,
        deliveryTime: "20 min",
        image: "/images/product-placeholder.jpg",
        autoDelivery: true,
    },
    {
        id: 2,
        title: "Steam Account lv34 | 8+ Years | €1860 Game Value",
        game: "Steam",
        category: "Account",
        price: 800.00,
        deliveryTime: "20 min",
        image: "/images/product-placeholder-2.jpg",
        autoDelivery: false,
    }
];

// Categories
const categories = [
    { id: "currency", label: "Currency", count: 1, icon: Coins },
    { id: "accounts", label: "Accounts", count: 2, icon: Shield },
    { id: "items", label: "Items", count: 1, icon: Package },
    { id: "top-ups", label: "Top Ups", count: 0, icon: ShoppingBag },
    { id: "gift-cards", label: "Gift Cards", count: 0, icon: Gift },
];

const reviews = [
    {
        id: 1,
        type: "Items",
        user: "Pri***",
        comment: "Nice guy",
        date: "5 days ago",
        positive: true,
    },
    {
        id: 2,
        type: "Custom Request",
        user: "Fre***",
        comment: "GOOD FAST NO SCAM",
        date: "6 days ago",
        positive: true,
    },
    {
        id: 3,
        type: "Items",
        user: "Ann***",
        comment: "good service",
        date: "9 days ago",
        positive: true,
    },
    {
        id: 4,
        type: "Custom Request",
        user: "Fre***",
        comment: "GOOD",
        date: "9 days ago",
        positive: true,
    },
    {
        id: 5,
        type: "Custom Request",
        user: "scr***",
        comment: "the best",
        date: "9 days ago",
        positive: true,
    },
    {
        id: 6,
        type: "Custom Request",
        user: "Cle***",
        comment: "GOAT",
        date: "12 days ago",
        positive: true,
    },
];

interface UserProfileViewProps {
    user: any; // Using any to avoid complex type sharing for now. In real app, share types via a types file.
}

export function UserProfileView({ user }: UserProfileViewProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Map URL params to state
    const tabParam = searchParams.get("tab");
    const categoryParam = searchParams.get("category");

    const initialTab = tabParam === "Offers" ? "Shop" : (tabParam || "Shop");

    const getCategoryIdIdFromParam = (param: string | null) => {
        if (!param) return "accounts";
        if (param === "Account") return "accounts";
        return param.toLowerCase();
    };

    const [activeTab, setActiveTab] = React.useState(initialTab);
    const [activeCategory, setActiveCategory] = React.useState(getCategoryIdIdFromParam(categoryParam));

    // Update URL when state changes
    const updateUrl = (tab: string, category: string) => {
        const params = new URLSearchParams(searchParams);
        params.set("tab", tab === "Shop" ? "Offers" : tab);

        // Map category id back to URL param format
        const catLabel = categories.find(c => c.id === category)?.label;
        let catParam = category;
        if (category === "accounts") catParam = "Account";
        else if (category === "items") catParam = "Item";
        else if (category === "currency") catParam = "Currency";

        params.set("category", catParam);

        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        updateUrl(tab, activeCategory);
    };

    const handleCategoryChange = (catId: string) => {
        setActiveCategory(catId);
        updateUrl(activeTab, catId);
    };

    // Derived User Props
    const username = user.username;
    const joinedDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown';

    return (
        <div className="min-h-screen bg-[#0a0e13]">
            <MainNavbar variant="landing" user={user} />

            {/* Content Container */}
            <div className="pt-[88px]">
                {/* Banner */}
                <div className="h-48 w-full bg-[#1c2128] relative overflow-hidden">
                    {/* Pattern Overlay */}
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat" />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
                </div>

                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative">
                    {/* Profile Header Card - Overlaps Banner */}
                    <Card className="bg-[#1c2128] border-[#2d333b] -mt-16 mb-8 relative z-10">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                                <div className="flex gap-4 items-center">
                                    {/* Avatar */}
                                    <div className="relative">
                                        <div className="h-24 w-24 rounded-full bg-[#252b33] border-4 border-[#1c2128] flex items-center justify-center text-3xl font-bold text-white overflow-hidden">
                                            {user.avatar ? (
                                                <img
                                                    src={user.avatar}
                                                    alt={username}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                username.charAt(0).toUpperCase()
                                            )}
                                            {/* Online Status Dot (Bordered) */}
                                            <div className="absolute bottom-1 right-1 h-5 w-5 bg-green-500 rounded-full border-4 border-[#1c2128]" />
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h1 className="text-2xl font-bold text-white">{username}</h1>
                                            {/* Defaults to checkmark for now */}
                                            <Badge variant="secondary" className="bg-[#5c9eff]/10 text-[#5c9eff] hover:bg-[#5c9eff]/20 border-0 p-1 rounded-full">
                                                <Check className="h-3 w-3" />
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm">
                                            <div className="flex items-center gap-1 text-[#22c55e]">
                                                <ThumbsUp className="h-4 w-4 fill-current" />
                                                <span className="font-semibold">100%</span>
                                                <span className="text-[#9ca3af] font-normal">{user.reviews || 0} reviews</span>
                                            </div>
                                            <span className="text-[#6b7280]">•</span>
                                            <div className="flex items-center gap-1 text-[#22c55e]">
                                                <div className="h-2 w-2 rounded-full bg-current" />
                                                Online
                                            </div>
                                            <span className="text-[#6b7280]">•</span>
                                            <span className="text-[#9ca3af]">Joined {joinedDate}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="absolute top-4 right-4">
                                    <button className="text-[#6b7280] hover:text-white transition-colors">
                                        <Flag className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Navigation Tabs (Inside Card) */}
                            <div className="flex items-center gap-8 mt-8 border-b border-[#2d333b]">
                                {["Shop", "Reviews", "About"].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => handleTabChange(tab)}
                                        className={cn(
                                            "pb-3 text-sm font-medium border-b-2 transition-colors",
                                            activeTab === tab
                                                ? "border-[#f5a623] text-white"
                                                : "border-transparent text-[#9ca3af] hover:text-white"
                                        )}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Shop Content */}
                    {activeTab === "Shop" && (
                        <div className="space-y-8 pb-12">
                            {/* Shop Header */}
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-6">Shop</h2>

                                {/* Categories */}
                                <div className="flex flex-wrap gap-4 mb-8">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => handleCategoryChange(cat.id)}
                                            className={cn(
                                                "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all w-28 h-28 space-y-2",
                                                activeCategory === cat.id
                                                    ? "border-[#f5a623] bg-[#f5a623]/5 text-[#f5a623]"
                                                    : "border-[#2d333b] bg-[#1c2128] text-[#9ca3af] hover:border-[#3d444d]"
                                            )}
                                        >
                                            <cat.icon className="h-8 w-8" />
                                            <span className="text-xs font-medium">{cat.label} ({cat.count})</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Filters Row */}
                                <div className="flex gap-4 mb-6">
                                    <div className="relative flex-1 max-w-md">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b7280]" />
                                        <input
                                            type="text"
                                            placeholder="Search offers"
                                            className="w-full h-10 pl-10 pr-4 rounded-lg bg-[#1c2128] border border-[#2d333b] text-white placeholder:text-[#6b7280] focus:border-[#f5a623] focus:outline-none"
                                        />
                                    </div>
                                    <div className="relative w-48">
                                        <select className="w-full h-10 px-4 rounded-lg bg-[#1c2128] border border-[#2d333b] text-white focus:border-[#f5a623] focus:outline-none appearance-none cursor-pointer">
                                            <option>All Games</option>
                                            <option>Marvel Rivals</option>
                                            <option>Steam</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#6b7280]">
                                            ▼
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Products Grid */}
                            <div>
                                <p className="text-[#6b7280] text-sm mb-4">{products.length} items found</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {products.map((product) => (
                                        <Card key={product.id} className="bg-[#1c2128] border-[#2d333b] overflow-hidden hover:border-[#3d444d] transition-colors group cursor-pointer">
                                            <CardContent className="p-0">
                                                <div className="h-32 bg-[#0a0e13] relative">
                                                    {/* Game Icon/Badge */}
                                                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs text-white">
                                                        <Gamepad2 className="h-3 w-3 text-[#f5a623]" />
                                                        {product.game}
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="text-white font-medium line-clamp-2 h-12 mb-2 group-hover:text-[#f5a623] transition-colors">
                                                        {product.title}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mb-4">
                                                        {product.autoDelivery && (
                                                            <Badge variant="secondary" className="bg-[#22c55e]/10 text-[#22c55e] text-[10px] px-1.5 py-0.5 border-0 rounded h-5">
                                                                <Check className="h-3 w-3 mr-1" /> Auto Delivery
                                                            </Badge>
                                                        )}
                                                        <span className="text-xs text-[#6b7280]">24/7</span>
                                                    </div>
                                                    <div className="flex items-center justify-between pt-3 border-t border-[#2d333b]">
                                                        <div className="text-lg font-bold text-white">
                                                            ${product.price.toFixed(2)}
                                                        </div>
                                                        <div className="flex items-center text-xs text-[#6b7280]">
                                                            <span className="mr-1">🕒</span>
                                                            {product.deliveryTime}
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Reviews Content */}
                    {activeTab === "Reviews" && (
                        <div className="space-y-6 pb-12">
                            {/* ... (existing reviews content) ... */}
                            {/* Header */}
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-6">Reviews</h2>

                                {/* Filters */}
                                <div className="flex items-center gap-2 mb-6">
                                    <button className="px-4 py-2 rounded-lg text-sm font-medium bg-[#f5a623] text-black transition-colors">
                                        All
                                    </button>
                                    <button className="px-4 py-2 rounded-lg text-sm font-medium bg-[#1c2128] text-white hover:bg-[#252b33] border border-[#2d333b] transition-colors flex items-center gap-2">
                                        Positive
                                        <ThumbsUp className="h-3 w-3" />
                                    </button>
                                    <button className="px-4 py-2 rounded-lg text-sm font-medium bg-[#1c2128] text-white hover:bg-[#252b33] border border-[#2d333b] transition-colors flex items-center gap-2">
                                        Negative
                                        <ThumbsDown className="h-3 w-3" />
                                    </button>
                                </div>

                                {/* Reviews List */}
                                <div className="rounded-lg border border-[#2d333b] bg-[#1c2128] overflow-hidden">
                                    <div className="divide-y divide-[#2d333b]">
                                        {reviews.map((review) => (
                                            <div key={review.id} className="p-4 hover:bg-[#252b33] transition-colors">
                                                <div className="flex items-start justify-between">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            {review.positive ? (
                                                                <ThumbsUp className="h-4 w-4 text-[#06b6d4]" />
                                                            ) : (
                                                                <ThumbsDown className="h-4 w-4 text-[#ef4444]" />
                                                            )}
                                                            <span className="text-sm font-medium text-white">
                                                                {review.type} <span className="text-[#6b7280]">|</span> {review.user}
                                                            </span>
                                                        </div>
                                                        <p className="text-[#9ca3af] text-sm pl-6">{review.comment}</p>
                                                    </div>
                                                    <span className="text-xs text-[#6b7280] whitespace-nowrap">
                                                        {review.date}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* About Content */}
                    {activeTab === "About" && (
                        <div className="space-y-6 pb-12">
                            <h2 className="text-2xl font-bold text-white mb-6">About</h2>
                            <Card className="bg-[#1c2128] border-[#2d333b]">
                                <CardContent className="p-6">
                                    {user.bio ? (
                                        <p className="text-[#9ca3af] whitespace-pre-wrap">{user.bio}</p>
                                    ) : (
                                        <div className="text-center py-8 text-[#6b7280]">
                                            <p>No bio available.</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
