"use client";

import * as React from "react";
import { Sidebar } from "@/components/layout/sidebar";

export default function SellerDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isCollapsed, setIsCollapsed] = React.useState(false);

    return (
        <div className="flex h-screen bg-[var(--bg-primary)]">
            <Sidebar
                variant="seller"
                isCollapsed={isCollapsed}
                onToggle={() => setIsCollapsed(!isCollapsed)}
            />
            <div className="flex flex-1 flex-col overflow-hidden">
                <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
        </div>
    );
}
