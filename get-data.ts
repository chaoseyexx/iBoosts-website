
import { prisma } from "./src/lib/prisma/client";

async function main() {
    console.log("🔍 Verifying Data Integrity...");

    const userCount = await prisma.user.count();
    const gameCount = await prisma.game.count();
    const categoryCount = await prisma.category.count();
    const listingCount = await prisma.listing.count();
    const orderCount = await prisma.order.count();
    const walletTxCount = await prisma.walletTransaction.count();

    console.log(`\n📊 Counts:`);
    console.log(`- Users: ${userCount}`);
    console.log(`- Games: ${gameCount}`);
    console.log(`- Categories: ${categoryCount}`);
    console.log(`- Listings: ${listingCount}`);
    console.log(`- Orders: ${orderCount}`);
    console.log(`- Wallet Tx: ${walletTxCount}`);

    console.log(`\n🕹️ Sample Games:`);
    const games = await prisma.game.findMany({ take: 5, include: { categories: true } });
    games.forEach(g => console.log(`  - ${g.name} (${g.slug}) | Icon: ${g.icon?.substring(0, 40)}... | Cats: ${g.categories.map(c => c.name).join(", ")}`));

    console.log(`\n📦 Sample Listings:`);
    const listings = await prisma.listing.findMany({ take: 3, include: { game: true, category: true, seller: true } });
    listings.forEach(l => console.log(`  - ${l.title} (${l.id}) | Game: ${l.game.name} | Seller: ${l.seller.username}`));

    console.log(`\n🛒 Sample Orders:`);
    const orders = await prisma.order.findMany({ take: 3, include: { buyer: true, listing: true } });
    orders.forEach(o => console.log(`  - ${o.orderNumber} | Buyer: ${o.buyer.username} | Item: ${o.listing.title}`));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
