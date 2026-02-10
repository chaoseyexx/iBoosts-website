import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
    const withdrawalsCount = await prisma.withdrawal.count();
    const withdrawals = await prisma.withdrawal.findMany({ take: 5 });
    const ordersCount = await prisma.order.count();
    const orders = await prisma.order.findMany({ where: { status: 'COMPLETED' }, take: 5 });

    console.log('Withdrawals Count:', withdrawalsCount);
    console.log('Recent Withdrawals:', JSON.stringify(withdrawals, null, 2));
    console.log('Completed Orders Count:', ordersCount);
    console.log('Recent Orders:', JSON.stringify(orders, null, 2));
}

check().catch(console.error).finally(() => prisma.$disconnect());
