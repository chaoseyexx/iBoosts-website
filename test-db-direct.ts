
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

console.log("DIRECT_URL loaded:", process.env.DIRECT_URL ? "Yes" : "No");

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DIRECT_URL,
        },
    },
});

async function main() {
    try {
        console.log("Connecting to DIRECT_URL...");
        const userCount = await prisma.user.count();
        console.log("Success! User count:", userCount);
    } catch (e) {
        console.error("Connection failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
