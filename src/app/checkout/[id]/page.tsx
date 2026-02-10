import { notFound } from "next/navigation";
import prisma from "@/lib/prisma/client";
import { CheckoutView } from "@/components/marketplace/checkout-view";

interface CheckoutPageProps {
    params: Promise<{ id: string }>;
}

import { createClient } from "@/lib/supabase/server";

export default async function CheckoutPage({ params }: CheckoutPageProps) {
    const { id } = await params;

    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    let walletBalance = 0;
    let isShieldActive = false;

    if (authUser) {
        const user = await (prisma.user as any).findUnique({
            where: { supabaseId: authUser.id },
            include: { wallet: true }
        });

        if (user?.isShieldActive && user.ishieldUntil && new Date(user.ishieldUntil) > new Date()) {
            isShieldActive = true;
        } else if (user?.isShieldActive && !user.ishieldUntil) {
            // Lifetime or untracked
            isShieldActive = true;
        }

        if (user?.wallet) {
            walletBalance = Number(user.wallet.balance);
        }
    }

    const listing = await prisma.listing.findUnique({
        where: { id },
        include: {
            seller: true,
            game: {
                select: {
                    name: true,
                    slug: true,
                    icon: true,
                    banner: true
                }
            },
            images: {
                where: { isPrimary: true },
                take: 1
            }
        }
    });

    if (!listing) {
        return notFound();
    }

    // Serialize listing to plain object (removes Decimal, reduces hydration errors)
    const serializedListing = JSON.parse(JSON.stringify(listing));

    return (
        <CheckoutView
            listing={serializedListing}
            isShieldActive={isShieldActive}
            walletBalance={walletBalance}
        />
    );
}
