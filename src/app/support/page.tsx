import { NavbarServer } from "@/components/layout/navbar-server";
import { Footer } from "@/components/layout/footer";
import { SupportClient } from "./client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
    title: "Support Hub | iBoosts",
    description: "Get help with buying, selling, accounts, and iShield protection on iBoosts.",
};

export default async function SupportPage() {
    const headerList = await headers();
    const host = headerList.get('host') || "";

    if (!host.includes('support.iboosts.gg')) {
        redirect('https://support.iboosts.gg/');
    }

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
