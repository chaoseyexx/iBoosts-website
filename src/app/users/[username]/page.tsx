import * as React from "react";
import prisma from "@/lib/prisma/client";
import { notFound } from "next/navigation";
import { UserProfileView } from "@/components/profile/user-profile-view";

// Server Component Fetch Logic
async function getUserWithData(username: string) {
    if (!username) return null;

    const decodedUsername = decodeURIComponent(username);

    const user = await prisma.user.findFirst({
        where: {
            username: {
                equals: decodedUsername,
                mode: 'insensitive'
            }
        },
    });

    if (!user) return null;

    // Fetch reviews where this user is the target (seller)
    const reviews = await prisma.review.findMany({
        where: {
            targetId: user.id,
            isHidden: false,
        },
        include: {
            author: {
                select: {
                    username: true,
                    avatar: true,
                }
            },
            listing: {
                select: {
                    title: true,
                    game: {
                        select: {
                            name: true,
                        }
                    }
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 50,
    });

    // Fetch user's listings
    const listings = await prisma.listing.findMany({
        where: {
            sellerId: user.id,
            status: 'ACTIVE',
        },
        include: {
            game: {
                select: {
                    name: true,
                    slug: true,
                }
            },
            category: {
                select: {
                    name: true,
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 50,
    });

    // Serialize dates and decimals for client component
    const serializedReviews = reviews.map(r => ({
        id: r.id,
        rating: r.rating,
        content: r.content,
        title: r.title,
        createdAt: r.createdAt.toISOString(),
        authorUsername: r.author.username,
        authorAvatar: r.author.avatar,
        listingTitle: r.listing?.title || 'Item',
        gameName: r.listing?.game?.name || 'Unknown',
    }));

    const serializedListings = listings.map(l => ({
        id: l.id,
        title: l.title,
        slug: l.slug,
        price: Number(l.price),
        gameName: l.game?.name || 'Unknown',
        gameSlug: l.game?.slug || '',
        categoryName: l.category?.name || 'Item',
        deliveryType: l.deliveryType,
        createdAt: l.createdAt.toISOString(),
    }));

    return {
        user: {
            ...user,
            createdAt: user.createdAt.toISOString(),
        },
        reviews: serializedReviews,
        listings: serializedListings,
    };
}

export default async function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
    const resolvedParams = await params;
    const data = await getUserWithData(resolvedParams.username);

    if (!data) {
        notFound();
    }

    return (
        <React.Suspense fallback={
            <div className="flex min-h-screen items-center justify-center bg-[#0a0e13]">
                <div className="h-8 w-8 border-2 border-[#f5a623] border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <UserProfileView
                user={data.user}
                reviews={data.reviews}
                listings={data.listings}
            />
        </React.Suspense>
    );
}
