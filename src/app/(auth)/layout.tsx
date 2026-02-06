import * as React from "react";
import Link from "next/link";
import { NavbarServer } from "@/components/layout/navbar-server";
import { ShieldCheck, Zap, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#0d1117] flex flex-col">
            {/* 1. Global Navbar included (Fixed at top) */}
            <NavbarServer variant="landing" />

            {/* 2. Main Content Area: Split Layout */}
            {/* Added top padding to account for fixed navbar height (approx 80px) */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 pt-[60px]">

                {/* LEFT COL: Form Area */}
                <div className="flex flex-col items-center justify-center p-8 lg:p-16 relative">
                    {/* Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#f5a623]/5 rounded-full blur-[100px] pointer-events-none" />

                    <div className="w-full max-w-md space-y-8 relative z-10">


                        {/* Header */}
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold tracking-tight text-white">
                                Welcome to <span className="text-[#f5a623]">iBoosts</span>
                            </h2>
                            <p className="text-[#8b949e]">
                                The premier destination for digital assets and professional boosting.
                            </p>
                        </div>

                        {/* The Login/Signup Form */}
                        {children}
                    </div>
                </div>

                {/* RIGHT COL: Visual Showcase (Hidden on mobile) */}
                <div className="hidden lg:flex flex-col justify-center p-16 bg-[#161b22] relative overflow-hidden border-l border-[#30363d]">
                    {/* Abstract Pattern overlay */}
                    <div className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: "radial-gradient(#30363d 1px, transparent 1px)",
                            backgroundSize: "32px 32px"
                        }}
                    />

                    {/* Glowing Orbs */}
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#f5a623]/10 rounded-full blur-[120px] pointer-events-none" />


                    {/* Content Container */}
                    <div className="relative z-10 max-w-lg mx-auto space-y-12">
                        <div className="space-y-4">
                            <h1 className="text-4xl font-extrabold text-white leading-tight">
                                Level Up Your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f5a623] to-[#e09612]">
                                    Digital Experience
                                </span>
                            </h1>
                            <p className="text-lg text-[#8b949e]">
                                Join thousands of gamers buying and selling high-tier accounts, currency, and boosting services securely.
                            </p>
                        </div>

                        {/* Feature Grid */}
                        <div className="grid grid-cols-1 gap-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-[#238636]/10 rounded-lg border border-[#238636]/20">
                                    <ShieldCheck className="h-6 w-6 text-[#238636]" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Secure Escrow</h3>
                                    <p className="text-sm text-[#8b949e]">Your funds are protected until you confirm delivery. No scams, no worries.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-[#f5a623]/10 rounded-lg border border-[#f5a623]/20">
                                    <Zap className="h-6 w-6 text-[#f5a623]" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Instant Delivery</h3>
                                    <p className="text-sm text-[#8b949e]">Automated systems ensure you get your items immediately after purchase.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                    <Trophy className="h-6 w-6 text-blue-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Verified Sellers</h3>
                                    <p className="text-sm text-[#8b949e]">Shop from top-rated merchants with proven track records.</p>
                                </div>
                            </div>
                        </div>

                        {/* Social Proof / Stats */}
                        <div className="pt-8 border-t border-[#30363d] flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-white">50K+</div>
                                <div className="text-xs text-[#8b949e] uppercase tracking-wider">Users</div>
                            </div>
                            <div className="h-8 w-px bg-[#30363d]" />
                            <div>
                                <div className="text-2xl font-bold text-white">100K+</div>
                                <div className="text-xs text-[#8b949e] uppercase tracking-wider">Orders</div>
                            </div>
                            <div className="h-8 w-px bg-[#30363d]" />
                            <div>
                                <div className="text-2xl font-bold text-white">4.9/5</div>
                                <div className="text-xs text-[#8b949e] uppercase tracking-wider">Rating</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
