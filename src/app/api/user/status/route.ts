
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma/client";
import Stripe from "stripe";

export async function GET(request: Request) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Use raw SQL to ensure we get the latest fields even if Prisma client is stale
        const users = await prisma.$queryRaw<any[]>`
            SELECT * FROM "User" WHERE "supabaseId" = ${user.id} LIMIT 1
        `;
        const dbUser = users[0];

        if (!dbUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        let kycStatus = dbUser.kycStatus;
        let stripeAccountStatus = dbUser.stripeAccountStatus;

        // --- DIDIT FALLBACK ---
        // If local status is PENDING, poll Didit to see if it was already approved
        if (kycStatus === "PENDING") {
            try {
                const apiKey = process.env.DIDIT_API_KEY;
                if (apiKey) {
                    const diditResponse = await fetch(`https://verification.didit.me/v3/sessions?vendor_data=${user.id}`, {
                        headers: { "x-api-key": apiKey }
                    });

                    if (diditResponse.ok) {
                        const diditData = await diditResponse.json();
                        // Get the most recent session
                        const latestSession = diditData.results?.[0];

                        if (latestSession && latestSession.status === "Approved") {
                            kycStatus = "APPROVED";
                            // Update DB immediately
                            const newRole = dbUser.role === "BUYER" ? "SELLER" : dbUser.role;
                            await prisma.$executeRaw`
                                UPDATE "User"
                                SET "kycStatus" = 'APPROVED',
                                    "role" = ${newRole}::"Role",
                                    "stripeAccountStatus" = CASE WHEN "stripeAccountStatus" = 'PENDING' OR "stripeAccountStatus" IS NULL THEN 'ACTIVE' ELSE "stripeAccountStatus" END
                                WHERE "id" = ${dbUser.id}
                            `;
                        }
                    }
                }
            } catch (diditError) {
                console.error("Didit polling error:", diditError);
            }
        }

        // --- STRIPE SYNC ---
        // Always check Stripe account status if we have an account
        let payoutsEnabled = false;
        if (dbUser.stripeAccountId) {
            try {
                const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
                    apiVersion: "2024-12-18.acacia" as any,
                });
                const account = await stripe.accounts.retrieve(dbUser.stripeAccountId);

                // Check if payouts are actually enabled
                payoutsEnabled = account.payouts_enabled === true;

                if (account.charges_enabled && account.payouts_enabled) {
                    stripeAccountStatus = "ACTIVE";

                    // Update DB if not already ACTIVE
                    if (dbUser.stripeAccountStatus !== "ACTIVE") {
                        await prisma.$executeRaw`
                            UPDATE "User"
                            SET "stripeAccountStatus" = 'ACTIVE'
                            WHERE "id" = ${dbUser.id}
                        `;
                    }
                } else if (account.details_submitted) {
                    // They finished the onboarding, but not yet enabled by Stripe (restricted)
                    stripeAccountStatus = "RESTRICTED";
                } else {
                    // Account created but onboarding not completed
                    stripeAccountStatus = "PENDING";
                }
            } catch (stripeError) {
                console.error("Stripe sync error:", stripeError);
            }
        }

        return NextResponse.json({
            stripeAccountId: dbUser.stripeAccountId,
            stripeAccountStatus: stripeAccountStatus,
            payoutsEnabled: payoutsEnabled,
            kycStatus: kycStatus,
            role: dbUser.role
        });
    } catch (error) {
        console.error("Internal Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
