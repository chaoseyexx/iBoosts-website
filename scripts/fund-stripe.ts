
import dotenv from "dotenv";
import Stripe from "stripe";

// Load environment variables
dotenv.config();

if (!process.env.STRIPE_SECRET_KEY) {
    console.error("Error: STRIPE_SECRET_KEY is missing in .env");
    process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-12-18.acacia" as any,
});

async function main() {
    console.log("----------------------------------------------------------------");
    console.log("  Funding Stripe Platform Balance (Test Mode)  ");
    console.log("----------------------------------------------------------------");

    try {
        // 1. Create a PaymentIntent designed to succeed immediately
        // We use 'pm_card_visa' which simulates a successful card payment.
        console.log("Creating a $500 charge to self...");

        const paymentIntent = await stripe.paymentIntents.create({
            amount: 50000, // $500.00
            currency: "usd",
            payment_method: "pm_card_visa",
            confirm: true,
            description: "Self-funding for Payout Testing",
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: "never"
            }
        });

        console.log(`✅ Success! PaymentIntent ID: ${paymentIntent.id}`);
        console.log(`💰 Added $500.00 USD to your Stripe Dashboard balance.`);
        console.log("Note: In Test Mode, this might not be 'Available' for payouts instantly depending on your settings,");
        console.log("but it adds to your platform volume.");

    } catch (error: any) {
        console.error("❌ Error adding funds:", error.message);
    }
}

main();
