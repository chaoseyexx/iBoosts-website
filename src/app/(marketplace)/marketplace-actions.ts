"use server";

import prisma from "@/lib/prisma/client";

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
        const listings = await prisma.listing.findMany({
            where: {
                categoryId: category.id,
                ...(game ? { gameId: game.id } : {}), // Now that schema is synced, this will work
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




        return { category, game, listings };
    } catch (error: any) {
        console.error("Error fetching marketplace data:", error);
        return { error: error.message };
    }
}
