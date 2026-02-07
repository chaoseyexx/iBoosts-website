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
    Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { cn } from "@/lib/utils";

// --- Mock Data ---

const ORDER_DETAILS = {
    id: "ORD-7782-XJ9",
    status: "active", // active, completed, disputed
    game: "World of Warcraft",
    title: "Level 1-70 Powerleveling | Safe & Hand-done",
    price: "$45.00",
    quantity: 1,
    seller: "ProBooster_99",
    buyer: "Me",
    createdAt: "Oct 24, 2024, 2:30 PM",
    deliveryTime: "24 Hours",
    deadline: "Oct 25, 2024, 2:30 PM"
};

const INITIAL_MESSAGES = [
    {
        id: 1,
        sender: "system",
        text: "Order #ORD-7782-XJ9 has been created. Funds are held securely in escrow.",
        time: "2:30 PM"
    },
    {
        id: 2,
        sender: "seller",
        text: "Hi there! Thanks for the order. I'm starting right now.",
        time: "2:32 PM"
    },
    {
        id: 3,
        sender: "me", // 'me' is the current user
        text: "Great, thanks! Let me know if you need any credentials.",
        time: "2:35 PM"
    },
    {
        id: 4,
        sender: "seller",
        text: "Just the character name and realm please.",
        time: "2:36 PM"
    }
];

const TIMELINE_STEPS = [
    { label: "Order Created", time: "2:30 PM", status: "completed" },
    { label: "Payment Secure", time: "2:30 PM", status: "completed" },
    { label: "Seller Started", time: "2:32 PM", status: "current" },
    { label: "Delivery", time: "Est. Tomorrow", status: "pending" },
    { label: "Confirmation", time: "-", status: "pending" },
];

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
    const [messageInput, setMessageInput] = React.useState("");
    const [messages, setMessages] = React.useState(INITIAL_MESSAGES);

    // Simulate scrolling to bottom
    const chatEndRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = () => {
        if (!messageInput.trim()) return;
        const newMsg = {
            id: messages.length + 1,
            sender: "me",
            text: messageInput,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages([...messages, newMsg]);
        setMessageInput("");
    };

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
                                Order #{ORDER_DETAILS.id}
                                <Badge className="bg-[#f5a623]/10 text-[#f5a623] border border-[#f5a623]/20 font-black h-5 text-[10px] tracking-widest uppercase shadow-[0_0_10px_rgba(245,166,35,0.1)]">
                                    ACTIVE
                                </Badge>
                            </h1>
                            <p className="text-[#9ca3af] text-sm flex items-center gap-2">
                                {ORDER_DETAILS.game} • {ORDER_DETAILS.title}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="border-[#2d333b] text-[#ef4444] hover:bg-[#ef4444]/10 hover:text-[#ef4444]">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Report / Dispute
                        </Button>
                        <Button className="bg-[#f5a623] hover:bg-[#e09612] text-black font-bold">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Confirm Delivery
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
                                P
                                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-[#f5a623] border-2 border-[#13181e] shadow-[0_0_5px_rgba(245,166,35,0.5)]" />
                            </div>
                            <div>
                                <div className="text-white font-bold text-sm tracking-tight">ProBooster_99</div>
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
                        {messages.map((msg) => {
                            const isMe = msg.sender === "me";
                            const isSystem = msg.sender === "system";

                            if (isSystem) {
                                return (
                                    <div key={msg.id} className="flex justify-center my-4">
                                        <div className="bg-[#2d333b]/50 text-[#9ca3af] text-xs px-4 py-1.5 rounded-full flex items-center gap-2">
                                            <ShieldCheck className="h-3 w-3" />
                                            {msg.text}
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
                                        <p className="leading-relaxed">{msg.text}</p>
                                        <div className={cn("text-[9px] mt-1 font-bold uppercase tracking-wider flex justify-end", isMe ? "text-black/50" : "text-[#8b949e]")}>
                                            {msg.time}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
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
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                placeholder="Type a message..."
                                className="bg-[#0a0e13] border-[#2d333b] text-white focus:border-[#f5a623] rounded-lg"
                            />
                            <Button onClick={handleSendMessage} className="bg-[#f5a623] hover:bg-[#e09612] text-black font-bold shrink-0">
                                <Send className="h-4 w-4" />
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
                                <span className="text-[#9ca3af]">Price</span>
                                <span className="text-white font-medium">{ORDER_DETAILS.price}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-[#9ca3af]">Quantity</span>
                                <span className="text-white font-medium">x{ORDER_DETAILS.quantity}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-[#9ca3af]">Service Fee</span>
                                <span className="text-white font-medium">$0.00</span>
                            </div>
                            <div className="h-px bg-[#2d333b]" />
                            <div className="flex justify-between text-lg font-bold">
                                <span className="text-white">Total</span>
                                <span className="text-[#f5a623]">{ORDER_DETAILS.price}</span>
                            </div>
                        </div>

                        <div className="mt-6 p-3 bg-[#0a0e13] rounded-lg border border-[#2d333b] flex items-center justify-between">
                            <div className="text-xs text-[#9ca3af] font-mono">
                                ID: {ORDER_DETAILS.id}
                            </div>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-[#9ca3af] hover:text-white">
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
                            {/* Vertical Line */}
                            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-[#2d333b]" />

                            {TIMELINE_STEPS.map((step, index) => {
                                const isCompleted = step.status === "completed";
                                const isCurrent = step.status === "current";

                                return (
                                    <div key={index} className="relative flex items-center gap-4">
                                        <div className={cn(
                                            "z-10 h-6 w-6 rounded-full border-4 flex items-center justify-center shrink-0",
                                            isCompleted
                                                ? "bg-[#f5a623] border-[#f5a623] text-black shadow-[0_0_10px_rgba(245,166,35,0.3)]"
                                                : isCurrent
                                                    ? "bg-[#1c2128] border-[#f5a623] shadow-[0_0_15px_rgba(245,166,35,0.1)]"
                                                    : "bg-[#1c2128] border-[#2d333b]"
                                        )}>
                                            {isCompleted && <CheckCircle2 className="h-3 w-3 stroke-[3]" />}
                                            {isCurrent && <div className="h-2 w-2 rounded-full bg-[#f5a623] animate-pulse" />}
                                        </div>
                                        <div>
                                            <div className={cn("text-sm font-bold", isCurrent || isCompleted ? "text-white" : "text-[#8b949e]")}>
                                                {step.label}
                                            </div>
                                            <div className="text-xs text-[#9ca3af]">
                                                {step.time}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
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
        </div>
    );
}

