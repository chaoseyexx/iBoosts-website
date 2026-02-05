"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma/client";
import { createAdminClient } from "@/lib/supabase/server";

export async function updateUserStatus(userId: string, status: "ACTIVE" | "SUSPENDED" | "BANNED" | "FROZEN") {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { status }
        });
        revalidatePath("/admin/users");
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function updateUserRole(userId: string, role: "BUYER" | "SELLER" | "MODERATOR" | "SUPPORT" | "ADMIN") {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { role }
        });
        revalidatePath("/admin/users");
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function updateOrderStatus(orderId: string, status: "PENDING" | "ACTIVE" | "DELIVERED" | "COMPLETED" | "DISPUTED" | "CANCELLED" | "REFUNDED") {
    try {
        await prisma.order.update({
            where: { id: orderId },
            data: { status }
        });
        revalidatePath("/admin/orders");
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function adminManageOrder(orderId: string, action: "FORCE_COMPLETE" | "FORCE_CANCEL_REFUND") {
    try {
        if (action === "FORCE_COMPLETE") {
            await prisma.order.update({
                where: { id: orderId },
                data: { status: "COMPLETED", completedAt: new Date() }
            });
        } else if (action === "FORCE_CANCEL_REFUND") {
            await prisma.order.update({
                where: { id: orderId },
                data: { status: "CANCELLED", cancelledAt: new Date() }
            });
            // In a real app, you would also trigger a refund in the wallet
        }
        revalidatePath("/admin/orders");
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function createGame(data: {
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    isPopular?: boolean;
    categoryIds: string[];
}) {
    try {
        const game = await prisma.game.create({
            data: {
                name: data.name,
                slug: data.slug,
                description: data.description,
                icon: data.icon,
                isPopular: data.isPopular || false,
                categories: {
                    connect: data.categoryIds.map(id => ({ id }))
                }
            }
        });

        // Trigger notification for all users
        const users = await prisma.user.findMany({
            where: { status: "ACTIVE" },
            select: { id: true }
        });

        await prisma.notification.createMany({
            data: users.map(user => ({
                userId: user.id,
                type: "SYSTEM",
                title: `🔥 New ${data.name} Game Added! 🔥`,
                content: `${data.name} has been added to our platform. You can start listing your offers now!`,
                link: `/${data.categoryIds[0] || 'marketplace'}?game=${data.slug}`,
            }))
        });

        revalidatePath("/admin/cms");
        revalidatePath("/"); // To update navbar if it's dynamic later
        return { success: true, game };
    } catch (error: any) {
        console.error("Error creating game:", error);
        return { error: error.message };
    }
}

export async function fetchCategories() {
    try {
        return await prisma.category.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' }
        });
    } catch (error) {
        return [];
    }
}

export async function fetchGames() {
    try {
        return await prisma.game.findMany({
            include: { categories: true },
            orderBy: { createdAt: 'desc' }
        });
    } catch (error) {
        return [];
    }
}
