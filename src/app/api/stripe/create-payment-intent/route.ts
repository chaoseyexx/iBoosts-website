import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { calculateOrderTotal } from "@/lib/utils/fees";
import { getDynamicFees } from "@/lib/utils/dynamic-fees";

export async function POST(request: Request) {
    try {
        const { amount } = await request.json();

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
        }

        // Fetch Dynamic Fees
        const dynamicFees = await getDynamicFees();

        // Calculate final amount including fees
        const { total } = calculateOrderTotal(Number(amount), false, dynamicFees);

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(total * 100), // Convert to cents
            currency: "usd",
            metadata: {
                baseAmount: amount.toString(),
                feeIncluded: (total - amount).toFixed(2),
                type: "direct_order"
            }
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            totalCharge: total
        });
    } catch (error) {
        console.error("Internal Error:", error);
        return NextResponse.json(
            { error: `Internal Server Error: ${error}` },
            { status: 500 }
        );
    }
}
