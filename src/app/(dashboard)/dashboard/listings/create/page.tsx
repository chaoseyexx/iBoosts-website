"use client";

import * as React from "react";
import { useState } from "react";
import { fetchCategories, fetchGames } from "@/app/(admin)/admin/actions";
import { createListing } from "./actions";
import { ListingForm } from "@/components/listings/listing-form";

export default function CreateListingPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [games, setGames] = useState<any[]>([]);

    // Load Data
    React.useEffect(() => {
        const load = async () => {
            const [cats, gms] = await Promise.all([fetchCategories(), fetchGames()]);
            setCategories(cats || []);
            setGames(gms || []);
        };
        load();
    }, []);

    return (
        <div className="min-h-screen bg-[#0a0e13] pb-20">
            {/* Header Banner - Matches Ref */}
            <div className="w-full h-32 bg-gradient-to-r from-blue-600 to-blue-500 relative overflow-hidden mb-12">
                <div className="absolute inset-0 opacity-10 bg-[url('/grid.svg')]" />
                <div className="absolute inset-x-0 bottom-0 h-1 bg-[#00ffcc]" /> {/* Cyan stripe from ref */}
            </div>

            <main className="container max-w-5xl mx-auto px-4">
                <ListingForm
                    categories={categories}
                    games={games}
                    action={createListing}
                    mode="create"
                />
            </main>
        </div>
    );
}
