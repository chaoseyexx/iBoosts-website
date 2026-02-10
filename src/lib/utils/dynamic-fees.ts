import { prisma } from "@/lib/prisma/client";
import { FEES } from "./fees";

/**
 * Fetches dynamic fees from the database and maps them to the FEES structure.
 * Falls back to hardcoded constants if fees are missing in the DB.
 */
export async function getDynamicFees() {
    try {
        const dbFees = await prisma.fee.findMany({
            where: { isActive: true }
        });

        if (dbFees.length === 0) return FEES;

        const mappedFees = { ...FEES };

        // Mapping logic (depends on fee names in DB)
        dbFees.forEach(fee => {
            switch (fee.name) {
                case "BUYER_SERVICE_PERCENT": mappedFees.BUYER_SERVICE_PERCENT = Number(fee.value); break;
                case "BUYER_SERVICE_FLAT": mappedFees.BUYER_SERVICE_FLAT = Number(fee.value); break;
                case "SELLER_COMMISSION_PERCENT": mappedFees.SELLER_COMMISSION_PERCENT = Number(fee.value); break;
                case "WITHDRAWAL_PERCENT": mappedFees.WITHDRAWAL_PERCENT = Number(fee.value); break;
                case "WITHDRAWAL_FLAT": mappedFees.WITHDRAWAL_FLAT = Number(fee.value); break;
            }
        });

        return mappedFees;
    } catch (error) {
        console.error("Error fetching dynamic fees:", error);
        return FEES;
    }
}
