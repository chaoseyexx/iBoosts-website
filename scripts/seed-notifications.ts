
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.findFirst();

    if (!user) {
        console.log('No user found to seed notifications for.');
        return;
    }

    console.log(`Seeding notifications for user: ${user.email} (${user.id})`);

    // Clear existing notifications for this user to avoid duplicates if run multiple times
    await prisma.notification.deleteMany({
        where: { userId: user.id }
    });

    const notifications = [
        {
            userId: user.id,
            type: 'ORDER_NEW',
            title: 'Order #1234 Received',
            content: 'Your order for "Valorant Rank Boost" has been received and is pending processing.',
            link: '/dashboard/orders/1234',
            isRead: false,
        },
        {
            userId: user.id,
            type: 'MESSAGE_NEW',
            title: 'New Message from Booster',
            content: 'Hey, I will be starting your boost in 10 minutes. Please log out!',
            link: '/dashboard/messages',
            isRead: false,
        },
        {
            userId: user.id,
            type: 'OFFER_RECEIVED',
            title: 'Special Offer!',
            content: 'Get 20% off your next purchase with code BOOST20.',
            link: '/dashboard/offers',
            isRead: true,
        },
        {
            userId: user.id,
            type: 'KYC_APPROVED',
            title: 'Identity Verified',
            content: 'Your KYC documents have been approved. You can now sell on iBoosts.',
            link: '/dashboard/settings',
            isRead: false,
        },
        {
            userId: user.id,
            type: 'WITHDRAWAL_COMPLETED',
            title: 'Withdrawal Processed',
            content: 'Your withdrawal of $50.00 has been sent to your PayPal account.',
            link: '/dashboard/wallet',
            isRead: true,
        }
    ];

    for (const notif of notifications) {
        await prisma.notification.create({
            data: {
                ...notif,
                type: notif.type as any
            }
        });
    }

    console.log('Notifications seeded successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
