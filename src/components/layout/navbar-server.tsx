import { fetchGamesForNavbar } from "@/app/(admin)/admin/actions";
import { MainNavbar } from "./main-navbar";
import { getProfile } from "@/app/(dashboard)/dashboard/settings/actions";
import { createClient } from "@/lib/supabase/server";

interface NavbarServerProps {
    variant?: "landing" | "dashboard";
}

export async function NavbarServer({ variant = "landing" }: NavbarServerProps) {
    // 1. Fetch cached navbar data
    const { categories, gamesByCategory } = await fetchGamesForNavbar();

    // 2. Fetch user session if possible (server-side)
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let userData = null;
    if (user) {
        const profile = await getProfile();
        userData = {
            id: user.id,
            email: user.email,
            username: profile?.username || user.email?.split("@")[0] || "User",
            avatar: profile?.avatar || undefined
        };
    }

    // 3. Transform gamesByCategory for the client component (adding hrefs)
    const transformedGamesData: Record<string, any> = {};
    for (const [catName, data] of Object.entries(gamesByCategory as Record<string, any>)) {
        const catSlug = categories.find((c: any) => c.name === catName)?.slug || catName.toLowerCase().replace(/\s+/g, '-');
        transformedGamesData[catName] = {
            popular: data.popular.map((g: any) => ({
                ...g,
                href: `/${catSlug}/${g.slug}`
            })),
            all: data.all.map((g: any) => ({
                ...g,
                href: `/${catSlug}/${g.slug}`
            }))
        };
    }

    const transformedCategories = categories.map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        icon: c.icon
    }));

    return (
        <MainNavbar
            variant={variant}
            user={userData}
            initialCategories={transformedCategories}
            initialGamesData={transformedGamesData}
        />
    );
}
