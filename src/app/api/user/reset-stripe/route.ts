
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma/client";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Fetch user using raw SQL to be safe
        const users = await prisma.$queryRaw<any[]>`
            SELECT "id", "stripeAccountId" FROM "User" WHERE "supabaseId" = ${user.id} LIMIT 1
        `;
        const dbUser = users[0];

        if (!dbUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (dbUser.stripeAccountId) {
            try {
                // Attempt to delete from Stripe as well
                await stripe.accounts.del(dbUser.stripeAccountId);
            } catch (stripeError) {
                console.error("Failed to delete account from Stripe (might already be deleted or restricted):", stripeError);
            }
        }

        // Reset user fields in database
        await prisma.$executeRaw`
            UPDATE "User"
            SET "stripeAccountId" = NULL,
                "stripeAccountStatus" = NULL,
                "kycStatus" = 'NOT_SUBMITTED'
            WHERE "id" = ${dbUser.id}
        `;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Reset Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
