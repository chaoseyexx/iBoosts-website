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
export async function seedCMSData() {
    try {
        const categories = [
            { id: "currency", name: "Currency", icon: "💰", slug: "currency", sortOrder: 1 },
            { id: "accounts", name: "Accounts", icon: "👤", slug: "accounts", sortOrder: 2 },
            { id: "top-ups", name: "Top Ups", icon: "⬆️", slug: "top-ups", sortOrder: 3 },
            { id: "items", name: "Items", icon: "🎁", slug: "items", sortOrder: 4 },
            { id: "gift-cards", name: "Gift Cards", icon: "🎴", slug: "gift-cards", sortOrder: 5 },
            { id: "boosting", name: "Boosting", icon: "🚀", slug: "boosting", sortOrder: 6 }
        ];

        const games = [
            { name: "Grand Theft Auto V", slug: "gta-v", isPopular: true, categoryIds: ["currency", "accounts"] },
            { name: "Fortnite", slug: "fortnite", isPopular: true, categoryIds: ["currency", "accounts", "items"] },
            { name: "Valorant", slug: "valorant", isPopular: true, categoryIds: ["accounts", "top-ups"] },
            { name: "Roblox", slug: "roblox", isPopular: true, categoryIds: ["currency", "items"] },
            { name: "League of Legends", slug: "lol", isPopular: true, categoryIds: ["accounts", "top-ups"] },
            { name: "Minecraft", slug: "minecraft", isPopular: true, categoryIds: ["accounts", "items"] }
        ];

        // Seed Categories
        for (const cat of categories) {
            await prisma.category.upsert({
                where: { id: cat.id },
                update: {},
                create: {
                    id: cat.id,
                    name: cat.name,
                    slug: cat.slug,
                    icon: cat.icon,
                    sortOrder: cat.sortOrder
                }
            });
        }

        // Seed Games
        for (const game of games) {
            await prisma.game.upsert({
                where: { slug: game.slug },
                update: {},
                create: {
                    name: game.name,
                    slug: game.slug,
                    isPopular: game.isPopular,
                    categories: {
                        connect: game.categoryIds.map(id => ({ id }))
                    }
                }
            });
        }

        revalidatePath("/admin/cms");
        return { success: true };
    } catch (error: any) {
        console.error("Seed error:", error);
        return { error: error.message };
    }
}

// ==========================================
// DISPUTE ACTIONS
// ==========================================

export async function fetchDisputes() {
    try {
        return await prisma.dispute.findMany({
            include: {
                order: {
                    include: {
                        listing: true
                    }
                },
                buyer: {
                    select: { id: true, username: true, avatar: true }
                },
                seller: {
                    select: { id: true, username: true, avatar: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    } catch (error) {
        console.error("Error fetching disputes:", error);
        return [];
    }
}

export async function resolveDispute(
    disputeId: string,
    resolution: "BUYER_FAVOR" | "SELLER_FAVOR" | "SPLIT" | "NO_ACTION",
    notes?: string
) {
    try {
        const dispute = await prisma.dispute.update({
            where: { id: disputeId },
            data: {
                status: "RESOLVED",
                resolution,
                resolutionNotes: notes,
                resolvedAt: new Date()
            }
        });

        // Also update the associated order status
        await prisma.order.update({
            where: { id: dispute.orderId },
            data: {
                status: resolution === "BUYER_FAVOR" ? "REFUNDED" : "COMPLETED"
            }
        });

        revalidatePath("/admin/disputes");
        return { success: true };
    } catch (error: any) {
        console.error("Error resolving dispute:", error);
        return { error: error.message };
    }
}

// ==========================================
// WITHDRAWAL ACTIONS
// ==========================================

export async function fetchWithdrawals() {
    try {
        return await prisma.withdrawal.findMany({
            include: {
                user: {
                    select: { id: true, username: true, avatar: true, email: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    } catch (error) {
        console.error("Error fetching withdrawals:", error);
        return [];
    }
}

export async function processWithdrawal(
    withdrawalId: string,
    action: "APPROVE" | "REJECT",
    rejectionReason?: string
) {
    try {
        if (action === "APPROVE") {
            await prisma.withdrawal.update({
                where: { id: withdrawalId },
                data: {
                    status: "COMPLETED",
                    processedAt: new Date()
                }
            });
        } else {
            await prisma.withdrawal.update({
                where: { id: withdrawalId },
                data: {
                    status: "REJECTED",
                    rejectionReason,
                    processedAt: new Date()
                }
            });
        }

        revalidatePath("/admin/finance");
        return { success: true };
    } catch (error: any) {
        console.error("Error processing withdrawal:", error);
        return { error: error.message };
    }
}

// ==========================================
// USER BALANCE MANAGEMENT
// ==========================================

export async function addUserBalance(userId: string, amount: number, reason: string, adminId?: string) {
    try {
        // Get or create wallet
        let wallet = await prisma.wallet.findUnique({ where: { userId } });

        if (!wallet) {
            wallet = await prisma.wallet.create({
                data: { userId, balance: 0, pendingBalance: 0 }
            });
        }

        const balanceBefore = Number(wallet.balance);
        const balanceAfter = balanceBefore + amount;

        // Update wallet
        await prisma.wallet.update({
            where: { userId },
            data: { balance: balanceAfter }
        });

        // Create transaction record
        await prisma.walletTransaction.create({
            data: {
                walletId: wallet.id,
                type: "CREDIT",
                amount,
                balanceBefore,
                balanceAfter,
                description: `Admin credit: ${reason}`,
                referenceType: "admin_adjustment"
            }
        });

        // Log admin action
        if (adminId) {
            await logAdminAction(adminId, "ADD_BALANCE", userId, { amount, reason });
        }

        revalidatePath("/admin/users");
        return { success: true, newBalance: balanceAfter };
    } catch (error: any) {
        console.error("Error adding balance:", error);
        return { error: error.message };
    }
}

export async function subtractUserBalance(userId: string, amount: number, reason: string, adminId?: string) {
    try {
        const wallet = await prisma.wallet.findUnique({ where: { userId } });

        if (!wallet) {
            return { error: "User has no wallet" };
        }

        const balanceBefore = Number(wallet.balance);
        if (balanceBefore < amount) {
            return { error: "Insufficient balance" };
        }

        const balanceAfter = balanceBefore - amount;

        await prisma.wallet.update({
            where: { userId },
            data: { balance: balanceAfter }
        });

        await prisma.walletTransaction.create({
            data: {
                walletId: wallet.id,
                type: "DEBIT",
                amount,
                balanceBefore,
                balanceAfter,
                description: `Admin debit: ${reason}`,
                referenceType: "admin_adjustment"
            }
        });

        if (adminId) {
            await logAdminAction(adminId, "SUBTRACT_BALANCE", userId, { amount, reason });
        }

        revalidatePath("/admin/users");
        return { success: true, newBalance: balanceAfter };
    } catch (error: any) {
        console.error("Error subtracting balance:", error);
        return { error: error.message };
    }
}

// ==========================================
// USER MODERATION
// ==========================================

export async function banUser(
    userId: string,
    reason: string,
    duration: "PERMANENT" | "7_DAYS" | "30_DAYS",
    adminId?: string
) {
    try {
        let banUntil: Date | null = null;

        if (duration === "7_DAYS") {
            banUntil = new Date();
            banUntil.setDate(banUntil.getDate() + 7);
        } else if (duration === "30_DAYS") {
            banUntil = new Date();
            banUntil.setDate(banUntil.getDate() + 30);
        }

        await prisma.user.update({
            where: { id: userId },
            data: {
                status: "BANNED",
                bannedReason: reason,
                bannedAt: new Date()
            }
        });

        if (adminId) {
            await logAdminAction(adminId, "BAN_USER", userId, { reason, duration });
        }

        revalidatePath("/admin/users");
        return { success: true };
    } catch (error: any) {
        console.error("Error banning user:", error);
        return { error: error.message };
    }
}

export async function suspendUser(userId: string, reason: string, adminId?: string) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                status: "SUSPENDED"
            }
        });

        if (adminId) {
            await logAdminAction(adminId, "SUSPEND_USER", userId, { reason });
        }

        revalidatePath("/admin/users");
        return { success: true };
    } catch (error: any) {
        console.error("Error suspending user:", error);
        return { error: error.message };
    }
}

export async function activateUser(userId: string, adminId?: string) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                status: "ACTIVE",
                bannedReason: null,
                bannedAt: null
            }
        });

        if (adminId) {
            await logAdminAction(adminId, "ACTIVATE_USER", userId, {});
        }

        revalidatePath("/admin/users");
        return { success: true };
    } catch (error: any) {
        console.error("Error activating user:", error);
        return { error: error.message };
    }
}

// ==========================================
// AUDIT LOGGING
// ==========================================

export async function logAdminAction(
    adminId: string,
    action: string,
    targetId: string,
    metadata: Record<string, any>
) {
    try {
        await prisma.adminLog.create({
            data: {
                adminId,
                action,
                targetId,
                targetType: "USER", // Can be USER, ORDER, DISPUTE, etc.
                metadata,
                ipAddress: "system", // Would come from request in real scenario
                createdAt: new Date()
            }
        });
    } catch (error) {
        // Don't fail the main action if logging fails
        console.error("Failed to log admin action:", error);
    }
}

export async function getAdminLogs(filters?: {
    adminId?: string;
    action?: string;
    targetId?: string;
    limit?: number;
}) {
    try {
        return await prisma.adminLog.findMany({
            where: {
                ...(filters?.adminId && { adminId: filters.adminId }),
                ...(filters?.action && { action: filters.action }),
                ...(filters?.targetId && { targetId: filters.targetId })
            },
            include: {
                admin: {
                    select: { id: true, username: true, avatar: true }
                }
            },
            orderBy: { createdAt: "desc" },
            take: filters?.limit || 50
        });
    } catch (error) {
        console.error("Error fetching admin logs:", error);
        return [];
    }
}

// ==========================================
// ADVANCED QUERIES
// ==========================================

export async function fetchUsersWithStats(filters?: {
    search?: string;
    status?: string;
    role?: string;
    limit?: number;
    offset?: number;
}) {
    try {
        const where: any = {};

        if (filters?.search) {
            where.OR = [
                { username: { contains: filters.search, mode: "insensitive" } },
                { email: { contains: filters.search, mode: "insensitive" } },
                { id: { contains: filters.search } }
            ];
        }
        if (filters?.status) {
            where.status = filters.status;
        }
        if (filters?.role) {
            where.role = filters.role;
        }

        const users = await prisma.user.findMany({
            where,
            include: {
                wallet: { select: { balance: true, pendingBalance: true } },
                _count: {
                    select: {
                        buyerOrders: true,
                        sellerOrders: true,
                        listings: true,
                        buyerDisputes: true,
                        sellerDisputes: true
                    }
                }
            },
            orderBy: { createdAt: "desc" },
            take: filters?.limit || 25,
            skip: filters?.offset || 0
        });

        const totalCount = await prisma.user.count({ where });

        return { users, totalCount };
    } catch (error) {
        console.error("Error fetching users:", error);
        return { users: [], totalCount: 0 };
    }
}

export async function fetchOrdersWithDetails(filters?: {
    search?: string;
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
    limit?: number;
    offset?: number;
}) {
    try {
        const where: any = {};

        if (filters?.search) {
            where.OR = [
                { orderNumber: { contains: filters.search, mode: "insensitive" } },
                { buyer: { username: { contains: filters.search, mode: "insensitive" } } },
                { seller: { username: { contains: filters.search, mode: "insensitive" } } }
            ];
        }
        if (filters?.status) {
            where.status = filters.status;
        }
        if (filters?.dateFrom || filters?.dateTo) {
            where.createdAt = {};
            if (filters.dateFrom) where.createdAt.gte = filters.dateFrom;
            if (filters.dateTo) where.createdAt.lte = filters.dateTo;
        }

        const orders = await prisma.order.findMany({
            where,
            include: {
                buyer: { select: { id: true, username: true, avatar: true } },
                seller: { select: { id: true, username: true, avatar: true } },
                listing: { select: { id: true, title: true } },
                dispute: { select: { id: true, status: true } }
            },
            orderBy: { createdAt: "desc" },
            take: filters?.limit || 25,
            skip: filters?.offset || 0
        });

        const totalCount = await prisma.order.count({ where });

        return { orders, totalCount };
    } catch (error) {
        console.error("Error fetching orders:", error);
        return { orders: [], totalCount: 0 };
    }
}

// ==========================================
// BULK OPERATIONS
// ==========================================

export async function bulkUpdateUserStatus(userIds: string[], status: "ACTIVE" | "SUSPENDED" | "BANNED", adminId?: string) {
    try {
        await prisma.user.updateMany({
            where: { id: { in: userIds } },
            data: { status }
        });

        if (adminId) {
            await logAdminAction(adminId, `BULK_${status}`, userIds.join(","), { count: userIds.length });
        }

        revalidatePath("/admin/users");
        return { success: true, count: userIds.length };
    } catch (error: any) {
        console.error("Error in bulk update:", error);
        return { error: error.message };
    }
}

export async function bulkCompleteOrders(orderIds: string[], adminId?: string) {
    try {
        await prisma.order.updateMany({
            where: { id: { in: orderIds } },
            data: { status: "COMPLETED", completedAt: new Date() }
        });

        if (adminId) {
            await logAdminAction(adminId, "BULK_COMPLETE_ORDERS", orderIds.join(","), { count: orderIds.length });
        }

        revalidatePath("/admin/orders");
        return { success: true, count: orderIds.length };
    } catch (error: any) {
        console.error("Error in bulk complete:", error);
        return { error: error.message };
    }
}
