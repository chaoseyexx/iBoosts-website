"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { sendWelcomeEmail } from "@/lib/resend";

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

    // 3. Create Profile Entry (if Supabase triggers aren't set up yet)
    // We'll trust Supabase triggers or just rely on metadata for now.
    // However, explicit creation is safer if triggers fail/don't exist.
    if (authData.user) {
        try {
            await supabase.from('profiles').insert({
                id: authData.user.id,
                username: username,
                email: email
            });
        } catch (e) {
            // Ignore duplicate key error if trigger already handled it
            // console.warn("Profile creation might have been handled by DB trigger");
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
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .ilike('username', username)
        .single();

    if (error && error.code === 'PGRST116') {
        return true;
    }
    return false;
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
