import { notFound, redirect } from "next/navigation";
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

    // Redirect currency category to the new /currency/[game] route
    if (categorySlug === "currency" && gameSlug) {
        redirect(`/currency/${gameSlug}`);
    }

    const { category, game, listings, error } = await fetchMarketplaceData(categorySlug, gameSlug);

    if (error || !category) {
        return notFound();
    }

    return (
        <>
            <NavbarServer variant="landing" />
            <CurrencyMarketplaceView
                category={category}
                game={game}
                listings={listings || []}
            />
            <Footer />
        </>
    );
}
