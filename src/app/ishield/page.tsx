import { NavbarServer } from "@/components/layout/navbar-server";
import { IShieldClient } from "@/components/ishield/ishield-client";

export const metadata = {
    title: "iShield AI - Your Trading Guardian | iBoosts.gg",
    description: "iShield AI is the proprietary neural defense network for iBoosts.gg. 100% in-house engineering for ultimate trade security.",
};

export default function IShieldUserPage() {
    return (
        <div className="h-screen w-full bg-[#0a0e13] text-white overflow-hidden relative font-sans flex flex-col">
            <NavbarServer variant="landing" />

            <IShieldClient />

            {/* Minimal HUD Footer */}
            <footer className="relative z-20 border-t border-white/5 py-3 px-6 bg-[#0a0e13]/80 backdrop-blur-md flex items-center justify-between shrink-0 font-mono text-[9px] text-white/20">
                <div className="flex gap-6">
                    <span className="flex items-center gap-1.5"><div className="h-1 w-1 rounded-full bg-[#f5a623]" /> SECURE_CORE: ACTIVE</span>
                    <span className="hidden sm:inline">AUTHENTICATION: 100% NATIVE</span>
                </div>
                <div className="uppercase tracking-[0.2em] font-black text-white/30">
                    © 2026 iBoosts.gg Neural Defense Unit
                </div>
            </footer>
        </div>
    );
}
