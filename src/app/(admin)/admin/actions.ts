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
