import { fetchGamesForNavbar } from "@/app/(admin)/admin/actions";
import { MainNavbar } from "./main-navbar";

interface NavbarServerProps {
    variant?: "landing" | "dashboard";
    user?: {
        id: string;
        email?: string;
        username?: string;
        avatar?: string;
    } | null;
}

export async function NavbarServer({ variant = "landing", user }: NavbarServerProps) {
    const { categories, gamesByCategory } = await fetchGamesForNavbar();

    // Transform categories
    const initialCategories = categories.map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        icon: c.icon
    }));

    // Transform games to include href
    const initialGamesData: Record<string, { popular: any[]; all: any[] }> = {};
    for (const [catName, data] of Object.entries(gamesByCategory as Record<string, any>)) {
        const category = categories.find((c: any) => c.name === catName);
        const catSlug = category?.slug || catName.toLowerCase().replace(/\s+/g, '-');

        initialGamesData[catName] = {
            popular: data.popular.map((g: any) => ({
                id: g.id,
                name: g.name,
                slug: g.slug,
                icon: g.icon,
                isPopular: g.isPopular,
                href: `/${catSlug}?game=${g.slug}`
            })),
            all: data.all.map((g: any) => ({
                id: g.id,
                name: g.name,
                slug: g.slug,
                icon: g.icon,
                isPopular: g.isPopular,
                href: `/${catSlug}?game=${g.slug}`
            }))
        };
    }

    return (
        <MainNavbar
            variant={variant}
            user={user}
            initialCategories={initialCategories}
            initialGamesData={initialGamesData}
        />
    );
}
