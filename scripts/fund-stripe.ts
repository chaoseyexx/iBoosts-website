
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
        // Check Balance First
        const balance = await stripe.balance.retrieve();
        console.log("Current Balance:");
        if (balance.available.length > 0) {
            console.log(`  Available: ${balance.available[0].amount / 100} ${balance.available[0].currency.toUpperCase()}`);
        } else {
            console.log("  Available: 0 USD");
        }

        if (balance.pending.length > 0) {
            console.log(`  Pending:   ${balance.pending[0].amount / 100} ${balance.pending[0].currency.toUpperCase()}`);
        } else {
            console.log("  Pending:   0 USD");
        }
        console.log("----------------------------------------------------------------");

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

        // Check Balance Again
        const newBalance = await stripe.balance.retrieve();
        console.log("----------------------------------------------------------------");
        console.log("New Balance:");
        if (newBalance.available.length > 0) {
            console.log(`  Available: ${newBalance.available[0].amount / 100} ${newBalance.available[0].currency.toUpperCase()}`);
        } else {
            console.log("  Available: 0 USD");
        }

        if (newBalance.pending.length > 0) {
            console.log(`  Pending:   ${newBalance.pending[0].amount / 100} ${newBalance.pending[0].currency.toUpperCase()}`);
        } else {
            console.log("  Pending:   0 USD");
        }
        console.log("----------------------------------------------------------------");

        console.log("IMPORTANT:");
        console.log("1. Funds from card payments usually go to 'Pending' first.");
        console.log("2. The error 'insufficient available funds' happens if your 'Available' balance is too low.");
        console.log("3. To fix this INSTANTLY in Test Mode:");
        console.log("   Go to https://dashboard.stripe.com/test/balance/overview");
        console.log("   Click 'Add to balance' and simulate a bank transfer.");

    } catch (error: any) {
        console.error("❌ Error adding funds:", error.message);
    }
}

main();
