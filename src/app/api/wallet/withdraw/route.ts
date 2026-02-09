import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma/client";
import { generateId } from "@/lib/utils/ids";

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { amount, method, destination, fee, netAmount } = await req.json();

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { supabaseId: authUser.id },
            include: { wallet: true }
        });

        if (!user || !user.wallet) {
            return NextResponse.json({ error: "User or wallet not found" }, { status: 404 });
        }

        if (user.kycStatus !== "APPROVED") {
            return NextResponse.json({ error: "KYC verification required for withdrawals" }, { status: 403 });
        }

        if (Number(user.wallet.balance) < amount) {
            return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
        }

        // Use a transaction to deduct balance and create withdrawal request
        const result = await prisma.$transaction(async (tx) => {
            // Deduct from wallet balance
            const updatedWallet = await tx.wallet.update({
                where: { id: user.wallet!.id },
                data: {
                    balance: {
                        decrement: amount
                    }
                }
            });

            // Create record in WalletTransaction
            await tx.walletTransaction.create({
                data: {
                    id: generateId("WalletTransaction"),
                    walletId: user.wallet!.id,
                    type: "WITHDRAWAL",
                    amount: -amount,
                    balanceBefore: user.wallet!.balance,
                    balanceAfter: Number(user.wallet!.balance) - amount,
                    description: `Withdrawal request (${method})`,
                    reference: null,
                    referenceType: "WITHDRAWAL"
                }
            });

            // Create withdrawal request
            const withdrawal = await tx.withdrawal.create({
                data: {
                    id: generateId("Withdrawal"),
                    userId: user.id,
                    amount: amount,
                    fee: fee || 0,
                    netAmount: netAmount || amount,
                    method: method,
                    destination: destination,
                    status: "PENDING"
                }
            });

            return withdrawal;
        });

        return NextResponse.json({ success: true, withdrawalId: result.id });
    } catch (error: any) {
        console.error("[WITHDRAW_ERROR]", error);
        return NextResponse.json({ error: error.message || "Failed to process withdrawal" }, { status: 500 });
    }
}
