
import { TransactionType } from "@prisma/client";
import { prisma } from "../src/lib/prisma/client";

async function main() {
    console.log("🌱 Seeding database with comprehensive data...");

    // 1. Create Users
    const usersData = [
        {
            email: "demo@iboosts.gg",
            username: "DEMO",
            avatar: "https://i.imgur.com/6U68l5g.png",
            bio: "Platform founder and lead administrator.",
            role: "ADMIN" as const,
            status: "ACTIVE" as const,
            kycStatus: "APPROVED" as const,
            sellerLevel: 2,
            reputationScore: 500,
        },
        {
            email: "chaoseyex@gmail.com",
            username: "ChaoseyeX",
            avatar: "https://i.imgur.com/b08hxPY.png",
            bio: "Pro Valorant booster, check my listings!",
            role: "SELLER" as const,
            status: "ACTIVE" as const,
        },
        {
            email: "bouncestacks@gmail.com",
            username: "BounceStacks",
            avatar: "https://i.imgur.com/Alwd7I3.png",
            bio: "Just looking for good deals.",
            role: "BUYER" as const,
            status: "ACTIVE" as const,
        },
        {
            email: "nyzx@iboosts.gg",
            username: "nyzx_.",
            avatar: "https://i.imgur.com/pZq4qLz.png",
            bio: "Top rated Roblox service provider.",
            role: "SELLER" as const,
            status: "ACTIVE" as const,
        }
    ];

    const users = [];
    for (const userData of usersData) {
        const u = await prisma.user.upsert({
            where: { email: userData.email },
            update: {
                avatar: userData.avatar,
                bio: userData.bio,
                role: userData.role,
                status: userData.status,
            },
            create: {
                ...userData,
                wallet: { create: { balance: 0, pendingBalance: 0 } }
            }
        });
        users.push(u);
    }
    const [demoUser, seller1, buyer1, seller2] = users;
    console.log(`✅ Upserted ${users.length} users`);

    // 2. Create Categories
    const categoriesData = [
        { name: "Currency", slug: "currency", description: "In-game currencies and virtual money", icon: "https://cdn.iboosts.gg/images/categories/currency.png", sortOrder: 1 },
        { name: "Accounts", slug: "accounts", description: "Gaming and service accounts", icon: "https://cdn.iboosts.gg/images/categories/accounts.png", sortOrder: 2 },
        { name: "Top Ups", slug: "top-ups", description: "Recharge and top-up services", icon: "https://cdn.iboosts.gg/images/categories/top-ups.png", sortOrder: 3 },
        { name: "Items", slug: "items", description: "In-game items and skins", icon: "https://cdn.iboosts.gg/images/categories/items.png", sortOrder: 4 },
        { name: "Gift Cards", slug: "gift-cards", description: "Digital gift cards and vouchers", icon: "https://cdn.iboosts.gg/images/categories/gift-cards.png", sortOrder: 5 },
        { name: "Boosting", slug: "boosting", description: "Rank boosting services", icon: "https://cdn.iboosts.gg/images/categories/boosting.png", sortOrder: 6 },
    ];

    const categoriesMap = new Map();
    for (const cat of categoriesData) {
        // Fallback icon if R2 is not set up perfectly yet, but user asked for R2 links pattern
        // Using the requested pattern
        const c = await prisma.category.upsert({
            where: { slug: cat.slug },
            update: { icon: cat.icon },
            create: cat,
        });
        categoriesMap.set(cat.slug, c);
    }
    console.log(`✅ Upserted ${categoriesData.length} categories`);

    // 3. Create Games with R2 Links
    // Pattern: https://cdn.iboosts.gg/images/games/[slug].png
    const gamesData = [
        { name: "Roblox", slug: "roblox", isPopular: true, catSlugs: ["currency", "items", "accounts", "gift-cards"] },
        { name: "Valorant", slug: "valorant", isPopular: true, catSlugs: ["accounts", "boosting", "top-ups"] },
        { name: "Fortnite", slug: "fortnite", isPopular: true, catSlugs: ["accounts", "items", "currency"] },
        { name: "Grand Theft Auto V", slug: "gta-v", isPopular: true, catSlugs: ["accounts", "currency"] },
        { name: "League of Legends", slug: "lol", isPopular: true, catSlugs: ["accounts", "boosting", "top-ups"] },
        { name: "Minecraft", slug: "minecraft", isPopular: true, catSlugs: ["accounts", "items"] },
        { name: "Call of Duty", slug: "cod", isPopular: false, catSlugs: ["accounts", "boosting"] },
        { name: "EA Sports FC", slug: "fc", isPopular: true, catSlugs: ["currency", "accounts"] },
        { name: "Counter-Strike 2", slug: "cs2", isPopular: false, catSlugs: ["accounts", "items"] },
        { name: "World of Warcraft", slug: "wow", isPopular: false, catSlugs: ["currency", "accounts", "boosting"] },
        { name: "Old School RuneScape", slug: "osrs", isPopular: false, catSlugs: ["currency", "accounts"] },
        { name: "Apex Legends", slug: "apex", isPopular: false, catSlugs: ["accounts", "boosting"] },
        { name: "Overwatch 2", slug: "overwatch-2", isPopular: false, catSlugs: ["accounts", "boosting"] },
        { name: "Rocket League", slug: "rocket-league", isPopular: false, catSlugs: ["accounts", "items"] },
        { name: "Escape from Tarkov", slug: "tarkov", isPopular: false, catSlugs: ["accounts", "currency", "items"] },
    ];

    const gamesMap = new Map();

    for (const g of gamesData) {
        // Construct R2 URL
        const iconUrl = `https://cdn.iboosts.gg/images/games/${g.slug}.png`;
        const bannerUrl = `https://cdn.iboosts.gg/images/banners/${g.slug}.png`;

        const game = await prisma.game.upsert({
            where: { slug: g.slug },
            update: {
                icon: iconUrl,
                banner: bannerUrl,
                isPopular: g.isPopular,
                categories: {
                    connect: g.catSlugs.map(slug => ({ slug }))
                }
            },
            create: {
                name: g.name,
                slug: g.slug,
                description: `Best marketplace for ${g.name} accounts, currency and services.`,
                icon: iconUrl,
                banner: bannerUrl,
                isPopular: g.isPopular,
                isActive: true,
                categories: {
                    connect: g.catSlugs.map(slug => ({ slug }))
                }
            }
        });
        gamesMap.set(g.slug, game);
    }
    console.log(`✅ Upserted ${gamesData.length} games`);

    // 4. Create Listings (Linked correctly)
    const listingsData = [
        {
            title: "Valorant Immortal Account - Skins + Email",
            slug: "val-immortal-skins",
            price: 150.00,
            seller: demoUser,
            gameSlug: "valorant",
            catSlug: "accounts",
            desc: "Full access Immortal account with Reaver Vandal."
        },
        {
            title: "1M Robux Fast Delivery",
            slug: "roblox-1m",
            price: 50.00,
            seller: seller1,
            gameSlug: "roblox",
            catSlug: "currency",
            desc: "Cheapest Robux on the market."
        },
        {
            title: "Fortnite OG Skull Trooper",
            slug: "fortnite-og-skull",
            price: 450.00,
            seller: seller2,
            gameSlug: "fortnite",
            catSlug: "accounts",
            desc: "Rare OG account with Skull Trooper and Ghoul Trooper."
        },
        {
            title: "GTA V Modded Account (PS5)",
            slug: "gta-v-modded-ps5",
            price: 25.00,
            seller: seller1,
            gameSlug: "gta-v",
            catSlug: "accounts",
            desc: "5 Billion cash + Modded outfits. PS5 Only."
        },
        {
            title: "LoL Challenger Boost (NA)",
            slug: "lol-challenger-boost",
            price: 300.00,
            seller: demoUser,
            gameSlug: "lol",
            catSlug: "boosting",
            desc: "Boost to Challenger by pro player."
        }
    ];

    const listings = [];
    for (const item of listingsData) {
        const game = gamesMap.get(item.gameSlug);
        const cat = categoriesMap.get(item.catSlug);

        if (game && cat) {
            const l = await prisma.listing.upsert({
                where: { slug: item.slug },
                update: {},
                create: {
                    title: item.title,
                    slug: item.slug,
                    description: item.desc,
                    price: item.price,
                    status: "ACTIVE",
                    sellerId: item.seller.id,
                    gameId: game.id,
                    categoryId: cat.id,
                }
            });
            listings.push(l);
        }
    }
    console.log(`✅ Created ${listings.length} sample listings`);

    // 5. Create Orders (Linked correctly)
    // Order 1: Demo user bought Robux from Seller1
    const order1 = await prisma.order.create({
        data: {
            orderNumber: `ORD-${Date.now()}-1`,
            buyerId: demoUser.id,
            sellerId: seller1.id,
            listingId: listings[1].id, // Roblox 1M
            quantity: 1,
            unitPrice: 50.00,
            subtotal: 50.00,
            platformFee: 2.50,
            sellerEarnings: 47.50,
            finalAmount: 50.00,
            status: "ACTIVE",
            paidAt: new Date(),
        }
    });

    // Order 2: Buyer1 bought Valorant Account from Demo User
    const order2 = await prisma.order.create({
        data: {
            orderNumber: `ORD-${Date.now()}-2`,
            buyerId: buyer1.id,
            sellerId: demoUser.id,
            listingId: listings[0].id, // Valorant Account
            quantity: 1,
            unitPrice: 150.00,
            subtotal: 150.00,
            platformFee: 7.50,
            sellerEarnings: 142.50,
            finalAmount: 150.00,
            status: "COMPLETED",
            paidAt: new Date(Date.now() - 86400000), // Yesterday
            completedAt: new Date(),
        }
    });

    console.log(`✅ Created sample orders: ${order1.orderNumber}, ${order2.orderNumber}`);

    // Test Wallet Transactions for correct linking
    const wallet = await prisma.wallet.findUnique({ where: { userId: demoUser.id } });
    if (wallet) {
        await prisma.walletTransaction.create({
            data: {
                walletId: wallet.id,
                amount: 142.50,
                type: "SALE",
                description: `Sale of Listing: ${listings[0].title}`,
                balanceBefore: 0,
                balanceAfter: 142.50
            }
        });
        await prisma.wallet.update({ where: { id: wallet.id }, data: { balance: 142.50 } });
    }

    console.log("🎉 Comprehensive Seeding Complete!");
    console.log("\n📋 Demo Credentials:");
    console.log("   User: demo@iboosts.gg / password123");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
