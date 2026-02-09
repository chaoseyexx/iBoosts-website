import { fetchCategories, fetchGames } from "@/app/(admin)/admin/actions";
import { ListingForm } from "@/components/listings/listing-form";
import { createListing } from "./actions";

export default async function CreateListingPage() {
    const [categories, games] = await Promise.all([
        fetchCategories(),
        fetchGames()
    ]);

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
                    Create <span className="text-[#f5a623]">Listing</span>
                </h1>
                <p className="text-[#8b949e] font-medium">
                    List your items, accounts, or services for sale.
                </p>
            </div>

            <ListingForm
                categories={categories}
                games={games}
                action={createListing}
                mode="create"
            />
        </div>
    );
}
