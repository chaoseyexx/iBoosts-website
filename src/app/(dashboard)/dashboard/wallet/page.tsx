
import prisma from "@/lib/prisma/client";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import WalletView from "./wallet-view";

export default async function WalletPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/auth/login");
    }

    // Parallel Fetching
    const [dbUser, walletData] = await Promise.all([
        // Fetch User Status
        prisma.user.findUnique({
            where: { supabaseId: user.id },
            select: {
                role: true,
                kycStatus: true,
                // stripeAccountId removed as it is unused in the view
            }
        }),
        // Fetch Wallet Data
        prisma.user.findUnique({
            where: { supabaseId: user.id },
            select: {
                wallet: {
                    include: {
                        transactions: {
                            orderBy: { createdAt: 'desc' },
                            take: 20
                        }
                    }
                }
            }
        })
    ]);

    if (!dbUser) {
        return notFound();
    }

    // Process Wallet Data
    const wallet = walletData?.wallet;

    // safe formatting to avoid serialization errors
    const formattedWallet = wallet ? {
        ...wallet,
        balance: Number(wallet.balance),
        pendingBalance: Number(wallet.pendingBalance),
        transactions: wallet.transactions.map(tx => ({
            ...tx,
            amount: Number(tx.amount),
            balanceBefore: Number(tx.balanceBefore),
            balanceAfter: Number(tx.balanceAfter),
            createdAt: tx.createdAt.toISOString(),
            metadata: tx.metadata as any
        }))
    } : {
        balance: 0,
        pendingBalance: 0,
        transactions: []
    };

    const initialUser = {
        role: dbUser.role,
        kycStatus: dbUser.kycStatus || "NOT_SUBMITTED",
    };

    return (
        <WalletView
            initialWallet={formattedWallet}
            initialUser={initialUser}
        />
    );
}
