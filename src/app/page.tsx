import { NavbarServer } from "@/components/layout/navbar-server";
import { HomePageClient } from "./home-page-client";
import { fetchGamesForNavbar } from "@/app/(admin)/admin/actions";

export default async function HomePage() {
    // Re-use fetchGamesForNavbar since it already groups popular games by category
    const { categories, gamesByCategory } = await fetchGamesForNavbar();

    return (
        <>
            <NavbarServer variant="landing" />
            <HomePageClient
                initialCategories={categories}
                initialGamesData={gamesByCategory}
            />
        </>
    );
}
