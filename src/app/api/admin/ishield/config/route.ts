import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { createClient } from "@/lib/supabase/server";

// Default configuration
const DEFAULT_CONFIG = {
    agents: {
        TheJudge: { enabled: true },
        TheDetective: { enabled: true },
        TheAuditor: { enabled: true },
        TheGuardian: { enabled: true },
        TheBroker: { enabled: true },
        TheConcierge: { enabled: true },
        TheSentry: { enabled: true },
        TheHerald: { enabled: true, generateSEO: true, generateSocial: false },
        TheAccountant: { enabled: true },
        TheArchitect: { enabled: true },
    },
    patrolInterval: 60,
};

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const dbUser = await prisma.user.findUnique({
            where: { supabaseId: user.id },
            select: { role: true },
        });

        if (!dbUser || dbUser.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Get config from database
        const configRecord = await prisma.iShieldConfig.findUnique({
            where: { key: "agents_config" },
        });

        if (configRecord) {
            return NextResponse.json(configRecord.value);
        }

        // Return default config if none exists
        return NextResponse.json(DEFAULT_CONFIG);
    } catch (error) {
        console.error("iShield Config GET Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch config" },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const dbUser = await prisma.user.findUnique({
            where: { supabaseId: user.id },
            select: { role: true },
        });

        if (!dbUser || dbUser.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await request.json();

        // Upsert config
        await prisma.iShieldConfig.upsert({
            where: { key: "agents_config" },
            update: { value: body },
            create: { key: "agents_config", value: body },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("iShield Config PUT Error:", error);
        return NextResponse.json(
            { error: "Failed to save config" },
            { status: 500 }
        );
    }
}
