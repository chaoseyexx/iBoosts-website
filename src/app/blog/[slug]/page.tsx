import { prisma } from "@/lib/prisma/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowLeft, Clock, ArrowRight } from "lucide-react";
import { CDN_URL } from "@/lib/constants";

export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{ slug: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;

    const post = await prisma.contentPost.findFirst({
        where: {
            OR: [{ slug }, { id: slug }],
            status: "PUBLISHED",
        },
    });

    if (!post) {
        return { title: "Post Not Found | iBoosts Blog" };
    }

    return {
        title: `${post.title} | iBoosts Blog`,
        description: post.content.slice(0, 160),
        openGraph: {
            title: post.title,
            description: post.content.slice(0, 160),
            type: "article",
            publishedTime: post.createdAt.toISOString(),
        },
    };
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;

    const post = await prisma.contentPost.findFirst({
        where: {
            OR: [{ slug }, { id: slug }],
            status: "PUBLISHED",
        },
    });

    if (!post) {
        notFound();
    }

    // Get related posts
    const relatedPosts = await prisma.contentPost.findMany({
        where: {
            platform: "BLOG",
            status: "PUBLISHED",
            id: { not: post.id },
        },
        take: 3,
        orderBy: { createdAt: "desc" },
    });

    // Calculate read time
    const wordCount = post.content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);

    return (
        <div className="max-w-3xl mx-auto px-6 py-8">
            {/* Back Link */}
            <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-xs font-medium text-white/40 hover:text-[#f5a623] transition-colors mb-6"
            >
                <ArrowLeft className="h-3 w-3" />
                Back to Blog
            </Link>

            {/* Article */}
            <article>
                {/* Hero Image */}
                <div className="relative h-48 md:h-64 rounded-xl overflow-hidden mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#f5a623]/20 to-[#0a0e13] flex items-center justify-center">
                        <span className="text-6xl opacity-20">📰</span>
                    </div>
                </div>

                {/* Post Header */}
                <header className="mb-6">
                    <div className="flex flex-wrap items-center gap-3 mb-4 text-xs text-white/40">
                        <span className="px-2 py-0.5 bg-white/5 rounded">Article</span>
                        <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {post.createdAt.toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric"
                            })}
                        </span>
                        <span>•</span>
                        <span>{readTime} min read</span>
                    </div>

                    <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                        {post.title}
                    </h1>
                </header>

                {/* Post Content */}
                <div className="bg-[#13181e]/40 rounded-xl border border-white/5 p-6 mb-8">
                    <div className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
                        {post.content}
                    </div>
                </div>

                {/* CTA */}
                <div className="p-6 bg-[#13181e] rounded-xl border border-white/5 mb-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-sm font-bold text-white mb-1">Ready to trade?</h3>
                            <p className="text-white/40 text-xs">
                                Find gaming accounts, items, and more on iBoosts
                            </p>
                        </div>
                        <Link
                            href="/"
                            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-[#f5a623] text-[#0a0e13] font-bold text-sm rounded-lg hover:bg-[#ffc107] transition-colors"
                        >
                            Browse Marketplace
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <div>
                        <h3 className="text-sm font-bold text-white/60 mb-4 uppercase tracking-wider">
                            More Articles
                        </h3>
                        <div className="grid sm:grid-cols-3 gap-3">
                            {relatedPosts.map((related) => (
                                <Link
                                    key={related.id}
                                    href={`/blog/${related.slug || related.id}`}
                                    className="group block p-4 bg-[#13181e]/60 rounded-lg border border-white/5 hover:border-[#f5a623]/20 transition-all"
                                >
                                    <span className="text-white/30 text-xs block mb-1">
                                        {related.createdAt.toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric"
                                        })}
                                    </span>
                                    <h4 className="text-xs font-medium text-white group-hover:text-[#f5a623] transition-colors line-clamp-2">
                                        {related.title}
                                    </h4>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </article>
        </div>
    );
}
