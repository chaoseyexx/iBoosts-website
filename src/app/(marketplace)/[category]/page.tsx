import { notFound } from "next/navigation";
import { fetchMarketplaceData } from "../marketplace-actions";
import { CurrencyMarketplaceView } from "@/components/marketplace/currency-marketplace-view";
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

    // If it's the currency category, show the specialized currency view
    // Otherwise, we could show a more generic marketplace view (to be implemented)
    const marketplaceView = (categorySlug === "currency") ? (
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
            <NavbarServer variant="landing" />
            {marketplaceView}
            <Footer />
        </>
    );
}
