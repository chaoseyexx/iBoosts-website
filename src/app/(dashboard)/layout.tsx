
import * as React from "react";
import { createClient } from "@/lib/supabase/server";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { MainNavbar } from "@/components/layout/main-navbar";
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
            avatar: profile?.avatar || authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture,
            registeredAt: registeredDate,
            verified: true,
        };
    }

    return (
        <div data-dashboard className="dashboard-theme min-h-screen bg-[#0a0e13]">
            {/* Fixed Navbar */}
            <MainNavbar variant="dashboard" user={userData ? {
                id: authUser?.id || '',
                email: authUser?.email || '',
                username: userData.username,
                avatar: userData.avatar || undefined
            } : null} />

            {/* Content area with sidebar - positioned below fixed navbar */}
            <div className="flex pt-[60px]">
                {/* Sidebar */}
                <React.Suspense fallback={<div className="w-64 bg-[#0d1117] border-r border-[#2d333b]/40" />}>
                    {/* @ts-ignore */}
                    <DashboardSidebar user={userData || undefined} />
                </React.Suspense>

                {/* Main Content */}
                <main className="flex-1 min-h-[calc(100vh-60px)] overflow-y-auto bg-[#0a0e13] p-6">
                    {/* Max width container to keep space on right side */}
                    <div className="max-w-[1200px] w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
