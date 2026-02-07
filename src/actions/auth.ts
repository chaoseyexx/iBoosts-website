"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma/client";

import { generateId } from "@/lib/utils/ids";

export async function signUp(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const username = formData.get("username") as string;

    // Validate inputs
    if (!email || !password || !username) {
        return { error: "All fields are required" };
    }

    if (password.length < 8) {
        return { error: "Password must be at least 8 characters" };
    }

    if (username.length < 5 || username.length > 20) {
        return { error: "Username must be between 5 and 20 characters" };
    }

    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!usernameRegex.test(username)) {
        return { error: "Username must only contain letters and numbers" };
    }

    // Check if username is taken
    const existingUser = await prisma.user.findUnique({
        where: { username: username.toLowerCase() },
    });

    if (existingUser) {
        return { error: "Username is already taken" };
    }

    // Create auth user
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
            data: {
                username: username.toLowerCase(),
            },
        },
    });

    if (error) {
        return { error: error.message };
    }

    if (data.user) {
        // Create user in database
        try {
            const userId = generateId("User");
            await prisma.user.create({
                data: {
                    id: userId,
                    email: email.toLowerCase(),
                    username: username.toLowerCase(),
                    supabaseId: data.user.id,
                    role: "BUYER",
                    emailVerified: false,
                    status: "ACTIVE"
                },
            });

            // Create wallet for user
            await prisma.wallet.create({
                data: {
                    id: generateId("Wallet"),
                    userId: userId,
                    balance: 0,
                    currency: "USD",
                },
            });
        } catch (dbError) {
            console.error("Failed to create user in database:", dbError);
            // User will be created on first login if this fails
        }
    }

    revalidatePath("/", "layout");
    redirect("/login?message=Check your email to confirm your account");
}

export async function signIn(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { error: "Email and password are required" };
    }

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

export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    redirect("/");
}

export async function signInWithOAuth(provider: "google" | "discord" | "github") {
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

export async function resetPassword(formData: FormData) {
    const supabase = await createClient();
    const email = formData.get("email") as string;

    if (!email) {
        return { error: "Email is required" };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
    });

    if (error) {
        return { error: error.message };
    }

    return { success: "Password reset email sent" };
}

export async function updatePassword(formData: FormData) {
    const supabase = await createClient();
    const password = formData.get("password") as string;

    if (!password || password.length < 8) {
        return { error: "Password must be at least 8 characters" };
    }

    const { error } = await supabase.auth.updateUser({
        password,
    });

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/", "layout");
    redirect("/dashboard?message=Password updated successfully");
}

export async function getCurrentUser() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    const dbUser = await prisma.user.findUnique({
        where: { supabaseId: user.id },
        include: {
            wallet: true,
        },
    });

    return dbUser;
}
