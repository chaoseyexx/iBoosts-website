
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({ take: 5 });
    const games = await prisma.game.findMany({ take: 5 });
    const categories = await prisma.category.findMany({ take: 5 });

    console.log('--- USERS ---');
    console.log(JSON.stringify(users, null, 2));
    console.log('--- GAMES ---');
    console.log(JSON.stringify(games, null, 2));
    console.log('--- CATEGORIES ---');
    console.log(JSON.stringify(categories, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
