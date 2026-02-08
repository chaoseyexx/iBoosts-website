import { NavbarServer } from "@/components/layout/navbar-server";
import { HomePageClient } from "./home-page-client";
import { fetchGamesForNavbar } from "@/app/(admin)/admin/actions";
import { prisma } from "@/lib/prisma/client";

export default async function HomePage() {
    // Re-use fetchGamesForNavbar since it already groups popular games by category
    const { categories, gamesByCategory } = await fetchGamesForNavbar();

    // Fetch real user count
    const userCount = await prisma.user.count();

    return (
        <>
            <NavbarServer variant="landing" />
            <HomePageClient
                initialCategories={categories}
                initialGamesData={gamesByCategory}
                initialUserCount={userCount}
            />
        </>
    );
}
