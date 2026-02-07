"use server";

import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { redirect } from "next/navigation";

// Reuse the schema or define a partial for updates
const listingSchema = z.object({
    categoryId: z.string().min(1, "Category is required"),
    gameId: z.string().min(1, "Game is required"),
    description: z.string().optional(),
    price: z.string().min(1, "Price is required"),
    stock: z.string().min(1, "Stock is required"),
    minQuantity: z.string().min(1, "Minimum quantity is required"),
    deliveryTime: z.string().min(1, "Delivery time is required"),
    deliveryMethod: z.string().optional(), // Can be multiple, handled as array or string
});

export async function createListing(prevState: any, formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "You must be logged in to create a listing" };
    }

    // Get DB user
    const dbUser = await prisma.user.findUnique({
        where: { supabaseId: user.id },
    });

    if (!dbUser) {
        return { error: "User profile not found" };
    }

    const validatedFields = listingSchema.safeParse({
        categoryId: formData.get("categoryId"),
        gameId: formData.get("gameId"),
        description: formData.get("description"),
        price: formData.get("price"),
        stock: formData.get("stock"),
        minQuantity: formData.get("minQuantity"),
        deliveryTime: formData.get("deliveryTime"),
        deliveryMethod: formData.get("deliveryMethod"),
    });

    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors };
    }

    const { categoryId, gameId, description, price, stock, minQuantity, deliveryTime, deliveryMethod } = validatedFields.data;

    try {
        // Fetch category and game slugs for redirection
        const category = await prisma.category.findUnique({ where: { id: categoryId } });
        const game = await prisma.game.findUnique({ where: { id: gameId } });

        if (!category || !game) throw new Error("Invalid category or game");

        // Generate Slug
        const slug = `${game.slug}-${category.slug}-${Math.random().toString(36).substring(2, 7)}`;

        // TODO: Handle tags/delivery methods better
        // const deliveryMethods = formData.getAll("deliveryMethod"); 

        await prisma.listing.create({
            data: {
                sellerId: dbUser.id,
                categoryId,
                gameId,
                title: `${game.name} ${category.name}`, // Simple auto-title
                slug,
                description: description || "",
                price: parseFloat(price),
                stock: parseInt(stock),
                minQuantity: parseInt(minQuantity),
                deliveryTime: 24, // simplified handling for now, mapping "20m" etc needs logic
                status: "ACTIVE", // Auto-active for now
                currency: "USD",
            },
        });

        revalidatePath("/dashboard/listings");
        revalidatePath(`/${category.slug}/${game.slug}`);

        return { success: true, redirectUrl: `/${category.slug}/${game.slug}` };
    } catch (error) {
        console.error("Create Listing Error:", error);
        return { error: "Failed to create listing" };
    }
}

export async function updateListing(listingId: string, prevState: any, formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Unauthorized" };

    const dbUser = await prisma.user.findUnique({ where: { supabaseId: user.id } });
    if (!dbUser) return { error: "Profile not found" };

    // Validate ownership
    const existing = await prisma.listing.findUnique({
        where: { id: listingId },
    });

    if (!existing || existing.sellerId !== dbUser.id) {
        return { error: "Listing not found or unauthorized" };
    }

    // Extract fields
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const stock = formData.get("stock") as string;
    const minQuantity = formData.get("minQuantity") as string;
    const deliveryTime = formData.get("deliveryTime") as string;

    // Logic to handle delivery time string to int if schema requires int
    // Schema says deliveryTime is Int (hours? or minutes?). Default is 24.
    // The select has "20m", "1h", "24h". 
    // Let's just store as 24 for now or parse it. 
    // Ideally we update schema to support string or map it.
    // For now assuming 24.

    try {
        await prisma.listing.update({
            where: { id: listingId },
            data: {
                description,
                price: parseFloat(price),
                stock: parseInt(stock),
                minQuantity: parseInt(minQuantity),
            }
        });

        revalidatePath("/dashboard/offers");
        return { success: true };
    } catch (error) {
        console.error("Update Listing Error:", error);
        return { error: "Failed to update listing" };
    }
}
