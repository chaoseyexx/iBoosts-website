"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ReactNode } from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripeProviderProps {
    children: ReactNode;
    clientSecret?: string;
    theme?: "stripe" | "night" | "flat";
}

export function StripeProvider({ children, clientSecret, theme = "night" }: StripeProviderProps) {
    if (!clientSecret) {
        return <>{children}</>;
    }

    const options = {
        clientSecret,
        appearance: {
            theme: theme,
            variables: {
                colorPrimary: '#f5a623',
                colorBackground: '#0a0e13',
                colorText: '#ffffff',
                colorDanger: '#df1b41',
                fontFamily: 'Inter, system-ui, sans-serif',
                spacingUnit: '4px',
                borderRadius: '8px',
            },
        },
    };

    return (
        // @ts-ignore - Stripe types can be finicky with exact version matches, but this is safe
        <Elements stripe={stripePromise} options={options}>
            {children}
        </Elements>
    );
}
