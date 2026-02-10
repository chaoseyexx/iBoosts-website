import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
    try {
        // Auth check using Supabase
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get user from DB to check role
        const dbUser = await prisma.user.findUnique({
            where: { supabaseId: user.id },
            select: { role: true },
        });

        if (!dbUser || dbUser.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Fetch recent agent logs (last 100)
        const logs = await prisma.agentLog.findMany({
            orderBy: { createdAt: "desc" },
            take: 100,
        });

        // Fetch latest system health snapshot
        const health = await prisma.systemHealth.findFirst({
            orderBy: { timestamp: "desc" },
        });

        // Fetch content posts (last 10 drafts)
        const content = await prisma.contentPost.findMany({
            orderBy: { createdAt: "desc" },
            take: 10,
        });

        // Fetch recommendation count
        const recommendationCount = await prisma.recommendation.count();

        return NextResponse.json({
            logs,
            health,
            content,
            stats: {
                recommendationCount,
            },
        });
    } catch (error) {
        console.error("iShield API Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch iShield data" },
            { status: 500 }
        );
    }
}
