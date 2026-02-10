"use client";

import {
    Shield, Cpu, Eye, Lock, Brain, Network, Fingerprint, Binary, CheckCircle, Zap, ShieldCheck
} from "lucide-react";

export function IShieldClient() {
    return (
        <div className="flex-1 relative z-10 flex flex-col items-center justify-start py-4 md:py-8 px-6 max-w-7xl mx-auto w-full min-h-0">
            {/* Background Cinematic FX */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,166,35,0.05),transparent_70%)]" />
                <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-[#f5a623]/5 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-[20%] right-[10%] w-[300px] h-[300px] bg-[#f5a623]/3 rounded-full blur-[80px] animate-pulse duration-5000" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
            </div>

            {/* Visual Anchor - iShield Core - Scaled down for better fit */}
            <div className="relative mb-6 md:mb-8 shrink-0">
                <div className="absolute inset-0 bg-[#f5a623]/20 rounded-full blur-2xl animate-pulse scale-150" />
                <div className="relative h-24 w-24 md:h-32 md:w-32 rounded-full border border-[#f5a623]/30 flex items-center justify-center bg-[#0a0e13] shadow-[0_0_40px_rgba(245,166,35,0.1)]">
                    <div className="absolute inset-1.5 border border-[#f5a623]/10 rounded-full animate-[spin_20s_linear_infinite]" />
                    <div className="absolute inset-3 border-t-2 border-[#f5a623]/30 rounded-full animate-[spin_10s_linear_infinite]" />
                    <Shield className="h-10 w-10 md:h-14 md:w-14 text-[#f5a623] drop-shadow-[0_0_15px_rgba(245,166,35,0.5)] animate-float-slow" />
                </div>
            </div>

            {/* Content HUD */}
            <div className="text-center max-w-3xl mb-8 md:mb-10 relative shrink-0">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f5a623]/10 border border-[#f5a623]/20 mb-3">
                    <Cpu className="h-2.5 w-2.5 text-[#f5a623]" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#f5a623]">Proprietary Neutral Defense</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-3 text-white leading-tight">
                    PROTECTED BY <span className="text-[#f5a623]">iSHIELD AI</span>
                </h1>
                <p className="text-white/40 text-xs md:text-base font-medium leading-relaxed max-w-2xl mx-auto">
                    A proprietary security ecosystem engineered in-house by <span className="text-white">iBoosts.gg</span>.
                    Zero third-party reliance. 100% focused on your trade integrity.
                </p>
            </div>

            {/* Feature Grid - More compact */}
            <div className="w-full grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4 mb-8">
                {[
                    { icon: Eye, title: "Smart Verification", desc: "Live credential & metadata auditing" },
                    { icon: Lock, title: "Fraud Intercept", desc: "Pattern recognition blocks scams" },
                    { icon: Brain, title: "Neural Support", desc: "Fair, instant dispute resolution" },
                    { icon: Network, title: "Chat Shield", desc: "Real-time conversation monitor" },
                    { icon: Fingerprint, title: "ID Integrity", desc: "Advanced seller authentication" },
                    { icon: Binary, title: "Auto Payout", desc: "Milestone-locked transfers" },
                ].map((feature, i) => (
                    <div
                        key={feature.title}
                        className="group p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-[#f5a623]/30 hover:bg-[#f5a623]/5 transition-all flex flex-col items-center text-center animate-in fade-in zoom-in duration-500"
                        style={{ animationDelay: `${i * 100}ms` }}
                    >
                        <div className="h-9 w-9 rounded-xl bg-white/5 flex items-center justify-center mb-3 group-hover:bg-[#f5a623] group-hover:text-black transition-all">
                            <feature.icon className="h-4 w-4" />
                        </div>
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-white mb-1">{feature.title}</h3>
                        <p className="text-[8px] text-white/30 font-bold leading-tight group-hover:text-white/50 transition-colors uppercase tracking-tighter">{feature.desc}</p>
                    </div>
                ))}
            </div>

            {/* Bottom Trust Badge */}
            <div className="mt-auto py-6 flex flex-wrap items-center justify-center gap-4 md:gap-8 text-[9px] font-black uppercase tracking-widest text-white/10 shrink-0">
                <div className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-[#f5a623]/40" /> In-House Engineering</div>
                <div className="hidden md:block h-3 w-[1px] bg-white/5" />
                <div className="flex items-center gap-2"><ShieldCheck className="h-3 w-3 text-[#f5a623]/40" /> Zero Third-Party Tech</div>
                <div className="hidden md:block h-3 w-[1px] bg-white/5" />
                <div className="flex items-center gap-2 animate-pulse"><Zap className="h-3 w-3 text-[#f5a623]/40" /> Active Protection</div>
            </div>

            <style jsx global>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
                .animate-float-slow {
                    animation: float 6s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
