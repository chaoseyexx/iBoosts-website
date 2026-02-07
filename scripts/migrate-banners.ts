
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
    console.log("Checking for 'cdn.iboosts.com' URLs to migrate...");

    // Find games with incorrect domain in banner
    const gamesWithBadBanner = await prisma.game.findMany({
        where: {
            banner: {
                contains: "cdn.iboosts.com"
            }
        }
    });

    console.log(`Found ${gamesWithBadBanner.length} games with bad banner URLs.`);

    for (const game of gamesWithBadBanner) {
        if (game.banner) {
            const newBanner = game.banner.replace("cdn.iboosts.com", "cdn.iboosts.gg");
            await prisma.game.update({
                where: { id: game.id },
                data: { banner: newBanner }
            });
            console.log(`Updated Game [${game.name}]: ${game.banner} -> ${newBanner}`);
        }
    }

    // Find games with incorrect domain in icon
    const gamesWithBadIcon = await prisma.game.findMany({
        where: {
            icon: {
                contains: "cdn.iboosts.com"
            }
        }
    });

    console.log(`Found ${gamesWithBadIcon.length} games with bad icon URLs.`);

    for (const game of gamesWithBadIcon) {
        if (game.icon) {
            const newIcon = game.icon.replace("cdn.iboosts.com", "cdn.iboosts.gg");
            await prisma.game.update({
                where: { id: game.id },
                data: { icon: newIcon }
            });
            console.log(`Updated Game [${game.name}]: ${game.icon} -> ${newIcon}`);
        }
    }

    console.log("Migration complete.");
}

main()
    .catch(console.error)
    .finally(() => {
        prisma.$disconnect();
        pool.end();
    });
