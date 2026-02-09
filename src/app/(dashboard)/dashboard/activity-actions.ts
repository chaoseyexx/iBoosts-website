"use server";

import prisma from "@/lib/prisma/client";
import { createClient } from "@/lib/supabase/server";
import { Activity } from "@/components/ui/activity-dropdown";

export async function getRecentActivities(): Promise<Activity[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const dbUser = await (prisma.user as any).findUnique({
        where: { supabaseId: user.id }
    });
    if (!dbUser) return [];

    // Fetch recent orders (as buyer or seller) - focus on Active/Pending/Disputed
    const orders = await prisma.order.findMany({
        where: {
            OR: [
                { buyerId: dbUser.id },
                { sellerId: dbUser.id }
            ],
            // Show all recent activity, prioritizing active
            status: { not: "CANCELLED" }
        },
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { listing: true }
    });

    // Fetch unread notifications? (Optional, maybe later)

    // Transform to Activity
    const activities: Activity[] = orders.map(order => {
        const isBuyer = order.buyerId === dbUser.id;
        let type: Activity["type"] = "order";

        if (order.status === "DISPUTED") type = "dispute";
        if (order.status === "DELIVERED") type = "delivery";

        // Format timestamp relative
        const date = new Date(order.createdAt);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        let timestamp = "Just now";

        if (diff < 60000) timestamp = "Just now";
        else if (diff < 3600000) timestamp = `${Math.floor(diff / 60000)}m ago`;
        else if (diff < 86400000) timestamp = `${Math.floor(diff / 3600000)}h ago`;
        else timestamp = date.toLocaleDateString();

        return {
            id: order.id,
            type,
            title: isBuyer ? `BOUGHT: ${order.listing.title}` : `SOLD: ${order.listing.title}`,
            status: order.status,
            timestamp,
            link: `/dashboard/orders/${order.orderNumber}`
        };
    });

    return activities;
}
