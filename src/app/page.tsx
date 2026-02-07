import { NavbarServer } from "@/components/layout/navbar-server";
import { HomePageClient } from "./home-page-client";
import { Footer } from "@/components/layout/footer";

export default function HomePage() {
    return (
        <>
            <NavbarServer variant="landing" />
            <HomePageClient />
            {/* Note: Footer is inside HomePageClient to maintain layout structure from original */}
        </>
    );
}
