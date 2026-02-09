import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma/client";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-11-20.acacia" as any,
});

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { country } = body;

        // Fetch user from database
        const dbUser = await prisma.$queryRaw<any[]>`
            SELECT id, username, "stripeAccountId", email FROM "User" WHERE "supabaseId" = ${user.id} LIMIT 1
        `;

        if (!dbUser || dbUser.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const userData = dbUser[0];
        let stripeAccountId = userData.stripeAccountId;

        console.log(`[Account Session] User ${userData.username} - existing stripeAccountId: ${stripeAccountId}`);

        // Only create if stripeAccountId is null, undefined, or empty string
        if (!stripeAccountId || stripeAccountId.trim() === "") {
            if (!country) {
                return NextResponse.json({ error: "Country is required for new accounts" }, { status: 400 });
            }

            console.log(`[Account Session] Creating new Express account for ${userData.username} in ${country}`);

            // Get user's IP for TOS acceptance
            const forwarded = request.headers.get("x-forwarded-for");
            const ip = forwarded ? forwarded.split(",")[0].trim() : request.headers.get("x-real-ip") || "127.0.0.1";

            const account = await stripe.accounts.create({
                type: "express",
                country: country,
                email: user.email || userData.email,
                business_type: "individual",
                capabilities: {
                    transfers: { requested: true },
                },
                tos_acceptance: {
                    service_agreement: "full",
                    date: Math.floor(Date.now() / 1000),
                    ip: ip,
                },
                settings: {
                    payouts: {
                        schedule: {
                            interval: "manual",
                        },
                    },
                },
                metadata: {
                    userId: userData.id,
                    username: userData.username,
                    platform: "iboosts",
                },
            });

            stripeAccountId = account.id;
            console.log(`[Account Session] Created account: ${stripeAccountId}`);

            // Save to database immediately
            await prisma.$executeRaw`
                UPDATE "User" 
                SET "stripeAccountId" = ${stripeAccountId}, 
                    "stripeAccountStatus" = 'PENDING'
                WHERE "supabaseId" = ${user.id}
            `;

            console.log(`[Account Session] Saved ${stripeAccountId} to database for user ${user.id}`);
        } else {
            console.log(`[Account Session] Reusing existing account: ${stripeAccountId}`);
        }

        // Verify the account exists on Stripe before creating session
        try {
            const existingAccount = await stripe.accounts.retrieve(stripeAccountId);
            console.log(`[Account Session] Verified Stripe account exists: ${existingAccount.id}, details_submitted: ${existingAccount.details_submitted}`);
        } catch (stripeErr: any) {
            // Account doesn't exist on Stripe - clear it and ask user to retry
            if (stripeErr.code === 'resource_missing') {
                console.log(`[Account Session] Account ${stripeAccountId} not found on Stripe, clearing from DB`);
                await prisma.$executeRaw`
                    UPDATE "User" 
                    SET "stripeAccountId" = NULL, 
                        "stripeAccountStatus" = NULL
                    WHERE "supabaseId" = ${user.id}
                `;
                return NextResponse.json({
                    error: "Account not found. Please try setting up again.",
                    requiresRetry: true
                }, { status: 400 });
            }
            throw stripeErr;
        }

        // Create an Account Session for embedded components
        const accountSession = await stripe.accountSessions.create({
            account: stripeAccountId,
            components: {
                account_onboarding: {
                    enabled: true,
                },
                payouts: {
                    enabled: true,
                },
                payment_details: {
                    enabled: true,
                },
            },
        });

        return NextResponse.json({
            clientSecret: accountSession.client_secret,
            accountId: stripeAccountId,
        });
    } catch (error: any) {
        console.error("Account Session Error:", error);

        if (error.type === "StripeInvalidRequestError") {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
