"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Search, Send, Paperclip, MoreVertical, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getConversations, getChatMessages } from "./actions";
import { sendOrderMessage } from "../orders/orders-actions";
import { getSupabaseClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export default function MessagesPage() {
    const [conversations, setConversations] = React.useState<any[]>([]);
    const [selectedConversation, setSelectedConversation] = React.useState<any>(null);
    const [messages, setMessages] = React.useState<any[]>([]);
    const [messageInput, setMessageInput] = React.useState("");
    const [loading, setLoading] = React.useState(true);
    const [messagesLoading, setMessagesLoading] = React.useState(false);
    const [userId, setUserId] = React.useState<string | null>(null);
    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchConvs = React.useCallback(async () => {
        setLoading(true);
        const data = await getConversations();
        setConversations(data);
        if (data.length > 0 && !selectedConversation) {
            setSelectedConversation(data[0]);
        }
        setLoading(false);
    }, [selectedConversation]);

    React.useEffect(() => {
        const init = async () => {
            const supabase = getSupabaseClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase.from('User').select('id').eq('supabaseId', user.id).single();
                if (profile) setUserId(profile.id);
            }
            fetchConvs();
        };
        init();
    }, [fetchConvs]);

    const fetchMessages = React.useCallback(async (orderId: string) => {
        setMessagesLoading(true);
        const data = await getChatMessages(orderId);
        setMessages(data);
        setMessagesLoading(false);
        setTimeout(scrollToBottom, 50);
    }, []);

    React.useEffect(() => {
        if (selectedConversation) {
            fetchMessages(selectedConversation.id);
        }
    }, [selectedConversation, fetchMessages]);

    // Real-time listener for current conversation
    React.useEffect(() => {
        if (!selectedConversation) return;

        const supabase = getSupabaseClient();
        const channel = supabase.channel(`order-chat-${selectedConversation.id}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'OrderMessage',
                filter: `orderId=eq.${selectedConversation.id}`
            }, (payload) => {
                // If the message isn't already in our list (optimistic update handle)
                setMessages(prev => {
                    if (prev.find(m => m.id === payload.new.id)) return prev;
                    return [...prev, payload.new];
                });
                setTimeout(scrollToBottom, 50);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [selectedConversation]);

    const handleSendMessage = async () => {
        if (!messageInput.trim() || !selectedConversation) return;

        const content = messageInput.trim();
        setMessageInput("");

        // Optimistic update
        const tempId = Math.random().toString();
        const optimisticMsg = {
            id: tempId,
            content,
            senderId: userId,
            createdAt: new Date().toISOString(),
            sender: { username: "You" } // Simplified
        };
        setMessages(prev => [...prev, optimisticMsg]);
        setTimeout(scrollToBottom, 50);

        try {
            await sendOrderMessage(selectedConversation.id, content);
        } catch (error) {
            console.error("Failed to send message:", error);
            // Optionally remove optimistic message and show error
        }
    };

    return (
        <div className="h-[calc(100vh-8rem)]">
            {/* Page Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1c2128]">
                    <MessageCircle className="h-5 w-5 text-[#f5a623]" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">Messages</h1>
                    <p className="text-sm text-[#8b949e]">Chat with buyers and sellers</p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 h-[calc(100%-5rem)]">
                {/* Conversations List */}
                <Card className="border-[#2d333b] bg-[#1c2128] overflow-hidden flex flex-col">
                    <div className="p-3 border-b border-[#2d333b]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8b949e]" />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                className="h-9 w-full rounded-lg border border-[#2d333b] bg-[#0a0e13] pl-10 pr-4 text-sm text-white placeholder:text-[#8b949e] focus:border-[#f5a623] focus:outline-none"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="flex justify-center p-8">
                                <Loader2 className="h-6 w-6 animate-spin text-[#f5a623]" />
                            </div>
                        ) : conversations.length > 0 ? (
                            conversations.map((conv) => (
                                <button
                                    key={conv.id}
                                    onClick={() => setSelectedConversation(conv)}
                                    className={cn(
                                        "w-full p-4 text-left border-b border-[#2d333b] hover:bg-[#252b33] transition-colors relative",
                                        selectedConversation?.id === conv.id ? "bg-[#252b33] border-l-2 border-l-[#f5a623]" : ""
                                    )}
                                >
                                    <div className="flex items-start gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={conv.otherUser.avatar || undefined} />
                                            <AvatarFallback>
                                                {conv.otherUser.username.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-0.5">
                                                <span className="font-bold text-white text-sm tracking-tight">{conv.otherUser.username}</span>
                                                <span className="text-[10px] font-bold text-[#8b949e] uppercase tracking-wider">
                                                    {new Date(conv.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <p className="text-[12px] text-[#9ca3af] truncate font-medium">
                                                {conv.lastMessage?.content || "No messages yet"}
                                            </p>
                                            <span className="text-[11px] text-[#f5a623] font-bold mt-1 inline-block tracking-tight uppercase">
                                                {conv.orderNumber}
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="p-8 text-center opacity-40">
                                <MessageCircle className="h-8 w-8 mx-auto mb-2" />
                                <p className="text-xs font-bold uppercase">No conversations found</p>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Chat Area */}
                <Card className="col-span-2 border-[#2d333b] bg-[#1c2128] flex flex-col overflow-hidden">
                    {!selectedConversation ? (
                        <div className="flex-1 flex flex-col items-center justify-center opacity-20">
                            <MessageCircle className="h-16 w-16 mb-4" />
                            <p className="text-lg font-bold uppercase tracking-widest">Select a conversation</p>
                        </div>
                    ) : (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-[#2d333b] flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={selectedConversation.otherUser.avatar || undefined} />
                                        <AvatarFallback>
                                            {selectedConversation.otherUser.username.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <span className="font-bold text-white tracking-tight">{selectedConversation.otherUser.username}</span>
                                        <p className="text-[11px] text-[#f5a623] font-semibold uppercase tracking-widest">{selectedConversation.orderNumber}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" className="text-[#8b949e] hover:text-white hover:bg-[#252b33]">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messagesLoading ? (
                                    <div className="flex justify-center p-8">
                                        <Loader2 className="h-6 w-6 animate-spin text-[#f5a623]" />
                                    </div>
                                ) : (
                                    messages.map((msg) => (
                                        <div key={msg.id} className={cn("flex", msg.senderId === userId ? "justify-end" : "justify-start")}>
                                            <div className={cn(
                                                "max-w-[70%] rounded-lg px-4 py-2.5",
                                                msg.senderId === userId ? "bg-[#f5a623] text-black" : "bg-[#252b33] text-white"
                                            )}>
                                                <p className="text-sm leading-relaxed">{msg.content}</p>
                                                <p className={cn(
                                                    "text-[9px] mt-1 font-bold uppercase tracking-widest",
                                                    msg.senderId === userId ? "text-black/40" : "text-[#8b949e]"
                                                )}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message Input */}
                            <div className="p-4 border-t border-[#2d333b]">
                                <div className="flex items-center gap-3">
                                    <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-[#252b33] h-10 w-10 p-0">
                                        <Paperclip className="h-5 w-5" />
                                    </Button>
                                    <input
                                        type="text"
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                        placeholder="Type a message..."
                                        className="flex-1 h-11 rounded-xl border border-[#2d333b] bg-[#0a0e13] px-4 text-sm text-white placeholder:text-[#8b949e] focus:border-[#f5a623] focus:outline-none transition-all"
                                    />
                                    <Button
                                        onClick={handleSendMessage}
                                        className="bg-[#f5a623] hover:bg-[#e69512] text-black h-11 w-11 p-0 rounded-xl shadow-lg"
                                    >
                                        <Send className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </Card>
            </div>
        </div>
    );
}
