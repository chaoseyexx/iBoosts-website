"use server";

import prisma from "@/lib/prisma/client";
import { createClient } from "@/lib/supabase/server";
import { WalletWithdrawalView } from "./withdrawal-view";
import { notFound } from "next/navigation";
import { generateId } from "@/lib/utils/ids";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";

interface BankAccountInfo {
    bankName: string;
    last4: string;
    currency: string;
    country: string;
}

export default async function WithdrawalPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return notFound();

    // Use raw SQL to get user with stripeAccountId (bypasses stale Prisma client)
    const users = await prisma.$queryRaw<any[]>`
        SELECT id, "stripeAccountId" FROM "User" WHERE "supabaseId" = ${user.id} LIMIT 1
    `;
    const dbUser = users[0];

    if (!dbUser) return notFound();

    // Fetch wallet separately
    let wallet = await prisma.wallet.findUnique({
        where: { userId: dbUser.id }
    });

    if (!wallet) {
        wallet = await prisma.wallet.create({
            data: {
                id: generateId("Wallet"),
                userId: dbUser.id,
                balance: 0,
                pendingBalance: 0
            }
        });
    }

    // Check if Stripe payouts are actually enabled and get bank info
    let payoutsEnabled = false;
    let bankInfo: BankAccountInfo | null = null;

    if (dbUser.stripeAccountId) {
        try {

            const account = await stripe.accounts.retrieve(dbUser.stripeAccountId);
            payoutsEnabled = account.payouts_enabled === true;

            // Get bank account details
            if (account.external_accounts && account.external_accounts.data.length > 0) {
                const bankAccount = account.external_accounts.data[0];
                if (bankAccount.object === 'bank_account') {
                    bankInfo = {
                        bankName: (bankAccount as Stripe.BankAccount).bank_name || 'Bank Account',
                        last4: (bankAccount as Stripe.BankAccount).last4,
                        currency: ((bankAccount as Stripe.BankAccount).currency || 'usd').toUpperCase(),
                        country: (bankAccount as Stripe.BankAccount).country || '',
                    };
                }
            }
        } catch (error) {
            console.error("Error checking Stripe account:", error);
        }
    }

    return (
        <WalletWithdrawalView
            balance={Number(wallet.balance)}
            stripeConnected={payoutsEnabled}
            bankInfo={bankInfo}
        />
    );
}
