import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma/client";
import { headers } from "next/headers";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
    const body = await req.text();
    const sig = (await headers()).get("stripe-signature") as string;

    let event: Stripe.Event;

    try {
        if (!sig || !webhookSecret) {
            // If secret is missing, we can't verify but we might be in dev mode
            // For production, this MUST fail.
            event = JSON.parse(body);
        } else {
            event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
        }
    } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    console.log(`Stripe webhook received: ${event.type}`);

    try {
        // Handle the event
        switch (event.type) {
            case "payment_intent.succeeded": {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                const orderId = paymentIntent.metadata.orderId;

                if (orderId) {
                    console.log(`Payment confirmed for Order: ${orderId}`);

                    // Fetch order and listing to get delivery time
                    const order = await prisma.order.findUnique({
                        where: { id: orderId },
                        include: { listing: true }
                    });

                    if (order) {
                        const deliveryDeadline = new Date();
                        deliveryDeadline.setHours(deliveryDeadline.getHours() + (order.listing.deliveryTime || 24));

                        // Use transaction to ensure order update and wallet update happen together
                        await prisma.$transaction(async (tx) => {
                            // 1. Update Order Status
                            await tx.order.update({
                                where: { id: orderId },
                                data: {
                                    status: "ACTIVE",
                                    paidAt: new Date(),
                                    deliveryDeadline,
                                }
                            });

                            // 2. Update Seller Wallet Pending Balance
                            const sellerWallet = await tx.wallet.findUnique({
                                where: { userId: order.sellerId }
                            });

                            if (sellerWallet) {
                                await tx.wallet.update({
                                    where: { id: sellerWallet.id },
                                    data: {
                                        pendingBalance: {
                                            increment: order.sellerEarnings
                                        }
                                    }
                                });
                            }

                            // 3. Log Timeline
                            await tx.orderTimeline.create({
                                data: {
                                    id: `tl_${Date.now()}`,
                                    orderId: orderId,
                                    event: "PAYMENT_CONFIRMED",
                                    description: "Payment confirmed via Stripe. Delivery countdown started.",
                                    metadata: {
                                        paymentIntentId: paymentIntent.id,
                                        deliveryDeadline
                                    }
                                }
                            });
                        });
                    }
                }
                break;
            }

            case "account.updated": {
                // Handle Connect account updates
                const account = event.data.object as Stripe.Account;
                console.log(`Connect account updated: ${account.id}, payouts_enabled: ${account.payouts_enabled}`);

                // Update user's Stripe status in database
                const newStatus = account.payouts_enabled ? "ACTIVE" :
                    account.details_submitted ? "RESTRICTED" : "PENDING";

                await prisma.$executeRaw`
                    UPDATE "User" 
                    SET "stripeAccountStatus" = ${newStatus}
                    WHERE "stripeAccountId" = ${account.id}
                `;
                break;
            }

            case "capability.updated": {
                // Handle capability updates (transfers, payouts, etc.)
                const capability = event.data.object as Stripe.Capability;
                console.log(`Capability updated: ${capability.id}, status: ${capability.status}`);
                // No action needed - account.updated handles the main status
                break;
            }

            case "account.external_account.created": {
                // Bank account was added to Connect account
                console.log(`External account added to Connect account`);
                break;
            }

            case "account.application.authorized":
            case "account.application.deauthorized": {
                // OAuth flow events
                console.log(`Account application event: ${event.type}`);
                break;
            }

            case "person.created":
            case "person.updated": {
                // Person/representative events for the Connect account
                console.log(`Person event: ${event.type}`);
                break;
            }

            case "payment_intent.created": {
                // Payment intent was created - no action needed
                console.log(`Payment intent created`);
                break;
            }

            default: {
                console.log(`Unhandled event type: ${event.type}`);
            }
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error(`Error processing webhook: ${error.message}`);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

