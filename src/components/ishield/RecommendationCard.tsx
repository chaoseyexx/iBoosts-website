"use client";

import Link from "next/link";
import Image from "next/image";

interface RecommendationCardProps {
    listing: {
        id: string;
        title: string;
        slug: string;
        price: number;
        image?: string;
        game?: { name: string };
        seller?: { username: string };
    };
    reason?: string;
}

export function RecommendationCard({ listing, reason }: RecommendationCardProps) {
    return (
        <Link
            href={`/marketplace/${listing.slug}`}
            className="group block bg-gradient-to-b from-white/5 to-transparent rounded-xl border border-white/10 overflow-hidden hover:border-[#f5a623]/50 transition-all hover:shadow-lg hover:shadow-[#f5a623]/5"
        >
            {/* Image */}
            <div className="relative aspect-video bg-black/40">
                {listing.image ? (
                    <Image
                        src={listing.image}
                        alt={listing.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-50">
                        🎮
                    </div>
                )}
                {/* AI Badge */}
                <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 backdrop-blur rounded-full text-xs font-medium text-cyan-400 flex items-center gap-1">
                    <span className="text-[10px]">🤖</span>
                    Suggested by iShield AI
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-semibold text-white group-hover:text-[#f5a623] transition-colors line-clamp-1">
                    {listing.title}
                </h3>
                <div className="flex items-center justify-between mt-2">
                    <span className="text-[#f5a623] font-bold">${listing.price}</span>
                    {listing.game && (
                        <span className="text-xs text-gray-400">{listing.game.name}</span>
                    )}
                </div>
                {reason && (
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                        {reason}
                    </p>
                )}
            </div>
        </Link>
    );
}

interface RecommendationsSectionProps {
    recommendations: Array<{
        listing: RecommendationCardProps["listing"];
        reason?: string;
    }>;
}

export function RecommendationsSection({ recommendations }: RecommendationsSectionProps) {
    if (!recommendations || recommendations.length === 0) return null;

    return (
        <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🤖</span>
                <h2 className="text-xl font-bold text-white">Recommended for You</h2>
                <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-full">
                    by iShield AI
                </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {recommendations.map((rec) => (
                    <RecommendationCard
                        key={rec.listing.id}
                        listing={rec.listing}
                        reason={rec.reason}
                    />
                ))}
            </div>
        </section>
    );
}
