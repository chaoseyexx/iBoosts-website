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
            <AdminSidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative">
                <div className="absolute inset-0 bg-[#0d1117] -z-20" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#f5a62308,transparent_50%)] -z-10" />

                <div className="max-w-[1600px] mx-auto p-10 relative">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#f5a623]/2 rounded-full blur-[120px] -z-10" />
                    {children}
                </div>
            </main>
        </div>
    );
}
