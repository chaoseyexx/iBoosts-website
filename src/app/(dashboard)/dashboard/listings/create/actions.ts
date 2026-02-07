"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma/client";
import slugify from "slugify";
import { generateId } from "@/lib/utils/ids";

export type CreateListingState = {
    error?: string | null;
    success?: boolean;
    listingId?: string;
};

export async function createListing(prevState: CreateListingState | null, formData: FormData): Promise<CreateListingState> {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
        return { error: "You must be logged in to create a listing." };
    }

    // Get input data
    const categoryId = formData.get("categoryId") as string;
    const gameName = formData.get("gameName") as string; // We'll look up game by name or ID
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const minQuantity = parseInt(formData.get("minQuantity") as string) || 1;
    const stock = parseInt(formData.get("stock") as string) || 0;
    const deliveryTimeStr = formData.get("deliveryTime") as string;

    // Validate
    if (!categoryId || !gameName || !price || !description) {
        return { error: "Please fill in all required fields." };
    }

    try {
        // 1. Find the user in our DB
        const seller = await prisma.user.findUnique({
            where: { supabaseId: authUser.id }
        });

        if (!seller) {
            return { error: "Seller profile not found." };
        }

        // 2. Find or match the Game
        // In a real app, we should pass gameId. For now, we'll try to find by name or create a placeholder if it allows
        // But better to fetch the game by name from the mock data found in the wizard IF we haven't connected real games yet.
        // Wait, the wizard currently uses MOCK_GAMES strings.
        // We should try to find a real Game entity that matches.

        // 2. Fetch Category to get the slug for redirection
        const category = await prisma.category.findUnique({
            where: { id: categoryId }
        });

        if (!category) {
            return { error: "Category not found." };
        }

        // 3. Find or match the Game
        let game = await prisma.game.findFirst({
            where: { name: { equals: gameName, mode: "insensitive" } }
        });

        if (!game) {
            return { error: `Game '${gameName}' not found in database. Please ask Admin to add it.` };
        }

        // 3. Generate Slug
        const slugBase = `${game.name} ${description.substring(0, 20)} ${seller.username}`.trim();
        const slug = slugify(slugBase, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g }) + "-" + Date.now().toString().slice(-4);

        // 4. Parse Delivery Time (e.g. "20m" -> minutes integer)
        let deliveryMinutes = 24 * 60; // default 24h
        if (deliveryTimeStr.endsWith("m")) deliveryMinutes = parseInt(deliveryTimeStr);
        if (deliveryTimeStr.endsWith("h")) deliveryMinutes = parseInt(deliveryTimeStr) * 60;

        // 5. Create Listing
        const listing = await prisma.listing.create({
            data: {
                id: generateId("Listing"),
                sellerId: seller.id,
                categoryId: categoryId,
                gameId: game.id,
                title: `${game.name} Currency`, // Auto-generated title
                slug: slug,
                description: description,
                price: price,
                currency: "USD",
                stock: stock,
                minQuantity: minQuantity,
                maxQuantity: stock, // Default max to stock
                deliveryTime: deliveryMinutes,
                status: "ACTIVE", // Auto-activate for demo
            }
        });

        revalidatePath(`/dashboard/listings`);
        revalidatePath(`/${category.slug}/${game.slug}`);

        return { success: true, listingId: listing.id };

    } catch (e: any) {
        console.error("Create listing error:", e);
        return { error: e.message || "Failed to create listing" };
    }
}
