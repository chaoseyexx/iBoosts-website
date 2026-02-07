"use server";

import { prisma } from "@/lib/prisma/client";
import { createClient } from "@/lib/supabase/server";

export async function getConversations() {
    try {
        const supabase = await createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) return [];

        const profile = await prisma.user.findUnique({
            where: { supabaseId: authUser.id }
        });
        if (!profile) return [];

        const orders = await prisma.order.findMany({
            where: {
                OR: [
                    { buyerId: profile.id },
                    { sellerId: profile.id }
                ]
            },
            include: {
                buyer: true,
                seller: true,
                messages: {
                    orderBy: { createdAt: "desc" },
                    take: 1,
                    include: { sender: true }
                }
            },
            orderBy: { updatedAt: "desc" }
        });

        return orders.map(order => ({
            id: order.id,
            orderNumber: order.orderNumber,
            otherUser: order.buyerId === profile.id ? order.seller : order.buyer,
            lastMessage: order.messages[0] || null,
            unreadCount: 0,
            timestamp: order.messages[0]?.createdAt || order.updatedAt
        }));
    } catch (error) {
        console.error("Error fetching conversations:", error);
        return [];
    }
}

export async function getChatMessages(orderId: string) {
    try {
        return await prisma.orderMessage.findMany({
            where: { orderId },
            include: { sender: true },
            orderBy: { createdAt: "asc" }
        });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return [];
    }
}
