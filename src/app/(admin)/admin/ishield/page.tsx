"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Shield, Zap, Eye, Brain, Lock, CheckCircle, ArrowRight,
    Activity, Terminal, ShieldCheck, Cpu, Settings, LayoutDashboard,
    AlertTriangle, Server, Database, Bot
} from "lucide-react";
import { Logo } from "@/components/ui/logo";

interface AgentLog {
    id: string;
    agentName: string;
    level: string;
    message: string;
    createdAt: string;
}

interface SystemHealth {
    id: string;
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    dbLatency: number;
    timestamp: string;
}

interface AgentConfig {
    enabled: boolean;
    generateSEO?: boolean;
    generateSocial?: boolean;
}

interface IShieldConfig {
    agents: Record<string, AgentConfig>;
    patrolInterval: number;
}

const AGENTS_LIST = [
    { name: "TheJudge", icon: <Shield className="h-4 w-4" />, desc: "Arbitration" },
    { name: "TheDetective", icon: <Eye className="h-4 w-4" />, desc: "Validation" },
    { name: "TheAuditor", icon: <ShieldCheck className="h-4 w-4" />, desc: "Verification" },
    { name: "TheGuardian", icon: <Lock className="h-4 w-4" />, desc: "Protection" },
    { name: "TheBroker", icon: <Activity className="h-4 w-4" />, desc: "Pricing" },
    { name: "TheConcierge", icon: <Brain className="h-4 w-4" />, desc: "Support" },
    { name: "TheSentry", icon: <Server className="h-4 w-4" />, desc: "DevOps" },
    { name: "TheHerald", icon: <Zap className="h-4 w-4" />, desc: "Content" },
    { name: "TheAccountant", icon: <Database className="h-4 w-4" />, desc: "Finance" },
    { name: "TheArchitect", icon: <Cpu className="h-4 w-4" />, desc: "Strategy" },
];

const DEFAULT_CONFIG: IShieldConfig = {
    agents: {},
    patrolInterval: 60,
};

export default function IShieldAdminConsole() {
    const [view, setView] = useState<"console" | "settings">("console");
    const [logs, setLogs] = useState<AgentLog[]>([]);
    const [health, setHealth] = useState<SystemHealth | null>(null);
    const [config, setConfig] = useState<IShieldConfig>(DEFAULT_CONFIG);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchData = async () => {
        try {
            const res = await fetch("/api/admin/ishield");
            const data = await res.json();
            setLogs(data.logs || []);
            setHealth(data.health || null);
        } catch (e) {
            console.error("Failed to fetch iShield data", e);
        } finally {
            setLoading(false);
        }
    };

    const fetchConfig = async () => {
        try {
            const res = await fetch("/api/admin/ishield/config");
            const data = await res.json();
            if (data.agents) setConfig(data);
        } catch (e) {
            console.error("Failed to fetch config", e);
        }
    };

    useEffect(() => {
        fetchData();
        fetchConfig();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    const toggleAgent = async (agentName: string) => {
        const newAgents = {
            ...config.agents,
            [agentName]: {
                ...config.agents[agentName],
                enabled: !config.agents[agentName]?.enabled,
            },
        };
        const newConfig = { ...config, agents: newAgents };
        setConfig(newConfig);

        try {
            await fetch("/api/admin/ishield/config", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newConfig),
            });
        } catch (e) {
            console.error("Failed to sync agent toggle", e);
        }
    };

    if (loading) {
        return (
            <div className="h-screen bg-[#0a0e13] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Logo className="h-8 w-auto animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f5a623]">Booting iShield OS...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 relative z-10 animate-in fade-in duration-700">
            {/* Page Header - Streamlined for HUD feel */}
            <div className="flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-[#f5a623]/10 border border-[#f5a623]/20 flex items-center justify-center">
                        <Bot className="h-6 w-6 text-[#f5a623]" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-widest text-white uppercase flex items-center gap-2">
                            iShield AI <span className="text-[10px] text-[#f5a623] bg-[#f5a623]/10 px-2 py-0.5 rounded border border-[#f5a623]/20">OS v4.2.0</span>
                        </h1>
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Autonomous Defense & Arbitration System</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-white/[0.03] border border-white/5 p-1 rounded-xl">
                        <button
                            onClick={() => setView("console")}
                            className={`h-9 px-6 flex items-center gap-2 rounded-lg transition-all text-[10px] font-black uppercase tracking-widest ${view === 'console' ? 'bg-[#f5a623] text-black shadow-[0_0_15px_rgba(245,166,35,0.4)]' : 'text-white/40 hover:text-white'}`}
                        >
                            <LayoutDashboard className="h-3 w-3" /> Console
                        </button>
                        <button
                            onClick={() => setView("settings")}
                            className={`h-9 px-6 flex items-center gap-2 rounded-lg transition-all text-[10px] font-black uppercase tracking-widest ${view === 'settings' ? 'bg-[#f5a623] text-black shadow-[0_0_15px_rgba(245,166,35,0.4)]' : 'text-white/40 hover:text-white'}`}
                        >
                            <Settings className="h-3 w-3" /> Engine
                        </button>
                    </div>
                    <div className="h-8 w-[1px] bg-white/5 mx-2" />
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Core Online</span>
                    </div>
                </div>
            </div>

            {/* Main Console Interface */}
            <div className="flex-1 min-h-0">
                {view === "console" ? (
                    <div className="grid grid-cols-12 gap-6 h-full">
                        {/* Status Column */}
                        <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
                            {/* Health Monitor */}
                            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:border-[#f5a623]/20 transition-all group backdrop-blur-sm">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 flex items-center gap-2 mb-6 group-hover:text-white/40 transition-colors">
                                    <Activity className="h-3.5 w-3.5 text-[#f5a623]" /> Sentry Monitor
                                </h3>
                                <div className="space-y-6">
                                    {[
                                        { label: "CPU Usage", val: health?.cpuUsage || 0, color: "bg-[#f5a623]" },
                                        { label: "Memory", val: health?.memoryUsage || 0, color: "bg-[#f5a623]/60" },
                                        { label: "Storage", val: health?.diskUsage || 0, color: "bg-[#f5a623]/30" },
                                    ].map((item) => (
                                        <div key={item.label}>
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2 opacity-40">
                                                <span>{item.label}</span>
                                                <span>{item.val}%</span>
                                            </div>
                                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${item.color} transition-all duration-1000 shadow-[0_0_8px_rgba(245,166,35,0.3)]`}
                                                    style={{ width: `${item.val}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    <div className="pt-2 flex items-center justify-between border-t border-white/5 mt-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-20">Network Delay</span>
                                        <span className="text-xs font-mono text-[#f5a623] font-black">{health?.dbLatency || 0}ms</span>
                                    </div>
                                </div>
                            </div>

                            {/* Active Agents Summary */}
                            <div className="flex-1 min-h-0 bg-white/[0.02] border border-white/5 rounded-2xl p-6 overflow-hidden flex flex-col hover:border-[#f5a623]/20 transition-all backdrop-blur-sm">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 flex items-center gap-2 mb-6 shrink-0">
                                    <Cpu className="h-3.5 w-3.5 text-[#f5a623]" /> Neural Clusters
                                </h3>
                                <div className="flex-1 overflow-y-auto pr-2 space-y-2 no-scrollbar">
                                    {AGENTS_LIST.map((agent) => {
                                        const isEnabled = config.agents[agent.name]?.enabled !== false;
                                        return (
                                            <div
                                                key={agent.name}
                                                className={`p-4 rounded-xl border transition-all flex items-center justify-between group ${isEnabled ? 'bg-white/[0.03] border-white/5 hover:border-[#f5a623]/30' : 'bg-red-500/5 border-red-500/10 opacity-40 grayscale'}`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center transition-all ${isEnabled ? 'bg-[#f5a623]/10 text-[#f5a623]' : 'bg-white/5 text-white'}`}>
                                                        {agent.icon}
                                                    </div>
                                                    <div>
                                                        <div className="text-[11px] font-black uppercase tracking-widest text-white/80">
                                                            {agent.name.replace("The", "")}
                                                        </div>
                                                        <div className="text-[9px] font-black opacity-20 uppercase tracking-tighter">
                                                            {agent.desc}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2.5">
                                                    <div className={`h-1.5 w-1.5 rounded-full ${isEnabled ? 'bg-[#f5a623] animate-pulse shadow-[0_0_10px_rgba(245,166,35,0.8)]' : 'bg-red-500'}`} />
                                                    <span className={`text-[9px] font-black uppercase tracking-widest ${isEnabled ? 'text-[#f5a623]' : 'text-red-500'}`}>
                                                        {isEnabled ? 'LIVE' : 'IDLE'}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Logs Column */}
                        <div className="col-span-12 lg:col-span-6 flex flex-col min-h-[500px] lg:min-h-0 relative">
                            <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-3xl p-0 flex flex-col overflow-hidden group hover:border-[#f5a623]/20 transition-all backdrop-blur-sm">
                                <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0 bg-white/[0.01]">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 flex items-center gap-2">
                                        <Terminal className="h-3.5 w-3.5 text-[#f5a623]" /> Terminal Feed
                                    </h3>
                                    <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-white/10">
                                        <span className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500/50" /> STDOUT</span>
                                        <span className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-red-500/50" /> STDERR</span>
                                    </div>
                                </div>
                                <div className="flex-1 overflow-y-auto p-6 font-mono text-[12px] leading-relaxed no-scrollbar bg-black/40">
                                    {logs.length === 0 ? (
                                        <div className="h-full flex items-center justify-center text-white/5 italic uppercase tracking-[0.2em]">
                                            {`> WAITING FOR SYSTEM_BURST...`}
                                        </div>
                                    ) : (
                                        logs.map((log) => (
                                            <div key={log.id} className="mb-3 flex gap-4 group/log animate-in fade-in slide-in-from-left-4 duration-500">
                                                <span className="text-white/10 shrink-0 font-black">[{new Date(log.createdAt).toLocaleTimeString([], { hour12: false })}]</span>
                                                <span className={`font-black shrink-0 tracking-widest ${log.level === 'ERROR' ? 'text-red-500' :
                                                    log.level === 'WARNING' ? 'text-amber-500' :
                                                        'text-[#f5a623]'
                                                    }`}>
                                                    {log.agentName.toUpperCase()}
                                                </span>
                                                <span className="text-white/50 group-hover/log:text-white/80 transition-colors uppercase font-medium">{log.message}</span>
                                            </div>
                                        ))
                                    )}
                                    <div className="animate-pulse text-[#f5a623] mt-4 font-black">_</div>
                                </div>
                            </div>
                        </div>

                        {/* Operations Column */}
                        <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
                            {/* System Overdrive Toggle */}
                            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:border-[#f5a623]/20 transition-all flex items-center justify-between group backdrop-blur-sm">
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-1 group-hover:text-white/40 transition-colors">Autonomous Mode</h3>
                                    <p className="text-[9px] text-[#f5a623]/40 uppercase font-black tracking-widest">Self-Healing Active</p>
                                </div>
                                <div className="h-12 w-20 bg-[#f5a623]/10 border border-[#f5a623]/20 rounded-full p-1.5 flex items-center cursor-pointer hover:bg-[#f5a623]/20 transition-all">
                                    <div className="h-9 w-9 bg-[#f5a623] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(245,166,35,0.5)] translate-x-8 transition-transform">
                                        <Zap className="h-4 w-4 text-black" fill="currentColor" />
                                    </div>
                                </div>
                            </div>

                            {/* Quick Stats Grid */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 group hover:border-[#f5a623]/20 transition-all backdrop-blur-sm">
                                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 group-hover:text-[#f5a623] transition-colors">Scans</span>
                                    <span className="text-3xl font-black text-white px-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">1,284</span>
                                </div>
                                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 group hover:border-red-500/20 transition-all backdrop-blur-sm">
                                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 group-hover:text-red-500 transition-colors">Blocked</span>
                                    <span className="text-3xl font-black text-red-500 px-2 drop-shadow-[0_0_10px_rgba(239,68,68,0.2)]">42</span>
                                </div>
                            </div>

                            {/* Integrity Board */}
                            <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-3xl p-6 overflow-hidden flex flex-col hover:border-[#f5a623]/20 transition-all backdrop-blur-sm">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 flex items-center gap-2 mb-6 shrink-0">
                                    <Shield className="h-3.5 w-3.5 text-[#f5a623]" /> Defense Log
                                </h3>
                                <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar">
                                    {[
                                        { type: "Listing", agent: "Auditor", status: "VERIFIED", val: "M02-K9" },
                                        { type: "Dispute", agent: "Judge", status: "RESOLVED", val: "CASE-492" },
                                        { type: "Fraud", agent: "Detective", status: "BLOCKED", val: "IP:82.x.x" },
                                        { type: "Chat", agent: "Guardian", status: "FILTERED", val: "POLICY-A" },
                                        { type: "SEO", agent: "Herald", status: "GEN", val: "BLOG-093" },
                                    ].map((item, i) => (
                                        <div key={i} className="flex flex-col gap-1.5 pb-4 border-b border-white/5 last:border-0 group/item transition-colors hover:bg-white/[0.01]">
                                            <div className="flex items-center justify-between text-[10px] font-black uppercase">
                                                <span className="text-white/40 tracking-[0.2em] group-hover/item:text-white/60 transition-colors">{item.type}</span>
                                                <span className="text-[#f5a623] tracking-tighter shadow-[#f5a623]/20">{item.status}</span>
                                            </div>
                                            <div className="flex items-center justify-between font-mono text-[9px] opacity-20 group-hover/item:opacity-40 transition-opacity">
                                                <span>{item.agent.toUpperCase()}</span>
                                                <span>{item.val}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Engine Configuration Tab */
                    <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                            {AGENTS_LIST.map((agent) => {
                                const isEnabled = config.agents[agent.name]?.enabled !== false;
                                return (
                                    <div
                                        key={agent.name}
                                        className={`p-8 rounded-3xl border transition-all flex flex-col h-full group ${isEnabled ? 'bg-white/[0.03] border-white/10 hover:border-[#f5a623]/40' : 'bg-red-500/5 border-red-500/20 opacity-60'}`}
                                    >
                                        <div className="flex items-start justify-between mb-8">
                                            <div className="flex items-center gap-5">
                                                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all ${isEnabled ? 'bg-[#f5a623] text-black shadow-[0_0_30px_rgba(245,166,35,0.4)]' : 'bg-white/5 text-white/20'}`}>
                                                    {agent.icon}
                                                </div>
                                                <div>
                                                    <h3 className="text-md font-black uppercase tracking-widest text-white">{agent.name.replace("The", "")}</h3>
                                                    <span className="text-[10px] font-black opacity-20 uppercase tracking-[0.2em]">{agent.desc}</span>
                                                </div>
                                            </div>
                                            <div
                                                onClick={() => toggleAgent(agent.name)}
                                                className={`w-14 h-7 rounded-full p-1 cursor-pointer transition-all relative ${isEnabled ? 'bg-[#f5a623]/20 border border-[#f5a623]/40' : 'bg-white/5 border border-white/10'}`}
                                            >
                                                <div className={`h-4.5 w-4.5 bg-white rounded-full transition-all shadow-[0_0_10px_rgba(255,255,255,0.3)] ${isEnabled ? 'translate-x-7 bg-[#f5a623]' : 'translate-x-0 bg-white/20'}`} />
                                            </div>
                                        </div>
                                        <p className="text-[11px] text-white/40 leading-relaxed mb-10 font-medium uppercase tracking-tight">
                                            Integrated neural matrix configuration for operational {agent.name} protocols. Parameters sync across active marketplace nodes.
                                        </p>
                                        <div className="mt-auto pt-8 border-t border-white/5 flex gap-3">
                                            <button className="flex-1 h-11 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:border-[#f5a623]/20">Trace</button>
                                            <button className="flex-1 h-11 bg-[#f5a623]/5 hover:bg-[#f5a623]/10 border border-[#f5a623]/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#f5a623] transition-all hover:border-[#f5a623]/40">Tune</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Tech Footer Bar - Unified HUD style */}
            <footer className="shrink-0 pt-4 flex items-center justify-between font-mono text-[9px] text-white/10 uppercase tracking-[0.2em]">
                <div className="flex gap-6">
                    <span className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-[#f5a623] shadow-[0_0_5px_rgba(245,166,35,0.4)]" /> NODE_STATUS: SYNCED</span>
                    <span className="hidden sm:inline">LATENCY: 114ms</span>
                    <span className="hidden md:inline">SYSTEM_UPTIME: 99.998%</span>
                </div>
                <div className="font-black opacity-30">
                    Proprietary iShield Neural Defense Unit
                </div>
            </footer>
        </div>
    );
}
