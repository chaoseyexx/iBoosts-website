import "dotenv/config";
import { prisma } from "./src/lib/prisma/client";

async function main() {
    try {
        console.log("Connecting...");
        const userCount = await prisma.user.count();
        console.log("Success! User count:", userCount);
    } catch (e) {
        console.error("Connection failed:", e);
    } finally {
        process.exit(0);
    }
}

main();
