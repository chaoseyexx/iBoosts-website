
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

        const apiKey = process.env.DIDIT_API_KEY;
        const workflowId = process.env.DIDIT_WORKFLOW_ID;

        if (!apiKey || !workflowId) {
            console.error("KYC Config Missing:", { hasApiKey: !!apiKey, hasWorkflowId: !!workflowId });
            return NextResponse.json({ error: "KYC system is currently being configured. Please try again in 1 minute." }, { status: 500 });
        }

        // Didit KYC Session Creation (v3)
        const apiUrl = "https://verification.didit.me/v3/session/";
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
            },
            body: JSON.stringify({
                callback: `${appUrl}/dashboard/kyc`,
                vendor_data: user.id,
                workflow_id: workflowId,
                callback_method: "both",
            }),
        });

        let data;
        try {
            data = await response.json();
        } catch (e) {
            console.error("Failed to parse Didit response as JSON");
            return NextResponse.json({ error: "Upstream service error" }, { status: 500 });
        }

        if (!response.ok) {
            console.error("Didit API Error Details:", JSON.stringify(data, null, 2));
            return NextResponse.json({
                error: data.message || data.error || "Identity provider rejected the request. Please check your account status."
            }, { status: response.status });
        }

        // Update local DB status to PENDING
        await prisma.$executeRaw`
            UPDATE "User"
            SET "kycStatus" = 'PENDING'
            WHERE "supabaseId" = ${user.id}
        `;

        return NextResponse.json({
            url: data.url,
            sessionId: data.id
        });
    } catch (error: any) {
        console.error("KYC Session creation error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
