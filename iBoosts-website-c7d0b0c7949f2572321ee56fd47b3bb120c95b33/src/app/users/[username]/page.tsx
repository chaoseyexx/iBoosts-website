import * as React from "react";
import prisma from "@/lib/prisma/client";
import { notFound } from "next/navigation";
import { UserProfileView } from "@/components/profile/user-profile-view";

// Server Component Fetch Logic
async function getUser(username: string) {
    if (!username) return null;

    // Decode URI component (e.g. handle spaces or special chars if any)
    const decodedUsername = decodeURIComponent(username);

    // Try finding user by username (case insensitive usually done by DB, but here strict for unique constraint)
    const user = await prisma.user.findFirst({
        where: {
            username: {
                equals: decodedUsername,
                mode: 'insensitive' // Requires Prisma Postgres, if MySQL use raw query or rely on DB collation
            }
        },
    });

    return user;
}

export default async function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
    const resolvedParams = await params;
    const user = await getUser(resolvedParams.username);

    if (!user) {
        notFound();
    }

    // Convert Date objects to strings if needed for client component serialization
    // Prisma returns Date objects, but Server->Client props must be serializable.
    // Next.js handles Date objects in Server Actions/Components somewhat, but it's safer to map to plain objects if complex.
    // However, the previous code didn't do this and it worked locally because dev server allows more loose serialization or it handled it.
    // Let's pass 'user' as is. If warnings arise, we'll serialize.
    // Actually, Next.js 13/14+ supports Date objects in props.

    return (
        <React.Suspense fallback={
            <div className="flex min-h-screen items-center justify-center bg-[#0a0e13]">
                <div className="h-8 w-8 border-2 border-[#f5a623] border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <UserProfileView user={user} />
        </React.Suspense>
    );
}
