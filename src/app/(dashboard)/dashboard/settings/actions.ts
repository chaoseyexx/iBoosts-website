"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type State = {
    error?: string | null;
    success?: boolean;
    message?: string | null;
};

export async function updateProfile(prevState: State | null, formData: FormData): Promise<State> {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated" };
    }

    const updates: any = {
        updated_at: new Date().toISOString(),
    };

    if (formData.has("username")) updates.username = formData.get("username") as string;
    if (formData.has("display_name")) updates.display_name = formData.get("display_name") as string;
    if (formData.has("bio")) updates.bio = formData.get("bio") as string;
    if (formData.has("avatar_url")) updates.avatar_url = formData.get("avatar_url") as string;

    // Strict validation or specific logic per field can go here

    try {
        const { error } = await supabase
            .from("profiles")
            .update(updates)
            .eq("id", user.id);

        if (error) {
            console.error("Profile update error:", error);
            if (error.code === '23505') { // Unique violation
                return { error: "Username already taken." };
            }
            return { error: "Failed to update profile." };
        }

        revalidatePath("/dashboard/settings");
        revalidatePath("/", "layout"); // Update navbar avatar/name

        return { success: true, message: "Profile updated successfully." };

    } catch (e) {
        return { error: "An unexpected error occurred." };
    }
}

export async function uploadAvatarAction(formData: FormData): Promise<State> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
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
        const fileName = `avatars/${user.id}-${Date.now()}.${fileExt}`;

        const { uploadToR2 } = await import("@/lib/r2");
        const publicUrl = await uploadToR2(buffer, fileName, file.type);

        const { error } = await supabase
            .from("profiles")
            .update({
                avatar_url: publicUrl,
                updated_at: new Date().toISOString()
            })
            .eq("id", user.id);

        if (error) {
            console.error("Profile update error:", error);
            return { error: "Failed to update profile with new avatar." };
        }

        revalidatePath("/dashboard/settings");
        revalidatePath("/", "layout");

        return { success: true, message: "Avatar updated successfully." };

    } catch (error) {
        console.error("Avatar upload error:", error);
        return { error: "Failed to upload avatar." };
    }
}
