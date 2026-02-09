"use client";

import * as React from "react";
import Link from "next/link";
import { MainNavbar } from "@/components/layout/main-navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    Star,
    Clock,
    Zap,
    Calendar,
    MessageSquare,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

interface Review {
    id: string;
    rating: number;
    content: string;
    title: string | null;
    createdAt: string;
    authorUsername: string;
    authorAvatar: string | null;
    listingTitle: string;
    gameName: string;
}

interface Listing {
    id: string;
    title: string;
    slug: string;
    price: number;
    gameName: string;
    gameSlug: string;
    categoryName: string;
    deliveryType: string;
    createdAt: string;
}

interface UserProfileViewProps {
    user: any;
    reviews: Review[];
    listings: Listing[];
}

// Categories mapping
const categoryIcons: Record<string, any> = {
    "Currency": Coins,
    "Account": Shield,
    "Accounts": Shield,
    "Items": Package,
    "Item": Package,
    "Top Ups": ShoppingBag,
    "Gift Cards": Gift,
};

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" | "lg" }) {
    const sizeClasses = {
        sm: "h-3 w-3",
        md: "h-4 w-4",
        lg: "h-5 w-5"
    };

    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={cn(
                        sizeClasses[size],
                        star <= rating
                            ? "text-[#f5a623] fill-[#f5a623]"
                            : "text-[#3d444d]"
                    )}
                />
            ))}
        </div>
    );
}

function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
}

export function UserProfileView({ user, reviews, listings }: UserProfileViewProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const tabParam = searchParams.get("tab");
    const categoryParam = searchParams.get("category");

    const initialTab = tabParam === "Offers" ? "Shop" : (tabParam || "Shop");

    const [activeTab, setActiveTab] = React.useState(initialTab);
    const [showReviews, setShowReviews] = React.useState(false);
    const [reviewFilter, setReviewFilter] = React.useState<"all" | 5 | 4 | 3 | 2 | 1>("all");
    const [searchQuery, setSearchQuery] = React.useState("");

    // Get unique categories from listings
    const categories = React.useMemo(() => {
        const catMap = new Map<string, number>();
        listings.forEach(l => {
            const count = catMap.get(l.categoryName) || 0;
            catMap.set(l.categoryName, count + 1);
        });
        return Array.from(catMap.entries()).map(([name, count]) => ({
            id: name.toLowerCase().replace(/\s+/g, '-'),
            label: name,
            count,
            icon: categoryIcons[name] || Package,
        }));
    }, [listings]);

    const [activeCategory, setActiveCategory] = React.useState(categories[0]?.id || "");

    const updateUrl = (tab: string, category: string) => {
        const params = new URLSearchParams(searchParams);
        params.set("tab", tab === "Shop" ? "Offers" : tab);
        params.set("category", category);
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

    const username = user.username;
    const joinedDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Unknown';

    // Calculate rating stats
    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0;
    const ratingCounts = [5, 4, 3, 2, 1].map(r => reviews.filter(rev => rev.rating === r).length);

    const filteredReviews = reviewFilter === "all"
        ? reviews
        : reviews.filter(r => r.rating === reviewFilter);

    // Filter listings
    const filteredListings = listings.filter(l => {
        const matchesCategory = !activeCategory || l.categoryName.toLowerCase().replace(/\s+/g, '-') === activeCategory;
        const matchesSearch = !searchQuery || l.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-[#0a0e13]">
            <MainNavbar variant="landing" user={user} />

            {/* Hero Banner */}
            <div className="pt-[80px]">
                <div className="h-56 w-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#f5a623]/20 via-[#0d1117] to-purple-600/10" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#f5a623]/10 via-transparent to-transparent" />
                    <div className="absolute top-10 right-20 w-64 h-64 bg-[#f5a623]/10 rounded-full blur-[100px] animate-pulse" />
                    <div className="absolute bottom-0 left-20 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px]" />
                    <div className="absolute inset-0 opacity-[0.03]" style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: '50px 50px'
                    }} />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    {/* Profile Card */}
                    <div className="bg-[#0d1117]/80 backdrop-blur-xl border border-white/10 rounded-3xl -mt-24 relative z-10 overflow-hidden shadow-2xl">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-[#f5a623]/50 to-transparent" />

                        <div className="p-8">
                            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                                {/* Left: Avatar + Info */}
                                <div className="flex gap-6 items-center">
                                    <div className="relative group">
                                        <div className="absolute -inset-1 bg-gradient-to-br from-[#f5a623] to-orange-600 rounded-full opacity-75 blur group-hover:opacity-100 transition-opacity" />
                                        <div className="relative h-28 w-28 rounded-full bg-[#161b22] border-4 border-[#0d1117] flex items-center justify-center text-4xl font-black text-white overflow-hidden">
                                            {user.avatar ? (
                                                <img src={user.avatar} alt={username} className="h-full w-full object-cover" />
                                            ) : (
                                                <span className="bg-gradient-to-br from-[#f5a623] to-orange-600 bg-clip-text text-transparent">
                                                    {username.charAt(0).toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <div className="absolute bottom-1 right-1 h-6 w-6 bg-green-500 rounded-full border-4 border-[#0d1117] shadow-lg shadow-green-500/50" />
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <h1 className="text-3xl font-black text-white uppercase tracking-tight">{username}</h1>
                                            <Badge className="bg-[#f5a623]/10 text-[#f5a623] border border-[#f5a623]/30 px-2 py-1 rounded-lg">
                                                <Check className="h-3 w-3 mr-1" /> Verified
                                            </Badge>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-4 text-sm">
                                            {/* Clickable Rating - toggles reviews section */}
                                            <button
                                                onClick={() => setShowReviews(!showReviews)}
                                                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#f5a623]/10 border border-[#f5a623]/20 hover:border-[#f5a623]/50 transition-all group cursor-pointer"
                                            >
                                                <StarRating rating={Math.round(avgRating)} size="sm" />
                                                <span className="font-bold text-[#f5a623]">{avgRating.toFixed(1)}</span>
                                                <span className="text-[#8b949e] group-hover:text-white transition-colors">
                                                    ({totalReviews} reviews)
                                                </span>
                                                {showReviews ? (
                                                    <ChevronUp className="h-3 w-3 text-[#f5a623]" />
                                                ) : (
                                                    <ChevronDown className="h-3 w-3 text-[#8b949e] group-hover:text-[#f5a623] transition-colors" />
                                                )}
                                            </button>

                                            <div className="flex items-center gap-1.5 text-green-400">
                                                <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                                                <span className="font-medium">Online</span>
                                            </div>

                                            <div className="flex items-center gap-1.5 text-[#8b949e]">
                                                <Calendar className="h-4 w-4" />
                                                <span>Joined {joinedDate}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Actions */}
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-white/10 bg-white/5 hover:bg-white/10 text-white"
                                    >
                                        <MessageSquare className="h-4 w-4 mr-2" />
                                        Message
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-[#8b949e] hover:text-red-500 hover:bg-red-500/10"
                                    >
                                        <Flag className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="flex items-center gap-1 mt-8 p-1 bg-white/5 rounded-2xl w-fit">
                                {["Shop", "Reviews", "About"].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => handleTabChange(tab)}
                                        className={cn(
                                            "px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all",
                                            activeTab === tab
                                                ? "bg-[#f5a623] text-black shadow-lg shadow-[#f5a623]/20"
                                                : "text-[#8b949e] hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        {tab}
                                        {tab === "Reviews" && <span className="ml-1 opacity-60">({totalReviews})</span>}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Shop Content */}
                    {activeTab === "Shop" && (
                        <div className="py-10 space-y-8">
                            {/* Categories */}
                            {categories.length > 0 && (
                                <div className="flex flex-wrap gap-3">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => handleCategoryChange(cat.id)}
                                            className={cn(
                                                "flex items-center gap-2 px-5 py-3 rounded-2xl border transition-all font-medium",
                                                activeCategory === cat.id
                                                    ? "border-[#f5a623] bg-[#f5a623]/10 text-[#f5a623] shadow-lg shadow-[#f5a623]/10"
                                                    : "border-white/10 bg-white/5 text-[#8b949e] hover:border-white/20 hover:text-white"
                                            )}
                                        >
                                            <cat.icon className="h-4 w-4" />
                                            <span>{cat.label}</span>
                                            <span className="text-xs opacity-60">({cat.count})</span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Search */}
                            <div className="relative max-w-md">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8b949e]" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search listings..."
                                    className="w-full h-12 pl-12 pr-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-[#8b949e] focus:border-[#f5a623]/50 focus:outline-none focus:ring-2 focus:ring-[#f5a623]/20 transition-all"
                                />
                            </div>

                            {/* Inline Reviews Section (when expanded) */}
                            {showReviews && reviews.length > 0 && (
                                <div className="bg-[#0d1117]/60 backdrop-blur border border-white/10 rounded-2xl p-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <StarRating rating={Math.round(avgRating)} size="lg" />
                                            <div>
                                                <span className="text-2xl font-black text-white">{avgRating.toFixed(1)}</span>
                                                <span className="text-[#8b949e] ml-2">({totalReviews} reviews)</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setShowReviews(false)}
                                            className="text-[#8b949e] hover:text-white text-sm"
                                        >
                                            Hide reviews
                                        </button>
                                    </div>

                                    {/* Filter buttons */}
                                    <div className="flex gap-2 overflow-x-auto pb-2">
                                        <button
                                            onClick={() => setReviewFilter("all")}
                                            className={cn(
                                                "px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
                                                reviewFilter === "all"
                                                    ? "bg-[#f5a623] text-black"
                                                    : "bg-white/5 text-[#8b949e] hover:text-white"
                                            )}
                                        >
                                            All ({totalReviews})
                                        </button>
                                        {([5, 4, 3, 2, 1] as const).map((star, idx) => (
                                            ratingCounts[idx] > 0 && (
                                                <button
                                                    key={star}
                                                    onClick={() => setReviewFilter(star)}
                                                    className={cn(
                                                        "px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex items-center gap-1",
                                                        reviewFilter === star
                                                            ? "bg-[#f5a623] text-black"
                                                            : "bg-white/5 text-[#8b949e] hover:text-white"
                                                    )}
                                                >
                                                    {star} <Star className="h-3 w-3" /> ({ratingCounts[idx]})
                                                </button>
                                            )
                                        ))}
                                    </div>

                                    {/* Reviews list */}
                                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                                        {filteredReviews.slice(0, 10).map((review) => (
                                            <div
                                                key={review.id}
                                                className="bg-white/5 rounded-xl p-4"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-start gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#f5a623]/20 to-purple-500/20 flex items-center justify-center text-white font-bold flex-shrink-0">
                                                            {review.authorAvatar ? (
                                                                <img src={review.authorAvatar} alt="" className="h-full w-full rounded-full object-cover" />
                                                            ) : (
                                                                review.authorUsername.charAt(0).toUpperCase()
                                                            )}
                                                        </div>
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <span className="font-bold text-white">{review.authorUsername}</span>
                                                                <Badge variant="secondary" className="bg-white/5 text-[#8b949e] text-[10px] border-0">
                                                                    {review.gameName}
                                                                </Badge>
                                                            </div>
                                                            <StarRating rating={review.rating} size="sm" />
                                                            <p className="text-[#8b949e] text-sm">{review.content}</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-[#6b7280] whitespace-nowrap">{formatTimeAgo(review.createdAt)}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Products Grid */}
                            {filteredListings.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filteredListings.map((listing) => (
                                        <Link
                                            key={listing.id}
                                            href={`/games/${listing.gameSlug}/${listing.slug}`}
                                            className="group bg-[#0d1117]/60 backdrop-blur border border-white/5 rounded-2xl overflow-hidden hover:border-[#f5a623]/30 transition-all hover:shadow-xl hover:shadow-[#f5a623]/5 cursor-pointer"
                                        >
                                            <div className="h-36 bg-gradient-to-br from-[#161b22] to-[#0d1117] relative overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] to-transparent opacity-50" />
                                                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                                                    <Gamepad2 className="h-3 w-3 text-[#f5a623]" />
                                                    <span className="text-xs text-white font-medium">{listing.gameName}</span>
                                                </div>
                                                {listing.deliveryType === 'automatic' && (
                                                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-green-500/20 backdrop-blur-sm px-2 py-1 rounded-lg">
                                                        <Zap className="h-3 w-3 text-green-400" />
                                                        <span className="text-[10px] text-green-400 font-bold uppercase">Instant</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4 space-y-3">
                                                <h3 className="text-white font-bold line-clamp-2 h-12 group-hover:text-[#f5a623] transition-colors">
                                                    {listing.title}
                                                </h3>
                                                <div className="flex items-center gap-2 text-xs text-[#8b949e]">
                                                    <Clock className="h-3 w-3" />
                                                    <span>{listing.deliveryType === 'automatic' ? 'Instant' : '24h'}</span>
                                                </div>
                                                <div className="pt-3 border-t border-white/5">
                                                    <div className="text-2xl font-black text-white">
                                                        ${listing.price.toFixed(2)}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16">
                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                                        <Package className="h-8 w-8 text-[#8b949e]" />
                                    </div>
                                    <p className="text-[#8b949e] font-medium">No listings found</p>
                                    <p className="text-[#6b7280] text-sm mt-1">This seller hasn't listed any items yet</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Reviews Content */}
                    {activeTab === "Reviews" && (
                        <div className="py-10 space-y-8">
                            {reviews.length > 0 ? (
                                <>
                                    {/* Rating Summary */}
                                    <div className="bg-[#0d1117]/60 backdrop-blur border border-white/10 rounded-2xl p-6">
                                        <div className="flex flex-col lg:flex-row gap-8">
                                            <div className="text-center lg:text-left lg:pr-8 lg:border-r border-white/10">
                                                <div className="text-5xl font-black text-white mb-2">{avgRating.toFixed(1)}</div>
                                                <StarRating rating={Math.round(avgRating)} size="lg" />
                                                <p className="text-[#8b949e] mt-2">{totalReviews} reviews</p>
                                            </div>

                                            <div className="flex-1 space-y-2">
                                                {([5, 4, 3, 2, 1] as const).map((star, idx) => (
                                                    <button
                                                        key={star}
                                                        onClick={() => setReviewFilter(reviewFilter === star ? "all" : star)}
                                                        className={cn(
                                                            "w-full flex items-center gap-3 p-2 rounded-lg transition-all",
                                                            reviewFilter === star ? "bg-[#f5a623]/10" : "hover:bg-white/5"
                                                        )}
                                                    >
                                                        <span className="text-sm text-[#8b949e] w-12">{star} stars</span>
                                                        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-[#f5a623] rounded-full transition-all"
                                                                style={{ width: `${totalReviews > 0 ? (ratingCounts[idx] / totalReviews) * 100 : 0}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-sm text-[#8b949e] w-8">{ratingCounts[idx]}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Reviews List */}
                                    <div className="space-y-4">
                                        {filteredReviews.map((review) => (
                                            <div
                                                key={review.id}
                                                className="bg-[#0d1117]/60 backdrop-blur border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-start gap-4">
                                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#f5a623]/20 to-purple-500/20 flex items-center justify-center text-white font-bold">
                                                            {review.authorAvatar ? (
                                                                <img src={review.authorAvatar} alt="" className="h-full w-full rounded-full object-cover" />
                                                            ) : (
                                                                review.authorUsername.charAt(0).toUpperCase()
                                                            )}
                                                        </div>
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-white">{review.authorUsername}</span>
                                                                <Badge variant="secondary" className="bg-white/5 text-[#8b949e] text-[10px] border-0">
                                                                    {review.gameName}
                                                                </Badge>
                                                            </div>
                                                            <StarRating rating={review.rating} size="sm" />
                                                            <p className="text-[#8b949e] mt-2">{review.content}</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-[#6b7280]">{formatTimeAgo(review.createdAt)}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-16">
                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                                        <Star className="h-8 w-8 text-[#8b949e]" />
                                    </div>
                                    <p className="text-[#8b949e] font-medium">No reviews yet</p>
                                    <p className="text-[#6b7280] text-sm mt-1">This seller hasn't received any reviews</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* About Content */}
                    {activeTab === "About" && (
                        <div className="py-10">
                            <div className="bg-[#0d1117]/60 backdrop-blur border border-white/10 rounded-2xl p-8">
                                {user.bio ? (
                                    <p className="text-[#8b949e] whitespace-pre-wrap leading-relaxed">{user.bio}</p>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                                            <MessageSquare className="h-8 w-8 text-[#8b949e]" />
                                        </div>
                                        <p className="text-[#8b949e] font-medium">No bio available</p>
                                        <p className="text-[#6b7280] text-sm mt-1">This user hasn't added a bio yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
