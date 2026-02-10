"use server";

import { prisma } from "@/lib/prisma/client";
import { revalidatePath } from "next/cache";

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 100);
}

export async function publishContentPost(postId: string) {
    try {
        // Get the post to generate slug from title
        const post = await prisma.contentPost.findUnique({
            where: { id: postId },
        });

        if (!post) {
            return { error: "Post not found" };
        }

        // Generate unique slug
        let slug = generateSlug(post.title);

        // Check if slug exists, if so append timestamp
        const existingSlug = await prisma.contentPost.findUnique({
            where: { slug },
        });

        if (existingSlug && existingSlug.id !== postId) {
            slug = `${slug}-${Date.now()}`;
        }

        // Update post
        await prisma.contentPost.update({
            where: { id: postId },
            data: {
                status: "PUBLISHED",
                slug,
            },
        });

        revalidatePath("/admin/ishield");
        revalidatePath("/blog");

        return { success: true, slug };
    } catch (error: any) {
        console.error("Failed to publish post:", error);
        return { error: error.message };
    }
}

export async function unpublishContentPost(postId: string) {
    try {
        await prisma.contentPost.update({
            where: { id: postId },
            data: { status: "DRAFT" },
        });

        revalidatePath("/admin/ishield");
        revalidatePath("/blog");

        return { success: true };
    } catch (error: any) {
        console.error("Failed to unpublish post:", error);
        return { error: error.message };
    }
}
