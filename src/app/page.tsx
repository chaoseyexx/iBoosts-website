import { NavbarServer } from "@/components/layout/navbar-server";
import { HomePageClient } from "./home-page-client";
import { fetchGamesForNavbar } from "@/app/(admin)/admin/actions";
import { prisma } from "@/lib/prisma/client";
import { headers } from "next/headers";
import { SupportClient } from "./support/client";
import { Footer } from "@/components/layout/footer";

async function fetchPlatformStats() {
    try {
        // Total Trade Volume
        const volumeResult = await prisma.order.aggregate({
            where: { status: "DELIVERED" },
            _sum: { finalAmount: true },
        });
        const totalVolume = Number(volumeResult._sum.finalAmount || 0);

        let volumeDisplay: string;
        if (totalVolume >= 1000000) {
            volumeDisplay = `$${(totalVolume / 1000000).toFixed(1)}M+`;
        } else if (totalVolume >= 1000) {
            volumeDisplay = `$${(totalVolume / 1000).toFixed(0)}K+`;
        } else if (totalVolume > 0) {
            volumeDisplay = `$${totalVolume.toFixed(0)}`;
        } else {
            volumeDisplay = "$0";
        }

        // Average Delivery Time
        const deliveredOrders = await prisma.order.findMany({
            where: { status: "DELIVERED" },
            select: { createdAt: true, deliveredAt: true },
            take: 1000,
            orderBy: { createdAt: "desc" },
        });

        let avgDeliveryMinutes = 0;
        const validOrders = deliveredOrders.filter(o => o.deliveredAt);
        if (validOrders.length > 0) {
            const totalMinutes = validOrders.reduce((acc, order) => {
                const diffMs = order.deliveredAt!.getTime() - order.createdAt.getTime();
                return acc + (diffMs / 1000 / 60);
            }, 0);
            avgDeliveryMinutes = totalMinutes / validOrders.length;
        }

        let deliveryDisplay: string;
        if (validOrders.length === 0) {
            deliveryDisplay = "Instant";
        } else if (avgDeliveryMinutes < 1) {
            deliveryDisplay = "<1 MIN";
        } else if (avgDeliveryMinutes < 60) {
            deliveryDisplay = `${avgDeliveryMinutes.toFixed(1)} MIN`;
        } else {
            deliveryDisplay = `${(avgDeliveryMinutes / 60).toFixed(1)} HRS`;
        }

        return {
            totalVolume: volumeDisplay,
            avgDelivery: deliveryDisplay,
            successRate: "99.9%",
        };
    } catch {
        return { totalVolume: "$0", avgDelivery: "Instant", successRate: "99.9%" };
    }
}

export default async function HomePage() {
    const headerList = await headers();
    const host = headerList.get('host') || "";

    if (host.includes('support.iboosts.gg')) {
        return (
            <div className="flex flex-col min-h-screen">
                <NavbarServer variant="landing" />
                <main className="flex-1 bg-[#0a0e13]">
                    <SupportClient />
                </main>
                <Footer />
            </div>
        );
    }

    // Fetch data in parallel
    const [{ categories, gamesByCategory }, userCount, stats] = await Promise.all([
        fetchGamesForNavbar(),
        prisma.user.count(),
        fetchPlatformStats(),
    ]);

    return (
        <>
            <NavbarServer variant="landing" />
            <HomePageClient
                initialCategories={categories}
                initialGamesData={gamesByCategory}
                initialUserCount={userCount}
                stats={stats}
            />
        </>
    );
}
