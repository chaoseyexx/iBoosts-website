"use client";

import { CheckCircle, Activity, ShieldCheck, Database, Globe, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Mock Data
const services = [
    {
        id: "website",
        name: "Website & Marketplace",
        status: "operational",
        icon: Globe,
        uptime: "99.98%",
        description: "Frontend application and user dashboard"
    },
    {
        id: "api",
        name: "API Gateway",
        status: "operational",
        icon: Database,
        uptime: "99.95%",
        description: "Core backend services and API endpoints"
    },
    {
        id: "database",
        name: "Database Clusters",
        status: "operational",
        icon: Database,
        uptime: "100.00%",
        description: "Primary and replica database nodes"
    },
    {
        id: "auth",
        name: "Authentication",
        status: "operational",
        icon: ShieldCheck,
        uptime: "99.99%",
        description: "User login, registration and session management"
    },
    {
        id: "ishield",
        name: "iShield Security",
        status: "operational",
        icon: ShieldCheck,
        uptime: "100.00%",
        description: "Active Threat Monitoring & Fraud Prevention Engines"
    }
];

// Helper to generate uptime bars
const UptimeGraph = ({ serviceId, uptime }: { serviceId: string, uptime: string }) => {
    // Generate 90 days of mock data
    // Most days are operational (green), maybe 1 or 2 with minor issues for realism if desired, 
    // but for now all green as requested "like supabase" example.
    const days = Array.from({ length: 90 }, (_, i) => ({
        date: new Date(Date.now() - (89 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: "operational"
    }));

    return (
        <div className="mt-4">
            <div className="overflow-x-auto pb-2 scrollbar-hide">
                <div className="flex items-end gap-[3px] h-8 min-w-[600px] md:min-w-0 md:w-full">
                    {days.map((day, i) => (
                        <TooltipProvider key={i} delayDuration={0}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div
                                        className="flex-1 h-full bg-[#3ecf8e] rounded-[1px] hover:opacity-80 transition-opacity cursor-pointer"
                                    />
                                </TooltipTrigger>
                                <TooltipContent className="bg-[#1c2128] border border-[#30363d] text-white text-xs p-2">
                                    <p className="font-bold mb-1">{day.date}</p>
                                    <p className="text-[#3ecf8e]">No downtime recorded on this day.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ))}
                </div>
            </div>
            <div className="flex justify-between items-center mt-1 text-[10px] sm:text-xs text-[#8b949e] font-medium">
                <span>90 days ago</span>
                <span className="text-white font-bold">{uptime} uptime</span>
                <span>Today</span>
            </div>
        </div>
    );
};

const incidents = [
    {
        id: 1,
        title: "No incidents reported today",
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        status: "operational"
    }
];

export function StatusPageClient() {
    return (
        <div className="min-h-screen bg-[#0a0e13] pt-12 pb-24 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-[#f5a623]/5 to-transparent pointer-events-none" />
            <div className="max-w-4xl mx-auto px-6 space-y-12">

                {/* Header Section */}
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">System Status</h1>
                        <div className="flex items-center w-fit gap-2 px-3 py-1.5 bg-[#3ecf8e]/10 border border-[#3ecf8e]/20 rounded-full">
                            <CheckCircle className="h-4 w-4 text-[#3ecf8e]" />
                            <span className="text-xs sm:text-sm font-bold text-[#3ecf8e]">All Systems Operational</span>
                        </div>
                    </div>
                </div>

                {/* Services List */}
                <Card className="bg-[#0d1117] border-[#30363d] overflow-hidden">
                    <div className="divide-y divide-[#30363d]">
                        {services.map((service) => (
                            <div key={service.id} className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                                            {service.name}
                                            {/* iShield badge */}
                                            {service.id === "ishield" && (
                                                <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#f5a623]/10 text-[#f5a623] border border-[#f5a623]/20 uppercase tracking-wide">
                                                    Protected
                                                </div>
                                            )}
                                        </h3>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <div className="h-4 w-4 rounded-full bg-[#1c2128] text-[#8b949e] flex items-center justify-center text-[10px] font-bold cursor-help border border-[#30363d]">?</div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    {service.description}
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                    <div className="flex items-center gap-2 text-[#3ecf8e] text-sm font-bold">
                                        <CheckCircle className="h-4 w-4" />
                                        Operational
                                    </div>
                                </div>

                                {/* Uptime Graph */}
                                <UptimeGraph serviceId={service.id} uptime={service.uptime} />
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Incident History (Simplified) */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white">Past Incidents</h2>
                    <div className="space-y-4">
                        {incidents.map((incident) => (
                            <div key={incident.id} className="border-l-2 border-[#30363d] pl-6 pb-6 relative">
                                <div className="absolute -left-[5px] top-0 h-2.5 w-2.5 rounded-full bg-[#30363d]" />
                                <h3 className="text-white font-bold mb-1">{incident.date}</h3>
                                <p className="text-[#8b949e]">{incident.title}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
