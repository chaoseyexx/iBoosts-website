import { stripe } from "@/lib/stripe";

/**
 * Fetches the exact processing fee for a Stripe PaymentIntent.
 * Returns the fee in USD.
 */
export async function getExactStripeFee(paymentIntentId: string): Promise<number> {
    try {
        if (!paymentIntentId) return 0;

        // Fetch balance transactions associated with this PaymentIntent
        const balanceTransactions = await stripe.balanceTransactions.list({
            source: paymentIntentId,
            limit: 10
        });

        if (balanceTransactions.data.length === 0) return 0;

        // Sum up the fees from all transactions (usually just one)
        const totalFee = balanceTransactions.data.reduce((sum, tx) => sum + tx.fee, 0);

        // Stripe returns amounts in cents
        return totalFee / 100;
    } catch (error) {
        console.error(`Error fetching Stripe fee for ${paymentIntentId}:`, error);
        return 0;
    }
}

/**
 * Batch version to avoid multiple round trips if we ever want to optimize,
 * but Stripe doesn't have a direct "bulk fetch fees by PI" besides this.
 */
