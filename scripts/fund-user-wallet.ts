
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
    const email = process.argv[2];
    const amount = parseFloat(process.argv[3]);

    if (!email || isNaN(amount)) {
        console.log("Usage: npx tsx scripts/fund-user-wallet.ts <email> <amount>");
        console.log("\nAvailable Users:");
        const users = await prisma.user.findMany({
            select: { email: true, wallet: { select: { balance: true } } },
            take: 10
        });
        users.forEach(u => console.log(`- ${u.email}: $${u.wallet?.balance || 0}`));
        return;
    }

    console.log(`Funding wallet for ${email} with $${amount}...`);

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { wallet: true }
        });

        if (!user) {
            console.error("User not found!");
            return;
        }

        if (!user.wallet) {
            console.log("Creating wallet for user...");
            await prisma.wallet.create({
                data: {
                    id: crypto.randomUUID(),
                    userId: user.id,
                    balance: amount
                }
            });
            console.log(`✅ Success! Wallet created with Balance: $${amount.toFixed(2)}`);
        } else {
            const updatedWallet = await prisma.wallet.update({
                where: { userId: user.id },
                data: {
                    balance: {
                        increment: amount
                    }
                }
            });
            console.log(`✅ Success! New Balance: $${updatedWallet.balance.toFixed(2)}`);
        }

    } catch (e) {
        console.error("Error updating wallet:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
