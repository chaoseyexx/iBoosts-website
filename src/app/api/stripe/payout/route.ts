import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma/client";
import Stripe from "stripe";
import { Prisma } from "@prisma/client";
import { calculateWithdrawal } from "@/lib/utils/fees";
import { generateId } from "@/lib/utils/ids";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { amount } = body;

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
        }

        // Use a transaction to ensure balance check and update are atomic
        const result = await prisma.$transaction(async (tx) => {
            // 1. Get User and Wallet
            const dbUser = await tx.user.findUnique({
                where: { supabaseId: user.id },
                include: { wallet: true },
            });

            if (!dbUser) {
                throw new Error("User not found");
            }

            // Cast to any to avoid lint error if types are stale
            const stripeAccountId = (dbUser as any).stripeAccountId;

            if (!stripeAccountId) {
                throw new Error("No payout account connected");
            }

            const wallet = dbUser.wallet;
            if (!wallet) {
                throw new Error("Wallet not found");
            }

            // 2. Check Balance
            if (wallet.balance.lessThan(amount)) {
                throw new Error("Insufficient balance");
            }

            // 3. Calculate Fees
            const { fee, netAmount } = calculateWithdrawal(Number(amount));

            if (netAmount <= 0) {
                throw new Error("Withdrawal amount too small to cover fees");
            }

            // 4. Create Stripe Transfer (for the net amount)
            const transfer = await stripe.transfers.create({
                amount: Math.round(netAmount * 100),
                currency: "usd",
                destination: stripeAccountId,
                metadata: {
                    type: "WITHDRAWAL",
                    userId: dbUser.id,
                    username: dbUser.username,
                    grossAmount: amount,
                    fee: fee.toFixed(2),
                    netAmount: netAmount.toFixed(2)
                }
            });

            // 5. Updating Wallet Balance (deduct the full gross amount)
            const updatedWallet = await tx.wallet.update({
                where: { id: wallet.id },
                data: {
                    balance: { decrement: amount },
                },
            });

            // 6. Create Transaction Record
            await tx.walletTransaction.create({
                data: {
                    id: generateId("WalletTransaction"),
                    walletId: wallet.id,
                    type: "WITHDRAWAL",
                    amount: new Prisma.Decimal(amount),
                    balanceBefore: wallet.balance,
                    balanceAfter: updatedWallet.balance,
                    description: `Payout via Stripe Connect(Fee: $${fee.toFixed(2)})`,
                    reference: transfer.id,
                    referenceType: "STRIPE_TRANSFER",
                    metadata: {
                        grossAmount: amount,
                        fee: fee,
                        netAmount: netAmount,
                        stripeTransferId: transfer.id
                    }
                }
            });

            return { transfer, fee, netAmount };
        });

        return NextResponse.json({
            success: true,
            transferId: result.transfer.id,
            fee: result.fee,
            netAmount: result.netAmount
        });

    } catch (error: any) {
        console.error("Payout Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 400 }
        );
    }
}
