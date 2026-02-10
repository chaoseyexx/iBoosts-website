"use client";

import * as React from "react";
import { useState, useEffect, useTransition } from "react";
import {
    Settings,
    Shield,
    DollarSign,
    Save,
    RefreshCcw,
    Clock,
    AlertTriangle,
    CheckCircle2,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
    fetchPlatformFees,
    updatePlatformFee,
    fetchPlatformConfigs,
    updatePlatformConfig
} from "../actions";

export default function AdminSettingsPage() {
    const [fees, setFees] = useState<any[]>([]);
    const [configs, setConfigs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, startTransition] = useTransition();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const [fetchedFees, fetchedConfigs] = await Promise.all([
            fetchPlatformFees(),
            fetchPlatformConfigs()
        ]);
        setFees(fetchedFees);
        setConfigs(fetchedConfigs);
        setLoading(false);
    };

    const handleUpdateFee = async (id: string, value: number) => {
        startTransition(async () => {
            const result = await updatePlatformFee(id, value);
            if (result.success) {
                toast.success("Fee updated successfully");
                loadData();
            } else {
                toast.error(result.error || "Failed to update fee");
            }
        });
    };

    const handleUpdateConfig = async (id: string, value: any) => {
        startTransition(async () => {
            const result = await updatePlatformConfig(id, value);
            if (result.success) {
                toast.success("Configuration updated successfully");
                loadData();
            } else {
                toast.error(result.error || "Failed to update configuration");
            }
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 text-[#f5a623] animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700 relative z-10">
            {/* HUD Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-[#f5a623] shadow-[0_0_8px_rgba(245,166,35,0.6)]" />
                        <span className="text-[10px] font-black text-[#f5a623] uppercase tracking-[0.3em]">System Matrix</span>
                    </div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Global <span className="text-[#f5a623]">Settings</span></h1>
                    <p className="text-white/20 text-xs font-black uppercase tracking-[0.1em] mt-1">Configure platform logic, marketplace fees, and operational constants</p>
                </div>
                <Button
                    variant="outline"
                    onClick={loadData}
                    className="bg-[#f5a623]/5 border-[#f5a623]/20 hover:bg-[#f5a623]/10 text-[#f5a623] uppercase text-[10px] font-black tracking-widest gap-2"
                >
                    <RefreshCcw className="h-3.5 w-3.5" />
                    Sync Data
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Marketplace Fees */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-[#f5a623]/10 flex items-center justify-center">
                            <DollarSign className="h-5 w-5 text-[#f5a623]" />
                        </div>
                        <h2 className="text-sm font-black text-white uppercase tracking-widest">Marketplace Fees</h2>
                    </div>

                    <div className="grid gap-4">
                        {fees.length === 0 ? (
                            <p className="text-white/40 text-xs italic">No dynamic fees found. Using hardcoded defaults.</p>
                        ) : fees.map((fee) => (
                            <div key={fee.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm group hover:border-[#f5a623]/30 transition-all">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-black text-white/60 uppercase tracking-widest">{fee.name}</span>
                                    <span className="text-[10px] font-black text-[#f5a623] bg-[#f5a623]/10 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                        {fee.type === "PERCENTAGE" ? "Percent" : "Flat Fee"}
                                    </span>
                                </div>
                                <p className="text-[10px] text-white/30 mb-4">{fee.description}</p>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 text-xs">
                                            {fee.type === "PERCENTAGE" ? "%" : "$"}
                                        </div>
                                        <Input
                                            type="number"
                                            defaultValue={fee.type === "PERCENTAGE" ? (fee.value * 100) : fee.value}
                                            className="pl-8 bg-black/40 border-white/10 text-white h-9 text-sm"
                                            onBlur={(e) => {
                                                const val = parseFloat(e.target.value);
                                                if (fee.type === "PERCENTAGE") handleUpdateFee(fee.id, val / 100);
                                                else handleUpdateFee(fee.id, val);
                                            }}
                                        />
                                    </div>
                                    <Button size="icon" className="h-9 w-9 bg-white/5 border border-white/10 hover:border-[#f5a623]/50 text-white">
                                        <Save className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Constants */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-[#f5a623]/10 flex items-center justify-center">
                            <Settings className="h-5 w-5 text-[#f5a623]" />
                        </div>
                        <h2 className="text-sm font-black text-white uppercase tracking-widest">Platform Configuration</h2>
                    </div>

                    <div className="grid gap-4">
                        {configs.length === 0 ? (
                            <p className="text-white/40 text-xs italic">No dynamic configurations found.</p>
                        ) : configs.map((config) => (
                            <div key={config.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm group hover:border-[#f5a623]/30 transition-all">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-black text-white/60 uppercase tracking-widest">{config.key.replace(/_/g, " ")}</span>
                                </div>
                                <p className="text-[10px] text-white/30 mb-4">{config.description}</p>
                                <div className="flex gap-2">
                                    <Input
                                        defaultValue={typeof config.value === "object" ? JSON.stringify(config.value) : config.value}
                                        className="bg-black/40 border-white/10 text-white h-9 text-sm"
                                        onBlur={(e) => {
                                            let val = e.target.value;
                                            try { val = JSON.parse(val); } catch (e) { }
                                            handleUpdateConfig(config.id, val);
                                        }}
                                    />
                                    <Button size="icon" className="h-9 w-9 bg-white/5 border border-white/10 hover:border-[#f5a623]/50 text-white">
                                        <Save className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Operational Alerts */}
                    <div className="p-5 bg-amber-500/5 border border-amber-500/20 rounded-2xl border-dashed">
                        <div className="flex items-center gap-2 mb-3">
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Operational Protocol</span>
                        </div>
                        <p className="text-[10px] text-amber-500/60 leading-relaxed uppercase font-bold">
                            Changes to global settings take effect immediately across all active sessions.
                            Calculations for ongoing orders will remain cached until their next state transition.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
