import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma/client";
import { ListingForm } from "@/components/listings/listing-form";
import { updateListing } from "../../actions";
import { fetchCategories, fetchGames } from "@/app/(admin)/admin/actions";

interface EditListingPageProps {
    params: {
        id: string;
    };
}

export default async function EditListingPage({ params }: EditListingPageProps) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/auth/login");
    }

    const { id } = await params;

    const listing = await prisma.listing.findUnique({
        where: { id },
        include: {
            seller: true,
            category: true,
            game: true
        }
    });

    if (!listing) {
        notFound();
    }

    // Verify ownership via supabaseId
    if (listing.seller.supabaseId !== user.id) {
        redirect("/dashboard/offers");
    }

    const [categories, games] = await Promise.all([
        fetchCategories(),
        fetchGames()
    ]);

    // Bind ID to the update action
    const updateAction = updateListing.bind(null, listing.id);

    return (
        <div className="min-h-screen bg-[#0a0e13] pb-20">
            {/* Header Banner - Matches Ref */}
            <div className="w-full h-32 bg-gradient-to-r from-blue-600 to-blue-500 relative overflow-hidden mb-12">
                <div className="absolute inset-0 opacity-10 bg-[url('/grid.svg')]" />
                <div className="absolute inset-x-0 bottom-0 h-1 bg-[#00ffcc]" /> {/* Cyan stripe from ref */}
            </div>

            <main className="container max-w-5xl mx-auto px-4">
                <ListingForm
                    initialData={listing}
                    categories={categories}
                    games={games}
                    action={updateAction}
                    mode="edit"
                />
            </main>
        </div>
    );
}
