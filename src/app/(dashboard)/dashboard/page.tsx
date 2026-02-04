"use client";

import * as React from "react";

// Redirect /dashboard to /dashboard/wallet (main dashboard)
export default function DashboardIndexPage() {
    React.useEffect(() => {
        window.location.href = "/dashboard/wallet";
    }, []);

    return (
        <div className="flex h-[50vh] items-center justify-center">
            <div className="text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#f5a623] border-t-transparent mx-auto mb-4" />
                <p className="text-[var(--text-muted)]">Loading dashboard...</p>
            </div>
        </div>
    );
}
