import { notFound } from "next/navigation";
import { fetchMarketplaceData } from "../../marketplace-actions";
import { CurrencyMarketplaceView } from "@/components/marketplace/currency-marketplace-view";
import { NavbarServer } from "@/components/layout/navbar-server";
import { Footer } from "@/components/layout/footer";

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
