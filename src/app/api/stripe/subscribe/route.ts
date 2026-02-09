
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { stripe } from "@/lib/stripe"; // Assuming this is where stripe client is exported
import prisma from "@/lib/prisma/client";

// These should ideally be in environment variables or fetched from Stripe
// For now, we'll create them on the fly if needed or assume they exist.
// Better practice: Use price IDs from your Stripe Dashboard in .env
const STRIPE_PRICE_ID_MONTHLY = process.env.STRIPE_PRICE_ID_ISHIELD_MONTHLY || "price_ishield_monthly";
const STRIPE_PRICE_ID_YEARLY = process.env.STRIPE_PRICE_ID_ISHIELD_YEARLY || "price_ishield_yearly";

export async function POST(req: Request) {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // Auth check
        const authHeader = req.headers.get("Authorization");
        if (!authHeader) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.replace("Bearer ", "");
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { plan } = body; // 'monthly' | 'yearly'

        if (!plan || (plan !== 'monthly' && plan !== 'yearly')) {
            return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
        }

        // Get user from DB to get Stripe Customer ID if exists
        const dbUser = await prisma.user.findUnique({
            where: { supabaseId: user.id },
        });

        if (!dbUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        let customerId = dbUser.stripeCustomerId;

        if (!customerId) {
            // Create Stripe Customer if not exists
            const customer = await stripe.customers.create({
                email: user.email,
                metadata: {
                    supabaseId: user.id,
                },
            });
            customerId = customer.id;

            // Update user in DB
            await prisma.user.update({
                where: { supabaseId: user.id },
                data: { stripeCustomerId: customerId },
            });
        }

        // Determine Price ID (In a real app, use real price IDs from env)
        // Since we don't have real IDs, we will use price_data to create them on the fly for this session
        // This is useful for development but for prod, use price IDs.

        const priceData = plan === 'monthly'
            ? {
                currency: 'usd',
                product_data: {
                    name: 'iShield Pro Monthly',
                    description: 'Monthly subscription to iShield Pro',
                },
                unit_amount: 1000, // $10.00
                recurring: {
                    interval: 'month',
                },
            }
            : {
                currency: 'usd',
                product_data: {
                    name: 'iShield Pro Yearly',
                    description: 'Yearly subscription to iShield Pro',
                },
                unit_amount: 10000, // $100.00
                recurring: {
                    interval: 'year',
                },
            };

        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            mode: "subscription",
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: priceData as any, // Cast to any to avoid strict type issues with inline price_data for recurring
                    quantity: 1,
                },
            ],
            metadata: {
                type: "ISHIELD_SUBSCRIPTION",
                userId: user.id,
                username: dbUser.username,
                plan: plan,
            },
            subscription_data: {
                metadata: {
                    type: "ISHIELD_SUBSCRIPTION",
                    userId: user.id,
                    username: dbUser.username,
                    plan: plan,
                }
            },
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/ishield?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/ishield?canceled=true`,
        });

        return NextResponse.json({ url: session.url });

    } catch (error: any) {
        console.error("Stripe Subscribe Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
