import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma/client";
import { generateId } from "@/lib/utils/ids";
import { calculateWithdrawal } from "@/lib/utils/fees";
import { getDynamicFees } from "@/lib/utils/dynamic-fees";
import { iShield } from "@/lib/ishield";
import { headers } from "next/headers";

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { amount, method, destination } = await req.json();

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
        }

        // Fetch Dynamic Fees
        const dynamicFees = await getDynamicFees();
        const { fee, netAmount } = calculateWithdrawal(amount, method, dynamicFees);

        const user = await (prisma as any).user.findUnique({
            where: { supabaseId: authUser.id },
            include: {
                wallet: true,
                _count: { select: { buyerOrders: true } }
            }
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

        // 🛡️ iShield & Config Logic
        const config = await prisma.config.findUnique({ where: { key: "MANUAL_PAYMENTS_ENABLED" } });
        const isManualMode = config?.value === true;

        let finalStatus: "PENDING" | "COMPLETED" = "COMPLETED";

        if (isManualMode || method.startsWith("CRYPTO")) {
            finalStatus = "PENDING";
        } else {
            // iShield Anti-Fraud Scan
            try {
                const headerList = await headers();
                const ip = headerList.get("x-forwarded-for") || "0.0.0.0";

                const risk = await iShield.analyzeBehavior({
                    userId: user.id,
                    ipAddress: ip,
                    amount: amount,
                    userAgeDays: Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
                    history: {
                        totalOrders: user._count.buyerOrders,
                        reputation: user.reputationScore
                    }
                });

                if (risk.risk_level !== "LOW") {
                    console.log(`[iShield] Flagged suspicious withdrawal for ${user.username}: ${risk.risk_level}`);
                    finalStatus = "PENDING";
                }
            } catch (e) {
                console.warn("[iShield] Scan failed, defaulting to manual review for safety.");
                finalStatus = "PENDING";
            }
        }

        // Use a transaction to deduct balance and create withdrawal request
        const result = await prisma.$transaction(async (tx) => {
            // Deduct from wallet balance
            await tx.wallet.update({
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
                    description: `Withdrawal request (${method}) - ${finalStatus}`,
                    reference: null,
                    referenceType: "WITHDRAWAL"
                }
            });

            // Create withdrawal request
            return await tx.withdrawal.create({
                data: {
                    id: generateId("Withdrawal"),
                    userId: user.id,
                    amount: amount,
                    fee: fee || 0,
                    netAmount: netAmount || amount,
                    method: method,
                    destination: destination,
                    status: finalStatus
                }
            });
        });

        return NextResponse.json({
            success: true,
            withdrawalId: result.id,
            immediate: finalStatus === "COMPLETED"
        });
    } catch (error: any) {
        console.error("[WITHDRAW_ERROR]", error);
        return NextResponse.json({ error: error.message || "Failed to process withdrawal" }, { status: 500 });
    }
}
