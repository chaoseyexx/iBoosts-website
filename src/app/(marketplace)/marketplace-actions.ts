"use server";

import prisma from "@/lib/prisma/client";

// Helper to serialize Prisma objects with Decimal fields
function serializeListings(listings: any[]) {
    return listings.map(listing => ({
        ...listing,
        price: listing.price ? Number(listing.price) : null,
        originalPrice: listing.originalPrice ? Number(listing.originalPrice) : null,
        createdAt: listing.createdAt?.toISOString() || null,
        updatedAt: listing.updatedAt?.toISOString() || null,
        deletedAt: listing.deletedAt?.toISOString() || null,
        publishedAt: listing.publishedAt?.toISOString() || null,
        description: listing.description || "",
        promotedUntil: listing.promotedUntil?.toISOString() || null,
        seller: listing.seller ? {
            ...listing.seller,
            lastActiveAt: listing.seller.lastActiveAt?.toISOString() || null,
        } : null,
    }));
}

export async function fetchMarketplaceData(categorySlug: string, gameSlug?: string) {
    try {
        // Fetch Category
        const category = await prisma.category.findUnique({
            where: { slug: categorySlug },
            include: {
                games: {
                    where: { isActive: true },
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        icon: true,
                    }
                }
            }
        });

        if (!category) {
            return { error: "Category not found" };
        }

        // Fetch Game if gameSlug is provided
        let game = null;
        if (gameSlug) {
            game = await prisma.game.findUnique({
                where: { slug: gameSlug },
                include: {
                    categories: true
                }
            });
        }

        // Fetch Listings for this category (and optionally game)
        const rawListings = await prisma.listing.findMany({
            where: {
                categoryId: category.id,
                ...(game ? { gameId: game.id } : {}),
                status: "ACTIVE",
            },
            include: {
                seller: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                        sellerRating: true,
                        totalSales: true,
                        totalReviews: true,
                        lastActiveAt: true,
                    }
                },
                images: {
                    where: { isPrimary: true },
                    take: 1
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        // Serialize to plain objects for client components
        const listings = serializeListings(rawListings);

        return { category, game, listings };
    } catch (error: any) {
        console.error("Error fetching marketplace data:", error);
        return { error: error.message };
    }
}

