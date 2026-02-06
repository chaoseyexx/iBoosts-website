import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, TransactionType } from "@prisma/client";

// Connection pool for PostgreSQL (same config as app)
const connectionString = process.env.DATABASE_URL!;
const finalConnectionString = connectionString.includes("uselibpqcompat")
    ? connectionString
    : connectionString.includes("?")
        ? `${connectionString}&uselibpqcompat=true`
        : `${connectionString}?uselibpqcompat=true`;

const pool = new Pool({
    connectionString: finalConnectionString,
    max: 10,
    ssl: { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });


async function main() {
    console.log("🌱 Seeding database...");

    // Create Demo User
    const demoUser = await prisma.user.upsert({
        where: { email: "demo@iboosts.gg" },
        update: {},
        create: {
            id: "demo-user-001",
            email: "demo@iboosts.gg",
            username: "DEMO",
            avatar: null,
            role: "SELLER",
            status: "ACTIVE",
            kycStatus: "APPROVED",
            sellerLevel: 2,
            reputationScore: 500,
            wallet: {
                create: {
                    balance: 0,
                    pendingBalance: 0,
                },
            },
        },
    });

    console.log(`✅ Created demo user: ${demoUser.username} (${demoUser.email})`);

    // Create sample categories
    const categories = [
        { name: "Currency", slug: "currency", description: "In-game currencies and virtual money", icon: "💰", sortOrder: 1 },
        { name: "Accounts", slug: "accounts", description: "Gaming and service accounts", icon: "👤", sortOrder: 2 },
        { name: "Top Ups", slug: "top-ups", description: "Recharge and top-up services", icon: "⬆️", sortOrder: 3 },
        { name: "Items", slug: "items", description: "In-game items and skins", icon: "🎁", sortOrder: 4 },
        { name: "Gift Cards", slug: "gift-cards", description: "Digital gift cards and vouchers", icon: "🎴", sortOrder: 5 },
        { name: "Boosting", slug: "boosting", description: "Rank boosting services", icon: "🚀", sortOrder: 6 },
    ];

    for (const category of categories) {
        await prisma.category.upsert({
            where: { slug: category.slug },
            update: {},
            create: category,
        });
    }

    console.log(`✅ Created ${categories.length} categories`);

    // Create sample listings for demo user
    const accountsCategory = await prisma.category.findUnique({ where: { slug: "accounts" } });
    const giftCardsCategory = await prisma.category.findUnique({ where: { slug: "gift-cards" } });
    const currencyCategory = await prisma.category.findUnique({ where: { slug: "currency" } });

    if (accountsCategory) {
        await prisma.listing.upsert({
            where: { slug: "valorant-immortal-account" },
            update: {},
            create: {
                title: "Valorant Immortal Account - Full Access",
                slug: "valorant-immortal-account",
                description: "High-tier Valorant account with Immortal rank. Includes rare skins and full email access.",
                price: 149.99,
                originalPrice: 179.99,
                stock: 5,
                totalSold: 45,
                totalViews: 234,
                status: "ACTIVE",
                deliveryTime: 1,
                sellerId: demoUser.id,
                categoryId: accountsCategory.id,
            },
        });
    }

    if (giftCardsCategory) {
        await prisma.listing.upsert({
            where: { slug: "discord-nitro-1-year" },
            update: {},
            create: {
                title: "Discord Nitro 1 Year - Instant Delivery",
                slug: "discord-nitro-1-year",
                description: "Full year of Discord Nitro. Instant delivery after purchase.",
                price: 79.99,
                originalPrice: 99.99,
                stock: 25,
                totalSold: 102,
                totalViews: 567,
                status: "ACTIVE",
                deliveryTime: 1,
                sellerId: demoUser.id,
                categoryId: giftCardsCategory.id,
            },
        });
    }

    if (currencyCategory) {
        await prisma.listing.upsert({
            where: { slug: "lol-1000-rp" },
            update: {},
            create: {
                title: "League of Legends 1000 RP",
                slug: "lol-1000-rp",
                description: "1000 Riot Points for League of Legends. NA region.",
                price: 8.50,
                originalPrice: 10.00,
                stock: 100,
                totalSold: 234,
                totalViews: 789,
                status: "ACTIVE",
                deliveryTime: 1,
                sellerId: demoUser.id,
                categoryId: currencyCategory.id,
            },
        });
    }

    console.log("✅ Created 3 sample listings");

    // Create wallet transactions for demo user
    const wallet = await prisma.wallet.findUnique({
        where: { userId: demoUser.id },
    });

    if (wallet) {
        let currentBalance = 0;

        const transactions: { amount: number; type: TransactionType; description: string }[] = [
            { amount: 100.00, type: "DEPOSIT", description: "Initial deposit" },
            { amount: 47.70, type: "SALE", description: "You successfully sold Order." },
            { amount: -67.00, type: "WITHDRAWAL", description: "Withdrawal processed." },
            { amount: 18.70, type: "SALE", description: "You successfully sold Order." },
            { amount: 7.65, type: "SALE", description: "You successfully sold Order." },
            { amount: 2.55, type: "SALE", description: "You successfully sold Order." },
            { amount: -100.00, type: "WITHDRAWAL", description: "Withdrawal processed." },
            { amount: 10.34, type: "SALE", description: "You successfully sold Order." },
        ];

        for (const tx of transactions) {
            const balanceBefore = currentBalance;
            const amount = Math.abs(tx.amount);
            const isDebit = tx.type === "WITHDRAWAL" || tx.type === "PURCHASE";
            currentBalance = isDebit ? currentBalance - amount : currentBalance + amount;

            await prisma.walletTransaction.create({
                data: {
                    walletId: wallet.id,
                    amount: amount,
                    type: tx.type,
                    balanceBefore: balanceBefore,
                    balanceAfter: currentBalance,
                    description: tx.description,
                },
            });
        }

        // Update wallet balance to final value
        await prisma.wallet.update({
            where: { id: wallet.id },
            data: { balance: currentBalance },
        });

        console.log(`✅ Created ${transactions.length} wallet transactions`);
        console.log(`   Final balance: $${currentBalance.toFixed(2)}`);
    }

    console.log("🎉 Seeding complete!");
    console.log("\n📋 Demo Account Credentials:");
    console.log("   Username: DEMO");
    console.log("   Email: demo@iboosts.gg");
    console.log("   Password: password123");
}

main()
    .catch((e) => {
        console.error("❌ Seeding error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
