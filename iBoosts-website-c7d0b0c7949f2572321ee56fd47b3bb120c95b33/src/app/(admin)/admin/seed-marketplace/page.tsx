"use client";

import { Button } from "@/components/ui/button";
import { seedMarketplaceData } from "../actions";
import { useState } from "react";

export default function SeedMarketplacePage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSeed = async () => {
        setLoading(true);
        setMessage("Seeding...");
        try {
            const res = await seedMarketplaceData();
            if (res.success) {
                setMessage("Successfully seeded Marketplace and Currency data!");
            } else {
                setMessage(`Error: ${res.error}`);
            }
        } catch (err: any) {
            setMessage(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#050506] p-4 text-white">
            <h1 className="text-3xl font-black mb-8 uppercase tracking-widest text-[#f5a623]">Marketplace Seeder</h1>
            <div className="bg-[#0d1117] border border-[#30363d] p-8 rounded-2xl max-w-md w-full text-center">
                <p className="text-[#8b949e] mb-6">
                    This will create the "Currency" category, "Roblox" game, and sample currency listings with a dummy seller.
                </p>
                <Button
                    onClick={handleSeed}
                    disabled={loading}
                    className="w-full h-14 bg-[#f5a623] hover:bg-[#f5a623]/90 text-black font-black uppercase tracking-widest rounded-xl"
                >
                    {loading ? "Seeding..." : "Seed Data Now"}
                </Button>
                {message && (
                    <p className={`mt-6 font-bold uppercase tracking-tight ${message.includes("Error") ? "text-[#ef4444]" : "text-[#22c55e]"}`}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}
