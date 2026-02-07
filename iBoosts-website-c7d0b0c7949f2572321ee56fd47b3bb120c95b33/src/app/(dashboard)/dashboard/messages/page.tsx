"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Search, Send, Paperclip, MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock conversations
const mockConversations = [
    {
        id: "1",
        user: { username: "GameDeals", avatar: null },
        lastMessage: "Thanks for your order! The code has been sent.",
        orderId: "ORD-2026-001234",
        timestamp: "2 mins ago",
        unread: true,
    },
    {
        id: "2",
        user: { username: "ProPlayer", avatar: null },
        lastMessage: "Is the account still available?",
        orderId: "ORD-2026-001236",
        timestamp: "1 hour ago",
        unread: true,
    },
    {
        id: "3",
        user: { username: "GamerX", avatar: null },
        lastMessage: "Perfect, received the items. Great seller!",
        orderId: "ORD-2026-001235",
        timestamp: "Yesterday",
        unread: false,
    },
];

const mockMessages = [
    { id: "1", senderId: "other", content: "Hi! I've placed an order for the Valorant Points.", timestamp: "10:30 AM" },
    { id: "2", senderId: "me", content: "Great! I'll prepare your order right away.", timestamp: "10:32 AM" },
    { id: "3", senderId: "me", content: "The code has been delivered. Please check your order details.", timestamp: "10:35 AM" },
    { id: "4", senderId: "other", content: "Thanks for your order! The code has been sent.", timestamp: "10:36 AM" },
];

export default function MessagesPage() {
    const [selectedConversation, setSelectedConversation] = React.useState(mockConversations[0]);
    const [message, setMessage] = React.useState("");

    return (
        <div className="h-[calc(100vh-8rem)]">
            {/* Page Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1c2128]">
                    <MessageCircle className="h-5 w-5 text-[#f5a623]" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">Messages</h1>
                    <p className="text-sm text-[#6b7280]">Chat with buyers and sellers</p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 h-[calc(100%-5rem)]">
                {/* Conversations List */}
                <Card className="border-[#2d333b] bg-[#1c2128] overflow-hidden flex flex-col">
                    <div className="p-3 border-b border-[#2d333b]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7280]" />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                className="h-9 w-full rounded-lg border border-[#2d333b] bg-[#0a0e13] pl-10 pr-4 text-sm text-white placeholder:text-[#6b7280] focus:border-[#f5a623] focus:outline-none"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {mockConversations.map((conv) => (
                            <button
                                key={conv.id}
                                onClick={() => setSelectedConversation(conv)}
                                className={`w-full p-4 text-left border-b border-[#2d333b] hover:bg-[#252b33] transition-colors ${selectedConversation?.id === conv.id ? "bg-[#252b33]" : ""
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={conv.user.avatar || undefined} alt={conv.user.username} />
                                        <AvatarFallback>
                                            {conv.user.username.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-white text-sm">{conv.user.username}</span>
                                            <span className="text-xs text-[#6b7280]">{conv.timestamp}</span>
                                        </div>
                                        <p className="text-xs text-[#9ca3af] truncate mt-0.5">{conv.lastMessage}</p>
                                        <span className="text-xs text-[#5c9eff] mt-1 inline-block">{conv.orderId}</span>
                                    </div>
                                    {conv.unread && <span className="h-2 w-2 rounded-full bg-[#f5a623] flex-shrink-0 mt-2" />}
                                </div>
                            </button>
                        ))}
                    </div>
                </Card>

                {/* Chat Area */}
                <Card className="col-span-2 border-[#2d333b] bg-[#1c2128] flex flex-col overflow-hidden">
                    {/* Chat Header */}
                    <div className="p-4 border-b border-[#2d333b] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={selectedConversation?.user.avatar || undefined} alt={selectedConversation?.user.username} />
                                <AvatarFallback>
                                    {(selectedConversation?.user.username || "U").charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <span className="font-medium text-white">{selectedConversation?.user.username}</span>
                                <p className="text-xs text-[#5c9eff]">{selectedConversation?.orderId}</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-[#6b7280] hover:text-white hover:bg-[#252b33]">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {mockMessages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.senderId === "me" ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[70%] rounded-lg px-4 py-2.5 ${msg.senderId === "me" ? "bg-[#f5a623] text-black" : "bg-[#252b33] text-white"
                                    }`}>
                                    <p className="text-sm">{msg.content}</p>
                                    <p className={`text-xs mt-1 ${msg.senderId === "me" ? "text-black/60" : "text-[#6b7280]"}`}>
                                        {msg.timestamp}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t border-[#2d333b]">
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="sm" className="text-[#6b7280] hover:text-white hover:bg-[#252b33] h-10 w-10 p-0">
                                <Paperclip className="h-5 w-5" />
                            </Button>
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 h-10 rounded-lg border border-[#2d333b] bg-[#0a0e13] px-4 text-sm text-white placeholder:text-[#6b7280] focus:border-[#f5a623] focus:outline-none"
                            />
                            <Button className="bg-[#f5a623] hover:bg-[#e09612] text-black h-10 w-10 p-0">
                                <Send className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
