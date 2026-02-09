import { prisma } from "../src/lib/prisma/client";

async function main() {
    console.log('--- Order & Notification Cleanup Started ---')

    try {
        // Correct order to avoid foreign key constraints
        console.log('1. Cleaning up Order dependencies...')
        await prisma.orderTimeline.deleteMany({})
        await prisma.orderMessage.deleteMany({})

        console.log('2. Cleaning up Dispute system...')
        await prisma.disputeMessage.deleteMany({})
        await prisma.disputeEvidence.deleteMany({})
        await prisma.dispute.deleteMany({})

        console.log('3. Cleaning up Reviews & Reports...')
        await prisma.review.deleteMany({})
        await prisma.report.deleteMany({})

        console.log('4. Cleaning up Offers & Coupons...')
        await prisma.offer.deleteMany({})
        await prisma.couponUsage.deleteMany({})

        console.log('5. Cleaning up Notifications...')
        await prisma.notification.deleteMany({})

        console.log('6. Final sweep of Orders...')
        await prisma.order.deleteMany({})

        // Reset user stats that are order-linked
        console.log('7. Resetting User transaction stats...')
        await prisma.user.updateMany({
            data: {
                totalSales: 0,
                totalOrders: 0,
                totalReviews: 0,
                sellerRating: 5.0, // Default to 5
            }
        })

        console.log('--- Cleanup Successful! ---')
        console.log('Deleted: Orders, Messages, Timeline, Disputes, Reviews, Reports, and Notifications.')
        console.log('Preserved: Games, Users, Categories, and Listings.')
    } catch (error) {
        console.error('Cleanup failed:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
