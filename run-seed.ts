
import prisma from './src/lib/prisma/client';
import { seedDemoOrders } from './src/app/(dashboard)/dashboard/orders/orders-actions';

async function main() {
    console.log('Finding user...');
    const user = await prisma.user.findFirst({
        where: { supabaseId: { not: null } }
    });

    if (!user || !user.supabaseId) {
        console.error('No user with supabaseId found');
        return;
    }

    console.log(`Seeding for user: ${user.username} (ID: ${user.id}, Supabase: ${user.supabaseId})`);
    const result = await seedDemoOrders(user.supabaseId);
    console.log('Result:', result);
}

main().catch(console.error).finally(() => prisma.$disconnect());
