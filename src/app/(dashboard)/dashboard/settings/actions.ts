"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma/client";

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

        // Self-healing: Create Prisma record if missing but Auth exists
        if (!user) {
            const email = authUser.email || "";
            const username = authUser.user_metadata.username || email.split("@")[0];

            try {
                user = await prisma.user.create({
                    data: {
                        supabaseId: authUser.id,
                        email: email,
                        username: username,
                        displayName: authUser.user_metadata.full_name || username,
                        role: "BUYER",
                        status: "ACTIVE"
                    }
                });
            } catch (createError) {
                console.error("Auto-creation of user failed:", createError);
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

        const { uploadToR2 } = await import("@/lib/r2");
        const publicUrl = await uploadToR2(buffer, fileName, file.type);

        await prisma.user.upsert({
            where: { supabaseId: authUser.id },
            update: { avatar: publicUrl },
            create: {
                supabaseId: authUser.id,
                email: authUser.email || "",
                username: authUser.user_metadata.username || authUser.email?.split("@")[0] || "user",
                role: "BUYER",
                status: "ACTIVE",
                avatar: publicUrl
            }
        });

        revalidatePath("/dashboard/settings");
        revalidatePath("/", "layout");

        return { success: true, message: "Avatar updated successfully." };

    } catch (error) {
        console.error("Avatar upload error:", error);
        return { error: `Upload failed: ${(error as Error).message}` };
    }
}
