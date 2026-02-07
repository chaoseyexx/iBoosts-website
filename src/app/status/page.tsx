import { NavbarServer } from "@/components/layout/navbar-server";
import { Footer } from "@/components/layout/footer";
import { StatusPageClient } from "./client";

export default function StatusPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <NavbarServer variant="landing" />
            <main className="flex-1 bg-[#0a0e13]">
                <StatusPageClient />
            </main>
            <Footer />
        </div>
    );
}
