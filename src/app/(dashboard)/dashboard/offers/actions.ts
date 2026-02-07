"use server";

import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma/client";

export type DashboardOffer = {
    id: string;
    game: string;
    platform: string;
    title: string;
    quantity: string;
    deliveryTime: string;
    price: string;
    status: string;
    expiresIn: string; // We might need to calculate this or just show 'N/A'
    category: string;
    image: string;
};

export async function getSellerListings(categorySlug?: string) {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
        return { error: "Not authenticated" };
    }

    const seller = await prisma.user.findUnique({
        where: { supabaseId: authUser.id }
    });

    if (!seller) {
        return { error: "Seller profile not found" };
    }

    // Build query
    const where: any = {
        sellerId: seller.id,
        // If category is "all" or undefined, don't filter by category
        // But the UI sends "all" or a category id/slug.
        // The mock used "items", "currency". These look like slugs or IDs.
        // Let's assume we filter by Category ID if it's not "all".
        // Actually, the UI uses `categoryQuery` from URL.
    };

    if (categorySlug && categorySlug !== "all") {
        // Find category by slug or id?
        // Let's assume slug for now as URLs usually use slugs.
        // But wait, the create wizard used IDs.
        // Let's support looking up by ID or Slug to be safe, or just Slug.
        // Given the URL `?category=...` usually implies slug.
        const category = await prisma.category.findFirst({
            where: {
                OR: [
                    { id: categorySlug },
                    { slug: categorySlug }
                ]
            }
        });
        if (category) {
            where.categoryId = category.id;
        }
    }

    const listings = await prisma.listing.findMany({
        where,
        include: {
            game: {
                include: {
                    categories: true
                }
            },
            category: true,
            images: true
        },
        orderBy: { createdAt: "desc" }
    });

    // Map to DashboardOffer format
    const mappedOffers: DashboardOffer[] = listings.map(l => ({
        id: l.id,
        game: l.game?.name || "Unknown Game",
        platform: "PC", // Default for now
        title: l.title,
        quantity: l.stock.toString(),
        deliveryTime: formatDeliveryTime(l.deliveryTime),
        price: l.price.toString(),
        status: l.status.toLowerCase(), // ACTIVE -> active
        expiresIn: "30d", // Placeholder or calc
        category: l.category?.slug || "unknown", // Return slug for filtering matching URL params
        image: l.game?.icon || l.images[0]?.url || "/placeholder.png"
    }));

    // We also need to fix the category field.
    // The UI filters `o.category === categoryQuery`.
    // If the URL has `?category=currency`, and we fetch that, the mapped offer should prob match.
    // If we filter on server, the client filter might be redundant but harmless.
    // However, if we return ALL listings and let client filter, `category` field needs to match what the URL param expects.

    return { listings: mappedOffers };
}


// Helper function for delivery time formatting
function formatDeliveryTime(minutes: number): string {
    if (minutes >= 1440) return `${Math.round(minutes / 1440)} days`;
    if (minutes >= 60) return `${Math.round(minutes / 60)} h`;
    const m = Math.round(minutes);
    return `${m} m`;
}

// Actions
export async function toggleListingStatus(listingId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Unauthorized" };

    try {
        const listing = await prisma.listing.findUnique({
            where: { id: listingId },
            include: { seller: true }
        });

        if (!listing || listing.seller.supabaseId !== user.id) {
            return { error: "Listing not found or unauthorized" };
        }

        const newStatus = listing.status === "ACTIVE" ? "PAUSED" : "ACTIVE";

        await prisma.listing.update({
            where: { id: listingId },
            data: { status: newStatus }
        });

        return { success: true, newStatus: newStatus.toLowerCase() };
    } catch (error) {
        console.error("Error toggling status:", error);
        return { error: "Failed to update status" };
    }
}

export async function deleteListing(listingId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Unauthorized" };

    try {
        const listing = await prisma.listing.findUnique({
            where: { id: listingId },
            include: { seller: true }
        });

        if (!listing || listing.seller.supabaseId !== user.id) {
            return { error: "Listing not found or unauthorized" };
        }

        // Check for active orders before deleting? 
        // For now, try hard delete. If it fails due to FK, we catch it.
        // User requested "no need to mark as deleted", implying hard delete.

        await prisma.listing.delete({
            where: { id: listingId }
        });

        return { success: true };
    } catch (error) {
        console.error("Error deleting listing:", error);
        // If it's a constraint error, we might want to tell the user.
        return { error: "Failed to delete listing (might have active orders)" };
    }
}

export async function updateListingPrice(listingId: string, newPrice: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Unauthorized" };

    try {
        const listing = await prisma.listing.findUnique({
            where: { id: listingId },
            include: { seller: true }
        });

        if (!listing || listing.seller.supabaseId !== user.id) {
            return { error: "Listing not found or unauthorized" };
        }

        await prisma.listing.update({
            where: { id: listingId },
            data: { price: newPrice }
        });

        return { success: true };
    } catch (error) {
        console.error("Error updating price:", error);
        return { error: "Failed to update price" };
    }
}
