
import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL!;
const finalConnectionString = connectionString.includes("uselibpqcompat")
    ? connectionString
    : connectionString.includes("?")
        ? `${connectionString}&uselibpqcompat=true`
        : `${connectionString}?uselibpqcompat=true`;

console.log("Testing Adapter with:", finalConnectionString.replace(/:[^:@]+@/, ":****@"));

const pool = new Pool({
    connectionString: finalConnectionString,
    max: 10,
    ssl: { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    try {
        console.log("Connecting via Adapter...");
        const count = await prisma.user.count();
        console.log("Success! User count:", count);
    } catch (err) {
        console.error("Adapter Connection failed:", err);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

main();
