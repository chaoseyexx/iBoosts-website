import { notFound } from "next/navigation";
import { fetchMarketplaceData } from "../marketplace-actions";
import { CurrencyMarketplaceView } from "@/components/marketplace/currency-marketplace-view";

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
    if (categorySlug === "currency") {
        return (
            <CurrencyMarketplaceView
                category={category}
                game={game}
                listings={listings || []}
            />
        );
    }

    // Default fallback or generic view
    return (
        <CurrencyMarketplaceView
            category={category}
            game={game}
            listings={listings || []}
        />
    );
}
