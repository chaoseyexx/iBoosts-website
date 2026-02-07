"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma/client";
import { generateId } from "@/lib/utils/ids";
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
    banner?: string;
    isPopular?: boolean;
    categoryIds: string[];
}) {
    try {


        const game = await prisma.game.create({
            data: {
                id: generateId("Game"),
                name: data.name,
                slug: data.slug,
                description: data.description,
                icon: data.icon,
                banner: data.banner,
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
                id: generateId("Notification"),
                userId: user.id,
                type: "SYSTEM",
                title: `🔥 New ${data.name} Game Added! 🔥`,
                content: `${data.name} has been added to our platform. You can start listing your offers now!`,
                link: `/${data.categoryIds[0] || 'marketplace'}?game=${data.slug}`,
            }))
        });

        revalidateTag("navbar-data", {});
        revalidatePath("/admin/cms");
        revalidatePath("/"); // To update navbar if it's dynamic later
        return { success: true, game };
    } catch (error: any) {
        console.error("Error creating game:", error);
        return { error: error.message };
    }
}

export async function updateGame(gameId: string, data: {
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    banner?: string;
    isPopular?: boolean;
    categoryIds: string[];
}) {
    try {


        // First disconnect all categories
        await prisma.game.update({
            where: { id: gameId },
            data: {
                categories: { set: [] }
            }
        });

        // Then update with new data
        const game = await prisma.game.update({
            where: { id: gameId },
            data: {
                name: data.name,
                slug: data.slug,
                description: data.description,
                icon: data.icon,
                banner: data.banner,
                isPopular: data.isPopular || false,
                categories: {
                    connect: data.categoryIds.map(id => ({ id }))
                }
            }
        });

        revalidateTag("navbar-data", {});
        revalidatePath("/admin/cms");
        revalidatePath("/");
        // Revalidate category pages
        revalidatePath("/currency");
        revalidatePath("/accounts");
        revalidatePath("/boosting");
        revalidatePath("/items");
        revalidatePath("/top-ups");
        revalidatePath("/gift-cards");
        return { success: true, game };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function toggleGameStatus(gameId: string, isActive: boolean) {
    try {
        const game = await prisma.game.update({
            where: { id: gameId },
            data: { isActive }
        });

        // Revalidate all necessary paths
        revalidateTag("navbar-data", {});
        revalidatePath("/admin/cms");
        revalidatePath("/");

        return { success: true, game };
    } catch (error: any) {
        console.error("Error toggling game status:", error);
        return { error: error.message };
    }
}

export async function deleteGame(gameId: string) {
    try {
        // Get the game to check for icon
        const game = await prisma.game.findUnique({
            where: { id: gameId }
        });

        // Check if game has listings
        const listingsCount = await prisma.listing.count({
            where: { gameId }
        });

        if (listingsCount > 0) {
            return { error: `Cannot delete: ${listingsCount} active listings exist for this game` };
        }

        // Delete icon from R2 if it exists
        if (game?.icon && game.icon.includes("cdn.iboosts.gg")) {
            try {
                const { deleteFromR2 } = await import("@/lib/r2");
                const key = game.icon.split("cdn.iboosts.gg/")[1];
                if (key) await deleteFromR2(key);
            } catch (e) {
                console.error("Error deleting game icon:", e);
            }
        }

        // Delete banner from R2 if it exists
        if (game?.banner && game.banner.includes("cdn.iboosts.gg")) {
            try {
                const { deleteFromR2 } = await import("@/lib/r2");
                const key = game.banner.split("cdn.iboosts.gg/")[1];
                if (key) await deleteFromR2(key);
            } catch (e) {
                console.error("Error deleting game banner:", e);
            }
        }

        await prisma.game.delete({
            where: { id: gameId }
        });

        revalidateTag("navbar-data", {});
        revalidatePath("/admin/cms");
        revalidatePath("/");
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting game:", error);
        return { error: error.message };
    }
}

export async function uploadGameIcon(formData: FormData) {
    try {
        const file = formData.get("file") as File;
        const gameId = formData.get("gameId") as string;

        if (!file || file.size === 0) {
            return { error: "No file provided" };
        }

        // Validate file type
        const allowedTypes = ["image/png", "image/jpeg", "image/webp", "image/gif"];
        if (!allowedTypes.includes(file.type)) {
            return { error: "Invalid file type. Only PNG, JPG, WebP, GIF allowed." };
        }

        // Max 2MB
        if (file.size > 2 * 1024 * 1024) {
            return { error: "File too large. Max 2MB." };
        }

        // Get current game to delete old icon
        const currentGame = gameId ? await prisma.game.findUnique({
            where: { id: gameId },
            select: { icon: true }
        }) : null;

        // Delete old icon from R2 if exists
        if (currentGame?.icon && currentGame.icon.includes("cdn.iboosts.gg")) {
            try {
                const { deleteFromR2 } = await import("@/lib/r2");
                const oldKey = currentGame.icon.split("cdn.iboosts.gg/")[1];
                if (oldKey) await deleteFromR2(oldKey);
            } catch (e) {
                console.error("Error deleting old game icon:", e);
            }
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate unique filename
        const ext = file.name.split(".").pop() || "png";
        const timestamp = Date.now();
        const fileName = `games/${gameId || "temp"}-${timestamp}.${ext}`;

        // Upload to R2
        const { uploadToR2 } = await import("@/lib/r2");
        const publicUrl = await uploadToR2(buffer, fileName, file.type);

        // If gameId provided, update the game
        if (gameId) {
            await prisma.game.update({
                where: { id: gameId },
                data: { icon: publicUrl }
            });
            revalidateTag("navbar-data", {});
            revalidatePath("/admin/cms");
            revalidatePath("/");
        }

        return { success: true, url: publicUrl };
    } catch (error: any) {
        console.error("Error uploading game icon:", error);
        return { error: error.message };
    }
}

export async function uploadGameBanner(formData: FormData) {
    try {
        const file = formData.get("file") as File;
        const gameId = formData.get("gameId") as string;

        if (!file || file.size === 0) {
            return { error: "No file provided" };
        }

        // Validate file type
        const allowedTypes = ["image/png", "image/jpeg", "image/webp", "image/gif"];
        if (!allowedTypes.includes(file.type)) {
            return { error: "Invalid file type. Only PNG, JPG, WebP, GIF allowed." };
        }

        // Max 5MB for banners
        if (file.size > 5 * 1024 * 1024) {
            return { error: "File too large. Max 5MB." };
        }

        // Get current game to delete old banner
        const currentGame = gameId ? await prisma.game.findUnique({
            where: { id: gameId },
            select: { banner: true }
        }) : null;

        // Delete old banner from R2 if exists
        if (currentGame?.banner && currentGame.banner.includes("cdn.iboosts.gg")) {
            try {
                const { deleteFromR2 } = await import("@/lib/r2");
                const oldKey = currentGame.banner.split("cdn.iboosts.gg/")[1];
                if (oldKey) await deleteFromR2(oldKey);
            } catch (e) {
                console.error("Error deleting old game banner:", e);
            }
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate unique filename
        const ext = file.name.split(".").pop() || "png";
        const timestamp = Date.now();
        const fileName = `banners/${gameId || "temp"}-${timestamp}.${ext}`;

        // Upload to R2
        const { uploadToR2 } = await import("@/lib/r2");
        const publicUrl = await uploadToR2(buffer, fileName, file.type);

        // If gameId provided, update the game
        if (gameId) {
            await prisma.game.update({
                where: { id: gameId },
                data: { banner: publicUrl }
            });
            revalidateTag("navbar-data", {});
            revalidatePath("/admin/cms");
            revalidatePath("/");
        }

        return { success: true, url: publicUrl };
    } catch (error: any) {
        console.error("Error uploading game banner:", error);
        return { error: error.message };
    }
}

// Fetch games with categories for navbar (server-side)
export async function fetchGamesForNavbar() {
    const { unstable_cache } = await import("next/cache");

    return await unstable_cache(
        async () => {
            console.log("Fetching fresh navbar data from database...");
            const categories = await prisma.category.findMany({
                where: { isActive: true },
                orderBy: { sortOrder: "asc" },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    icon: true
                }
            });

            const games = await prisma.game.findMany({
                include: {
                    categories: {
                        select: { id: true, name: true, slug: true }
                    }
                },
                orderBy: [
                    { isPopular: "desc" },
                    { name: "asc" }
                ]
            });

            // Group games by category
            const gamesByCategory: Record<string, { popular: any[]; all: any[] }> = {};

            for (const cat of categories) {
                const categoryGames = games.filter(g =>
                    g.categories.some(c => c.id === cat.id)
                );

                gamesByCategory[cat.name] = {
                    popular: categoryGames.filter(g => g.isPopular).slice(0, 12),
                    all: categoryGames.filter(g => !g.isPopular)
                };
            }

            return { categories, gamesByCategory };
        },
        ["navbar-data"],
        {
            revalidate: 3600, // 1 hour default revalidate
            tags: ["navbar-data"]
        }
    )();
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
                    id: generateId("Game"),
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
                data: { id: generateId("Wallet"), userId, balance: 0, pendingBalance: 0 }
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
                id: generateId("WalletTransaction"),
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
                id: generateId("WalletTransaction"),
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
                id: generateId("AdminLog"),
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
            select: {
                id: true,
                username: true,
                email: true,
                avatar: true,
                role: true,
                status: true,
                kycStatus: true,
                emailVerified: true,
                phoneVerified: true,
                createdAt: true,
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
            take: filters?.limit || 50,
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

export async function seedMarketplaceData() {
    try {
        // 1. Ensure "Currency" category exists
        const currencyCategory = await prisma.category.upsert({
            where: { slug: "currency" },
            update: {},
            create: {
                id: "currency",
                name: "Currency",
                slug: "currency",
                icon: "💰",
                isActive: true,
                sortOrder: 1,
            }
        });

        // 2. Ensure "Roblox" game exists
        const robloxGame = await prisma.game.upsert({
            where: { slug: "roblox" },
            update: {},
            create: {
                id: generateId("Game"),
                name: "Roblox",
                slug: "roblox",
                icon: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Roblox_player_icon_black_2022.svg",
                isActive: true,
                isPopular: true,
                categories: { connect: { id: currencyCategory.id } }
            }
        });

        // 3. Get or create a seller
        let seller = await prisma.user.findFirst({
            where: { role: "SELLER" }
        });

        if (!seller) {
            // Find any user and make them a seller for seeding purposes
            const anyUser = await prisma.user.findFirst();
            if (!anyUser) return { error: "No users found to make a seller" };
            seller = await prisma.user.update({
                where: { id: anyUser.id },
                data: { role: "SELLER", sellerRating: 4.9, totalSales: 1250 }
            });
        }

        // 4. Create some listings
        const seedListings = [
            {
                id: generateId("Listing"),
                title: "Robux - Super Fast Delivery",
                slug: "robux-fast-delivery",
                price: 0.007, // $7 per 1k
                stock: 500000,
                minQuantity: 1000,
                maxQuantity: 50000,
                deliveryTime: 15,
                status: "ACTIVE" as const,
                categoryId: currencyCategory.id,
                gameId: robloxGame.id,
                sellerId: seller.id,
                description: "Cheap and fast Robux. Verified seller with over 1000 successful trades."
            },
            {
                id: generateId("Listing"),
                title: "Robux - Bulk Discount",
                slug: "robux-bulk-discount",
                price: 0.0065, // $6.5 per 1k
                stock: 1000000,
                minQuantity: 10000,
                maxQuantity: 100000,
                deliveryTime: 30,
                status: "ACTIVE" as const,
                categoryId: currencyCategory.id,
                gameId: robloxGame.id,
                sellerId: seller.id,
                description: "Best rates for bulk Robux purchases. Safe and secure transfer methods used."
            }
        ];

        for (const l of seedListings) {
            await prisma.listing.upsert({
                where: { slug: l.slug },
                update: l,
                create: l
            });
        }

        return { success: true };
    } catch (error: any) {
        console.error("Error seeding marketplace data:", error);
        return { error: error.message };
    }
}

// Fetch some games for the recent purchase popup
export async function fetchRecentActivity() {
    const { unstable_cache } = await import("next/cache");

    return await unstable_cache(
        async () => {
            try {
                const games = await prisma.game.findMany({
                    where: { isPopular: true },
                    take: 10,
                    select: {
                        name: true,
                        icon: true
                    }
                });
                return games.filter(g => g.icon !== null);
            } catch (error) {
                console.error("Error fetching recent activity:", error);
                return [];
            }
        },
        ["recent-activity"],
        {
            revalidate: 3600, // Cache for 1 hour
            tags: ["navbar-data"] // Reuse same tag for simplicity in revalidation
        }
    )();
}
