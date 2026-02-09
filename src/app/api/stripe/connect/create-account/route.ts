// This route is deprecated - use /api/stripe/connect/account-session instead
// Keeping for backwards compatibility but it now just returns the existing account ID

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma/client";

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Fetch user from Prisma to check existing account
        const dbUser = await prisma.$queryRaw<any[]>`
            SELECT id, "stripeAccountId", username, email FROM "User" WHERE "supabaseId" = ${user.id} LIMIT 1
        `;

        if (!dbUser || dbUser.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const userData = dbUser[0];

        if (userData.stripeAccountId && userData.stripeAccountId.trim() !== "") {
            // Return existing account instead of creating new one
            return NextResponse.json({ accountId: userData.stripeAccountId });
        }

        // No account exists - redirect to use the new embedded flow
        return NextResponse.json({
            error: "No Stripe account found. Please use the payout setup flow.",
            requiresSetup: true
        }, { status: 400 });
    } catch (error) {
        console.error("Internal Error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal Server Error" },
            { status: 500 }
        );
    }
}
