import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma/client";
import { AdminSidebar } from "./Sidebar";
import { Toaster } from "sonner";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch user from DB to check role
    const dbUser = await prisma.user.findUnique({
        where: { supabaseId: user.id },
    });

    if (!dbUser || dbUser.role !== "ADMIN") {
        redirect("/dashboard");
    }

    return (
        <div className="flex h-screen bg-[#0a0e13] text-[#fdfcf0] overflow-hidden relative font-sans">
            <AdminSidebar />

            {/* Main Content Viewport */}
            <main className="flex-1 overflow-y-auto relative z-10 no-scrollbar">
                <div className="min-h-full max-w-[1600px] mx-auto p-6 md:p-8 lg:p-10 relative">
                    {children}
                </div>
            </main>
        </div>
    );
}
