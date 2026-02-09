
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma/client";

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

        // Get user from DB
        const dbUser = await prisma.user.findUnique({
            where: { supabaseId: user.id },
        });

        if (!dbUser || !dbUser.stripeCustomerId) {
            return NextResponse.json({ error: "No billing account found" }, { status: 404 });
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: dbUser.stripeCustomerId,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/ishield`,
        });

        return NextResponse.json({ url: session.url });

    } catch (error: any) {
        console.error("Stripe Portal Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
