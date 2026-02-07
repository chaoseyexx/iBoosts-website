
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({
    connectionString: connectionString.includes("uselibpqcompat")
        ? connectionString
        : `${connectionString}${connectionString.includes("?") ? "&" : "?"}uselibpqcompat=true`,
    max: 1, // Restrict to single connection for reset script
    ssl: { rejectUnauthorized: false }
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("🧹 Cleaning database (max connections: 1)...");

    // Order matters for deletion to avoid FK issues, although CASCADE helps
    const tables = [
        "Notification",
        "OrderMessage",
        "DisputeMessage",
        "DisputeEvidence",
        "Dispute",
        "Review",
        "Report",
        "Offer",
        "OrderTimeline",
        "Order",
        "ListingImage",
        "Listing",
        "BoostingRequest",
        "WalletTransaction",
        "Withdrawal",
        "Wallet",
        "Session",
        "Device",
        "KycDocument",
        "UserBadge",
        "CouponUsage",
        "Coupon",
        "Game",
        "Category",
        "User",
        "AdminLog",
        "AuditLog"
    ];

    for (const table of tables) {
        try {
            await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`);
            console.log(`✅ Cleared ${table}`);
        } catch (error) {
            console.log(`⚠️  Could not clear ${table} (might be empty or already cleared via cascade)`);
        }
    }

    console.log("✨ Database cleared successfully");
}

main()
    .catch(console.error)
    .finally(() => {
        prisma.$disconnect();
        pool.end();
    });
