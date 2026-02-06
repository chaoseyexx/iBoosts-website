import prisma from "@/lib/prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Log environment check
        const dbUrl = process.env.DATABASE_URL;
        console.log("DATABASE_URL exists:", !!dbUrl);
        console.log("DATABASE_URL starts with:", dbUrl?.substring(0, 30));

        // Simple test: count users
        const userCount = await prisma.user.count();
        return NextResponse.json({ success: true, userCount });
    } catch (error: any) {
        console.error("DB Test Error:", error);
        return NextResponse.json({
            error: error.message,
            name: error.name,
            code: error.code
        }, { status: 500 });
    }
}
