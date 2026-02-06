"use client";

import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ArrowRight,
    Shield,
    Zap,
    Star,
} from "lucide-react";

// Dynamic import for Three.js to avoid SSR issues
const HeroScene = dynamic(
    () => import("@/components/three/hero-scene").then((mod) => mod.HeroScene),
    { ssr: false }
);

// Feature cards
const features = [
    { icon: Shield, title: "Secure Escrow", desc: "100% buyer protection" },
    { icon: Zap, title: "Instant Delivery", desc: "Get items in seconds" },
    { icon: Star, title: "24/7 Support", desc: "Always here to help" },
];

export function HeroSection() {
    return (
        <section className="relative min-h-[70vh] flex items-center pt-[96px] overflow-hidden">
            {/* 3D Background */}
            <Suspense fallback={null}>
                <HeroScene />
            </Suspense>

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e13] via-transparent to-[#0a0e13] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e13]/80 via-transparent to-[#0a0e13]/80 pointer-events-none" />

            {/* Hero Content */}
            <div className="relative z-10 mx-auto max-w-7xl px-6 py-20">

                {/* Floating Hero Characters */}
                <div className="hidden lg:block absolute -left-[350px] top-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none z-0">
                    <div className="absolute left-[100px] top-[150px] animate-float-delayed -z-10">
                        <Image
                            src="https://cdn.iboosts.gg/images/landing-character-2.png"
                            alt="Builder Character"
                            width={280}
                            height={280}
                            className="object-contain drop-shadow-[0_0_30px_rgba(37,99,235,0.15)] opacity-90"
                        />
                    </div>
                </div>

                <div className="hidden lg:block absolute -right-[300px] top-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none z-0">
                    <div className="absolute right-[50px] top-[100px] animate-float-slow">
                        <Image
                            src="https://cdn.iboosts.gg/images/landing-character-omen.png"
                            alt="Omen Character"
                            width={280}
                            height={280}
                            className="object-contain drop-shadow-[0_0_30px_rgba(147,51,234,0.25)]"
                        />
                    </div>
                </div>

                <div className="max-w-2xl relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                        <Badge className="bg-[#00b67a] text-white border-0 px-3 py-1">
                            ★ Trustpilot
                        </Badge>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className="h-4 w-4 text-[#00b67a] fill-[#00b67a]" />
                            ))}
                        </div>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#fdfcf0] leading-tight mb-4">
                        The Largest{" "}
                        <span className="bg-gradient-to-r from-[#f5a623] to-[#ffb347] bg-clip-text text-transparent">
                            Digital Gaming
                        </span>{" "}
                        Marketplace
                    </h1>

                    <p className="text-lg text-[#9ca3af] mb-8 max-w-xl">
                        Buy & sell in-game currency, accounts, items, boosting, top-ups and gift cards with secure escrow protection.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <Link href="/marketplace">
                            <Button size="lg" className="bg-[#f5a623] hover:bg-[#e09612] text-black font-semibold h-12 px-8">
                                Shop Now
                                <ArrowRight className="h-5 w-5 ml-2" />
                            </Button>
                        </Link>
                        <Link href="/seller">
                            <Button size="lg" variant="secondary" className="bg-[#1c2128] border border-[#2d333b] text-white hover:bg-[#252b33] h-12 px-8">
                                Start Selling
                            </Button>
                        </Link>
                    </div>

                    <div className="flex flex-wrap gap-6 mt-10">
                        {features.map((feature) => (
                            <div key={feature.title} className="flex items-center gap-2">
                                <feature.icon className="h-5 w-5 text-[#f5a623]" />
                                <div>
                                    <p className="text-white text-sm font-medium">{feature.title}</p>
                                    <p className="text-[#6b7280] text-xs">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
