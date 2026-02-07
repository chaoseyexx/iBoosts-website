"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma/client";
import { generateId } from "@/lib/utils/ids";

export type State = {
    error?: string | null;
    success?: boolean;
    message?: string | null;
};

export async function getProfile() {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) return null;

    try {
        let user = await prisma.user.findUnique({
            where: { supabaseId: authUser.id }
        });

        // Self-healing: Create or Link Prisma record if missing but Auth exists
        if (!user) {
            const email = authUser.email || "";
            const username = authUser.user_metadata.username || email.split("@")[0];

            try {
                // Check if user exists by email primarily
                const existingUserByEmail = await prisma.user.findUnique({
                    where: { email: email }
                });

                if (existingUserByEmail) {
                    // Link the existing user to the Supabase ID
                    user = await prisma.user.update({
                        where: { id: existingUserByEmail.id },
                        data: { supabaseId: authUser.id }
                    });
                } else {
                    user = await prisma.user.create({
                        data: {
                            id: generateId("User"),
                            supabaseId: authUser.id,
                            email: email,
                            username: username,
                            role: "BUYER",
                            status: "ACTIVE"
                        }
                    });
                }
            } catch (createError) {
                console.error("Auto-creation/linking of user failed:", createError);
            }
        }
        return user;
    } catch (e) {
        console.error("Failed to fetch profile:", e);
        return null;
    }
}

export async function updateProfile(prevState: State | null, formData: FormData): Promise<State> {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
        return { error: "Not authenticated" };
    }

    const updates: any = {};
    if (formData.has("username")) updates.username = formData.get("username") as string;
    if (formData.has("bio")) updates.bio = formData.get("bio") as string;

    try {
        await prisma.user.upsert({
            where: { supabaseId: authUser.id },
            update: updates,
            create: {
                id: generateId("User"),
                supabaseId: authUser.id,
                email: authUser.email || "",
                username: (formData.get("username") as string) || authUser.user_metadata.username || authUser.email?.split("@")[0] || "user",
                role: "BUYER",
                status: "ACTIVE",
                ...updates
            }
        });

        revalidatePath("/dashboard/settings");
        revalidatePath("/", "layout");

        return { success: true, message: "Profile updated successfully." };

    } catch (e: any) {
        console.error("Profile update error:", e);
        if (e.code === 'P2002') {
            return { error: "Username already taken." };
        }
        return { error: `Update failed: ${e.message}` };
    }
}

export async function uploadAvatarAction(formData: FormData): Promise<State> {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
        return { error: "Not authenticated" };
    }

    const file = formData.get("file") as File;
    if (!file) {
        return { error: "No file provided" };
    }

    // Validate size (e.g., 2MB)
    if (file.size > 2 * 1024 * 1024) {
        return { error: "File size exceeds 2MB limit." };
    }

    try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileExt = file.name.split('.').pop();
        const fileName = `avatars/${authUser.id}-${Date.now()}.${fileExt}`;

        const { uploadToR2, deleteFromR2 } = await import("@/lib/r2");
        const publicUrl = await uploadToR2(buffer, fileName, file.type);

        // Fetch current user to check for existing avatar
        const currentUser = await prisma.user.findUnique({
            where: { supabaseId: authUser.id },
            select: { avatar: true }
        });

        await prisma.user.upsert({
            where: { supabaseId: authUser.id },
            update: { avatar: publicUrl },
            create: {
                id: generateId("User"),
                supabaseId: authUser.id,
                email: authUser.email || "",
                username: authUser.user_metadata.username || authUser.email?.split("@")[0] || "user",
                role: "BUYER",
                status: "ACTIVE",
                avatar: publicUrl
            }
        });

        // Cleanup old avatar if it exists and is an R2 URL
        if (currentUser?.avatar && currentUser.avatar.includes("cdn.iboosts.gg")) {
            try {
                // Extract key from URL (e.g. https://cdn.iboosts.gg/avatars/123.png -> avatars/123.png)
                const oldKey = currentUser.avatar.replace("https://cdn.iboosts.gg/", "");
                if (oldKey && oldKey !== currentUser.avatar) {
                    await deleteFromR2(oldKey);
                }
            } catch (cleanupError) {
                console.error("Failed to delete old avatar:", cleanupError);
                // Non-blocking error
            }
        }

        revalidatePath("/dashboard/settings");
        revalidatePath("/", "layout");

        return { success: true, message: "Avatar updated successfully." };

    } catch (error) {
        console.error("Avatar upload error:", error);
        return { error: `Upload failed: ${(error as Error).message}` };
    }
}
