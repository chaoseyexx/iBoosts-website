// Temporary endpoint to reset Stripe account - DELETE after use
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

        // Clear the Stripe account ID so user can create a new one with correct country
        await prisma.$executeRaw`
            UPDATE "User" 
            SET "stripeAccountId" = NULL, 
                "stripeAccountStatus" = NULL
            WHERE "supabaseId" = ${user.id}
        `;

        return NextResponse.json({
            success: true,
            message: "Stripe account cleared. You can now set up a new account."
        });
    } catch (error) {
        console.error("Reset Error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal Server Error" },
            { status: 500 }
        );
    }
}
