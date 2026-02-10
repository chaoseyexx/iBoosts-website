import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";

export async function GET() {
    try {
        // Return popular verified listings (simplified - no personalization for now)
        const popularListings = await prisma.listing.findMany({
            where: {
                status: "ACTIVE",
                // isVerifiedByAI: true  // Uncomment after Prisma regeneration
            },
            take: 8,
            orderBy: { totalSold: "desc" },
            include: {
                images: { where: { isPrimary: true }, take: 1 },
                game: { select: { name: true } },
                seller: { select: { username: true } },
            },
        });

        return NextResponse.json({
            recommendations: popularListings.map((listing) => ({
                listing: {
                    id: listing.id,
                    title: listing.title,
                    slug: listing.slug,
                    price: Number(listing.price),
                    image: listing.images[0]?.url,
                    game: listing.game,
                    seller: listing.seller,
                },
                reason: "Popular listing",
            })),
        });
    } catch (error) {
        console.error("Recommendations API Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch recommendations" },
            { status: 500 }
        );
    }
}
