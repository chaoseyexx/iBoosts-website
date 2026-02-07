"use server";

import prisma from "@/lib/prisma/client";
import { createClient } from "@/lib/supabase/server";
import { generateId } from "@/lib/utils/ids";
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

// Helper to format date
function formatDate(date: Date) {
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
}

// Map Prisma Status to UI Status
function mapStatus(status: OrderStatus): "completed" | "cancelled" | "active" | "delivered" {
    switch (status) {
        case "COMPLETED": return "completed";
        case "CANCELLED": return "cancelled";
        case "REFUNDED": return "cancelled";
        case "DELIVERED": return "delivered";
        case "ACTIVE": return "active";
        default: return "active";
    }
}

export async function getOrders(type: 'purchased' | 'sold') {
    try {
        const supabase = await createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser) {
            return { error: "Not authenticated" };
        }

        const profile = await prisma.user.findUnique({
            where: { supabaseId: authUser.id }
        });

        if (!profile) {
            return { error: "User profile not found" };
        }

        const orders = await prisma.order.findMany({
            where: type === 'purchased'
                ? { buyerId: profile.id }
                : { sellerId: profile.id },
            include: {
                listing: {
                    include: {
                        game: true,
                        category: true,
                    }
                },
                buyer: true,
                seller: true,
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return {
            orders: orders.map(order => ({
                id: order.id,
                game: order.listing.game?.name || "Unknown Game",
                productName: order.listing.title,
                type: order.listing.category.name,
                user: type === 'purchased' ? order.seller.username : order.buyer.username,
                date: formatDate(order.createdAt),
                status: mapStatus(order.status),
                quantity: order.quantity,
                price: Number(order.finalAmount),
                discount: Number(order.discount),
                icon: order.listing.game?.icon || "https://i.imgur.com/8N48l8b.png"
            }))
        };
    } catch (error: any) {
        console.error("Error fetching orders:", error);
        return { error: error.message };
    }
}

export async function seedDemoOrders(providedSupabaseId?: string) {
    try {
        let supabaseId = providedSupabaseId;

        if (!supabaseId) {
            const supabase = await createClient();
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) return { error: "Not authenticated" };
            supabaseId = authUser.id;
        }

        const demoUser = await prisma.user.findUnique({
            where: { supabaseId: supabaseId }
        });

        if (!demoUser) return { error: `Demo user (supabaseId: ${supabaseId}) not found in DB` };

        // 1. Ensure counterpart users exist
        const user1 = await prisma.user.upsert({
            where: { email: 'chaoseyex@gmail.com' },
            update: { username: 'ChaoseyeX' },
            create: {
                id: generateId("User"),
                email: 'chaoseyex@gmail.com',
                username: 'ChaoseyeX',
                role: 'SELLER'
            }
        });

        const user2 = await prisma.user.upsert({
            where: { email: 'bouncestacks@gmail.com' },
            update: { username: 'BounceStacks' },
            create: {
                id: generateId("User"),
                email: 'bouncestacks@gmail.com',
                username: 'BounceStacks',
                role: 'BUYER'
            }
        });

        // 2. Get some games/categories to link to
        const games = await prisma.game.findMany({ where: { isActive: true }, take: 3 });
        const categories = await prisma.category.findMany({ where: { isActive: true }, take: 3 });

        if (games.length === 0 || categories.length === 0) {
            return { error: "No games or categories found to create listings" };
        }

        const premiumDescription = `
            <div class="space-y-4">
                <div class="flex items-center gap-2 text-red-500 font-bold uppercase tracking-wider">
                    <span>❗</span> READ BEFORE PURCHASE !
                </div>
                <ul class="space-y-2 text-white/80">
                    <li class="flex items-center gap-2"><span>⭐</span> Face-to-Face Trade Only</li>
                    <li class="flex items-center gap-2"><span>⭐</span> Do not talk in-game about RMT</li>
                    <li class="flex items-center gap-2"><span>⭐</span> Put a rare item in trade window for safety</li>
                </ul>
                <div class="pt-4">
                    <div class="flex items-center gap-2 text-[#f5a623] font-bold uppercase tracking-wider mb-2">
                        <span>🚀</span> How to purchase ?
                    </div>
                    <ol class="space-y-3">
                        <li class="flex gap-3">
                            <span class="flex-shrink-0 w-5 h-5 rounded bg-[#3b82f6] text-white flex items-center justify-center text-[10px] font-bold">1</span>
                            <span class="text-white/80 text-sm">Select the amount you want to buy.</span>
                        </li>
                        <li class="flex gap-3">
                            <span class="flex-shrink-0 w-5 h-5 rounded bg-[#3b82f6] text-white flex items-center justify-center text-[10px] font-bold">2</span>
                            <span class="text-white/80 text-sm">Provide your character name.</span>
                        </li>
                        <li class="flex gap-3">
                            <span class="flex-shrink-0 w-5 h-5 rounded bg-[#3b82f6] text-white flex items-center justify-center text-[10px] font-bold">3</span>
                            <span class="text-white/80 text-sm">We will invite you to a party and trade the currency.</span>
                        </li>
                    </ol>
                </div>
            </div>
        `;

        // 3. Create sample listings
        const listingPurchased = await prisma.listing.create({
            data: {
                id: generateId("Listing"),
                sellerId: user1.id,
                categoryId: categories[0].id,
                gameId: games[0].id,
                title: "Premium Currency Bundle",
                slug: `seed-purchased-${Date.now()}`,
                description: premiumDescription,
                price: 45.00,
                status: "ACTIVE",
                stock: 100
            }
        });

        const listingSold = await prisma.listing.create({
            data: {
                id: generateId("Listing"),
                sellerId: demoUser.id,
                categoryId: categories[1].id,
                gameId: games[1].id,
                title: "Pro Boosting Service",
                slug: `seed-sold-${Date.now()}`,
                description: "Seeded sold order description",
                price: 120.00,
                status: "ACTIVE",
                stock: 1
            }
        });

        // 4. Create Orders
        await prisma.order.create({
            data: {
                id: generateId("Order"),
                orderNumber: `ORD-P-${Math.floor(Math.random() * 100000)}`,
                buyerId: demoUser.id,
                sellerId: user1.id,
                listingId: listingPurchased.id,
                quantity: 1,
                unitPrice: 45.00,
                subtotal: 45.00,
                platformFee: 2.25,
                sellerEarnings: 42.75,
                finalAmount: 45.00,
                status: "COMPLETED",
                paidAt: new Date()
            }
        });

        await prisma.order.create({
            data: {
                id: generateId("Order"),
                orderNumber: `ORD-S-${Math.floor(Math.random() * 100000)}`,
                buyerId: user2.id,
                sellerId: demoUser.id,
                listingId: listingSold.id,
                quantity: 1,
                unitPrice: 120.00,
                subtotal: 120.00,
                platformFee: 6.00,
                sellerEarnings: 114.00,
                finalAmount: 120.00,
                status: "ACTIVE",
                paidAt: new Date()
            }
        });

        revalidatePath("/dashboard/orders");
        return { success: true };
    } catch (error: any) {
        console.error("Error seeding orders:", error);
        return { error: error.message };
    }
}

export async function getOrderDetails(orderId: string) {
    try {
        const supabase = await createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser) return { error: "Not authenticated" };

        const profile = await prisma.user.findUnique({
            where: { supabaseId: authUser.id }
        });

        if (!profile) return { error: "User profile not found" };

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                listing: {
                    include: {
                        game: true,
                        category: true,
                    }
                },
                buyer: true,
                seller: true,
                messages: {
                    include: {
                        sender: true
                    },
                    orderBy: {
                        createdAt: "asc"
                    }
                },
                timeline: {
                    orderBy: {
                        createdAt: "desc"
                    }
                },
                review: true
            }
        });

        if (!order) return { error: "Order not found" };

        // Permission check: Is buyer, seller, or admin?
        const isAdmin = profile.role === 'ADMIN';
        const isBuyer = order.buyerId === profile.id;
        const isSeller = order.sellerId === profile.id;

        if (!isAdmin && !isBuyer && !isSeller) {
            return { error: "Unauthorized access to order details" };
        }

        return {
            order: {
                ...order,
                unitPrice: Number(order.unitPrice),
                subtotal: Number(order.subtotal),
                platformFee: Number(order.platformFee),
                sellerEarnings: Number(order.sellerEarnings),
                discount: Number(order.discount),
                finalAmount: Number(order.finalAmount),
                listing: {
                    ...order.listing,
                    price: Number(order.listing.price),
                    originalPrice: order.listing.originalPrice ? Number(order.listing.originalPrice) : null,
                }
            },
            viewer: {
                id: profile.id,
                role: isAdmin ? 'ADMIN' : (isBuyer ? 'BUYER' : 'SELLER'),
                username: profile.username
            }
        };
    } catch (error: any) {
        console.error("Error fetching order details:", error);
        return { error: error.message };
    }
}

export async function sendOrderMessage(orderId: string, content: string) {
    try {
        const supabase = await createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser) return { error: "Not authenticated" };

        const profile = await prisma.user.findUnique({
            where: { supabaseId: authUser.id }
        });

        if (!profile) return { error: "User profile not found" };

        const message = await prisma.orderMessage.create({
            data: {
                id: generateId("OrderMessage"),
                orderId,
                senderId: profile.id,
                content
            },
            include: {
                sender: true
            }
        });

        return { message };
    } catch (error: any) {
        console.error("Error sending message:", error);
        return { error: error.message };
    }
}

export async function confirmOrder(orderId: string) {
    try {
        const supabase = await createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser) return { error: "Not authenticated" };

        const profile = await prisma.user.findUnique({
            where: { supabaseId: authUser.id }
        });

        if (!profile) return { error: "User profile not found" };

        const order = await prisma.order.findUnique({ where: { id: orderId } });
        if (!order) return { error: "Order not found" };

        if (order.buyerId !== profile.id && profile.role !== 'ADMIN') {
            return { error: "Only the buyer can confirm the order" };
        }

        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: {
                status: "COMPLETED",
                completedAt: new Date()
            }
        });

        await prisma.orderTimeline.create({
            data: {
                id: generateId("OrderTimeline"),
                orderId,
                event: "ORDER_COMPLETED",
                description: `Order confirmed by ${profile.username}`
            }
        });

        revalidatePath(`/dashboard/orders/${orderId}`);
        return { success: true };
    } catch (error: any) {
        console.error("Error confirming order:", error);
        return { error: error.message };
    }
}

export async function submitReview(orderId: string, rating: number, content: string) {
    try {
        const supabase = await createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser) return { error: "Not authenticated" };

        const profile = await prisma.user.findUnique({
            where: { supabaseId: authUser.id }
        });

        if (!profile) return { error: "User profile not found" };

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { review: true }
        });

        if (!order) return { error: "Order not found" };
        if (order.buyerId !== profile.id) return { error: "Only buyers can leave reviews" };
        if (order.status !== 'COMPLETED') return { error: "Orders must be completed before reviewing" };
        if (order.review) return { error: "Review already submitted" };

        const review = await prisma.review.create({
            data: {
                id: generateId("Review"),
                orderId,
                listingId: order.listingId,
                authorId: profile.id,
                targetId: order.sellerId,
                rating,
                content
            }
        });

        // Update seller rating
        const allReviews = await prisma.review.findMany({
            where: { targetId: order.sellerId }
        });

        const avgRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length;

        await prisma.user.update({
            where: { id: order.sellerId },
            data: {
                sellerRating: avgRating,
                totalReviews: allReviews.length
            }
        });

        revalidatePath(`/dashboard/orders/${orderId}`);
        return { success: true };
    } catch (error: any) {
        console.error("Error submitting review:", error);
        return { error: error.message };
    }
}
