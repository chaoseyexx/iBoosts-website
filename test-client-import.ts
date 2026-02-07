
import "dotenv/config";
import { prisma } from "./src/lib/prisma/client";

async function main() {
    console.log("Imported prisma client:", prisma);
    try {
        console.log("Attempting query...");
        const count = await prisma.user.count();
        console.log("Query success! User count:", count);
    } catch (e) {
        console.error("Query failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
