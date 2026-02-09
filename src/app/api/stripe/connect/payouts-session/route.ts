
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
        const { accountId } = body;

        if (!accountId) {
            return NextResponse.json({ error: "Account ID is required" }, { status: 400 });
        }

        // Verify ownership using raw SQL to bypass stale client or schema issues
        const users = await prisma.$queryRaw<any[]>`
            SELECT "stripeAccountId" FROM "User" WHERE "supabaseId" = ${user.id} LIMIT 1
        `;
        const dbUser = users[0];

        if (!dbUser || dbUser.stripeAccountId !== accountId) {
            return NextResponse.json({ error: "Unauthorized access to account" }, { status: 403 });
        }

        const accountSession = await stripe.accountSessions.create({
            account: accountId,
            components: {
                payouts: {
                    enabled: true,
                    features: {
                        external_account_collection: true,
                        instant_payouts: true,
                        standard_payouts: true,
                        edit_payout_schedule: true,
                    }
                },
            },
        });

        return NextResponse.json({
            client_secret: accountSession.client_secret
        });
    } catch (error: any) {
        console.error("Payout Session Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error", stack: error.stack },
            { status: 500 }
        );
    }
}
