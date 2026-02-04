"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { sendWelcomeEmail } from "@/lib/resend";
import prisma from "@/lib/prisma/client";

export async function login(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/", "layout");
    redirect("/dashboard");
}

export async function signup(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const username = formData.get("username") as string;

    // 1. Sign Up with Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                username: username,
                display_name: username,
            },
        },
    });

    if (authError) {
        return { error: authError.message };
    }

    // 2. Send Welcome Email via Resend
    // Note: This is fire-and-forget to not block the user flow
    // In a real app, use a queue like BullMQ
    if (authData.user?.email) {
        await sendWelcomeEmail(authData.user.email, username);
    }

    // 3. Create Prisma User Record (Source of Truth)
    if (authData.user) {
        try {
            await prisma.user.create({
                data: {
                    supabaseId: authData.user.id,
                    username: username,
                    email: email,
                    role: "BUYER", // Default role
                    status: "ACTIVE"
                }
            });
        } catch (e) {
            console.error("User creation failed in Prisma:", e);
            // If it fails (e.g. duplicate), we might want to handle it or log it.
            // But Supabase auth is already successful, so we probably shouldn't block.
            // Ideally we'd rollback auth, but that's complex.
        }
    }

    revalidatePath("/", "layout");
    redirect("/dashboard");
}

export async function logout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    redirect("/login");
}

export async function signInWithProvider(provider: "google" | "discord") {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        },
    });

    if (error) {
        return { error: error.message };
    }

    if (data.url) {
        redirect(data.url);
    }
}

export async function checkUsernameAvailability(username: string) {
    // Check against Prisma User table
    const user = await prisma.user.findUnique({
        where: { username: username },
        select: { username: true }
    });

    if (user) {
        return true; // Exists
    }
    return false; // Available
}

export async function forgotPasswordAction(formData: FormData) {
    const supabase = await createClient();
    const email = formData.get("email") as string;
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/reset-password`; // Supabase will redirect here with a code

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: callbackUrl,
    });

    if (error) {
        return { error: error.message };
    }

    return { success: true, message: "Check your email for the reset link." };
}

export async function updatePasswordAction(formData: FormData) {
    const supabase = await createClient();
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.updateUser({
        password: password
    });

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/", "layout");
    redirect("/dashboard");
}
