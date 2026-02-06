import prisma from "@/lib/prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        console.log("Starting direct database seed...");

        // 1. Seed Currency Category
        const currencyCategory = await prisma.category.upsert({
            where: { slug: "currency" },
            update: {},
            create: {
                name: "Currency",
                slug: "currency",
                icon: "💰",
                sortOrder: 1,
                isActive: true
            }
        });
        console.log("Currency category created:", currencyCategory.id);

        // 2. Seed Roblox Game
        const robloxGame = await prisma.game.upsert({
            where: { slug: "roblox" },
            update: {},
            create: {
                name: "Roblox",
                slug: "roblox",
                isPopular: true,
                isActive: true,
                categories: {
                    connect: { id: currencyCategory.id }
                }
            }
        });
        console.log("Roblox game created:", robloxGame.id);

        // 3. Find or create a seller
        let seller = await prisma.user.findFirst({ where: { role: "SELLER" } });
        if (!seller) {
            const anyUser = await prisma.user.findFirst();
            if (anyUser) {
                seller = await prisma.user.update({
                    where: { id: anyUser.id },
                    data: { role: "SELLER", sellerRating: 4.9, totalSales: 1250 }
                });
                console.log("User promoted to seller:", seller.id);
            }
        }

        // 4. Seed Listing
        if (seller) {
            await prisma.listing.upsert({
                where: { slug: "robux-fast-delivery" },
                update: {},
                create: {
                    title: "Robux - Super Fast Delivery",
                    slug: "robux-fast-delivery",
                    description: "Cheap and fast Robux. Verified seller with over 1000 successful trades.",
                    price: 0.007,
                    stock: 500000,
                    minQuantity: 1000,
                    maxQuantity: 50000,
                    deliveryTime: 15,
                    status: "ACTIVE",
                    categoryId: currencyCategory.id,
                    gameId: robloxGame.id,
                    sellerId: seller.id
                }
            });
            console.log("Listing created.");
        }

        return NextResponse.json({ success: true, message: "Marketplace data seeded successfully!" });
    } catch (error: any) {
        console.error("Seed error:", error);
        return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
    }
}

