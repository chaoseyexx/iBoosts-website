import { NavbarServer } from "@/components/layout/navbar-server";
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
import prisma from "@/lib/prisma/client";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Prevent static generation - this page requires database access
export const dynamic = "force-dynamic";

export default async function MarketplacePage() {
    // 1. Fetch Categories from DB
    const dbCategories = await prisma.category.findMany({
        where: { isActive: true },
        select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
            _count: {
                select: { listings: { where: { status: "ACTIVE" } } }
            }
        },
        orderBy: { sortOrder: "asc" }
    });

    const categories = [
        { name: "All Categories", slug: "all", icon: null as string | null, count: dbCategories.reduce((acc, cat) => acc + cat._count.listings, 0) },
        ...dbCategories.map(cat => ({
            name: cat.name,
            slug: cat.slug,
            icon: cat.icon,
            count: cat._count.listings
        }))
    ];

    // 2. Fetch Featured/Active Listings
    const listings = await prisma.listing.findMany({
        where: { status: "ACTIVE" },
        take: 12,
        include: {
            seller: {
                select: {
                    id: true,
                    username: true,
                    avatar: true,
                    sellerRating: true,
                    totalSales: true,
                }
            },
            game: {
                select: { name: true }
            }
        },
        orderBy: { createdAt: "desc" }
    });

    const sortOptions = [
        { label: "Most Relevant", value: "relevance" },
        { label: "Newest First", value: "newest" },
        { label: "Price: Low to High", value: "price_asc" },
        { label: "Price: High to Low", value: "price_desc" },
        { label: "Best Rating", value: "rating" },
    ];

    return (
        <div className="min-h-screen bg-[#050506]">
            <NavbarServer variant="landing" />

            <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="flex flex-col space-y-8">
                    {/* Hero Section */}
                    <div className="text-center space-y-4 py-8">
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase">
                            Premium <span className="text-[#f5a623]">Marketplace</span>
                        </h1>
                        <p className="text-[#8b949e] max-w-2x1 mx-auto text-lg">
                            The most trusted platform for buying and selling digital assets, currency, and boosting services.
                        </p>
                    </div>

                    {/* Filter Bar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0d1117] border border-[#1c2128]">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8b949e]" />
                            <Input
                                placeholder="Search the marketplace..."
                                className="pl-10 h-10 bg-[#161b22] border-[#2d333b]"
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <Select defaultValue="relevance">
                                <SelectTrigger className="w-44 h-10 bg-[#161b22] border-[#2d333b]">
                                    <SelectValue placeholder="Sort order" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1c2128] border-[#2d333b]">
                                    {sortOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value} className="text-white hover:bg-[#252b33]">
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button variant="outline" className="h-10 border-[#2d333b] bg-[#161b22] text-[#8b949e]">
                                <SlidersHorizontal className="h-4 w-4 mr-2" />
                                Filters
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar Categories */}
                        <aside className="w-full lg:w-64 shrink-0">
                            <Card className="p-4 bg-[#0d1117] border-[#1c2128]">
                                <h3 className="font-bold text-white mb-4 uppercase text-xs tracking-widest text-[#8b949e]">
                                    Categories
                                </h3>
                                <ul className="space-y-1">
                                    {categories.map((category) => (
                                        <li key={category.slug}>
                                            <Link href={category.slug === "all" ? "/marketplace" : `/${category.slug}`}>
                                                <div className={cn(
                                                    "w-full flex items-center justify-between rounded-xl px-4 py-2.5 text-sm transition-all group",
                                                    category.slug === "all"
                                                        ? "bg-[#f5a623] text-black font-bold"
                                                        : "text-[#8b949e] hover:bg-[#161b22] hover:text-white"
                                                )}>
                                                    <span className="flex items-center gap-3">
                                                        {category.icon && <span className="text-lg">{category.icon}</span>}
                                                        {category.name}
                                                    </span>
                                                    <Badge variant="outline" className={cn(
                                                        "text-[10px] h-5",
                                                        category.slug === "all" ? "border-black/20 text-black/60" : "border-[#2d333b] text-[#8b949e]"
                                                    )}>
                                                        {category.count}
                                                    </Badge>
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        </aside>

                        {/* Main Grid */}
                        <div className="flex-1 space-y-6">
                            {listings.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {listings.map((listing) => (
                                        <ListingCard key={listing.id} listing={listing as any} />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 bg-[#0d1117] rounded-3xl border border-dashed border-[#2d333b]">
                                    <div className="h-16 w-16 bg-[#161b22] rounded-full flex items-center justify-center mb-4">
                                        <Search className="h-8 w-8 text-[#8b949e]" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-1">No listings found</h3>
                                    <p className="text-[#8b949e]">Try adjusting your search filters or browse other categories.</p>
                                </div>
                            )}

                            {/* Pagination Placeholder */}
                            <div className="flex items-center justify-center gap-2 pt-8">
                                <Button variant="outline" className="border-[#2d333b] bg-[#0d1117] text-[#8b949e]" disabled>Previous</Button>
                                <Button className="bg-[#f5a623] text-black font-bold">1</Button>
                                <Button variant="outline" className="border-[#2d333b] bg-[#0d1117] text-[#8b949e]" disabled>Next</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
