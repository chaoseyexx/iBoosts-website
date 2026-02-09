
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma/client";

export async function GET(request: Request) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Fetch user with wallet and recent transactions
        const dbUser = await prisma.user.findUnique({
            where: { supabaseId: user.id },
            include: {
                wallet: {
                    include: {
                        transactions: {
                            orderBy: { createdAt: 'desc' },
                            take: 20
                        }
                    }
                }
            }
        });

        if (!dbUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Sum up lifetime sales (Gross Revenue)
        const lifetimeStats = await prisma.walletTransaction.aggregate({
            where: {
                walletId: dbUser.wallet?.id,
                type: 'SALE'
            },
            _sum: {
                amount: true
            }
        });

        const grossLifetimeRevenue = Number(lifetimeStats._sum.amount || 0);

        return NextResponse.json({
            wallet: dbUser.wallet,
            transactions: dbUser.wallet?.transactions || [],
            stats: {
                grossLifetimeRevenue
            }
        });

    } catch (error) {
        console.error("Internal Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
