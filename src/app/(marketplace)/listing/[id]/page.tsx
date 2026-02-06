import { NavbarServer } from "@/components/layout/navbar-server";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import {
    Star,
    Shield,
    Clock,
    MessageCircle,
    Heart,
    Share2,
    AlertTriangle,
    Check,
    ChevronRight,
    Package,
    ShoppingCart,
    Zap,
} from "lucide-react";

// Mock data - replace with real data from database
const listing = {
    id: "1",
    title: "Valorant Immortal Account - Full Access with Rare Skins",
    description: `This is a high-tier Valorant account with Immortal rank rating. Perfect for players looking to skip the grind and jump straight into competitive play.

## What's Included:
- Immortal 2 Rank
- 50+ Agent Contracts Unlocked
- 15 Rare Skins including Elderflame Vandal
- Original Email Access
- Full Account Ownership Transfer

## Account Details:
- Region: NA
- Created: 2020
- No Previous Bans
- 2FA Ready

## After Purchase:
You'll receive full login credentials including email access. I'll help you change all security information to ensure complete ownership transfer.`,
    price: 149.99,
    originalPrice: 199.99,
    category: "Gaming",
    subcategory: "Valorant",
    images: [],
    stock: 5,
    sold: 45,
    views: 1234,
    createdAt: "2024-01-15",
    deliveryTime: "Instant",
    warranty: "24 hours",
    seller: {
        id: "seller-1",
        username: "ProGamer",
        displayName: "Pro Gamer Store",
        avatar: null,
        rating: 4.9,
        totalReviews: 234,
        totalSales: 567,
        memberSince: "2023",
        verified: true,
        level: 2,
        responseTime: "< 1 hour",
    },
};

const reviews = [
    {
        id: "1",
        user: { username: "buyer123", avatar: null },
        rating: 5,
        comment: "Super fast delivery! Account was exactly as described. Highly recommend!",
        date: "2 days ago",
    },
    {
        id: "2",
        user: { username: "gamer456", avatar: null },
        rating: 5,
        comment: "Great seller, very helpful with the transfer process. Will buy again!",
        date: "1 week ago",
    },
    {
        id: "3",
        user: { username: "pro_player", avatar: null },
        rating: 4,
        comment: "Good account, minor delay in delivery but seller was communicative.",
        date: "2 weeks ago",
    },
];

const relatedListings = [
    {
        id: "5",
        title: "League of Legends Diamond Account",
        price: 89.99,
        seller: "ProGamer",
        rating: 4.9,
    },
    {
        id: "6",
        title: "CS2 Premier 20K Account",
        price: 79.99,
        seller: "ProGamer",
        rating: 4.9,
    },
];

export default function ListingDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const discount = listing.originalPrice
        ? Math.round(
            ((listing.originalPrice - listing.price) / listing.originalPrice) * 100
        )
        : null;

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            <NavbarServer />

            <main className="pt-20 pb-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <nav className="mb-6 flex items-center gap-2 text-sm text-[var(--text-muted)]">
                        <Link href="/marketplace" className="hover:text-[var(--text-primary)]">
                            Marketplace
                        </Link>
                        <ChevronRight className="h-4 w-4" />
                        <Link
                            href={`/marketplace?category=${listing.category.toLowerCase()}`}
                            className="hover:text-[var(--text-primary)]"
                        >
                            {listing.category}
                        </Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-[var(--text-secondary)] truncate max-w-[200px]">
                            {listing.title}
                        </span>
                    </nav>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Images */}
                            <Card className="overflow-hidden">
                                <div className="aspect-video bg-gradient-to-br from-[var(--bg-elevated)] to-[var(--bg-card)] flex items-center justify-center">
                                    <span className="text-8xl opacity-50">🎮</span>
                                </div>
                            </Card>

                            {/* Description */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Description</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="prose prose-invert prose-sm max-w-none">
                                        <div className="whitespace-pre-wrap text-[var(--text-secondary)] leading-relaxed">
                                            {listing.description}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Reviews */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>Reviews ({listing.seller.totalReviews})</CardTitle>
                                    <div className="flex items-center gap-2">
                                        <Star className="h-5 w-5 fill-[var(--warning)] text-[var(--warning)]" />
                                        <span className="text-lg font-semibold text-[var(--text-primary)]">
                                            {listing.seller.rating}
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {reviews.map((review) => (
                                            <div
                                                key={review.id}
                                                className="border-b border-[var(--border-subtle)] pb-4 last:border-0 last:pb-0"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={review.user.avatar || undefined} alt={review.user.username} />
                                                            <AvatarFallback>
                                                                {review.user.username.charAt(0).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span className="font-medium text-[var(--text-primary)]">
                                                            {review.user.username}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-center gap-0.5">
                                                            {Array.from({ length: 5 }).map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`h-3 w-3 ${i < review.rating
                                                                        ? "fill-[var(--warning)] text-[var(--warning)]"
                                                                        : "text-[var(--text-muted)]"
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className="text-xs text-[var(--text-muted)]">
                                                            {review.date}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-[var(--text-secondary)]">
                                                    {review.comment}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    <Button variant="secondary" className="w-full mt-4">
                                        View All Reviews
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Purchase Card */}
                            <Card className="sticky top-24">
                                <CardContent className="p-6">
                                    {/* Title & Category */}
                                    <div className="mb-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge variant="secondary">{listing.category}</Badge>
                                            <Badge variant="secondary">{listing.subcategory}</Badge>
                                        </div>
                                        <h1 className="text-xl font-bold text-[var(--text-primary)]">
                                            {listing.title}
                                        </h1>
                                    </div>

                                    {/* Price */}
                                    <div className="flex items-baseline gap-3 mb-4">
                                        <span className="text-3xl font-bold text-[var(--olive-400)]">
                                            ${listing.price.toFixed(2)}
                                        </span>
                                        {listing.originalPrice && (
                                            <span className="text-lg text-[var(--text-muted)] line-through">
                                                ${listing.originalPrice.toFixed(2)}
                                            </span>
                                        )}
                                        {discount && (
                                            <Badge variant="error">-{discount}%</Badge>
                                        )}
                                    </div>

                                    {/* Stock & Views */}
                                    <div className="flex items-center gap-4 text-sm text-[var(--text-muted)] mb-6">
                                        <span className="text-[var(--success)]">
                                            {listing.stock} in stock
                                        </span>
                                        <span>·</span>
                                        <span>{listing.sold} sold</span>
                                        <span>·</span>
                                        <span>{listing.views} views</span>
                                    </div>

                                    {/* Delivery Info */}
                                    <div className="grid grid-cols-2 gap-3 mb-6">
                                        <div className="flex items-center gap-2 rounded-lg bg-[var(--bg-secondary)] p-3">
                                            <Zap className="h-4 w-4 text-[var(--olive-400)]" />
                                            <div>
                                                <p className="text-xs text-[var(--text-muted)]">Delivery</p>
                                                <p className="text-sm font-medium text-[var(--text-primary)]">
                                                    {listing.deliveryTime}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 rounded-lg bg-[var(--bg-secondary)] p-3">
                                            <Shield className="h-4 w-4 text-[var(--olive-400)]" />
                                            <div>
                                                <p className="text-xs text-[var(--text-muted)]">Warranty</p>
                                                <p className="text-sm font-medium text-[var(--text-primary)]">
                                                    {listing.warranty}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="space-y-3">
                                        <Button className="w-full glow-olive" size="lg">
                                            <ShoppingCart className="h-5 w-5 mr-2" />
                                            Buy Now
                                        </Button>
                                        <div className="flex gap-2">
                                            <Button variant="secondary" className="flex-1">
                                                <MessageCircle className="h-4 w-4 mr-2" />
                                                Contact Seller
                                            </Button>
                                            <Button variant="secondary" size="icon">
                                                <Heart className="h-4 w-4" />
                                            </Button>
                                            <Button variant="secondary" size="icon">
                                                <Share2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Escrow Protection */}
                                    <div className="mt-6 flex items-start gap-3 rounded-lg bg-[var(--olive-900)]/30 p-4">
                                        <Shield className="h-5 w-5 text-[var(--olive-400)] mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-[var(--olive-400)]">
                                                Secure Escrow Protection
                                            </p>
                                            <p className="text-xs text-[var(--text-muted)] mt-1">
                                                Your payment is held safely until you confirm delivery
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>

                                {/* Seller Info */}
                                <div className="border-t border-[var(--border-subtle)] p-6">
                                    <Link
                                        href={`/seller/${listing.seller.username}`}
                                        className="flex items-center gap-4 group"
                                    >
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={listing.seller.avatar || undefined} alt={listing.seller.displayName} />
                                            <AvatarFallback>
                                                {listing.seller.displayName.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--olive-400)] transition-colors">
                                                    {listing.seller.displayName}
                                                </span>
                                                {listing.seller.verified && (
                                                    <Shield className="h-4 w-4 text-[var(--olive-500)]" />
                                                )}
                                            </div>
                                            <p className="text-sm text-[var(--text-muted)]">
                                                @{listing.seller.username}
                                            </p>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-[var(--text-muted)]" />
                                    </Link>

                                    <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                                        <div>
                                            <p className="text-lg font-semibold text-[var(--text-primary)]">
                                                {listing.seller.rating}
                                            </p>
                                            <p className="text-xs text-[var(--text-muted)]">Rating</p>
                                        </div>
                                        <div>
                                            <p className="text-lg font-semibold text-[var(--text-primary)]">
                                                {listing.seller.totalSales}
                                            </p>
                                            <p className="text-xs text-[var(--text-muted)]">Sales</p>
                                        </div>
                                        <div>
                                            <p className="text-lg font-semibold text-[var(--text-primary)]">
                                                {listing.seller.responseTime}
                                            </p>
                                            <p className="text-xs text-[var(--text-muted)]">Response</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Report */}
                            <button className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--error)] transition-colors">
                                <AlertTriangle className="h-4 w-4" />
                                Report this listing
                            </button>
                        </div>
                    </div>

                    {/* Related Listings */}
                    <section className="mt-12">
                        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">
                            More from this seller
                        </h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {relatedListings.map((item) => (
                                <Link key={item.id} href={`/listing/${item.id}`}>
                                    <Card variant="interactive" className="p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-16 w-16 rounded-lg bg-[var(--bg-elevated)] flex items-center justify-center shrink-0">
                                                <span className="text-2xl">🎮</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-[var(--text-primary)] truncate">
                                                    {item.title}
                                                </p>
                                                <p className="text-lg font-bold text-[var(--olive-400)]">
                                                    ${item.price.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
