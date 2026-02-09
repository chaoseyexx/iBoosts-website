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
    Loader2,
    Info,
    Plus,
    Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getOrderDetails, sendOrderMessage, confirmOrder, submitReview, submitReport, markAsDelivered, cancelOrder, openDispute } from "../orders-actions";
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

    // Report State
    const [showReportModal, setShowReportModal] = React.useState(false);
    const [reportReason, setReportReason] = React.useState("INCOMPLETE_DELIVERY");
    const [reportDescription, setReportDescription] = React.useState("");
    const [isSubmittingReport, setIsSubmittingReport] = React.useState(false);

    // Cancel / Dispute State
    const [showCancelModal, setShowCancelModal] = React.useState(false);
    const [showDisputeModal, setShowDisputeModal] = React.useState(false);
    const [cancelReason, setCancelReason] = React.useState("UNABLE_TO_FULFILL");
    const [disputeReason, setDisputeReason] = React.useState("ITEM_NOT_RECEIVED");
    const [disputeDescription, setDisputeDescription] = React.useState("");
    const [isProcessingAction, setIsProcessingAction] = React.useState(false);
    const [timeLeft, setTimeLeft] = React.useState<string | null>(null);

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
        if (!orderId || !viewer || !order) return;

        const supabase = getSupabaseClient();

        // Listen to new messages and typing events
        // Channel uses orderNumber (public ID) for consistent broadcast
        // Filter uses order.id (internal UUID) for database matching
        const channel = supabase.channel(`order-${orderId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'OrderMessage',
                filter: `orderId=eq.${order.id}`
            }, async (payload) => {
                // Check if we already have this message (from optimistic update)
                setMessages(prev => {
                    if (prev.find(m => m.id === payload.new.id)) return prev;
                    // If it's our temp message, we already have it
                    if (prev.find(m => m.id.startsWith('temp-') && m.content === payload.new.content)) {
                        // Replace temp with real
                        return prev.map(m =>
                            m.id.startsWith('temp-') && m.content === payload.new.content
                                ? { ...payload.new, sender: m.sender }
                                : m
                        );
                    }
                    return [...prev, payload.new];
                });
            })
            .on('broadcast', { event: 'typing' }, ({ payload }) => {
                if (payload.userId !== viewer.id) {
                    setTypingUser(payload.username);
                    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                    typingTimeoutRef.current = setTimeout(() => setTypingUser(null), 3000);
                }
            })
            .on('broadcast', { event: 'stop_typing' }, ({ payload }) => {
                if (payload.userId !== viewer.id) {
                    setTypingUser(null);
                    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [orderId, viewer, order]);

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

    const handleStopTyping = () => {
        if (!viewer) return;
        const supabase = getSupabaseClient();
        supabase.channel(`order-${orderId}`).send({
            type: 'broadcast',
            event: 'stop_typing',
            payload: { userId: viewer.id }
        });
    };

    const handleInputChange = (value: string) => {
        setMessageInput(value);
        if (value.trim()) {
            handleTyping();
        } else {
            handleStopTyping();
        }
    };

    const handleSendMessage = async () => {
        if (!messageInput.trim() || isSubmittingMessage) return;

        const content = messageInput.trim();
        setMessageInput("");
        setIsSubmittingMessage(true);
        handleStopTyping();

        // Optimistic update - add message immediately
        const tempId = `temp-${Date.now()}`;
        const optimisticMsg = {
            id: tempId,
            content,
            senderId: viewer?.id,
            sender: { username: viewer?.username, avatar: null },
            createdAt: new Date().toISOString(),
            isSystem: false
        };
        setMessages(prev => [...prev, optimisticMsg]);

        const result = await sendOrderMessage(orderId, content);
        if (result.error) {
            toast.error(result.error);
            // Remove optimistic message on error
            setMessages(prev => prev.filter(m => m.id !== tempId));
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
        const result = await submitReview(order.id, rating, reviewContent);
        if (result.success) {
            toast.success("Review submitted! Thank you.");
            setShowReviewModal(false);
            fetchData();
        } else {
            toast.error(result.error || "Failed to submit review");
        }
        setIsSubmittingReview(false);
    };

    const handleSubmitReport = async () => {
        if (!reportDescription.trim()) {
            toast.error("Please provide a description for your report");
            return;
        }

        setIsSubmittingReport(true);
        const result = await submitReport(order.id, reportReason, reportDescription);
        if (result.success) {
            toast.success("Report submitted successfully. Our team will review it.");
            setShowReportModal(false);
            setReportDescription("");
            fetchData();
        } else {
            toast.error(result.error || "Failed to submit report");
        }
        setIsSubmittingReport(false);
    };

    const handleMarkAsDelivered = async () => {
        setIsProcessingAction(true);
        const result = await markAsDelivered(order.id);
        if (result.success) {
            toast.success("Order marked as delivered!");
            fetchData();
        } else {
            toast.error(result.error);
        }
        setIsProcessingAction(false);
    };

    const handleCancelOrder = async () => {
        setIsProcessingAction(true);
        const result = await cancelOrder(order.id, cancelReason);
        if (result.success) {
            toast.success("Order cancelled.");
            setShowCancelModal(false);
            fetchData();
        } else {
            toast.error(result.error);
        }
        setIsProcessingAction(false);
    };

    const handleOpenDispute = async () => {
        if (!disputeDescription.trim()) {
            toast.error("Please provide details for the dispute");
            return;
        }
        setIsProcessingAction(true);
        const result = await openDispute(order.id, disputeReason, disputeDescription);
        if (result.success) {
            toast.success("Dispute opened. Our support team will investigate.");
            setShowDisputeModal(false);
            fetchData();
        } else {
            toast.error(result.error);
        }
        setIsProcessingAction(false);
    };

    React.useEffect(() => {
        if (!order?.deliveryDeadline || order.status !== 'ACTIVE') {
            setTimeLeft(null);
            return;
        }

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const deadline = new Date(order.deliveryDeadline).getTime();
            const diff = deadline - now;

            if (diff <= 0) {
                setTimeLeft("Time Expired");
                clearInterval(interval);
                return;
            }

            const h = Math.floor(diff / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft(`${h}h ${m}m ${s}s`);
        }, 1000);

        return () => clearInterval(interval);
    }, [order?.deliveryDeadline, order?.status]);

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
        <div className="h-[calc(100vh-190px)] lg:h-[calc(100vh-210px)] bg-[#0a0e13] flex flex-col overflow-hidden rounded-2xl border border-white/5">
            {/* Ultra-Slim Header */}
            <div className="bg-[#0d1117]/80 backdrop-blur-md border-b border-white/5 px-6 py-3 flex items-center justify-between shrink-0 z-20">
                <div className="flex items-center gap-4">
                    <div className="h-9 w-9 bg-[#f5a623]/10 rounded-xl flex items-center justify-center text-[#f5a623] border border-[#f5a623]/20 shadow-lg shadow-[#f5a623]/5">
                        <Box className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-white font-black text-sm tracking-tight uppercase">
                                Order <span className="text-[#f5a623]">#{order.orderNumber}</span>
                            </h1>
                            <Badge className={cn(
                                "font-black h-5 text-[9px] tracking-widest uppercase border-0 rounded-md",
                                order.status === 'COMPLETED' ? "bg-green-500/20 text-green-400" : "bg-[#f5a623]/20 text-[#f5a623]"
                            )}>
                                {order.status}
                            </Badge>
                            {isAdmin && <Badge className="bg-red-500/20 text-red-500 font-bold border-0 text-[10px]">ADMIN VIEW</Badge>}
                        </div>
                        <p className="text-[#8b949e] text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 mt-0.5">
                            {order.listing.game?.name} <span className="w-1 h-1 rounded-full bg-[#30363d]" /> {order.listing.title}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Real-time Countdown */}
                    {timeLeft && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#f5a623]/5 border border-[#f5a623]/20 rounded-xl">
                            <Clock className={cn("h-3.5 w-3.5", timeLeft === "Time Expired" ? "text-red-500" : "text-[#f5a623]")} />
                            <span className={cn("text-[10px] font-black tabular-nums tracking-widest", timeLeft === "Time Expired" ? "text-red-500" : "text-white")}>
                                {timeLeft}
                            </span>
                        </div>
                    )}

                    <div className="h-6 w-px bg-white/5 mx-1" />

                    {/* Dynamic Action Buttons */}
                    {viewer?.role === 'SELLER' && order.status === 'ACTIVE' && (
                        <>
                            <Button
                                variant="ghost"
                                onClick={() => setShowCancelModal(true)}
                                className="h-8 text-[#ef4444] hover:bg-[#ef4444]/10 font-black text-[9px] uppercase tracking-[0.2em] px-4"
                            >
                                Cancel Order
                            </Button>
                            <Button
                                onClick={handleMarkAsDelivered}
                                disabled={isProcessingAction}
                                className="h-8 bg-[#f5a623] hover:bg-[#e09612] text-black font-black uppercase text-[9px] tracking-[0.2em] rounded-lg px-6 shadow-lg shadow-[#f5a623]/10"
                            >
                                {isProcessingAction ? <Loader2 className="h-3 w-3 animate-spin" /> : "Deliver"}
                            </Button>
                        </>
                    )}

                    {viewer?.role === 'BUYER' && (
                        <>
                            {(order.status === 'ACTIVE' || order.status === 'DELIVERED') && (
                                <Button
                                    variant="ghost"
                                    onClick={() => setShowDisputeModal(true)}
                                    className="h-8 text-[#ef4444] hover:bg-[#ef4444]/10 font-black text-[9px] uppercase tracking-[0.2em] px-4"
                                >
                                    Open Dispute
                                </Button>
                            )}
                            {order.status === 'DELIVERED' && (
                                <Button
                                    onClick={handleConfirmDelivery}
                                    className="h-8 bg-green-600 hover:bg-green-700 text-white font-black uppercase text-[9px] tracking-[0.2em] rounded-lg px-6 shadow-lg shadow-green-500/10"
                                >
                                    Confirm Received
                                </Button>
                            )}
                        </>
                    )}

                    {order.status === 'COMPLETED' && isBuyer && (
                        <Button
                            onClick={() => {
                                if (order.review) {
                                    setRating(order.review.rating);
                                    setReviewContent(order.review.content || "");
                                }
                                setShowReviewModal(true);
                            }}
                            className="h-8 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-[10px] tracking-widest rounded-lg px-4"
                        >
                            <Star className="h-3.5 w-3.5 mr-2" />
                            {order.review ? "Edit Feedback" : "Feedback"}
                        </Button>
                    )}

                    <Button
                        variant="ghost"
                        onClick={() => setShowReportModal(true)}
                        className="h-8 text-[#8b949e] hover:bg-white/5 font-bold text-[9px] uppercase tracking-widest"
                    >
                        <AlertTriangle className="h-3.5 w-3.5 mr-2" />
                        Report
                    </Button>
                </div>
            </div>

            <main className="flex-1 flex overflow-hidden p-4 gap-4">
                {/* Left Column: Compact Sidebar */}
                <div className="w-[360px] flex flex-col gap-4 overflow-y-auto pr-1 custom-scrollbar">

                    {/* Order Specs */}
                    <Card className="bg-[#0d1117]/50 backdrop-blur-sm border-white/5 p-4 rounded-2xl shrink-0 overflow-hidden relative group">
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#f5a623]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <h3 className="text-[#8b949e] font-black uppercase tracking-widest text-[9px] mb-4 flex items-center gap-2">
                            <DollarSign className="h-3 w-3 text-[#f5a623]" />
                            Financial Breakdown
                        </h3>
                        <div className="space-y-2.5">
                            {isBuyer ? (
                                <>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-[#d0d7de] uppercase tracking-tighter">Listing Price</span>
                                        <span className="text-xs font-black text-white">${(order.unitPrice * order.quantity).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-[#d0d7de] uppercase tracking-tighter">Quantity</span>
                                        <span className="text-xs font-black text-[#f5a623]">x{order.quantity}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-[#d0d7de] uppercase tracking-tighter">Service Fee</span>
                                        <span className="text-xs font-black text-white">${(order.finalAmount - (order.unitPrice * order.quantity)).toFixed(2)}</span>
                                    </div>
                                    <div className="h-px bg-white/5 my-2" />
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-black text-[#f5a623] uppercase tracking-widest">Total Paid</span>
                                        <div className="text-xl font-black text-white leading-none tracking-tighter">
                                            <span className="text-sm text-[#f5a623] mr-0.5">$</span>
                                            {order.finalAmount.toFixed(2)}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Seller View: Show listing price, not total paid by buyer */}
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-[#d0d7de] uppercase tracking-tighter">Listing Price</span>
                                        <span className="text-xs font-black text-white">${(order.unitPrice * order.quantity).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-[#d0d7de] uppercase tracking-tighter">Platform Fee (14%)</span>
                                        <span className="text-xs font-black text-red-400">-${(order.unitPrice * order.quantity * 0.14).toFixed(2)}</span>
                                    </div>
                                    <div className="h-px bg-white/5 my-2" />
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Your Earnings</span>
                                        <div className="text-xl font-black text-white leading-none tracking-tighter">
                                            <span className="text-sm text-green-500 mr-0.5">$</span>
                                            {(order.unitPrice * order.quantity * 0.86).toFixed(2)}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </Card>

                    {/* Timeline - Compact */}
                    <Card className="bg-[#0d1117]/50 backdrop-blur-sm border-white/5 p-4 rounded-2xl flex-1 min-h-0 flex flex-col">
                        <h3 className="text-[#8b949e] font-black uppercase tracking-widest text-[9px] mb-4 flex items-center gap-2 shrink-0">
                            <Clock className="h-3 w-3 text-[#f5a623]" />
                            Transaction Path
                        </h3>
                        <div className="relative pl-2 overflow-y-auto custom-scrollbar pr-2 pt-2">
                            {order.timeline.map((event: any, i: number) => (
                                <div key={event.id} className="relative pl-6 pb-5 last:pb-0">
                                    {/* Connector Line */}
                                    {i !== order.timeline.length - 1 && (
                                        <div className="absolute left-[7px] top-4 bottom-0 w-px bg-white/5 group-hover:bg-white/10 transition-colors" />
                                    )}
                                    {/* Dot / Icon */}
                                    <div className={cn(
                                        "absolute left-0 top-1.5 h-4 w-4 rounded-full flex items-center justify-center border transition-all z-10",
                                        i === 0
                                            ? "bg-[#f5a623] border-[#f5a623] shadow-[0_0_10px_rgba(245,166,35,0.3)]"
                                            : "bg-[#1c2128] border-white/10"
                                    )}>
                                        {event.event === "REVIEW_SUBMITTED" ? (
                                            <Star className={cn("h-2 w-2", i === 0 ? "fill-black text-black" : "text-[#f5a623]")} />
                                        ) : event.event === "ORDER_COMPLETED" ? (
                                            <Check className={cn("h-2 w-2", i === 0 ? "text-black" : "text-green-500")} />
                                        ) : (
                                            <Plus className={cn("h-2 w-2", i === 0 ? "text-black" : "text-[#8b949e]")} />
                                        )}
                                    </div>
                                    {/* Content */}
                                    <div className="relative -top-1">
                                        <div className={cn(
                                            "text-[11px] font-black uppercase tracking-tight leading-none mb-1 transition-colors",
                                            i === 0 ? "text-white" : "text-[#8b949e]"
                                        )}>
                                            {event.event.replace(/_/g, " ")}
                                        </div>
                                        <div className="text-[9px] font-bold text-[#525a65] mb-1.5">
                                            {new Date(event.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        {event.description && (
                                            <div className={cn(
                                                "text-[11px] leading-relaxed font-bold transition-colors",
                                                i === 0 ? "text-white/90" : "text-[#d0d7de]"
                                            )}>
                                                {event.description}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Secure Shield */}
                    <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-3 shrink-0">
                        <div className="flex gap-3">
                            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                                <ShieldCheck className="h-4 w-4 text-blue-400" />
                            </div>
                            <div className="text-[9px] text-blue-200/70 font-bold leading-relaxed uppercase tracking-wide">
                                <span className="text-blue-200 font-black">Secure Escrow Protection:</span> Funds are held safely until delivery is confirmed by the buyer.
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Expanded Chat */}
                <Card className="flex-1 flex flex-col bg-[#0d1117]/80 backdrop-blur-md border-white/5 rounded-2xl overflow-hidden shadow-2xl relative">
                    {/* Chat Header Overlay */}
                    <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#13181e]/30 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-[#0d1117] border border-white/10 flex items-center justify-center font-black text-white relative shadow-inner overflow-hidden group/avatar">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#f5a623]/10 to-transparent" />
                                {(() => {
                                    const targetUser = viewer?.role === 'BUYER' ? order.seller : order.buyer;
                                    if (targetUser.avatar) {
                                        return <Image src={targetUser.avatar} alt={targetUser.username} fill className="object-cover" />;
                                    }
                                    return <span className="relative z-10">{targetUser.username.charAt(0).toUpperCase()}</span>;
                                })()}
                                <div className="absolute bottom-1 right-1 h-2 w-2 rounded-full bg-green-500 border border-[#0d1117] shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <Link
                                        href={`/profile/${viewer?.role === 'BUYER' ? order.seller.username : order.buyer.username}`}
                                        className="text-white font-black text-sm tracking-tight capitalize hover:text-[#f5a623] transition-colors"
                                    >
                                        {viewer?.role === 'BUYER' ? order.seller.username : order.buyer.username}
                                    </Link>
                                    <Badge className="bg-white/5 border-white/10 text-[#8b949e] text-[8px] font-black uppercase tracking-tighter h-4 px-1">
                                        {viewer?.role === 'BUYER' ? 'Seller' : 'Buyer'}
                                    </Badge>
                                </div>
                                <div className="text-[9px] font-black uppercase tracking-widest text-[#8b949e] flex items-center gap-1.5 mt-0.5">
                                    <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                                    Active Now
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-[#8b949e]">
                            <Link
                                href={`/profile/${viewer?.role === 'BUYER' ? order.seller.username : order.buyer.username}`}
                                className="bg-white/5 px-2.5 py-1 rounded-lg border border-white/5 hover:bg-white/10 hover:text-white transition-all flex items-center gap-1.5"
                            >
                                View Profile
                            </Link>
                            <span className="hidden md:flex items-center gap-1.5 bg-[#f5a623]/5 px-2.5 py-1 rounded-lg border border-[#f5a623]/10">
                                <ShieldCheck className="h-3 w-3 text-[#f5a623]" />
                                Chaos Secured
                            </span>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-gradient-to-b from-transparent to-black/20">
                        {messages.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-30 select-none">
                                <MessageSquare className="h-12 w-12 text-[#f5a623]/50" />
                                <p className="text-[10px] font-bold uppercase tracking-widest leading-none">Initialize conversation with the {viewer?.role === 'BUYER' ? 'seller' : 'buyer'}</p>
                            </div>
                        )}
                        {messages.map((msg: any) => {
                            const isMe = msg.senderId === viewer?.id;
                            const isSystem = msg.isSystem;

                            if (isSystem) {
                                return (
                                    <div key={msg.id} className="flex justify-center my-6">
                                        <div className="bg-[#f5a623]/5 border border-[#f5a623]/10 text-[#f5a623] text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full flex items-center gap-2 backdrop-blur-md">
                                            <ShieldCheck className="h-3 w-3" />
                                            {msg.content}
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <div key={msg.id} className={cn("flex group animate-in slide-in-from-bottom-2 duration-300", isMe ? "justify-end" : "justify-start")}>
                                    <div className={cn(
                                        "max-w-[70%] relative transition-all duration-300",
                                        isMe ? "scale-in" : "scale-in"
                                    )}>
                                        <div className={cn(
                                            "rounded-2xl px-5 py-3 shadow-2xl relative overflow-hidden",
                                            isMe
                                                ? "bg-[#f5a623] text-black font-semibold rounded-tr-none"
                                                : "bg-[#1c2128] border border-white/5 text-white rounded-tl-none"
                                        )}>
                                            {isMe && <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />}
                                            <p className="leading-relaxed text-sm antialiased">{msg.content}</p>
                                        </div>
                                        <div className={cn(
                                            "text-[8px] mt-1.5 font-black uppercase tracking-widest flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity",
                                            isMe ? "justify-end text-[#8b949e]" : "justify-start text-[#8b949e]"
                                        )}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            {isMe && <Badge className="bg-transparent border-0 p-0 hover:bg-transparent"><CheckCircle2 className="h-2 w-2 text-green-500" /></Badge>}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {typingUser && (
                            <div className="text-[#f5a623] text-[9px] font-black tracking-widest uppercase flex items-center gap-2 animate-pulse">
                                <div className="flex gap-0.5">
                                    <div className="w-1 h-1 rounded-full bg-[#f5a623]" />
                                    <div className="w-1 h-1 rounded-full bg-[#f5a623]" />
                                    <div className="w-1 h-1 rounded-full bg-[#f5a623]" />
                                </div>
                                {typingUser} is composing...
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Compact Input */}
                    <div className="p-4 bg-[#13181e]/50 backdrop-blur-xl border-t border-white/5 shrink-0">
                        <div className="flex gap-2 items-center">
                            <Button variant="ghost" size="icon" className="h-10 w-10 text-[#8b949e] hover:text-white hover:bg-white/5 rounded-xl shrink-0 transition-all">
                                <Paperclip className="h-5 w-5" />
                            </Button>
                            <div className="flex-1 relative">
                                <Input
                                    value={messageInput}
                                    onChange={(e) => {
                                        setMessageInput(e.target.value);
                                        handleTyping();
                                    }}
                                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                    placeholder="Type your message..."
                                    className="h-11 bg-black/40 border-white/5 text-white focus:border-[#f5a623]/50 focus:ring-0 rounded-xl px-4 text-sm transition-all placeholder:text-[#525a65] placeholder:font-bold placeholder:uppercase placeholder:text-[9px] placeholder:tracking-widest"
                                    disabled={isSubmittingMessage}
                                />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                    <Button
                                        size="icon"
                                        onClick={handleSendMessage}
                                        disabled={isSubmittingMessage || !messageInput.trim()}
                                        className={cn(
                                            "h-8 w-8 rounded-lg transition-all active:scale-90",
                                            messageInput.trim() ? "bg-[#f5a623] hover:bg-[#e09612] text-black" : "bg-white/5 text-[#8b949e]"
                                        )}
                                    >
                                        {isSubmittingMessage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-1.5 mt-3 text-[8px] text-[#8b949e] font-black uppercase tracking-widest opacity-40">
                            <Info className="h-2 w-2" />
                            Keep all communication on platform for order protection
                        </div>
                    </div>
                </Card>
            </main>

            {/* Review Modal */}
            {showReviewModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <Card className="w-full max-w-md bg-[#0d1117] border border-[#f5a623]/20 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#f5a623] to-transparent" />

                        <div className="absolute top-4 right-4">
                            <Button variant="ghost" size="icon" onClick={() => setShowReviewModal(false)} className="text-[#8b949e] hover:text-white rounded-xl">
                                <Badge className="bg-[#df1b41] text-white border-0 font-black px-1.5 py-0">X</Badge>
                            </Button>
                        </div>

                        <div className="text-center mb-8">
                            <div className="h-16 w-16 bg-[#f5a623]/10 rounded-2xl flex items-center justify-center text-[#f5a623] mx-auto mb-4 border border-[#f5a623]/20">
                                <ThumbsUp className="h-8 w-8" />
                            </div>
                            <h2 className="text-2xl font-black text-white tracking-tighter uppercase leading-none mb-2">
                                Rate your <span className="text-[#f5a623]">Experience</span>
                            </h2>
                            <p className="text-[10px] font-bold text-[#8b949e] uppercase tracking-widest leading-relaxed">
                                Your feedback helps <span className="text-white font-black">{order.seller.username}</span> grow in the community.
                            </p>
                        </div>

                        <div className="flex justify-center gap-3 mb-10">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className={cn(
                                        "transition-all duration-300 transform hover:scale-110 active:scale-95 group/star",
                                        rating >= star ? "text-[#f5a623] drop-shadow-[0_0_10px_rgba(245,166,35,0.4)]" : "text-[#1c2128]"
                                    )}
                                >
                                    <Star className={cn("h-10 w-10", rating >= star ? "fill-current" : "fill-[#1c2128] stroke-[#30363d]")} />
                                </button>
                            ))}
                        </div>

                        <Textarea
                            placeholder="TELL US WHAT YOU LIKED..."
                            value={reviewContent}
                            onChange={(e) => setReviewContent(e.target.value)}
                            className="bg-black/40 border-white/5 text-white focus:border-[#f5a623]/50 mb-8 min-h-[120px] rounded-2xl p-4 text-xs font-bold tracking-tight resize-none placeholder:opacity-30"
                        />

                        <Button
                            onClick={() => handleSubmitReview()}
                            disabled={isSubmittingReview || !reviewContent.trim()}
                            className="w-full bg-[#f5a623] hover:bg-[#e09612] text-black font-black uppercase tracking-widest h-14 rounded-2xl text-xs shadow-xl shadow-[#f5a623]/10 active:scale-95 transition-all"
                        >
                            {isSubmittingReview ? <Loader2 className="animate-spin" /> : "Publish Feedback"}
                        </Button>
                    </Card>
                </div>
            )}

            {/* Report Modal */}
            {showReportModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <Card className="w-full max-w-md bg-[#0d1117] border border-red-500/20 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent" />

                        <div className="absolute top-4 right-4">
                            <Button variant="ghost" size="icon" onClick={() => setShowReportModal(false)} className="text-[#8b949e] hover:text-white rounded-xl">
                                <Badge className="bg-white/5 text-[#8b949e] border-0 font-black px-1.5 py-0 uppercase">ESC</Badge>
                            </Button>
                        </div>

                        <div className="text-center mb-8">
                            <div className="h-16 w-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-4 border border-red-500/20">
                                <AlertTriangle className="h-8 w-8" />
                            </div>
                            <h2 className="text-2xl font-black text-white tracking-tighter uppercase leading-none mb-2">
                                Report <span className="text-red-500">Order</span>
                            </h2>
                            <p className="text-[10px] font-bold text-[#8b949e] uppercase tracking-widest leading-relaxed">
                                Flag this order for community review.
                            </p>
                        </div>

                        <div className="space-y-4 mb-8 text-left">
                            <div>
                                <label className="text-[9px] font-black text-[#525a65] uppercase tracking-widest mb-2 block">Reason for Report</label>
                                <Select value={reportReason} onValueChange={setReportReason}>
                                    <SelectTrigger className="w-full bg-black/40 border-white/5 rounded-xl h-11 px-4 text-xs font-bold text-white focus:ring-0 focus:ring-offset-0 focus:border-red-500/50 transition-all">
                                        <SelectValue placeholder="Select a reason" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#0d1117] border-white/10 text-white">
                                        <SelectItem value="INCOMPLETE_DELIVERY">Incomplete Delivery</SelectItem>
                                        <SelectItem value="WRONG_ITEM">Item not as described</SelectItem>
                                        <SelectItem value="SCAM_ATTEMPT">Fraud / Scam Attempt</SelectItem>
                                        <SelectItem value="INAPPROPRIATE_BEHAVIOR">Harassment / Behavior</SelectItem>
                                        <SelectItem value="OUTSIDE_PLATFORM">Transaction outside platform</SelectItem>
                                        <SelectItem value="OTHER">Other Issue</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-[9px] font-black text-[#525a65] uppercase tracking-widest mb-2 block">Detailed Description</label>
                                <Textarea
                                    placeholder="PLEASE PROVIDE AS MUCH DETAIL AS POSSIBLE..."
                                    value={reportDescription}
                                    onChange={(e) => setReportDescription(e.target.value)}
                                    className="bg-black/40 border-white/5 text-white focus:border-red-500/50 min-h-[120px] rounded-2xl p-4 text-xs font-bold tracking-tight resize-none placeholder:opacity-30"
                                />
                            </div>
                        </div>

                        <Button
                            onClick={() => handleSubmitReport()}
                            disabled={isSubmittingReport || !reportDescription.trim()}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest h-14 rounded-2xl text-xs shadow-xl shadow-red-500/10 active:scale-95 transition-all"
                        >
                            {isSubmittingReport ? <Loader2 className="animate-spin" /> : "Submit Report"}
                        </Button>
                    </Card>
                </div>
            )}

            {/* Cancellation Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <Card className="w-full max-w-md bg-[#0d1117] border border-red-500/20 p-8 rounded-3xl shadow-2xl relative overflow-hidden text-left">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
                        <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-4">Cancel Order</h2>
                        <div className="space-y-4 mb-8">
                            <div>
                                <label className="text-[9px] font-black text-[#525a65] uppercase tracking-widest mb-2 block">Cancellation Reason</label>
                                <Select value={cancelReason} onValueChange={setCancelReason}>
                                    <SelectTrigger className="w-full bg-black/40 border-white/5 rounded-xl h-11 text-xs font-bold text-white focus:ring-0 focus:ring-offset-0 focus:border-red-500/50">
                                        <SelectValue placeholder="Select reason" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#0d1117] border-white/10 text-white">
                                        <SelectItem value="UNABLE_TO_FULFILL">Unable to fulfill order</SelectItem>
                                        <SelectItem value="OUT_OF_STOCK">Stock error</SelectItem>
                                        <SelectItem value="BUYER_REQUESTED">Buyer requested cancellation</SelectItem>
                                        <SelectItem value="TECHNICAL_ISSUES">Technical issues</SelectItem>
                                        <SelectItem value="OTHER">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="ghost" onClick={() => setShowCancelModal(false)} className="flex-1 text-[#8b949e] font-black uppercase text-[10px] tracking-widest h-12 rounded-xl">Back</Button>
                            <Button onClick={handleCancelOrder} disabled={isProcessingAction} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black uppercase text-[10px] tracking-widest h-12 rounded-xl shadow-xl shadow-red-500/10">
                                {isProcessingAction ? <Loader2 className="animate-spin" /> : "Confirm Cancel"}
                            </Button>
                        </div>
                    </Card>
                </div>
            )}

            {/* Dispute Modal */}
            {showDisputeModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <Card className="w-full max-w-lg bg-[#0d1117] border border-red-500/20 p-8 rounded-3xl shadow-2xl relative overflow-hidden text-left">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
                        <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-4">Open <span className="text-red-500">Dispute</span></h2>
                        <p className="text-[10px] text-[#8b949e] font-bold uppercase tracking-widest mb-8">Escalate this order to ChaosLabs support for mediation.</p>

                        <div className="space-y-4 mb-8">
                            <div>
                                <label className="text-[9px] font-black text-[#525a65] uppercase tracking-widest mb-2 block">Reason for Dispute</label>
                                <Select value={disputeReason} onValueChange={setDisputeReason}>
                                    <SelectTrigger className="w-full bg-black/40 border-white/5 rounded-xl h-11 text-xs font-bold text-white focus:ring-0 focus:ring-offset-0 focus:border-red-500/50">
                                        <SelectValue placeholder="Select reason" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#0d1117] border-white/10 text-white">
                                        <SelectItem value="ITEM_NOT_RECEIVED">Item not received</SelectItem>
                                        <SelectItem value="NOT_AS_DESCRIBED">Item not as described</SelectItem>
                                        <SelectItem value="SELLER_UNRESPONSIVE">Seller is unresponsive</SelectItem>
                                        <SelectItem value="SCAM_ATTEMPT">Fraudulent activity detected</SelectItem>
                                        <SelectItem value="OTHER">Other Issue</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-[9px] font-black text-[#525a65] uppercase tracking-widest mb-2 block">Evidence & Details</label>
                                <Textarea
                                    placeholder="DESCRIBE THE ISSUE IN DETAIL..."
                                    value={disputeDescription}
                                    onChange={(e) => setDisputeDescription(e.target.value)}
                                    className="bg-black/40 border-white/5 text-white focus:border-red-500/50 min-h-[120px] rounded-2xl p-4 text-xs font-bold tracking-tight resize-none"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="ghost" onClick={() => setShowDisputeModal(false)} className="flex-1 text-[#8b949e] font-black uppercase text-[10px] tracking-widest h-12 rounded-xl">Wait</Button>
                            <Button onClick={handleOpenDispute} disabled={isProcessingAction} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black uppercase text-[10px] tracking-widest h-12 rounded-xl shadow-xl shadow-red-500/10">
                                {isProcessingAction ? <Loader2 className="animate-spin" /> : "Initiate Dispute"}
                            </Button>
                        </div>
                    </Card>
                </div>
            )}

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
                @keyframes scale-in {
                    0% { transform: scale(0.95); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-in {
                    animation: scale-in 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(price);
};

