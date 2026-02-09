import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma/client";
import { stripe } from "@/lib/stripe";
import { generateId } from "@/lib/utils/ids";
import { calculateOrderTotal } from "@/lib/utils/fees";

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

        const { total, serviceFee, discount } = calculateOrderTotal(subtotal, effectiveShield);

        // 3. Create PENDING Order
        const orderId = generateId("Order");
        const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

        // Seller Earnings (Listing Price - 10% commission)
        const sellerEarnings = subtotal * 0.9;

        const order = await prisma.order.create({
            data: {
                id: orderId,
                orderNumber,
                buyerId: dbUser.id,
                sellerId: listing.sellerId,
                listingId: listing.id,
                quantity,
                unitPrice: listing.price,
                subtotal: subtotal,
                platformFee: serviceFee + (subtotal * 0.1), // Buyer fee + Seller commission
                sellerEarnings: sellerEarnings,
                discount: discount || 0,
                finalAmount: total,
                status: "PENDING",
                escrowStatus: "PENDING",
            }
        });

        // 4. Handle Payment Method
        let clientSecret = null;
        let stripePaymentIntentId = null;

        if (paymentMethod === "card") {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(total * 100),
                currency: "usd",
                description: `Order ${orderNumber} - ${listing.title}`,
                metadata: {
                    type: "ORDER_PAYMENT",
                    orderId: order.id,
                    orderNumber: order.orderNumber,
                    buyerId: dbUser.id,
                    buyerUsername: dbUser.username,
                    sellerId: listing.sellerId,
                    sellerUsername: listing.seller.username,
                    listingId: listing.id,
                    productName: listing.title
                }
            });
            clientSecret = paymentIntent.client_secret;
            stripePaymentIntentId = paymentIntent.id;

            // 5. Update Order with Payment Intent ID
            await prisma.order.update({
                where: { id: order.id },
                data: { stripePaymentIntentId }
            });
        }

        // Log Order Creation in Timeline
        await prisma.orderTimeline.create({
            data: {
                id: generateId("OrderTimeline"),
                orderId: order.id,
                event: "ORDER_CREATED",
                description: `Order created via ${paymentMethod.toUpperCase()}`,
                metadata: { paymentMethod }
            }
        });

        // Notify Seller about the new order
        await prisma.notification.create({
            data: {
                id: generateId("Notification"),
                userId: listing.sellerId,
                type: "ORDER_NEW",
                title: "New Order Received",
                content: `You received a new order for "${listing.title}"`,
                link: `/dashboard/orders/${order.orderNumber}`,
                metadata: { orderId: order.id, orderNumber: order.orderNumber, listingId: listing.id }
            }
        });

        return NextResponse.json({
            orderId: order.id,
            clientSecret,
            total: total,
            subtotal: subtotal,
            fee: serviceFee
        });

    } catch (error: any) {
        console.error("Order Creation Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
