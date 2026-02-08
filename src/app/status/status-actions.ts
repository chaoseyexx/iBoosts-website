"use server";

import { prisma } from "@/lib/prisma/client";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export type ServiceStatus = "operational" | "degraded" | "outage";
export type IncidentSeverity = "low" | "medium" | "high";
export type IncidentUpdateStatus = "investigating" | "identified" | "monitoring" | "resolved" | "update";

export interface IncidentUpdate {
    status: IncidentUpdateStatus;
    message: string;
    timestamp: string;
}

export interface Incident {
    id: string;
    title: string;
    description?: string;
    date: string;
    affectedServices: string[];
    severity: IncidentSeverity;
    updates: IncidentUpdate[];
}

export interface StatusData {
    id: string;
    name: string;
    status: ServiceStatus;
    uptime: string;
    description: string;
}

export interface StatusResponse {
    services: StatusData[];
    incidents: Incident[];
    lastUpdated: string;
}

export async function getSystemStatus(): Promise<StatusResponse> {
    const statuses: StatusData[] = [
        {
            id: "website",
            name: "Website & Marketplace",
            status: "operational",
            uptime: "99.98%",
            description: "Frontend application and user dashboard accessibility"
        }
    ];

    // 1. Check Database
    let dbStatus: ServiceStatus = "operational";
    try {
        await prisma.$queryRaw`SELECT 1`;
    } catch (error) {
        console.error("Status Check: Database Error", error);
        dbStatus = "outage";
    }
    statuses.push({
        id: "database",
        name: "Database Clusters",
        status: dbStatus,
        uptime: "100.00%",
        description: "Primary and replica database nodes handling user data and listings"
    });

    // 2. Check Authentication
    let authStatus: ServiceStatus = "operational";
    try {
        const cookieStore = await cookies();
        const client = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) { return cookieStore.get(name)?.value },
                    set(name: string, value: string, options: any) { cookieStore.set({ name, value, ...options }) },
                    remove(name: string, options: any) { cookieStore.set({ name, value: "", ...options }) },
                },
            }
        );

        const { error } = await client.auth.getSession();
        if (error) throw error;
    } catch (error) {
        console.error("Status Check: Auth Error", error);
        authStatus = "degraded";
    }

    statuses.push({
        id: "auth",
        name: "Authentication",
        status: authStatus,
        uptime: "99.99%",
        description: "User login, registration and session management systems"
    });

    statuses.push({
        id: "ishield",
        name: "iShield Security",
        status: "operational",
        uptime: "100.00%",
        description: "Active Threat Monitoring & Fraud Prevention Engines"
    });

    // Mock Incident History based on user's request (simplified snapshot)
    const incidents: Incident[] = [
        {
            id: "inc-1",
            title: "Performance degradation in Marketplace search",
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            affectedServices: ["website"],
            severity: "medium",
            updates: [
                {
                    status: "resolved",
                    message: "Search performance has returned to normal levels after indexing optimization.",
                    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString()
                },
                {
                    status: "monitoring",
                    message: "We have deployed a fix and are monitoring search latencies.",
                    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString()
                },
                {
                    status: "investigating",
                    message: "We are investigating increased latency in marketplace search queries.",
                    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
                }
            ]
        },
        {
            id: "inc-2",
            title: "Scheduled Database Maintenance",
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            affectedServices: ["database"],
            severity: "low",
            updates: [
                {
                    status: "resolved",
                    message: "Maintenance completed successfully with no impact on user data.",
                    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000).toISOString()
                },
                {
                    status: "update",
                    message: "Began scheduled maintenance on primary database cluster.",
                    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
                }
            ]
        }
    ];

    return {
        services: statuses,
        incidents: incidents,
        lastUpdated: new Date().toISOString()
    };
}
