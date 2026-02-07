import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from "@/lib/prisma/client";
import { generateId } from "@/lib/utils/ids";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/dashboard';

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
            console.error("Supabase auth error in callback:", error);
            return NextResponse.redirect(new URL(`/auth/auth-code-error?error=${error.message}`, request.url));
        }

        if (!error) {
            // Check for Discord metadata and ensure profile exists
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                console.log("Supabase user found in callback:", user.id);
                try {
                    // Start of Sync Logic
                    const existingUser = await prisma.user.findUnique({
                        where: { supabaseId: user.id }
                    });

                    if (!existingUser) {
                        console.log("Creating new user in Prisma for Supabase ID:", user.id);
                        await prisma.user.create({
                            data: {
                                id: generateId("User"),
                                supabaseId: user.id,
                                email: user.email!,
                                username: user.user_metadata.full_name || user.user_metadata.name || user.email?.split('@')[0] || `User${Date.now()}`,
                                role: "BUYER",
                                status: "ACTIVE",
                                avatar: user.user_metadata.avatar_url || user.user_metadata.picture
                            }
                        });
                    } else {
                        // Optional: Update email if it changed in Supabase Auth (e.g. email change confirmed)
                        if (existingUser.email !== user.email && user.email) {
                            await prisma.user.update({
                                where: { id: existingUser.id },
                                data: { email: user.email }
                            });
                        }
                    }
                } catch (e) {
                    console.error("Failed to sync user in callback:", e);
                }
            }

            return NextResponse.redirect(new URL(next, request.url));
        }
    }

    console.warn("No code found in auth callback");
    // return the user to an error page with instructions
    return NextResponse.redirect(new URL('/auth/auth-code-error', request.url));
}
