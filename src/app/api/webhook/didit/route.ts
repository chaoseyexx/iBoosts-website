
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";

export async function POST(request: Request) {
    try {
        const payload = await request.json();
        console.log("Full Didit Webhook Payload:", JSON.stringify(payload, null, 2));

        // Didit payloads can vary, sometimes it's flat, sometimes it's in a 'data' object
        const vendor_data = payload.vendor_data || payload.data?.vendor_data;
        const status = payload.status || payload.data?.status;
        const sessionId = payload.session_id || payload.data?.session_id || payload.sessionId;

        console.log("Extracted Webhook Data:", { vendor_data, status, sessionId });

        if (!vendor_data) {
            console.error("Webhook Error: Missing vendor_data");
            return NextResponse.json({ error: "Missing vendor_data" }, { status: 400 });
        }

        // status from Didit: Approved, Declined, In Review
        let kycStatus = "PENDING";
        if (status === "Approved") kycStatus = "APPROVED";
        if (status === "Declined") kycStatus = "REJECTED";
        if (status === "In Review") kycStatus = "PENDING";

        console.log(`Updating user ${vendor_data} to KYC Status: ${kycStatus}`);

        // Update User
        // If APPROVED, we also want to ensure they become a SELLER if they were previously a BUYER
        if (kycStatus === "APPROVED") {
            await prisma.$executeRaw`
                UPDATE "User"
                SET "kycStatus" = 'APPROVED',
                    "role" = CASE WHEN "role" = 'BUYER' THEN 'SELLER'::"Role" ELSE "role" END,
                    "stripeAccountStatus" = CASE WHEN "stripeAccountStatus" = 'PENDING' OR "stripeAccountStatus" IS NULL THEN 'ACTIVE' ELSE "stripeAccountStatus" END
                WHERE "supabaseId" = ${vendor_data}
            `;
        } else {
            await prisma.$executeRaw`
                UPDATE "User"
                SET "kycStatus" = ${kycStatus}
                WHERE "supabaseId" = ${vendor_data}
            `;
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Didit Webhook Critical Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
