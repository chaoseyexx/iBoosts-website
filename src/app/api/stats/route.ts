import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";

export async function GET() {
    try {
        // Calculate real stats from database

        // Total Trade Volume - sum of all completed orders
        const volumeResult = await prisma.order.aggregate({
            where: { status: "DELIVERED" },
            _sum: { finalAmount: true },
        });
        const totalVolume = Number(volumeResult._sum.finalAmount || 0);

        // Format volume for display
        let volumeDisplay: string;
        if (totalVolume >= 1000000) {
            volumeDisplay = `$${(totalVolume / 1000000).toFixed(1)}M+`;
        } else if (totalVolume >= 1000) {
            volumeDisplay = `$${(totalVolume / 1000).toFixed(0)}K+`;
        } else {
            volumeDisplay = `$${totalVolume.toFixed(0)}`;
        }

        // Average Delivery Time - calculate from delivered orders
        const deliveredOrders = await prisma.order.findMany({
            where: {
                status: "DELIVERED",
            },
            select: {
                createdAt: true,
                deliveredAt: true,
            },
            take: 1000, // Sample last 1000 orders
            orderBy: { createdAt: "desc" },
        });

        let avgDeliveryMinutes = 0;
        if (deliveredOrders.length > 0) {
            const totalMinutes = deliveredOrders.reduce((acc, order) => {
                if (order.deliveredAt && order.createdAt) {
                    const diffMs = order.deliveredAt.getTime() - order.createdAt.getTime();
                    return acc + (diffMs / 1000 / 60); // Convert to minutes
                }
                return acc;
            }, 0);
            avgDeliveryMinutes = totalMinutes / deliveredOrders.length;
        }

        // Format delivery time for display
        let deliveryDisplay: string;
        if (avgDeliveryMinutes < 1) {
            deliveryDisplay = "<1 MIN";
        } else if (avgDeliveryMinutes < 60) {
            deliveryDisplay = `${avgDeliveryMinutes.toFixed(1)} MIN`;
        } else {
            deliveryDisplay = `${(avgDeliveryMinutes / 60).toFixed(1)} HRS`;
        }

        // If no data, show reasonable defaults
        if (deliveredOrders.length === 0) {
            deliveryDisplay = "Instant";
        }
        if (totalVolume === 0) {
            volumeDisplay = "$0";
        }

        return NextResponse.json({
            totalVolume: volumeDisplay,
            avgDelivery: deliveryDisplay,
            successRate: "99.9%", // Hardcoded as requested
            totalOrders: deliveredOrders.length,
        });
    } catch (error) {
        console.error("Stats API Error:", error);
        return NextResponse.json({
            totalVolume: "$0",
            avgDelivery: "Instant",
            successRate: "99.9%",
            totalOrders: 0,
        });
    }
}
