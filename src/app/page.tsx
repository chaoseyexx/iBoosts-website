import { NavbarServer } from "@/components/layout/navbar-server";
import { HomePageClient } from "./home-page-client";
import { fetchGamesForNavbar } from "@/app/(admin)/admin/actions";
import { prisma } from "@/lib/prisma/client";
import { headers } from "next/headers";
import { SupportClient } from "./support/client";
import { Footer } from "@/components/layout/footer";

export default async function HomePage() {
    const headerList = await headers();
    const host = headerList.get('host') || "";

    if (host.includes('support.iboosts.gg')) {
        return (
            <div className="flex flex-col min-h-screen">
                <NavbarServer variant="landing" />
                <main className="flex-1 bg-[#0a0e13]">
                    <SupportClient />
                </main>
                <Footer />
            </div>
        );
    }

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
