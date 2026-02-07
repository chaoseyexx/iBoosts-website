import { NavbarServer } from "@/components/layout/navbar-server";
import { Footer } from "@/components/layout/footer";
import { SupportClient } from "./client";

export const metadata = {
    title: "Support Hub | iBoosts",
    description: "Get help with buying, selling, accounts, and iShield protection on iBoosts.",
};

export default function SupportPage() {
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
