import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, NotificationType } from "@prisma/client";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const connectionString = process.env.DATABASE_URL!;

// Ensure libpq compatibility for SSL modes is enabled (fixes self-signed cert issues)
const finalConnectionString = connectionString.includes("uselibpqcompat")
    ? connectionString
    : connectionString.includes("?")
        ? `${connectionString}&uselibpqcompat=true`
        : `${connectionString}?uselibpqcompat=true`;

const pool = new Pool({
    connectionString: finalConnectionString,
    max: 10,
    ssl: {
        rejectUnauthorized: false,
    },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("🌱 Seeding test data (notifications & boosting)...");

    const demoUserId = "demo-user-001";

    // 0. Ensure Demo User exists for relations
    let demoUser = await prisma.user.findUnique({
        where: { email: "demo@iboosts.gg" }
    });

    if (!demoUser) {
        demoUser = await prisma.user.create({
            data: {
                id: demoUserId,
                email: "demo@iboosts.gg",
                username: "DEMO",
                role: "SELLER",
                status: "ACTIVE",
                kycStatus: "APPROVED",
            },
        });
    }
    const actualDemoUserId = demoUser.id;
    console.log(`✅ Using demo user: ${demoUser.username} (${actualDemoUserId})`);

    // 0.5 Ensure Games exist for relations
    const gamesData = [
        { name: "Warframe", slug: "warframe" },
        { name: "Valorant", slug: "valorant" },
        { name: "Roblox", slug: "roblox" },
    ];

    for (const game of gamesData) {
        await prisma.game.upsert({
            where: { slug: game.slug },
            update: {},
            create: game,
        });
    }
    console.log(`✅ Ensured ${gamesData.length} games exist`);

    // 1. Seed Notifications
    const notificationsData = [
        {
            userId: actualDemoUserId,
            type: "ORDER_NEW" as NotificationType,
            title: "New Order Received",
            content: "You have a new order for Valorant Immortal Account!",
            link: "/dashboard/orders",
        },
        {
            userId: actualDemoUserId,
            type: "MESSAGE_NEW" as NotificationType,
            title: "New Message",
            content: "ExcaliburPrime sent you a message regarding your listing.",
            link: "/dashboard/messages",
        },
        {
            userId: actualDemoUserId,
            type: "SYSTEM" as NotificationType,
            title: "Security Alert",
            content: "A new device was used to log into your account.",
            link: "/dashboard/settings",
        },
        {
            userId: actualDemoUserId,
            type: "WITHDRAWAL_COMPLETED" as NotificationType,
            title: "Withdrawal Successful",
            content: "Your withdrawal of $100.00 has been processed successfully.",
            link: "/dashboard/wallet",
        }
    ];

    for (const notification of notificationsData) {
        await prisma.notification.create({
            data: notification
        });
    }
    console.log(`✅ Created ${notificationsData.length} notifications`);

    // 2. Seed Boosting Requests
    const warframe = await prisma.game.findUnique({ where: { slug: "warframe" } });
    const valorant = await prisma.game.findUnique({ where: { slug: "valorant" } });
    const roblox = await prisma.game.findUnique({ where: { slug: "roblox" } });

    if (warframe && valorant && roblox) {
        const boostingRequests = [
            {
                gameId: warframe.id,
                userId: actualDemoUserId,
                title: "Credit Farming",
                description: "Looking for an experienced player to farm 10 million credits on my account. I have boosters active.",
                price: 15.00,
                status: "available",
            },
            {
                gameId: valorant.id,
                userId: actualDemoUserId,
                title: "Rank Boost",
                description: "Need a solo boost from Plat 3 to Ascendant 2. Must play Reyna/Jett and have high ADR.",
                price: 45.00,
                status: "available",
            },
            {
                gameId: roblox.id,
                userId: actualDemoUserId,
                title: "Blox Fruits Leveling",
                description: "Need someone to level my character from 1000 to max. Fast delivery preferred.",
                price: 25.00,
                status: "available",
            }
        ];

        for (const req of boostingRequests) {
            await prisma.boostingRequest.create({
                data: req
            });
        }
        console.log(`✅ Created ${boostingRequests.length} boosting requests`);
    }

    console.log("🎉 Test data seeding complete!");
}

main()
    .catch((e) => {
        console.error("❌ Seeding error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
