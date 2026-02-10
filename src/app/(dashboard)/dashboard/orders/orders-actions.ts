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
                orderNumber: order.orderNumber,
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



export async function getOrderDetails(orderId: string) {
    try {
        const supabase = await createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser) return { error: "Not authenticated" };

        const profile = await prisma.user.findUnique({
            where: { supabaseId: authUser.id }
        });

        if (!profile) return { error: "User profile not found" };

        // Try finding by orderNumber first (public ID), then fall back to internal ID
        let order = await prisma.order.findUnique({
            where: { orderNumber: orderId },
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

export async function sendOrderMessage(orderIdentifier: string, content: string) {
    try {
        const supabase = await createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser) return { error: "Not authenticated" };

        const profile = await prisma.user.findUnique({
            where: { supabaseId: authUser.id }
        });

        if (!profile) return { error: "User profile not found" };

        // Try orderNumber first, then fall back to id
        let order = await prisma.order.findUnique({ where: { orderNumber: orderIdentifier } });
        if (!order) {
            order = await prisma.order.findUnique({ where: { id: orderIdentifier } });
        }
        if (!order) return { error: "Order not found" };

        const message = await prisma.orderMessage.create({
            data: {
                id: generateId("OrderMessage"),
                orderId: order.id,
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

export async function confirmOrder(orderIdentifier: string) {
    try {
        const supabase = await createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser) return { error: "Not authenticated" };

        const profile = await prisma.user.findUnique({
            where: { supabaseId: authUser.id }
        });

        if (!profile) return { error: "User profile not found" };

        // Try orderNumber first, then fall back to id
        let order = await prisma.order.findUnique({ where: { orderNumber: orderIdentifier } });
        if (!order) {
            order = await prisma.order.findUnique({ where: { id: orderIdentifier } });
        }
        if (!order) return { error: "Order not found" };

        if (order.buyerId !== profile.id && profile.role !== 'ADMIN') {
            return { error: "Only the buyer can confirm the order" };
        }

        if (order.status !== 'ACTIVE' && order.status !== 'DELIVERED') {
            return { error: `Cannot confirm order with status: ${order.status}` };
        }

        // Use a transaction to update order and wallet
        await prisma.$transaction(async (tx) => {
            // 1. Update order status
            await tx.order.update({
                where: { id: order.id },
                data: {
                    status: "COMPLETED",
                    completedAt: new Date(),
                    escrowStatus: "RELEASED"
                }
            });

            // 2. Update Seller Wallet (Decrease Pending, Increase Available)
            const sellerWallet = await tx.wallet.findUnique({
                where: { userId: order.sellerId }
            });

            if (sellerWallet) {
                const amount = Number(order.sellerEarnings);

                await tx.wallet.update({
                    where: { id: sellerWallet.id },
                    data: {
                        pendingBalance: { decrement: amount },
                        balance: { increment: amount }
                    }
                });

                // 3. Create Wallet Transaction Record
                await tx.walletTransaction.create({
                    data: {
                        id: generateId("WalletTransaction"),
                        walletId: sellerWallet.id,
                        type: "SALE",
                        amount: amount,
                        balanceBefore: Number(sellerWallet.balance),
                        balanceAfter: Number(sellerWallet.balance) + amount,
                        description: `Earnings from order #${order.orderNumber}`,
                        reference: order.id
                    }
                });
            }

            // 4. Log Timeline
            await tx.orderTimeline.create({
                data: {
                    id: generateId("OrderTimeline"),
                    orderId: order.id,
                    event: "ORDER_COMPLETED",
                    description: `Order confirmed by ${profile.username}. Funds released to seller.`
                }
            });
        });

        revalidatePath(`/dashboard/orders/${order.orderNumber}`);
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

        let review;
        if (order.review) {
            // Update existing review
            review = await prisma.review.update({
                where: { id: order.review.id },
                data: { rating, content }
            });

            // Add to timeline
            await prisma.orderTimeline.create({
                data: {
                    id: generateId("OrderTimeline"),
                    orderId: order.id,
                    event: "REVIEW_UPDATED",
                    description: `Feedback updated: ${rating} Stars - "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"`
                }
            });
        } else {
            // Create new review
            review = await prisma.review.create({
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

            // Add to timeline
            await prisma.orderTimeline.create({
                data: {
                    id: generateId("OrderTimeline"),
                    orderId: order.id,
                    event: "REVIEW_SUBMITTED",
                    description: `Feedback released: ${rating} Stars - "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"`
                }
            });
        }

        // Update seller rating
        const allReviews = await prisma.review.findMany({
            where: { targetId: order.sellerId }
        });

        const totalRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0);
        const avgRating = allReviews.length > 0 ? totalRating / allReviews.length : 5.0;

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

export async function submitReport(orderId: string, reason: string, description: string) {
    try {
        const supabase = await createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser) return { error: "Not authenticated" };

        const profile = await prisma.user.findUnique({
            where: { supabaseId: authUser.id }
        });

        if (!profile) return { error: "User profile not found" };

        const order = await prisma.order.findUnique({
            where: { id: orderId }
        });

        if (!order) return { error: "Order not found" };

        const targetUserId = profile.id === order.buyerId ? order.sellerId : order.buyerId;

        await prisma.report.create({
            data: {
                id: generateId("Report"),
                type: "ORDER",
                reporterId: profile.id,
                targetUserId: targetUserId,
                targetId: order.id,
                reason,
                description,
                status: "PENDING"
            }
        });

        // Add to timeline
        await prisma.orderTimeline.create({
            data: {
                id: generateId("OrderTimeline"),
                orderId: order.id,
                event: "ORDER_REPORTED",
                description: `Issue reported by ${profile.username}: ${reason}`
            }
        });

        return { success: true };
    } catch (error: any) {
        console.error("Error submitting report:", error);
        return { error: error.message };
    }
}

export async function getSellerFeedback() {
    try {
        const supabase = await createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser) return { error: "Not authenticated" };

        const profile = await prisma.user.findUnique({
            where: { supabaseId: authUser.id }
        });

        if (!profile) return { error: "User profile not found" };

        const reviews = await prisma.review.findMany({
            where: { targetId: profile.id },
            include: {
                author: true,
                order: {
                    include: {
                        listing: {
                            include: {
                                category: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        const completedOrdersCount = await prisma.order.count({
            where: {
                sellerId: profile.id,
                status: 'COMPLETED'
            }
        });

        const starCounts = {
            5: reviews.filter(r => r.rating === 5).length,
            4: reviews.filter(r => r.rating === 4).length,
            3: reviews.filter(r => r.rating === 3).length,
            2: reviews.filter(r => r.rating === 2).length,
            1: reviews.filter(r => r.rating === 1).length,
        };

        const averageRating = reviews.length > 0
            ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
            : "5.0";

        return {
            reviews: reviews.map(r => ({
                id: r.id,
                type: r.order.listing.category.name,
                user: r.author.username,
                comment: r.content,
                rating: r.rating,
                date: r.createdAt.toISOString(),
            })),
            stats: {
                completedOrders: completedOrdersCount,
                totalReviews: reviews.length,
                averageRating,
                starCounts
            }
        };
    } catch (error: any) {
        console.error("Error fetching feedback:", error);
        return { error: error.message };
    }
}

export async function markAsDelivered(orderId: string) {
    try {
        const supabase = await createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) return { error: "Not authenticated" };

        const profile = await prisma.user.findUnique({ where: { supabaseId: authUser.id } });
        if (!profile) return { error: "User profile not found" };

        const order = await prisma.order.findUnique({ where: { id: orderId } });
        if (!order) return { error: "Order not found" };

        if (order.sellerId !== profile.id && profile.role !== 'ADMIN') {
            return { error: "Only the seller can mark as delivered" };
        }

        if (order.status !== 'ACTIVE') {
            return { error: `Cannot mark as delivered. Order status is ${order.status}` };
        }

        await prisma.order.update({
            where: { id: order.id },
            data: {
                status: "DELIVERED",
                deliveredAt: new Date()
            }
        });

        await prisma.orderTimeline.create({
            data: {
                id: generateId("OrderTimeline"),
                orderId: order.id,
                event: "ORDER_DELIVERED",
                description: `Seller marked order as delivered. Buyer confirmation pending.`
            }
        });

        revalidatePath(`/dashboard/orders/${order.orderNumber}`);
        return { success: true };
    } catch (error: any) {
        console.error("Error marking as delivered:", error);
        return { error: error.message };
    }
}

export async function cancelOrder(orderId: string, reason: string) {
    try {
        const supabase = await createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) return { error: "Not authenticated" };

        const profile = await prisma.user.findUnique({ where: { supabaseId: authUser.id } });
        if (!profile) return { error: "User profile not found" };

        const order = await prisma.order.findUnique({ where: { id: orderId } });
        if (!order) return { error: "Order not found" };

        const isSeller = order.sellerId === profile.id;
        const isAdmin = profile.role === 'ADMIN';

        // Permissions: Seller or Admin can cancel
        if (!isSeller && !isAdmin) {
            return { error: "Unauthorized access" };
        }

        // Validate Status: Cannot cancel COMPLETED orders
        if (order.status === 'COMPLETED' || order.status === 'CANCELLED' || order.status === 'DISPUTED') {
            return { error: `Cannot cancel order with status: ${order.status}` };
        }

        // Refund Logic (Wallet Only)
        // If order was PAID (ACTIVE or DELIVERED), we must refund the buyer and debit the seller pending
        const shouldRefund = order.status === 'ACTIVE' || order.status === 'DELIVERED';

        await prisma.$transaction(async (tx) => {
            // 1. Refund Buyer (Credit Wallet)
            if (shouldRefund) {
                const refundAmount = Number(order.finalAmount);
                const buyerWallet = await tx.wallet.findUnique({ where: { userId: order.buyerId } });

                // If buyer has no wallet, create one (shouldn't happen if they paid, but safety check)
                let walletId = buyerWallet?.id;
                if (!buyerWallet) {
                    const newWallet = await tx.wallet.create({
                        data: { id: generateId("Wallet"), userId: order.buyerId }
                    });
                    walletId = newWallet.id;
                }

                // Credit Buyer
                await tx.wallet.update({
                    where: { id: walletId },
                    data: { balance: { increment: refundAmount } }
                });

                // Log Refund Transaction
                await tx.walletTransaction.create({
                    data: {
                        id: generateId("WalletTransaction"),
                        walletId: walletId!,
                        type: "REFUND",
                        amount: refundAmount,
                        balanceBefore: buyerWallet ? Number(buyerWallet.balance) : 0,
                        balanceAfter: (buyerWallet ? Number(buyerWallet.balance) : 0) + refundAmount,
                        description: `Refund for Order #${order.orderNumber}`,
                        reference: order.id
                    }
                });

                // 2. Debit Seller (Revert Pending)
                // Note: We only revert pending. If order was Active, money is in Pending.
                // If seller somehow already withdrew (impossible if not Completed), we'd have an issue.
                // But status check prevents cancellation of Completed.
                const sellerWallet = await tx.wallet.findUnique({ where: { userId: order.sellerId } });
                if (sellerWallet) {
                    const earnings = Number(order.sellerEarnings);
                    await tx.wallet.update({
                        where: { id: sellerWallet.id },
                        data: { pendingBalance: { decrement: earnings } }
                    });
                    // Note: We don't log a Transaction for pending reversal usually, but we could.
                }
            }

            // 3. Update Order Status
            await tx.order.update({
                where: { id: order.id },
                data: {
                    status: "CANCELLED",
                    cancelledAt: new Date(),
                    cancelReason: reason
                }
            });

            // 4. Log Timeline
            await tx.orderTimeline.create({
                data: {
                    id: generateId("OrderTimeline"),
                    orderId: order.id,
                    event: "ORDER_CANCELLED",
                    description: `Order cancelled by ${profile.username}. Reason: ${reason}. Refunded to Wallet.`
                }
            });
        });

        revalidatePath(`/dashboard/orders/${order.orderNumber}`);
        return { success: true };
    } catch (error: any) {
        console.error("Error cancelling order:", error);
        return { error: error.message };
    }
}

export async function openDispute(orderId: string, reason: string, description: string) {
    try {
        const supabase = await createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) return { error: "Not authenticated" };

        const profile = await prisma.user.findUnique({ where: { supabaseId: authUser.id } });
        if (!profile) return { error: "User profile not found" };

        const order = await prisma.order.findUnique({ where: { id: orderId } });
        if (!order) return { error: "Order not found" };

        if (order.buyerId !== profile.id && profile.role !== 'ADMIN') {
            return { error: "Only the buyer can open a dispute" };
        }

        await prisma.$transaction([
            prisma.order.update({
                where: { id: order.id },
                data: { status: "DISPUTED" }
            }),
            prisma.dispute.create({
                data: {
                    id: generateId("Dispute"),
                    orderId: order.id,
                    buyerId: order.buyerId,
                    sellerId: order.sellerId,
                    initiatedBy: profile.id,
                    reason,
                    description,
                    status: "OPEN"
                }
            }),
            prisma.orderTimeline.create({
                data: {
                    id: generateId("OrderTimeline"),
                    orderId: order.id,
                    event: "ORDER_DISPUTED",
                    description: `Dispute opened by ${profile.username}: ${reason}`
                }
            })
        ]);

        revalidatePath(`/dashboard/orders/${order.orderNumber}`);
        return { success: true };
    } catch (error: any) {
        console.error("Error opening dispute:", error);
        return { error: error.message };
    }
}
