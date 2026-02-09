
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma/client";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-12-18.acacia" as any,
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

        // Verify ownership using raw SQL to bypass stale client
        const users = await prisma.$queryRaw<any[]>`
            SELECT "stripeAccountId" FROM "User" WHERE "supabaseId" = ${user.id} LIMIT 1
        `;
        const dbUser = users[0];

        if (!dbUser || dbUser.stripeAccountId !== accountId) {
            return NextResponse.json({ error: "Unauthorized access to account" }, { status: 403 });
        }

        const accountLink = await stripe.accountLinks.create({
            account: accountId,
            refresh_url: `${request.headers.get("origin")}/dashboard/wallet`,
            return_url: `${request.headers.get("origin")}/dashboard/wallet`,
            type: "account_onboarding",
            collection_options: {
                fields: "eventually_due", // Only collect what's required immediately
                future_requirements: "omit", // Skip future requirements for now
            },
        });

        return NextResponse.json({ url: accountLink.url });
    } catch (error) {
        console.error("Internal Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
