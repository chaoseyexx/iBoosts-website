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
        <div className="flex h-screen bg-[#0d1117] text-[#c9d1d9] overflow-hidden">
            <Toaster position="top-right" theme="dark" richColors />
            <AdminSidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-[#0d1117]">
                <div className="max-w-7xl mx-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
