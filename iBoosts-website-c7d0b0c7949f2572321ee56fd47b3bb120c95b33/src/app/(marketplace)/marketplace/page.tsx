import { MainNavbar } from "@/components/layout/main-navbar";
import { Footer } from "@/components/layout/footer";
import { ListingCard } from "@/components/marketplace/listing-card";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal, Grid, List } from "lucide-react";

// Mock data - replace with real data from database
const categories = [
    { name: "All Categories", slug: "all", count: 3420 },
    { name: "Gaming", slug: "gaming", icon: "🎮", count: 1234 },
    { name: "Streaming", slug: "streaming", icon: "📺", count: 856 },
    { name: "Software", slug: "software", icon: "💻", count: 543 },
    { name: "Social Media", slug: "social-media", icon: "📱", count: 432 },
    { name: "Cloud Services", slug: "cloud", icon: "☁️", count: 321 },
];

const listings = [
    {
        id: "1",
        title: "Valorant Immortal Account - Full Access",
        price: 149.99,
        originalPrice: 199.99,
        seller: { username: "ProGamer", avatar: null, rating: 4.9, sales: 234 },
        category: "Gaming",
        image: null,
        stock: 5,
    },
    {
        id: "2",
        title: "Discord Nitro 1 Year - Instant Delivery",
        price: 79.99,
        originalPrice: 99.99,
        seller: { username: "DigitalDeals", avatar: null, rating: 4.8, sales: 1023 },
        category: "Software",
        image: null,
        stock: 50,
    },
    {
        id: "3",
        title: "Spotify Premium Lifetime - Warranty",
        price: 29.99,
        originalPrice: null,
        seller: { username: "StreamKing", avatar: null, rating: 4.7, sales: 567 },
        category: "Streaming",
        image: null,
        stock: 100,
    },
    {
        id: "4",
        title: "Netflix Premium 4K UHD - 1 Month",
        price: 19.99,
        originalPrice: null,
        seller: { username: "MediaPro", avatar: null, rating: 4.9, sales: 890 },
        category: "Streaming",
        image: null,
        stock: 25,
    },
    {
        id: "5",
        title: "League of Legends Diamond Account",
        price: 89.99,
        originalPrice: 129.99,
        seller: { username: "ProGamer", avatar: null, rating: 4.9, sales: 234 },
        category: "Gaming",
        image: null,
        stock: 3,
    },
    {
        id: "6",
        title: "Adobe Creative Cloud - 1 Year",
        price: 199.99,
        originalPrice: 599.99,
        seller: { username: "SoftwareHub", avatar: null, rating: 4.6, sales: 321 },
        category: "Software",
        image: null,
        stock: 15,
    },
    {
        id: "7",
        title: "Instagram 10K Followers - Real",
        price: 49.99,
        originalPrice: null,
        seller: { username: "SocialBoost", avatar: null, rating: 4.5, sales: 456 },
        category: "Social Media",
        image: null,
        stock: 200,
    },
    {
        id: "8",
        title: "YouTube Premium Family - 1 Year",
        price: 39.99,
        originalPrice: 59.99,
        seller: { username: "MediaPro", avatar: null, rating: 4.9, sales: 890 },
        category: "Streaming",
        image: null,
        stock: 40,
    },
];

const sortOptions = [
    { value: "relevance", label: "Relevance" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "newest", label: "Newest First" },
    { value: "best-selling", label: "Best Selling" },
    { value: "rating", label: "Highest Rated" },
];

export default function MarketplacePage() {
    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            <MainNavbar />

            <main className="pt-20 pb-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                            Marketplace
                        </h1>
                        <p className="text-[var(--text-muted)] mt-2">
                            Discover thousands of digital products from verified sellers
                        </p>
                    </div>

                    {/* Search & Filters */}
                    <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-1 items-center gap-4">
                            <div className="relative flex-1 max-w-md">
                                <Input
                                    placeholder="Search products..."
                                    leftIcon={<Search className="h-4 w-4" />}
                                    className="pr-4"
                                />
                            </div>
                            <Button variant="secondary">
                                <SlidersHorizontal className="h-4 w-4 mr-2" />
                                Filters
                            </Button>
                        </div>

                        <div className="flex items-center gap-4">
                            <Select defaultValue="relevance">
                                <SelectTrigger className="w-44">
                                    <SelectValue placeholder="Sort order" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sortOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <div className="hidden sm:flex items-center gap-1 border border-[var(--border-subtle)] rounded-lg p-1">
                                <Button variant="ghost" size="icon-sm" className="rounded">
                                    <Grid className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon-sm" className="rounded">
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-8">
                        {/* Sidebar Categories */}
                        <aside className="hidden lg:block w-64 shrink-0">
                            <Card className="p-4 sticky top-24">
                                <h3 className="font-semibold text-[var(--text-primary)] mb-4">
                                    Categories
                                </h3>
                                <ul className="space-y-1">
                                    {categories.map((category) => (
                                        <li key={category.slug}>
                                            <button
                                                className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${category.slug === "all"
                                                    ? "bg-[var(--olive-600)] text-white"
                                                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
                                                    }`}
                                            >
                                                <span className="flex items-center gap-2">
                                                    {category.icon && <span>{category.icon}</span>}
                                                    {category.name}
                                                </span>
                                                <Badge variant="secondary" size="sm">
                                                    {category.count}
                                                </Badge>
                                            </button>
                                        </li>
                                    ))}
                                </ul>

                                {/* Price Range */}
                                <div className="mt-6 pt-6 border-t border-[var(--border-subtle)]">
                                    <h3 className="font-semibold text-[var(--text-primary)] mb-4">
                                        Price Range
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <Input placeholder="Min" type="number" className="text-sm" />
                                        <span className="text-[var(--text-muted)]">-</span>
                                        <Input placeholder="Max" type="number" className="text-sm" />
                                    </div>
                                    <Button variant="secondary" size="sm" className="w-full mt-3">
                                        Apply
                                    </Button>
                                </div>

                                {/* Seller Rating */}
                                <div className="mt-6 pt-6 border-t border-[var(--border-subtle)]">
                                    <h3 className="font-semibold text-[var(--text-primary)] mb-4">
                                        Seller Rating
                                    </h3>
                                    <div className="space-y-2">
                                        {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                                            <label
                                                key={rating}
                                                className="flex items-center gap-2 cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-[var(--border-default)] bg-[var(--bg-input)] text-[var(--olive-600)] focus:ring-[var(--olive-600)]"
                                                />
                                                <span className="text-sm text-[var(--text-secondary)]">
                                                    {rating}+ stars
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        </aside>

                        {/* Listings Grid */}
                        <div className="flex-1">
                            <div className="mb-4 text-sm text-[var(--text-muted)]">
                                Showing {listings.length} results
                            </div>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                {listings.map((listing) => (
                                    <ListingCard key={listing.id} listing={listing} />
                                ))}
                            </div>

                            {/* Pagination */}
                            <div className="mt-8 flex items-center justify-center gap-2">
                                <Button variant="secondary" size="sm" disabled>
                                    Previous
                                </Button>
                                <Button variant="default" size="sm">
                                    1
                                </Button>
                                <Button variant="secondary" size="sm">
                                    2
                                </Button>
                                <Button variant="secondary" size="sm">
                                    3
                                </Button>
                                <span className="text-[var(--text-muted)]">...</span>
                                <Button variant="secondary" size="sm">
                                    12
                                </Button>
                                <Button variant="secondary" size="sm">
                                    Next
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
