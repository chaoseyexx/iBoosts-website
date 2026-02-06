const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedMarketplaceData() {
    try {
        console.log("Seeding marketplace data...");

        // 1. Ensure "Currency" category exists
        const currencyCategory = await prisma.category.upsert({
            where: { slug: "currency" },
            update: {},
            create: {
                name: "Currency",
                slug: "currency",
                icon: "💰",
                isActive: true,
                sortOrder: 1,
            }
        });
        console.log("Created/Found Currency category");

        // 2. Ensure "Roblox" game exists
        const robloxGame = await prisma.game.upsert({
            where: { slug: "roblox" },
            update: {},
            create: {
                name: "Roblox",
                slug: "roblox",
                icon: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Roblox_player_icon_black_2022.svg",
                isActive: true,
                isPopular: true,
                // categories: { connect: { id: currencyCategory.id } } // This might fail in raw script if relation not set up correctly in schema?
            }
        });
        console.log("Created/Found Roblox game");

        // Link them if not linked
        await prisma.game.update({
            where: { id: robloxGame.id },
            data: {
                categories: {
                    connect: { id: currencyCategory.id }
                }
            }
        });
        console.log("Linked Roblox to Currency");

        // 3. Get or create a seller
        let seller = await prisma.user.findFirst({
            where: { role: "SELLER" }
        });

        if (!seller) {
            const anyUser = await prisma.user.findFirst();
            if (anyUser) {
                seller = await prisma.user.update({
                    where: { id: anyUser.id },
                    data: { role: "SELLER", sellerRating: 4.9, totalSales: 1250 }
                });
                console.log("Promoted user to seller:", seller.username);
            }
        }

        if (seller) {
            // 4. Create some listings
            const seedListings = [
                {
                    title: "Robux - Super Fast Delivery",
                    slug: "robux-fast-delivery",
                    price: 0.007,
                    stock: 500000,
                    minQuantity: 1000,
                    maxQuantity: 50000,
                    deliveryTime: 15,
                    status: "ACTIVE",
                    categoryId: currencyCategory.id,
                    gameId: robloxGame.id,
                    sellerId: seller.id,
                    description: "Cheap and fast Robux. Verified seller with over 1000 successful trades.",
                    images: {
                        create: [
                            { url: "https://i.imgur.com/u7FvX8B.png", isPrimary: true }
                        ]
                    }
                }
            ];

            for (const l of seedListings) {
                // Check if exists first because images create is tricky in upsert
                const existing = await prisma.listing.findUnique({ where: { slug: l.slug } });
                if (!existing) {
                    await prisma.listing.create({ data: l });
                    console.log("Created listing:", l.title);
                }
            }
        }

        console.log("Seed complete!");
    } catch (error) {
        console.error("Seed failed:", error);
    }
}

seedMarketplaceData()
    .finally(async () => await prisma.$disconnect());
