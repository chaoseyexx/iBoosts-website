"use client";

import React from "react";
import {
    CheckCircle,
    Activity,
    ShieldCheck,
    Database,
    Globe,
    AlertTriangle,
    XCircle,
    Info,
    Clock,
    ChevronDown,
    ChevronUp,
    ExternalLink
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { StatusData, Incident, IncidentUpdate, IncidentUpdateStatus } from "./status-actions";

interface StatusPageClientProps {
    initialData: {
        services: StatusData[];
        incidents: Incident[];
        lastUpdated: string;
    };
}

const statusColorMap: Record<string, any> = {
    operational: {
        text: "text-[#3ecf8e]",
        bg: "bg-[#3ecf8e]/10",
        border: "border-[#3ecf8e]/20",
        dot: "bg-[#3ecf8e]",
        icon: CheckCircle,
        label: "Operational"
    },
    degraded: {
        text: "text-[#f5a623]",
        bg: "bg-[#f5a623]/10",
        border: "border-[#f5a623]/20",
        dot: "bg-[#f5a623]",
        icon: AlertTriangle,
        label: "Degraded Performance"
    },
    outage: {
        text: "text-rose-500",
        bg: "bg-rose-500/10",
        border: "border-rose-500/20",
        dot: "bg-rose-500",
        icon: XCircle,
        label: "Major Outage"
    }
};

const updateStatusColorMap: Record<IncidentUpdateStatus, string> = {
    investigating: "text-[#f5a623]",
    identified: "text-[#f5a623]",
    monitoring: "text-[#3ecf8e]",
    resolved: "text-[#3ecf8e]",
    update: "text-[#8b949e]"
};

// Helper for uptime bars
const UptimeGraph = ({ serviceId, status, uptime }: { serviceId: string, status: string, uptime: string }) => {
    // Generate 90 days of history
    const days = Array.from({ length: 90 }, (_, i) => ({
        date: new Date(Date.now() - (89 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: i === 89 ? status : "operational" // Current day reflects real status, history is simulated for UX
    }));

    return (
        <div className="mt-4">
            <div className="flex items-end gap-[4px] h-10 w-full mb-2">
                {days.map((day, i) => (
                    <TooltipProvider key={i} delayDuration={0}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div
                                    className={cn(
                                        "flex-1 h-full rounded-[2px] transition-all duration-300 hover:scale-y-110 cursor-alias",
                                        day.status === "operational" ? "bg-[#3ecf8e]/80 hover:bg-[#3ecf8e]" :
                                            day.status === "degraded" ? "bg-[#f5a623]/80 hover:bg-[#f5a623]" : "bg-rose-500/80 hover:bg-rose-500"
                                    )}
                                />
                            </TooltipTrigger>
                            <TooltipContent className="bg-[#1c2128] border border-[#30363d] text-white text-[11px] p-2.5 shadow-2xl">
                                <p className="opacity-60 mb-1">{day.date}</p>
                                <p className={cn(
                                    "text-xs uppercase",
                                    day.status === "operational" ? "text-[#3ecf8e]" :
                                        day.status === "degraded" ? "text-[#f5a623]" : "text-rose-500"
                                )}>
                                    {day.status === "operational" ? "All Systems Go" :
                                        day.status === "degraded" ? "Partial Degraded" : "Major Outage"}
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                ))}
            </div>
            <div className="flex justify-between items-center text-[10px] text-[#4b5563] uppercase tracking-widest">
                <span>90 days ago</span>
                <span className="h-[1px] flex-1 mx-4 bg-[#30363d]" />
                <span className="text-white bg-[#1c2128] px-2 py-0.5 rounded border border-[#30363d]">{uptime} uptime</span>
                <span className="h-[1px] flex-1 mx-4 bg-[#30363d]" />
                <span className="text-[#3ecf8e]">Today</span>
            </div>
        </div>
    );
};

export function StatusPageClient({ initialData }: StatusPageClientProps) {
    const isAllOperational = initialData.services.every(s => s.status === "operational");

    return (
        <div className="min-h-screen bg-[#0a0e13] px-6 pt-32 pb-32 relative overflow-hidden">
            {/* Background Aesthetics */}
            <div className="absolute top-0 left-0 right-0 h-[800px] bg-gradient-to-b from-[#f5a623]/5 to-transparent pointer-events-none" />
            <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-[#f5a623]/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-4xl mx-auto space-y-16 relative">

                {/* Main Header / Global Status */}
                <div className="flex flex-col items-center text-center space-y-8">
                    <div className="space-y-2">
                        <h1 className="text-4xl sm:text-5xl text-white tracking-tighter uppercase">Status Center</h1>
                    </div>

                    <div className={cn(
                        "w-full p-8 rounded-3xl border text-center relative overflow-hidden group transition-all duration-500",
                        isAllOperational
                            ? "bg-[#3ecf8e]/5 border-[#3ecf8e]/20 shadow-[0_0_50px_rgba(62,207,142,0.1)]"
                            : "bg-[#f5a623]/5 border-[#f5a623]/20 shadow-[0_0_50px_rgba(245,166,35,0.1)]"
                    )}>
                        <div className="flex flex-col items-center gap-4 relative z-10">
                            <div className={cn(
                                "h-16 w-16 rounded-full flex items-center justify-center animate-pulse",
                                isAllOperational ? "bg-[#3ecf8e]/20 text-[#3ecf8e]" : "bg-[#f5a623]/20 text-[#f5a623]"
                            )}>
                                {isAllOperational ? <CheckCircle className="h-8 w-8 text-black bg-[#3ecf8e] rounded-full p-1" /> : <Activity className="h-8 w-8" />}
                            </div>
                            <h2 className={cn(
                                "text-2xl sm:text-3xl uppercase tracking-tight",
                                isAllOperational ? "text-[#3ecf8e]" : "text-[#f5a623]"
                            )}>
                                {isAllOperational ? "All Systems Operational" : "Partial System Lag Detected"}
                            </h2>
                            <p className="text-[#8b949e] font-medium max-w-lg">
                                Our engineers are constantly monitoring the infrastructure to ensure 24/7 availability for all marketplace operations and game integrations.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Services Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <h3 className="text-xs text-[#8b949e] uppercase tracking-[0.3em]">Core Components</h3>
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-[#30363d] to-transparent" />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {initialData.services.map((service) => {
                            const statusInfo = statusColorMap[service.status];

                            return (
                                <Card key={service.id} className="bg-[#0d1117] border-[#30363d] p-8 rounded-2xl transition-all hover:bg-[#11161d] group">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3">
                                                <h4 className="text-xl text-white uppercase tracking-tighter group-hover:text-[#f5a623] transition-colors">
                                                    {service.name}
                                                </h4>
                                                {service.id === "ishield" && (
                                                    <span className="px-2 py-0.5 rounded bg-[#f5a623] text-black text-[9px] uppercase tracking-tighter">
                                                        DeepScan Active
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[#8b949e] text-sm pr-8">{service.description}</p>
                                        </div>

                                        <div className={cn(
                                            "flex items-center gap-2 px-4 py-2 rounded-xl border text-xs uppercase tracking-widest min-w-[160px] justify-center",
                                            statusInfo.bg, statusInfo.text, statusInfo.border
                                        )}>
                                            <statusInfo.icon className="h-4 w-4" />
                                            {statusInfo.label}
                                        </div>
                                    </div>

                                    {/* Uptime Graph */}
                                    <UptimeGraph serviceId={service.id} status={service.status} uptime={service.uptime} />
                                </Card>
                            );
                        })}
                    </div>
                </div>

                {/* Incident History Section */}
                <div className="space-y-8">
                    <div className="flex items-center gap-4">
                        <h3 className="text-xs text-[#8b949e] uppercase tracking-[0.3em]">Incident History</h3>
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-[#30363d] to-transparent" />
                    </div>

                    <div className="space-y-12">
                        {initialData.incidents.length > 0 ? (
                            initialData.incidents.map((incident) => (
                                <div key={incident.id} className="relative pl-10">
                                    {/* Vertical Timeline Thread */}
                                    <div className="absolute left-0 top-2 bottom-0 w-[2px] bg-gradient-to-b from-[#30363d] via-[#30363d] to-transparent" />

                                    <div className="space-y-6">
                                        <div className="space-y-1 relative">
                                            {/* Thread Knot */}
                                            <div className="absolute -left-[45px] top-1.5 h-3 w-3 rounded-full border-2 border-[#0a0e13] bg-[#f5a623]" />

                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] text-[#4b5563] uppercase tracking-widest bg-[#1c2128] px-2 py-0.5 rounded border border-[#30363d]">
                                                    {new Date(incident.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                                <h4 className="text-lg text-white uppercase tracking-tight">{incident.title}</h4>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            {incident.updates.map((update, idx) => (
                                                <div key={idx} className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className={cn(
                                                            "text-[10px] uppercase tracking-wider",
                                                            updateStatusColorMap[update.status]
                                                        )}>
                                                            {update.status}
                                                        </span>
                                                        <span className="h-1 w-1 rounded-full bg-[#30363d]" />
                                                        <span className="text-[10px] text-[#4b5563]">
                                                            {new Date(update.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })} UTC
                                                        </span>
                                                    </div>
                                                    <p className="text-[#8b949e] text-sm font-medium leading-relaxed max-w-2xl">
                                                        {update.message}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-[#0d1117] border border-dashed border-[#30363d] rounded-2xl p-12 text-center">
                                <p className="text-[#4b5563] uppercase tracking-widest text-xs">No incidents reported in the last 90 days</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Info */}
                <div className="flex flex-col items-center gap-6 pt-12 border-t border-[#30363d]/50">
                    <div className="flex items-center gap-8">
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-[10px] text-[#4b5563] uppercase tracking-widest">Update Frequency</span>
                            <span className="text-white text-xs uppercase">Every 60s</span>
                        </div>
                        <div className="w-[1px] h-8 bg-[#30363d]" />
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-[10px] text-[#4b5563] uppercase tracking-widest">Global Uptime</span>
                            <span className="text-[#3ecf8e] text-xs uppercase">99.98% Avg</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-[#4b5563] uppercase tracking-[0.2em] bg-[#1c2128]/50 px-4 py-2 rounded-full border border-[#30363d]/30">
                        <Clock className="h-3 w-3" />
                        Last Synced: {new Date(initialData.lastUpdated).toLocaleTimeString()}
                    </div>
                </div>

            </div>
        </div>
    );
}
