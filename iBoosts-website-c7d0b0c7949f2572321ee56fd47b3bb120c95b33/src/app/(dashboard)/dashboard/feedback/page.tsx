"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, RefreshCw, ThumbsUp, ThumbsDown, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock feedback data
const reviews = [
    {
        id: 1,
        type: "Items",
        user: "Pri***",
        comment: "Nice guy",
        date: "4 days ago",
        positive: true,
    },
    {
        id: 2,
        type: "Custom Request",
        user: "Fre***",
        comment: "GOOD FAST NO SCAM",
        date: "6 days ago",
        positive: true,
    },
    {
        id: 3,
        type: "Items",
        user: "Ann***",
        comment: "good service",
        date: "9 days ago",
        positive: true,
    },
    {
        id: 4,
        type: "Custom Request",
        user: "Fre***",
        comment: "GOOD",
        date: "9 days ago",
        positive: true,
    },
    {
        id: 5,
        type: "Custom Request",
        user: "scr***",
        comment: "the best",
        date: "9 days ago",
        positive: true,
    },
    {
        id: 6,
        type: "Custom Request",
        user: "Cle***",
        comment: "GOAT",
        date: "12 days ago",
        positive: true,
    },
    {
        id: 7,
        type: "Custom Request",
        user: "scr***",
        comment: "fast",
        date: "13 days ago",
        positive: true,
    },
];

export default function FeedbackPage() {
    const [filter, setFilter] = React.useState<"all" | "positive" | "negative">("all");

    const filteredReviews = reviews.filter((review) => {
        if (filter === "positive") return review.positive;
        if (filter === "negative") return !review.positive;
        return true;
    });

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center gap-2">
                <Star className="h-6 w-6 text-[#f5a623] fill-[#f5a623]" />
                <h1 className="text-2xl font-bold text-white">Feedback</h1>
            </div>

            {/* Stats Row */}
            <Card className="border-[#2d333b] bg-[#1c2128]">
                <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#2d333b]">
                        {/* Completed Orders */}
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-1">
                                <RefreshCw className="h-4 w-4 text-[#5c9eff]" />
                                <span className="text-xs font-semibold text-[#6b7280] uppercase">Completed Orders</span>
                            </div>
                            <div className="text-3xl font-bold text-white">56</div>
                        </div>

                        {/* Positive Feedback */}
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-1">
                                <ThumbsUp className="h-4 w-4 text-[#22c55e]" />
                                <span className="text-xs font-semibold text-[#6b7280] uppercase">Positive Feedback</span>
                            </div>
                            <div className="text-3xl font-bold text-white">56</div>
                        </div>

                        {/* Negative Feedback */}
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-1">
                                <ThumbsDown className="h-4 w-4 text-[#ef4444]" />
                                <span className="text-xs font-semibold text-[#6b7280] uppercase">Negative Feedback</span>
                            </div>
                            <div className="text-3xl font-bold text-white">0</div>
                        </div>

                        {/* Feedback Score */}
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-1">
                                <Star className="h-4 w-4 text-[#f5a623] fill-[#f5a623]" />
                                <span className="text-xs font-semibold text-[#6b7280] uppercase">Feedback Score</span>
                            </div>
                            <div className="text-3xl font-bold text-white">100%</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Filters */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => setFilter("all")}
                    className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                        filter === "all"
                            ? "bg-[#f5a623] text-black"
                            : "bg-[#1c2128] text-white hover:bg-[#252b33] border border-[#2d333b]"
                    )}
                >
                    All
                </button>
                <button
                    onClick={() => setFilter("positive")}
                    className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
                        filter === "positive"
                            ? "bg-[#f5a623] text-black"
                            : "bg-[#1c2128] text-white hover:bg-[#252b33] border border-[#2d333b]"
                    )}
                >
                    Positive
                    <ThumbsUp className="h-3 w-3" />
                </button>
                <button
                    onClick={() => setFilter("negative")}
                    className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
                        filter === "negative"
                            ? "bg-[#f5a623] text-black"
                            : "bg-[#1c2128] text-white hover:bg-[#252b33] border border-[#2d333b]"
                    )}
                >
                    Negative
                    <ThumbsDown className="h-3 w-3" />
                </button>
            </div>

            {/* Reviews List */}
            <div className="rounded-lg border border-[#2d333b] bg-[#1c2128] overflow-hidden">
                <div className="divide-y divide-[#2d333b]">
                    {filteredReviews.length > 0 ? (
                        filteredReviews.map((review) => (
                            <div key={review.id} className="p-4 hover:bg-[#252b33] transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            {review.positive ? (
                                                <ThumbsUp className="h-4 w-4 text-[#06b6d4]" /> // Cyan color as per screenshot
                                            ) : (
                                                <ThumbsDown className="h-4 w-4 text-[#ef4444]" />
                                            )}
                                            <span className="text-sm font-medium text-white">
                                                {review.type} <span className="text-[#6b7280]">|</span> {review.user}
                                            </span>
                                        </div>
                                        <p className="text-[#9ca3af] text-sm pl-6">{review.comment}</p>
                                    </div>
                                    <span className="text-xs text-[#6b7280] whitespace-nowrap">
                                        {review.date}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-[#6b7280]">
                            No feedback found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
