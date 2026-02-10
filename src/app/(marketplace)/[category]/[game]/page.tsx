import { notFound } from "next/navigation";
import { fetchMarketplaceData } from "../../marketplace-actions";
import { CurrencyMarketplaceView } from "@/components/marketplace/currency-marketplace-view";
import { AccountsMarketplaceView } from "@/components/marketplace/accounts-marketplace-view";
import { NavbarServer } from "@/components/layout/navbar-server";
import { Footer } from "@/components/layout/footer";
import { createClient } from "@/lib/supabase/server";

interface CategoryGamePageProps {
    params: Promise<{
        category: string;
        game: string;
    }>;
}

export default async function CategoryGamePage({ params }: CategoryGamePageProps) {
    const { category: categorySlug, game: gameSlug } = await params;

    const { category, game, listings, error } = await fetchMarketplaceData(categorySlug, gameSlug);

    if (error || !category || !game) {
        return notFound();
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const isGridCategory = categorySlug.toLowerCase() === "accounts" || categorySlug.toLowerCase() === "items";

    return (
        <>
            <NavbarServer variant="landing" />
            {isGridCategory ? (
                <AccountsMarketplaceView
                    category={category}
                    game={game}
                    listings={listings || []}
                    currentUserId={user?.id}
                />
            ) : (
                <CurrencyMarketplaceView
                    category={category}
                    game={game}
                    listings={listings || []}
                    currentUserId={user?.id}
                />
            )}
            <Footer />
        </>
    );
}
