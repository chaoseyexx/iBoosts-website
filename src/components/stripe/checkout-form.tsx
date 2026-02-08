"use client";

import { useState } from "react";
import {
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Loader2, Lock, AlertCircle } from "lucide-react";

interface CheckoutFormProps {
    amount: number;
    onSuccess?: () => void;
}

export function CheckoutForm({ amount, onSuccess }: CheckoutFormProps) {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            return;
        }

        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Return URL where the customer should be redirected after the payment completion.
                // We can use the current URL or a specific success page. 
                // For this implementation, we might handle success inline if not redirecting.
                return_url: `${window.location.origin}/dashboard/wallet`,
            },
            redirect: 'if_required', // Avoid redirect if possible to handle SPA flow
        });

        if (error) {
            if (error.type === "card_error" || error.type === "validation_error") {
                setMessage(error.message || "An unexpected error occurred.");
            } else {
                setMessage("An unexpected error occurred.");
            }
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            setMessage("Payment succeeded!");
            if (onSuccess) onSuccess();
        } else {
            // Unexpected state
            setMessage("Something went wrong. Please try again.");
        }

        setIsLoading(false);
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement id="payment-element" options={{ layout: "tabs" }} />

            {message && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-sm text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    {message}
                </div>
            )}

            <Button
                disabled={isLoading || !stripe || !elements}
                id="submit"
                className="w-full bg-[#f5a623] hover:bg-[#e09612] text-black font-bold h-11"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                    </>
                ) : (
                    <>
                        <Lock className="mr-2 h-4 w-4" />
                        Pay ${amount.toFixed(2)}
                    </>
                )}
            </Button>
        </form>
    );
}
