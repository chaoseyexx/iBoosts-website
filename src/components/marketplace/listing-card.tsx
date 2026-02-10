import Link from "next/link";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatCurrency } from "@/lib/utils";
import { TrustBadge } from "@/components/ishield";

interface ListingCardProps {
    listing: {
        id: string;
        title: string;
        price: number;
        originalPrice?: number | null;
        category: string;
        image?: string | null;
        stock: number;
        isVerifiedByAI?: boolean;
        seller: {
            username: string;
            avatar?: string | null;
            rating: number;
            sales: number;
        };
    };
}

export function ListingCard({ listing }: ListingCardProps) {
    const discount = listing.originalPrice
        ? Math.round(((listing.originalPrice - listing.price) / listing.originalPrice) * 100)
        : null;

    return (
        <Link href={`/listing/${listing.id}`}>
            <Card variant="interactive" className="h-full overflow-hidden group">
                {/* Image */}
                <div className="relative h-40 bg-gradient-to-br from-[var(--bg-elevated)] to-[var(--bg-card)] flex items-center justify-center overflow-hidden">
                    {listing.image ? (
                        <img
                            src={listing.image}
                            alt={listing.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <span className="text-4xl opacity-50 transition-transform duration-300 group-hover:scale-110">
                            🎁
                        </span>
                    )}

                    {/* Discount Badge */}
                    {discount && discount > 0 && (
                        <Badge
                            variant="error"
                            className="absolute top-2 right-2"
                        >
                            -{discount}%
                        </Badge>
                    )}

                    {/* Verified Badge */}
                    {listing.isVerifiedByAI && (
                        <div className="absolute top-2 left-2">
                            <TrustBadge isVerified={true} size="sm" showText={false} />
                        </div>
                    )}
                </div>

                <div className="p-4">
                    {/* Category & Verified */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge variant="secondary" size="sm">
                            {listing.category}
                        </Badge>
                        {listing.isVerifiedByAI && (
                            <TrustBadge isVerified={true} size="sm" />
                        )}
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-[var(--text-primary)] line-clamp-2 mb-2 group-hover:text-[var(--olive-400)] transition-colors">
                        {listing.title}
                    </h3>

                    {/* Seller Info */}
                    <div className="flex items-center gap-2 mb-3">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={listing.seller.avatar || undefined} alt={listing.seller.username} />
                            <AvatarFallback className="text-[10px]">
                                {listing.seller.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-[var(--text-muted)] truncate flex-1">
                            {listing.seller.username}
                        </span>
                        <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-[var(--warning)] text-[var(--warning)]" />
                            <span className="text-xs text-[var(--text-muted)]">
                                {listing.seller.rating.toFixed(1)}
                            </span>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-[var(--olive-400)]">
                            {formatCurrency(listing.price)}
                        </span>
                        {listing.originalPrice && (
                            <span className="text-sm text-[var(--text-muted)] line-through">
                                {formatCurrency(listing.originalPrice)}
                            </span>
                        )}
                    </div>

                    {/* Stock */}
                    <p className="text-xs text-[var(--text-muted)] mt-2">
                        {listing.stock > 0 ? (
                            <span className="text-[var(--success)]">{listing.stock} in stock</span>
                        ) : (
                            <span className="text-[var(--error)]">Out of stock</span>
                        )}
                    </p>
                </div>
            </Card>
        </Link>
    );
}
