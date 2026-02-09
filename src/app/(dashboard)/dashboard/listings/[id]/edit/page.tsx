import { fetchCategories, fetchGames } from "@/app/(admin)/admin/actions";
import { ListingForm } from "@/components/listings/listing-form";
import { getListingForEdit, updateListing } from "./actions";
import { redirect, notFound } from "next/navigation";

interface EditListingPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditListingPage({ params }: EditListingPageProps) {
    const resolvedParams = await params;

    const [categories, games, listing] = await Promise.all([
        fetchCategories(),
        fetchGames(),
        getListingForEdit(resolvedParams.id)
    ]);

    if (!listing) {
        notFound();
    }

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
                    Edit <span className="text-[#f5a623]">Listing</span>
                </h1>
                <p className="text-[#8b949e] font-medium">
                    Update your listing details.
                </p>
            </div>

            <ListingForm
                initialData={listing}
                categories={categories}
                games={games}
                action={updateListing}
                mode="edit"
            />
        </div>
    );
}
