import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma/client";
import { stripe } from "@/lib/stripe";
import { generateId } from "@/lib/utils/ids";
import { calculateOrderTotal } from "@/lib/utils/fees";
import { getDynamicFees } from "@/lib/utils/dynamic-fees";

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { listingId, quantity, paymentMethod = "card", isShieldActive = false } = await request.json();
        console.log("Order Creation Request:", { listingId, quantity, userId: user.id, paymentMethod, isShieldActive });

        if (!listingId || !quantity || quantity <= 0) {
            const missing = [];
            if (!listingId) missing.push("listingId");
            if (!quantity) missing.push("quantity");
            if (quantity <= 0) missing.push("quantity <= 0");

            return NextResponse.json({
                error: `Invalid parameters: missing ${missing.join(", ")}`,
                received: { listingId, quantity }
            }, { status: 400 });
        }

        // Resolve DB user
        const dbUser = await (prisma.user as any).findUnique({
            where: { supabaseId: user.id }
        });

        if (!dbUser) {
            return NextResponse.json({ error: "User profile not found" }, { status: 404 });
        }

        // 1. Fetch Listing and Seller Info
        const listing = await prisma.listing.findUnique({
            where: { id: listingId },
            include: { seller: true }
        });

        if (!listing) {
            return NextResponse.json({ error: "Listing not found" }, { status: 404 });
        }

        // PREVENT SELF-PURCHASE
        if (listing.sellerId === dbUser.id) {
            return NextResponse.json({ error: "You cannot purchase your own listing" }, { status: 400 });
        }

        if (listing.stock < quantity) {
            return NextResponse.json({ error: "Insufficient stock" }, { status: 400 });
        }

        // 2. Calculate Fees and Totals
        const unitPrice = Number(listing.price);
        const subtotal = unitPrice * quantity;

        // Security check: Only apply iShield discount if the user is actually iShield active in DB
        const effectiveShield = (isShieldActive && dbUser.isShieldActive) ? true : false;

        // Fetch Dynamic Fees
        const dynamicFees = await getDynamicFees();
        const { total, serviceFee, discount } = calculateOrderTotal(subtotal, effectiveShield, dynamicFees);

        // 3. Create PENDING Order
        const orderId = generateId("Order");
        const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

        // Seller Earnings (Listing Price - Dynamic Commission)
        const sellerEarnings = subtotal * (1 - dynamicFees.SELLER_COMMISSION_PERCENT);

        // --- HYBRID PAYMENT LOGIC START ---

        // Fetch User Wallet
        let wallet = await prisma.wallet.findUnique({ where: { userId: dbUser.id } });
        if (!wallet) {
            wallet = await prisma.wallet.create({ data: { id: generateId("Wallet"), userId: dbUser.id } });
        }

        const walletBalance = Number(wallet.balance);
        let walletUsed = 0;
        let stripeAmount = total;

        // Calculate Split
        if (walletBalance > 0) {
            walletUsed = Math.min(walletBalance, total);
            stripeAmount = total - walletUsed;
            // Round to 2 decimal places to avoid floating point issues
            walletUsed = Math.round(walletUsed * 100) / 100;
            stripeAmount = Math.round(stripeAmount * 100) / 100;
        }

        // Prepare Database Transaction operations
        // We need to coordinate: Wallet Update (Buyer), Order Creation, Wallet Update (Seller - if fully paid), Timeline

        let clientSecret = null;
        let stripePaymentIntentId = null;
        let orderStatus = "PENDING";
        let paidAt = null;

        // Case A: Fully Paid by Wallet
        if (stripeAmount <= 0) {
            orderStatus = "ACTIVE";
            paidAt = new Date();
        }

        // Begin Transaction for Order Creation + Wallet Deduction
        await prisma.$transaction(async (tx) => {
            // 1. Deduct Buyer Wallet (if used)
            if (walletUsed > 0) {
                await tx.wallet.update({
                    where: { id: wallet!.id },
                    data: { balance: { decrement: walletUsed } }
                });

                await tx.walletTransaction.create({
                    data: {
                        id: generateId("WalletTransaction"),
                        walletId: wallet!.id,
                        type: "PURCHASE",
                        amount: -walletUsed,
                        balanceBefore: walletBalance,
                        balanceAfter: walletBalance - walletUsed,
                        description: `Payment for Order #${orderNumber}`,
                        reference: orderId,
                        metadata: { orderId, listingId }
                    }
                });
            }

            // 2. Create Order
            await tx.order.create({
                data: {
                    id: orderId,
                    orderNumber,
                    buyerId: dbUser.id,
                    sellerId: listing.sellerId,
                    listingId: listing.id,
                    quantity,
                    unitPrice: listing.price,
                    subtotal: subtotal,
                    platformFee: serviceFee + (subtotal * dynamicFees.SELLER_COMMISSION_PERCENT),
                    sellerEarnings: sellerEarnings,
                    discount: discount || 0,
                    finalAmount: total,
                    status: orderStatus as any,
                    escrowStatus: orderStatus === "ACTIVE" ? "HELD" : "PENDING",
                    paidAt: paidAt,
                    deliveryDeadline: orderStatus === "ACTIVE" ? new Date(Date.now() + (listing.deliveryTime * 3600000)) : null
                }
            });

            // 3. If Fully Paid (Active), Credit Seller Pending Instantly
            if (orderStatus === "ACTIVE") {
                const sellerWallet = await tx.wallet.findUnique({ where: { userId: listing.sellerId } });
                if (sellerWallet) {
                    await tx.wallet.update({
                        where: { id: sellerWallet.id },
                        data: { pendingBalance: { increment: sellerEarnings } }
                    });
                }
                // Note: Webhook usually handles this, but since we skip Stripe, we must do it here.
            }

            // 4. Log Timeline
            await tx.orderTimeline.create({
                data: {
                    id: generateId("OrderTimeline"),
                    orderId: orderId,
                    event: "ORDER_CREATED",
                    description: `Order created. Wallet used: $${walletUsed}. Stripe charge: $${stripeAmount}.`,
                    metadata: { walletUsed, stripeAmount }
                }
            });

            // 5. Notify Seller
            await tx.notification.create({
                data: {
                    id: generateId("Notification"),
                    userId: listing.sellerId,
                    type: "ORDER_NEW",
                    title: "New Order Received",
                    content: `You received a new order for "${listing.title}"`,
                    link: `/dashboard/orders/${orderNumber}`,
                    metadata: { orderId, orderNumber, listingId: listing.id }
                }
            });
        });

        // Case B: Remaining Amount via Stripe
        if (stripeAmount > 0) {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(stripeAmount * 100),
                currency: "usd",
                description: `Order ${orderNumber} - ${listing.title} (Partial)`,
                metadata: {
                    type: "ORDER_PAYMENT",
                    orderId: orderId,
                    orderNumber: orderNumber,
                    buyerId: dbUser.id,
                    buyerUsername: dbUser.username,
                    sellerId: listing.sellerId,
                    sellerUsername: listing.seller.username,
                    listingId: listing.id,
                    walletUsed: walletUsed.toString()
                }
            });
            clientSecret = paymentIntent.client_secret;
            stripePaymentIntentId = paymentIntent.id;

            // Update Order with PI ID
            await prisma.order.update({
                where: { id: orderId },
                data: { stripePaymentIntentId }
            });
        }

        return NextResponse.json({
            orderId: orderId,
            clientSecret,
            total: total,
            walletUsed: walletUsed,
            stripeAmount: stripeAmount,
            status: orderStatus
        });

    } catch (error: any) {
        console.error("Order Creation Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
