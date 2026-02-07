import * as React from "react";
import Image from "next/image";
import { getSellerListings } from "./actions";
import { OffersClient } from "./offers-client";

interface OffersPageProps {
    searchParams: Promise<{
        category?: string;
    }>;
}

export default async function OffersPage({ searchParams }: OffersPageProps) {
    const params = await searchParams;
    const categoryQuery = params.category || "all";
    const { listings, error } = await getSellerListings(categoryQuery);

    const offers = listings || [];

    return (
        <div className="relative min-h-screen">
            {/* Background Image / Illustration (Subtle) */}
            <div className="absolute top-0 right-[-100px] w-[800px] h-[700px] opacity-[0.05] pointer-events-none z-0">
                <Image
                    src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1000"
                    alt="Background Decor"
                    fill
                    className="object-contain object-right-top grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-[#0a0e13] via-transparent to-[#0a0e13]" />
            </div>

            <OffersClient initialOffers={offers} categoryQuery={categoryQuery} />
        </div>
    );
}
