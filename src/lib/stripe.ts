import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "dummy", {
    apiVersion: "2024-12-18.acacia" as any,
    typescript: true,
});
