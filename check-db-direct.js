
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- USERS ---');
    const users = await prisma.user.findMany({ select: { id: true, email: true, username: true, supabaseId: true }, take: 20 });
    console.log(JSON.stringify(users, null, 2));

    console.log('--- GAMES ---');
    const games = await prisma.game.findMany({ select: { id: true, name: true, isActive: true }, take: 10 });
    console.log(JSON.stringify(games, null, 2));

    console.log('--- CATEGORIES ---');
    const categories = await prisma.category.findMany({ select: { id: true, name: true, isActive: true }, take: 10 });
    console.log(JSON.stringify(categories, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
