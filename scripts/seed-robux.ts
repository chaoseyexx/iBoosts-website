import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({
    connectionString: connectionString.includes("uselibpqcompat")
        ? connectionString
        : `${connectionString}${connectionString.includes("?") ? "&" : "?"}uselibpqcompat=true`,
    ssl: { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("Adding sample listings for currency/roblox-robux...");

    // Find or create the currency category
    let category = await prisma.category.findUnique({ where: { slug: "currency" } });
    if (!category) {
        category = await prisma.category.create({
            data: {
                name: "Currency",
                slug: "currency",
                description: "In-game currencies for various games",
                feePercent: 5,
                isActive: true,
            }
        });
        console.log("Created currency category");
    }

    // Find or create the roblox-robux game
    let game = await prisma.game.findUnique({ where: { slug: "roblox-robux" } });
    if (!game) {
        game = await prisma.game.create({
            data: {
                name: "Roblox Robux",
                slug: "roblox-robux",
                description: "Roblox virtual currency",
                isPopular: true,
                isActive: true,
                categories: { connect: { id: category.id } }
            }
        });
        console.log("Created roblox-robux game");
    }

    // Find or create a demo seller
    let seller = await prisma.user.findUnique({ where: { email: "demo@iboosts.gg" } });
    if (!seller) {
        seller = await prisma.user.create({
            data: {
                email: "demo@iboosts.gg",
                username: "RobuxKing",
                role: "SELLER",
                status: "ACTIVE",
                sellerLevel: 3,
                sellerRating: 4.9,
                totalSales: 1250,
                totalReviews: 847,
                emailVerified: true,
            }
        });
        console.log("Created demo seller");
    }

    // Sample listings data
    const listings = [
        {
            title: "1000 Robux - Instant Delivery",
            slug: "1000-robux-instant-" + Date.now(),
            description: "Get 1000 Robux delivered instantly to your account. Fast and secure transaction.",
            shortDescription: "Instant 1000 Robux delivery",
            price: 9.99,
            stock: 50,
            deliveryTime: 1,
        },
        {
            title: "5000 Robux Bundle - Best Value",
            slug: "5000-robux-bundle-" + Date.now(),
            description: "Premium bundle with 5000 Robux. Perfect for serious gamers.",
            shortDescription: "5000 Robux bundle deal",
            price: 45.99,
            originalPrice: 54.99,
            stock: 25,
            deliveryTime: 2,
        },
        {
            title: "10000 Robux - Mega Pack",
            slug: "10000-robux-mega-" + Date.now(),
            description: "Mega pack with 10000 Robux for the ultimate Roblox experience.",
            shortDescription: "10K Robux mega pack",
            price: 89.99,
            originalPrice: 109.99,
            stock: 15,
            deliveryTime: 4,
        },
        {
            title: "500 Robux - Starter Pack",
            slug: "500-robux-starter-" + Date.now(),
            description: "Perfect starter pack for new players. Quick and easy delivery.",
            shortDescription: "Starter 500 Robux",
            price: 5.49,
            stock: 100,
            deliveryTime: 1,
        },
        {
            title: "25000 Robux - Premium Elite",
            slug: "25000-robux-elite-" + Date.now(),
            description: "Elite package with 25000 Robux for serious collectors and developers.",
            shortDescription: "25K Robux elite pack",
            price: 199.99,
            originalPrice: 249.99,
            stock: 5,
            deliveryTime: 6,
        },
    ];

    for (const listing of listings) {
        await prisma.listing.create({
            data: {
                sellerId: seller.id,
                categoryId: category.id,
                gameId: game.id,
                title: listing.title,
                slug: listing.slug,
                description: listing.description,
                shortDescription: listing.shortDescription,
                price: listing.price,
                originalPrice: listing.originalPrice,
                stock: listing.stock,
                deliveryTime: listing.deliveryTime,
                status: "ACTIVE",
                tags: ["robux", "roblox", "instant"],
                publishedAt: new Date(),
            }
        });
        console.log(`Created: ${listing.title}`);
    }

    console.log("Done! 5 sample listings created.");
}

main()
    .catch(console.error)
    .finally(() => {
        prisma.$disconnect();
        pool.end();
    });
