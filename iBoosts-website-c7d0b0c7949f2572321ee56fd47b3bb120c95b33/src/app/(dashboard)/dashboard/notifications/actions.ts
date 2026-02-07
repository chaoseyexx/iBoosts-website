"use server";

import { prisma } from "@/lib/prisma/client";
import { createAdminClient } from "@/lib/supabase/server";

export async function getNotifications(userId: string) {
    if (!userId) return [];

    try {
        return await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take: 20
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return [];
    }
}

export async function markNotificationAsRead(notificationId: string) {
    try {
        await prisma.notification.update({
            where: { id: notificationId },
            data: { isRead: true, readAt: new Date() }
        });
        return { success: true };
    } catch (error) {
        return { error: "Failed to mark as read" };
    }
}

export async function markAllNotificationsAsRead(userId: string) {
    try {
        await prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true, readAt: new Date() }
        });
        return { success: true };
    } catch (error) {
        return { error: "Failed to mark all as read" };
    }
}
