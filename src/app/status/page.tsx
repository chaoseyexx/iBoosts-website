import { NavbarServer } from "@/components/layout/navbar-server";
import { Footer } from "@/components/layout/footer";
import { StatusPageClient } from "./client";
import { getSystemStatus } from "./status-actions";

export const dynamic = "force-dynamic";

export default async function StatusPage() {
    const initialData = await getSystemStatus();

    return (
        <div className="flex flex-col min-h-screen">
            <NavbarServer variant="landing" />
            <main className="flex-1 bg-[#0a0e13]">
                <StatusPageClient initialData={initialData} />
            </main>
            <Footer />
        </div>
    );
}
