"use client";

import { useState } from "react";
import { toast } from "sonner";

export function useStripeConnect() {
    const [isLoading, setIsLoading] = useState(false);

    const connectStripe = async () => {
        setIsLoading(true);
        try {
            const createRes = await fetch("/api/stripe/connect/create-account", {
                method: "POST",
            });
            const createData = await createRes.json();
            if (!createRes.ok) throw new Error(createData.error);

            const accountId = createData.accountId;

            const linkRes = await fetch("/api/stripe/connect/account-link", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accountId }),
            });
            const linkData = await linkRes.json();
            if (!linkRes.ok) throw new Error(linkData.error);

            window.location.href = linkData.url;
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to connect Stripe.");
            setIsLoading(false);
        }
    };

    return { connectStripe, isLoading };
}
