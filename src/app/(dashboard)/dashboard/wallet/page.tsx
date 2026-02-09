
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
    const initialWallet = {
        balance: wallet?.balance ? Number(wallet.balance) : 0,
        pendingBalance: wallet?.pendingBalance ? Number(wallet.pendingBalance) : 0,
        transactions: wallet?.transactions?.map(t => ({
            ...t,
            amount: Number(t.amount),
            createdAt: t.createdAt.toISOString(), // Serialize Date
            metadata: t.metadata as any
        })) || []
    };

    const initialUser = {
        role: dbUser.role,
        kycStatus: dbUser.kycStatus,
    };

    return (
        <WalletView
            initialWallet={initialWallet}
            initialUser={initialUser}
        />
    );
}
