
import * as React from "react";
import { createClient } from "@/lib/supabase/server";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { NavbarServer } from "@/components/layout/navbar-server";
import prisma from "@/lib/prisma/client";
import "../dashboard.css";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    let userData = null;

    if (authUser) {
        // Fetch from Prisma Source of Truth
        const profile = await prisma.user.findUnique({
            where: { supabaseId: authUser.id }
        });

        // Format date: MM/DD/YY
        const registeredDate = new Date(authUser.created_at).toLocaleDateString('en-US', {
            month: 'numeric',
            day: 'numeric',
            year: '2-digit'
        });

        userData = {
            username: profile?.username || authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "User",
            displayName: null,
            avatar: (profile?.avatar && profile.avatar !== "null") ? profile.avatar : (authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || null),
            registeredAt: registeredDate,
            verified: true,
        };
    }

    return (
        <div data-dashboard className="dashboard-theme min-h-screen bg-[var(--dashboard-bg)]">
            {/* Fixed Navbar (Server-side) */}
            <NavbarServer variant="dashboard" />

            {/* Content area with sidebar - positioned below fixed navbar */}
            <div className="flex pt-[96px]">
                {/* Sidebar */}
                <React.Suspense fallback={<div className="w-64 bg-[#0d1117] border-r border-[#1c2128]" />}>
                    {/* @ts-ignore */}
                    <DashboardSidebar user={userData || undefined} />
                </React.Suspense>

                {/* Main Content */}
                <main className="flex-1 min-h-[calc(100vh-96px)] overflow-y-auto bg-[var(--dashboard-bg)] p-6">
                    {/* Max width container to keep space on right side */}
                    <div className="max-w-[1200px] w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
