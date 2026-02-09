"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    Star,
    RefreshCw,
    MessageSquare,
    TrendingUp,
    ShieldCheck,
    Clock,
    User,
    Loader2,
    Filter,
    ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getSellerFeedback } from "../orders/orders-actions";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export default function FeedbackPage() {
    const [loading, setLoading] = React.useState(true);
    const [reviews, setReviews] = React.useState<any[]>([]);
    const [stats, setStats] = React.useState<any>(null);
    const [filter, setFilter] = React.useState<number | "all">("all");

    const fetchData = React.useCallback(async () => {
        setLoading(true);
        const result = await getSellerFeedback();
        if (result.error) {
            toast.error(result.error);
        } else {
            setReviews(result.reviews || []);
            setStats(result.stats);
        }
        setLoading(false);
    }, []);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filteredReviews = reviews.filter((review) => {
        if (filter === "all") return true;
        return review.rating === filter;
    });

    if (loading) {
        return (
            <div className="h-[400px] flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-[#f5a623] animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700 max-w-[1200px] mx-auto">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="h-14 w-14 bg-[#f5a623]/10 rounded-2xl flex items-center justify-center text-[#f5a623] border border-[#f5a623]/20 shadow-lg shadow-[#f5a623]/5">
                        <MessageSquare className="h-7 w-7" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight uppercase leading-none">
                            Seller <span className="text-[#f5a623]">Reputation</span>
                        </h1>
                        <p className="text-[#8b949e] text-[10px] font-bold uppercase tracking-[0.2em] mt-2">
                            Verified Platform feedback & historical data
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-[#0d1117] border border-white/5 rounded-2xl p-2 pr-6">
                    <div className="h-12 w-12 bg-white/5 rounded-xl flex items-center justify-center text-[#f5a623]">
                        <Star className="h-6 w-6 fill-current" />
                    </div>
                    <div>
                        <div className="text-2xl font-black text-white leading-none">{stats?.averageRating}</div>
                        <div className="text-[10px] font-bold text-[#525a65] uppercase tracking-widest mt-1">Average Star Rating</div>
                    </div>
                </div>
            </div>

            {/* Reputation HUD */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Score Breakdown */}
                <Card className="lg:col-span-4 bg-[#0d1117] border-white/5 p-8 rounded-3xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#f5a623] to-orange-600" />
                    <div className="flex flex-col h-full">
                        <div className="mb-8">
                            <h3 className="text-white text-sm font-black uppercase tracking-widest mb-1">Rating Distribution</h3>
                            <p className="text-[10px] text-[#525a65] font-bold uppercase">Based on {stats?.totalReviews} verified reviews</p>
                        </div>

                        <div className="space-y-4 flex-1">
                            {[5, 4, 3, 2, 1].map((star) => {
                                const count = stats?.starCounts?.[star] || 0;
                                const percentage = stats?.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
                                return (
                                    <div key={star} className="space-y-1.5">
                                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-tighter">
                                            <div className="flex items-center gap-2 text-white">
                                                <span className="w-2">{star}</span>
                                                <Star className="h-3 w-3 fill-[#f5a623] text-[#f5a623]" />
                                            </div>
                                            <span className="text-[#8b949e]">{count} Reviews</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[#f5a623] rounded-full transition-all duration-1000"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-8 pt-8 border-t border-white/5">
                            <div className="flex items-center gap-3">
                                <RefreshCw className="h-5 w-5 text-blue-400" />
                                <div>
                                    <div className="text-xl font-black text-white leading-none">{stats?.completedOrders}</div>
                                    <div className="text-[9px] font-bold text-[#525a65] uppercase tracking-widest mt-1">Orders Completed</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Reviews List */}
                <div className="lg:col-span-8 space-y-4">
                    {/* List Header & Filters */}
                    <div className="flex items-center justify-between bg-[#0d1117]/50 border border-white/5 p-4 rounded-2xl mb-2">
                        <div className="flex items-center gap-4">
                            <Filter className="h-4 w-4 text-[#f5a623]" />
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setFilter("all")}
                                    className={cn(
                                        "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                        filter === "all" ? "bg-[#f5a623] text-black" : "bg-white/5 text-[#8b949e] hover:bg-white/10"
                                    )}
                                >
                                    All
                                </button>
                                {[5, 4, 3, 2, 1].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setFilter(s)}
                                        className={cn(
                                            "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                            filter === s ? "bg-[#f5a623] text-black" : "bg-white/5 text-[#8b949e] hover:bg-white/10"
                                        )}
                                    >
                                        {s} <Star className={cn("h-3 w-3", filter === s ? "fill-current" : "fill-none")} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
                        {filteredReviews.length > 0 ? (
                            filteredReviews.map((review, i) => (
                                <Card
                                    key={review.id}
                                    className="bg-[#0d1117]/60 backdrop-blur-md border border-white/5 hover:border-[#f5a623]/20 transition-all duration-300 group overflow-hidden"
                                >
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                                <div className="h-12 w-12 rounded-xl bg-[#1c2128] border border-white/5 flex items-center justify-center text-[#8b949e] group-hover:bg-[#f5a623]/10 group-hover:text-[#f5a623] group-hover:border-[#f5a623]/20 transition-all shadow-inner">
                                                    <User className="h-6 w-6" />
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-white font-black text-xs uppercase tracking-tight">
                                                            {review.user}
                                                        </span>
                                                        <div className="h-1 w-1 rounded-full bg-white/10" />
                                                        <span className="text-[#8b949e] font-bold text-[9px] uppercase tracking-widest px-2 py-0.5 bg-white/5 rounded-md border border-white/5">
                                                            {review.type}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-0.5">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={cn(
                                                                    "h-3.5 w-3.5",
                                                                    i < review.rating ? "text-[#f5a623] fill-current" : "text-[#1c2128] fill-current"
                                                                )}
                                                            />
                                                        ))}
                                                        <span className="text-[10px] font-black text-[#525a65] uppercase tracking-widest ml-3">
                                                            {formatDistanceToNow(new Date(review.date), { addSuffix: true })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-[#22c55e]/5 border border-[#22c55e]/10 px-3 py-1 rounded-lg text-[#22c55e] text-[8px] font-black uppercase tracking-widest">
                                                Verified Order
                                            </div>
                                        </div>
                                        <div className="mt-5 pl-16 relative">
                                            <div className="absolute left-6 top-1 bottom-1 w-0.5 bg-white/[0.03] rounded-full" />
                                            <p className="text-[#d0d7de] text-sm font-medium leading-relaxed italic antialiased opacity-90 group-hover:opacity-100 transition-opacity">
                                                "{review.comment}"
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 bg-[#0d1117]/30 rounded-3xl border border-dashed border-white/5">
                                <MessageSquare className="h-12 w-12 text-[#1c2128] mb-4 opacity-20" />
                                <p className="text-[10px] font-black text-[#525a65] uppercase tracking-[0.3em]">No Reputation Data In This Range</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(245, 166, 35, 0.1);
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(245, 166, 35, 0.3);
                }
            `}</style>
        </div>
    );
}
