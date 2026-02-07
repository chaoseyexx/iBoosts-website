"use server";

import { prisma } from "@/lib/prisma/client";
import { createClient } from "@/lib/supabase/server";

export async function fetchBoostingRequests() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const requests = await prisma.boostingRequest.findMany({
        where: {
            userId: user.id,
        },
        include: {
            game: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return requests.map(req => ({
        id: req.id,
        game: req.game.name,
        category: req.title, // Using title as category for simplicity in this view
        date: req.createdAt.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }),
        offers: 0, // Mocking offers for now as we don't have an Offer model yet
        status: req.status,
        icon: req.game.icon || "https://i.imgur.com/39A8n8A.png",
    }));
}
