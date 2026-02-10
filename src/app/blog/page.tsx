import { prisma } from "@/lib/prisma/client";
import Link from "next/link";
import { Clock, ArrowRight, TrendingUp, Zap } from "lucide-react";

export const dynamic = "force-dynamic";

interface Post {
    id: string;
    slug: string | null;
    title: string;
    content: string;
    createdAt: Date;
}

export default async function BlogHomePage() {
    const posts = await prisma.contentPost.findMany({
        where: {
            platform: "BLOG",
            status: "PUBLISHED",
        },
        orderBy: { createdAt: "desc" },
        take: 50,
    });

    // Split posts into sections
    const heroPost = posts[0];
    const topPosts = posts.slice(1, 4);
    const latestPosts = posts.slice(4, 10);
    const morePosts = posts.slice(10);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-6xl mx-auto px-6 py-8">
                {posts.length === 0 ? (
                    <div className="text-center py-24">
                        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/5 mb-4">
                            <Zap className="h-8 w-8 text-[#f5a623]" />
                        </div>
                        <h2 className="text-xl font-bold mb-2">No Articles Yet</h2>
                        <p className="text-white/40 text-sm">Check back soon for gaming news and tips!</p>
                    </div>
                ) : (
                    <>
                        {/* Hero Section - Magazine Style */}
                        <section className="mb-10">
                            <div className="grid lg:grid-cols-5 gap-4">
                                {/* Main Hero */}
                                {heroPost && (
                                    <Link
                                        href={`/blog/${heroPost.slug || heroPost.id}`}
                                        className="lg:col-span-3 group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1f26] to-[#0d1117] border border-white/5 hover:border-[#f5a623]/30 transition-all"
                                    >
                                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
                                        <div className="relative p-8 h-full flex flex-col justify-end min-h-[280px]">
                                            <div className="absolute top-6 left-6">
                                                <span className="px-2.5 py-1 bg-[#f5a623] text-[#0a0e13] text-[10px] font-black uppercase tracking-widest rounded">
                                                    Featured
                                                </span>
                                            </div>
                                            <div className="mt-auto">
                                                <div className="flex items-center gap-2 text-white/40 text-xs mb-3">
                                                    <Clock className="h-3 w-3" />
                                                    {formatDate(heroPost.createdAt)}
                                                </div>
                                                <h2 className="text-xl lg:text-2xl font-bold text-white group-hover:text-[#f5a623] transition-colors mb-3 leading-tight">
                                                    {heroPost.title}
                                                </h2>
                                                <p className="text-white/50 text-sm line-clamp-2 max-w-xl">
                                                    {heroPost.content.slice(0, 150)}...
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                )}

                                {/* Side Stack */}
                                <div className="lg:col-span-2 flex flex-col gap-3">
                                    {topPosts.map((post: Post, i: number) => (
                                        <Link
                                            key={post.id}
                                            href={`/blog/${post.slug || post.id}`}
                                            className="group flex-1 p-4 bg-[#13181e] rounded-xl border border-white/5 hover:border-[#f5a623]/20 transition-all flex flex-col justify-center"
                                        >
                                            <div className="flex items-center gap-2 text-white/30 text-[10px] mb-2">
                                                <span className="px-1.5 py-0.5 bg-white/5 rounded text-[9px] uppercase tracking-wider">
                                                    #{i + 2}
                                                </span>
                                                <span>{formatDate(post.createdAt)}</span>
                                            </div>
                                            <h3 className="text-sm font-bold text-white group-hover:text-[#f5a623] transition-colors line-clamp-2">
                                                {post.title}
                                            </h3>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Latest Articles - Grid */}
                        {latestPosts.length > 0 && (
                            <section className="mb-10">
                                <div className="flex items-center gap-3 mb-5">
                                    <TrendingUp className="h-4 w-4 text-[#f5a623]" />
                                    <h2 className="text-sm font-bold text-white uppercase tracking-widest">Latest</h2>
                                    <div className="flex-1 h-px bg-white/5" />
                                </div>

                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {latestPosts.map((post: Post) => (
                                        <Link
                                            key={post.id}
                                            href={`/blog/${post.slug || post.id}`}
                                            className="group p-4 bg-[#13181e]/60 rounded-xl border border-white/5 hover:border-[#f5a623]/20 hover:bg-[#13181e] transition-all"
                                        >
                                            <div className="flex items-center gap-2 text-white/30 text-[10px] mb-2">
                                                <span>{formatDate(post.createdAt)}</span>
                                            </div>
                                            <h3 className="text-sm font-bold text-white group-hover:text-[#f5a623] transition-colors line-clamp-2 mb-2">
                                                {post.title}
                                            </h3>
                                            <p className="text-white/30 text-xs line-clamp-2">
                                                {post.content.slice(0, 80)}...
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* All Articles - Compact List */}
                        {morePosts.length > 0 && (
                            <section>
                                <div className="flex items-center gap-3 mb-5">
                                    <h2 className="text-sm font-bold text-white uppercase tracking-widest">Archive</h2>
                                    <div className="flex-1 h-px bg-white/5" />
                                    <span className="text-xs text-white/30">{morePosts.length} more</span>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-2">
                                    {morePosts.map((post: Post) => (
                                        <Link
                                            key={post.id}
                                            href={`/blog/${post.slug || post.id}`}
                                            className="group flex items-center gap-3 p-3 bg-[#0d1117] rounded-lg border border-white/5 hover:border-[#f5a623]/10 hover:bg-[#13181e]/50 transition-all"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-xs font-medium text-white group-hover:text-[#f5a623] transition-colors truncate">
                                                    {post.title}
                                                </h3>
                                                <span className="text-[10px] text-white/30">{formatDate(post.createdAt)}</span>
                                            </div>
                                            <ArrowRight className="h-3 w-3 text-white/20 group-hover:text-[#f5a623] transition-colors shrink-0" />
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Load More */}
                        {posts.length >= 50 && (
                            <div className="mt-10 text-center">
                                <button className="px-6 py-3 text-sm font-bold text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                                    Load More Articles
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* CTA */}
            <section className="border-t border-white/5 bg-[#0d1117]">
                <div className="max-w-6xl mx-auto px-6 py-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-gradient-to-r from-[#f5a623]/10 to-transparent rounded-xl border border-[#f5a623]/10">
                        <div>
                            <h3 className="text-base font-bold text-white mb-1">Ready to Trade?</h3>
                            <p className="text-white/40 text-sm">Find gaming accounts, items, and more on iBoosts</p>
                        </div>
                        <Link
                            href="/"
                            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-[#f5a623] text-[#0a0e13] font-bold text-sm rounded-lg hover:bg-[#ffc107] transition-colors"
                        >
                            Visit Marketplace
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
