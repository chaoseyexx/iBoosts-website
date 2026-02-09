"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma/client";
import { createClient } from "@/lib/supabase/server";
import { generateId } from "@/lib/utils/ids";
import { DeliveryMethod, ListingStatus } from "@prisma/client";

export async function createListing(prevState: any, formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "You must be logged in to create a listing." };
    }

    // Get Prisma user
    const dbUser = await prisma.user.findUnique({
        where: { supabaseId: user.id }
    });

    if (!dbUser) {
        return { error: "User profile not found." };
    }

    // Extract form data
    const categoryId = formData.get("categoryId") as string;
    const gameId = formData.get("gameId") as string;
    const gameName = formData.get("gameName") as string;
    const description = formData.get("description") as string;
    const priceStr = formData.get("price") as string;
    const stockStr = formData.get("stock") as string;
    const minQuantityStr = formData.get("minQuantity") as string;
    const deliveryTimeStr = formData.get("deliveryTime") as string;
    const deliveryMethodType = formData.get("deliveryMethodType") as string;

    // Items
    const accountItemsStr = formData.get("accountItems") as string;
    const giftCardKeysStr = formData.get("giftCardKeys") as string;

    // Validation
    if (!categoryId) return { error: "Category is required." };
    if (!description || description.length < 20) return { error: "Description must be at least 20 characters." };
    if (!priceStr || parseFloat(priceStr) <= 0) return { error: "Price must be greater than 0." };

    // Determine Delivery Method
    let deliveryMethod: DeliveryMethod = "MANUAL";
    if (deliveryMethodType === "AUTOMATIC") {
        deliveryMethod = "AUTOMATIC";
    }

    // Parse numeric values
    const price = parseFloat(priceStr);
    const stock = parseInt(stockStr) || 1;
    const minQuantity = parseInt(minQuantityStr) || 1;

    // Parse Delivery Time (Simple mapping for now)
    let deliveryTime = 24 * 60; // Default 24h
    if (deliveryTimeStr === "instant") deliveryTime = 0;
    else if (deliveryTimeStr === "20m") deliveryTime = 20;
    else if (deliveryTimeStr === "1h") deliveryTime = 60;
    else if (deliveryTimeStr === "24h") deliveryTime = 1440;

    // Generate Title & Slug
    // Title format: Level 20 Account | Full Access | [Game Name]
    // For now, we'll use a generic title or extract from description/game
    const shortDesc = description.substring(0, 50).replace(/<[^>]*>?/gm, ''); // Remove HTML tags
    const title = `${gameName ? gameName + ' - ' : ''}${shortDesc.substring(0, 30)}...`;

    const slug = `${gameName ? gameName.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'listing'}-${Date.now()}-${generateId("Listing").substring(0, 8)}`;

    try {
        const listingId = generateId("Listing");

        // Prepare Listing Items if Automatic
        let listingItemsData: any[] = [];
        let rCalculatedStock = stock; // Recalculate stock based on items if auto

        if (deliveryMethod === "AUTOMATIC") {
            if (accountItemsStr) {
                try {
                    const items = JSON.parse(accountItemsStr);
                    // Filter empty items
                    const validItems = items.filter((i: any) => i.login && i.password);
                    if (validItems.length > 0) {
                        listingItemsData = validItems.map((item: any) => ({
                            id: generateId("ListingItem"),
                            content: JSON.stringify(item),
                            isSold: false
                        }));
                        rCalculatedStock = listingItemsData.length;
                    }
                } catch (e) {
                    console.error("Error parsing account items:", e);
                }
            } else if (giftCardKeysStr) {
                const keys = giftCardKeysStr.split('\n').filter(k => k.trim());
                if (keys.length > 0) {
                    listingItemsData = keys.map(key => ({
                        id: generateId("ListingItem"),
                        content: key.trim(),
                        isSold: false
                    }));
                    rCalculatedStock = listingItemsData.length;
                }
            }
        }

        // Create Listing
        await prisma.listing.create({
            data: {
                id: listingId,
                sellerId: dbUser.id,
                categoryId,
                gameId: gameId || null,
                title: title, // We might want a dedicated title field in the form later
                slug,
                description,
                price,
                stock: deliveryMethod === "AUTOMATIC" ? rCalculatedStock : stock,
                minQuantity,
                deliveryTime,
                deliveryMethod,
                status: "ACTIVE", // Or DRAFT/PENDING based on logic
                items: {
                    create: listingItemsData
                }
            }
        });

        revalidatePath("/dashboard/listings");
        revalidatePath("/dashboard/offers");

        return { success: true, listingId };

    } catch (error: any) {
        console.error("Failed to create listing:", error);
        return { error: error.message || "Failed to create listing." };
    }
}
