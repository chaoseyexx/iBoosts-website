import { notFound } from "next/navigation";
import { fetchMarketplaceData } from "../marketplace-actions";
import { CurrencyMarketplaceView } from "@/components/marketplace/currency-marketplace-view";
import { AccountsMarketplaceView } from "@/components/marketplace/accounts-marketplace-view";
import { NavbarServer } from "@/components/layout/navbar-server";
import { Footer } from "@/components/layout/footer";

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

    if (error || !category) {
        return notFound();
    }

    const isGridCategory = categorySlug.toLowerCase() === "accounts" || categorySlug.toLowerCase() === "items";

    return (
        <>
            <NavbarServer variant="landing" />
            {isGridCategory ? (
                <AccountsMarketplaceView
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
            )}
            <Footer />
        </>
    );
}
