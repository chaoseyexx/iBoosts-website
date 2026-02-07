"use client";

import * as React from "react";
import {
    Send,
    Paperclip,
    Clock,
    CheckCircle2,
    AlertTriangle,
    ShieldCheck,
    MoreVertical,
    ThumbsUp,
    MessageSquare,
    Box,
    DollarSign,
    Copy,
    Star,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getOrderDetails, sendOrderMessage, confirmOrder, submitReview } from "../orders-actions";
import { getSupabaseClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useParams } from "next/navigation";

export default function OrderDetailsPage() {
    const { id: orderId } = useParams() as { id: string };
    const [loading, setLoading] = React.useState(true);
    const [order, setOrder] = React.useState<any>(null);
    const [viewer, setViewer] = React.useState<any>(null);
    const [messageInput, setMessageInput] = React.useState("");
    const [messages, setMessages] = React.useState<any[]>([]);
    const [typingUser, setTypingUser] = React.useState<string | null>(null);
    const [isSubmittingMessage, setIsSubmittingMessage] = React.useState(false);

    // Review State
    const [showReviewModal, setShowReviewModal] = React.useState(false);
    const [rating, setRating] = React.useState(5);
    const [reviewContent, setReviewContent] = React.useState("");
    const [isSubmittingReview, setIsSubmittingReview] = React.useState(false);

    const chatEndRef = React.useRef<HTMLDivElement>(null);
    const typingTimeoutRef = React.useRef<any>(null);

    const fetchData = async () => {
        const result = await getOrderDetails(orderId);
        if (result.error) {
            toast.error(result.error);
            setLoading(false);
            return;
        }
        if (result.order) {
            setOrder(result.order);
            setViewer(result.viewer);
            setMessages(result.order.messages || []);
        }
        setLoading(false);
    };

    React.useEffect(() => {
        fetchData();
    }, [orderId]);

    // Supabase Real-time
    React.useEffect(() => {
        if (!orderId || !viewer) return;

        const supabase = getSupabaseClient();

        // Listen to new messages
        const channel = supabase.channel(`order-${orderId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'OrderMessage',
                filter: `orderId=eq.${orderId}`
            }, async (payload) => {
                // Since payload doesn't have sender details, we might need a small refetch or just handle it
                // For simplicity here, we'll refetch to get the sender object
                const details = await getOrderDetails(orderId);
                if (details.order) {
                    setMessages(details.order.messages);
                }
            })
            .on('broadcast', { event: 'typing' }, ({ payload }) => {
                if (payload.userId !== viewer.id) {
                    setTypingUser(payload.username);
                    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                    typingTimeoutRef.current = setTimeout(() => setTypingUser(null), 3000);
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [orderId, viewer]);

    React.useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, typingUser]);

    const handleTyping = () => {
        if (!viewer) return;
        const supabase = getSupabaseClient();
        supabase.channel(`order-${orderId}`).send({
            type: 'broadcast',
            event: 'typing',
            payload: { userId: viewer.id, username: viewer.username }
        });
    };

    const handleSendMessage = async () => {
        if (!messageInput.trim() || isSubmittingMessage) return;
        setIsSubmittingMessage(true);

        const result = await sendOrderMessage(orderId, messageInput.trim());
        if (result.error) {
            toast.error(result.error);
        } else {
            setMessageInput("");
        }
        setIsSubmittingMessage(false);
    };

    const handleConfirmDelivery = async () => {
        const confirm = window.confirm("Are you sure you want to confirm delivery? This will release funds to the seller.");
        if (!confirm) return;

        const result = await confirmOrder(orderId);
        if (result.success) {
            toast.success("Order confirmed!");
            fetchData();
            setShowReviewModal(true);
        } else {
            toast.error(result.error || "Failed to confirm order");
        }
    };

    const handleSubmitReview = async () => {
        setIsSubmittingReview(true);
        const result = await submitReview(orderId, rating, reviewContent);
        if (result.success) {
            toast.success("Review submitted! Thank you.");
            setShowReviewModal(false);
            fetchData();
        } else {
            toast.error(result.error || "Failed to submit review");
        }
        setIsSubmittingReview(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0e13] flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-[#f5a623] animate-spin" />
            </div>
        );
    }

    if (!order) return <div className="p-20 text-center text-white">Order not found.</div>;

    const isBuyer = viewer?.role === 'BUYER';
    const isAdmin = viewer?.role === 'ADMIN';
    const canConfirm = isBuyer && order.status !== 'COMPLETED' && order.status !== 'CANCELLED';

    return (
        <div className="min-h-screen bg-[#0a0e13] pb-12">
            {/* Header / Top Bar */}
            <div className="bg-[#1c2128] border-b border-[#2d333b] px-6 py-4">
                <div className="container max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-[#f5a623]/20 rounded-lg flex items-center justify-center text-[#f5a623]">
                            <Box className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-white font-bold text-lg flex items-center gap-2">
                                Order #{order.orderNumber}
                                <Badge className={cn(
                                    "border font-black h-5 text-[10px] tracking-widest uppercase shadow-sm",
                                    order.status === 'COMPLETED' ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-[#f5a623]/10 text-[#f5a623] border-[#f5a623]/20"
                                )}>
                                    {order.status}
                                </Badge>
                                {isAdmin && <Badge className="bg-red-500 text-white font-bold">ADMIN VIEW</Badge>}
                            </h1>
                            <p className="text-[#9ca3af] text-sm flex items-center gap-2">
                                {order.listing.game?.name} • {order.listing.title}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {canConfirm && (
                            <Button onClick={handleConfirmDelivery} className="bg-[#f5a623] hover:bg-[#e09612] text-black font-bold">
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Confirm Delivery
                            </Button>
                        )}
                        {order.status === 'COMPLETED' && isBuyer && !order.review && (
                            <Button onClick={() => setShowReviewModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                                <Star className="h-4 w-4 mr-2" />
                                Leave Feedback
                            </Button>
                        )}
                        <Button variant="outline" className="border-[#2d333b] text-[#ef4444] hover:bg-[#ef4444]/10 hover:text-[#ef4444]">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Report
                        </Button>
                    </div>
                </div>
            </div>

            <main className="container max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Chat Area */}
                <div className="lg:col-span-2 flex flex-col h-[700px] bg-[#1c2128] border border-[#2d333b] rounded-xl overflow-hidden shadow-xl">

                    {/* Chat Header */}
                    <div className="p-4 border-b border-[#2d333b] flex items-center justify-between bg-[#13181e]">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-[#1c2128] border border-[#2d333b] flex items-center justify-center font-bold text-white relative shadow-lg">
                                {(viewer?.role === 'BUYER' ? order.seller.username : order.buyer.username).charAt(0).toUpperCase()}
                                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-[#f5a623] border-2 border-[#13181e] shadow-[0_0_5px_rgba(245,166,35,0.5)]" />
                            </div>
                            <div>
                                <div className="text-white font-bold text-sm tracking-tight">
                                    {viewer?.role === 'BUYER' ? order.seller.username : order.buyer.username}
                                </div>
                                <div className="text-[#f5a623] text-[10px] font-black uppercase tracking-widest">Online</div>
                            </div>
                        </div>
                        <div className="text-[#9ca3af] text-xs flex items-center gap-1">
                            <ShieldCheck className="h-4 w-4 text-[#f5a623]" />
                            Chat is monitored for safety
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0a0e13]/50">
                        {messages.map((msg: any) => {
                            const isMe = msg.senderId === viewer?.id;
                            const isSystem = msg.isSystem;

                            if (isSystem) {
                                return (
                                    <div key={msg.id} className="flex justify-center my-4">
                                        <div className="bg-[#2d333b]/50 text-[#9ca3af] text-xs px-4 py-1.5 rounded-full flex items-center gap-2">
                                            <ShieldCheck className="h-3 w-3" />
                                            {msg.content}
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                                    <div className={cn(
                                        "max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm",
                                        isMe
                                            ? "bg-[#f5a623] text-black font-medium rounded-tr-none"
                                            : "bg-[#2d333b] text-white rounded-tl-none"
                                    )}>
                                        <p className="leading-relaxed">{msg.content}</p>
                                        <div className={cn("text-[9px] mt-1 font-bold uppercase tracking-wider flex justify-end", isMe ? "text-black/50" : "text-[#8b949e]")}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {typingUser && (
                            <div className="text-[#9ca3af] text-[10px] italic animate-pulse ml-2 font-bold tracking-widest uppercase">
                                {typingUser} is typing...
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 bg-[#13181e] border-t border-[#2d333b]">
                        <div className="flex gap-3">
                            <Button variant="ghost" size="icon" className="text-[#9ca3af] hover:text-white shrink-0">
                                <Paperclip className="h-5 w-5" />
                            </Button>
                            <Input
                                value={messageInput}
                                onChange={(e) => {
                                    setMessageInput(e.target.value);
                                    handleTyping();
                                }}
                                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                placeholder="Type a message..."
                                className="bg-[#0a0e13] border-[#2d333b] text-white focus:border-[#f5a623] rounded-lg"
                                disabled={isSubmittingMessage}
                            />
                            <Button
                                onClick={handleSendMessage}
                                disabled={isSubmittingMessage}
                                className="bg-[#f5a623] hover:bg-[#e09612] text-black font-bold shrink-0"
                            >
                                {isSubmittingMessage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            </Button>
                        </div>
                        <p className="text-[10px] text-[#8b949e] mt-2 text-center">
                            Never share your password or personal social media. Keep communication on iBoosts for protection.
                        </p>
                    </div>
                </div>

                {/* Right Column: Order Info & Timeline */}
                <div className="space-y-6">

                    {/* Order Summary Card */}
                    <Card className="bg-[#1c2128] border-[#2d333b] p-5 shadow-lg">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-[#f5a623]" />
                            Order Summary
                        </h3>

                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-[#9ca3af]">Unit Price</span>
                                <span className="text-white font-medium">${order.unitPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-[#9ca3af]">Quantity</span>
                                <span className="text-white font-medium">x{order.quantity}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-[#9ca3af]">Service Fee</span>
                                <span className="text-white font-medium">${order.platformFee.toFixed(2)}</span>
                            </div>
                            <div className="h-px bg-[#2d333b]" />
                            <div className="flex justify-between text-lg font-bold">
                                <span className="text-white">Total</span>
                                <span className="text-[#f5a623]">${order.finalAmount.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="mt-6 p-3 bg-[#0a0e13] rounded-lg border border-[#2d333b] flex items-center justify-between">
                            <div className="text-xs text-[#9ca3af] font-mono">
                                ID: {order.orderNumber}
                            </div>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-[#9ca3af] hover:text-white" onClick={() => {
                                navigator.clipboard.writeText(order.orderNumber);
                                toast.success("Order ID copied!");
                            }}>
                                <Copy className="h-3 w-3" />
                            </Button>
                        </div>
                    </Card>

                    {/* Timeline Card */}
                    <Card className="bg-[#1c2128] border-[#2d333b] p-5 shadow-lg">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-[#f5a623]" />
                            Timeline
                        </h3>

                        <div className="relative space-y-6 pl-2">
                            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-[#2d333b]" />

                            {order.timeline.map((step: any, index: number) => (
                                <div key={index} className="relative flex items-center gap-4">
                                    <div className="z-10 h-6 w-6 rounded-full border-4 bg-[#f5a623] border-[#f5a623] text-black shadow-sm flex items-center justify-center">
                                        <CheckCircle2 className="h-3 w-3 stroke-[3]" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-white">
                                            {step.event.replace(/_/g, " ")}
                                        </div>
                                        <div className="text-xs text-[#9ca3af]">
                                            {new Date(step.createdAt).toLocaleString()}
                                        </div>
                                        {step.description && <div className="text-[10px] text-[#8b949e] mt-0.5">{step.description}</div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Security Hint */}
                    <Card className="bg-blue-900/10 border-blue-500/20 p-4">
                        <div className="flex gap-3">
                            <ShieldCheck className="h-5 w-5 text-blue-400 shrink-0" />
                            <div className="text-xs text-blue-200 leading-relaxed">
                                <span className="font-bold text-blue-100">Trade Safety:</span> Always record a video of the trade. Do not give back any items or currency even if the seller asks.
                            </div>
                        </div>
                    </Card>

                </div>

            </main>

            {/* Review Modal */}
            {showReviewModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <Card className="w-full max-w-md bg-[#1c2128] border-[#2d333b] p-6 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4">
                            <Button variant="ghost" size="icon" onClick={() => setShowReviewModal(false)} className="text-[#9ca3af]">
                                <Badge className="bg-red-500 text-white border-0">X</Badge>
                            </Button>
                        </div>
                        <h2 className="text-2xl font-black text-white mb-2 tracking-tighter uppercase italic">
                            How was your <span className="text-[#f5a623]">experience?</span>
                        </h2>
                        <p className="text-[#9ca3af] text-sm mb-6">Leave a review for <span className="text-white font-bold">{order.seller.username}</span> to help the community.</p>

                        <div className="flex justify-center gap-2 mb-8">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className={cn(
                                        "transition-transform active:scale-95",
                                        rating >= star ? "text-[#f5a623]" : "text-[#2d333b]"
                                    )}
                                >
                                    <Star className={cn("h-10 w-10 fill-current")} />
                                </button>
                            ))}
                        </div>

                        <Textarea
                            placeholder="Share your feedback..."
                            value={reviewContent}
                            onChange={(e) => setReviewContent(e.target.value)}
                            className="bg-[#0a0e13] border-[#2d333b] text-white focus:border-[#f5a623] mb-6 min-h-[100px]"
                        />

                        <Button
                            onClick={handleSubmitReview}
                            disabled={isSubmittingReview || !reviewContent.trim()}
                            className="w-full bg-[#f5a623] hover:bg-[#e09612] text-black font-black uppercase tracking-widest h-12"
                        >
                            {isSubmittingReview ? <Loader2 className="animate-spin" /> : "Submit Review"}
                        </Button>
                    </Card>
                </div>
            )}
        </div>
    );
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(price);
};

