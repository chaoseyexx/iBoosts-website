import { notFound } from "next/navigation";
import { fetchMarketplaceData } from "../marketplace-actions";
import { CurrencyMarketplaceView } from "@/components/marketplace/currency-marketplace-view";
import { NavbarServer } from "@/components/layout/navbar-server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma/client";

interface CategoryPageProps {
    params: Promise<{
        category: string;
    }>;
    searchParams: Promise<{
        game?: string;
    }>;
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
    const { category: categorySlug } = await params;
    const { game: gameSlug } = await searchParams;

    const { category, game, listings, error } = await fetchMarketplaceData(categorySlug, gameSlug);

    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    let userData = null;
    if (authUser) {
        const profile = await prisma.user.findUnique({
            where: { supabaseId: authUser.id }
        });
        userData = {
            id: authUser.id,
            email: authUser.email,
            username: profile?.username || authUser.email?.split("@")[0],
            avatar: profile?.avatar || undefined
        };
    }

    if (error || !category) {
        return notFound();
    }

    // If it's the currency category, show the specialized currency view
    // Otherwise, we could show a more generic marketplace view (to be implemented)
    const content = categorySlug === "currency" ? (
        <CurrencyMarketplaceView
            category={category}
            game={game}
            listings={listings || []}
        />
    ) : (
        <CurrencyMarketplaceView
            category={category}
            game={game}
            listings={listings || []}
        />
    );

    return (
        <>
            <NavbarServer user={userData} />
            {content}
        </>
    );
}
