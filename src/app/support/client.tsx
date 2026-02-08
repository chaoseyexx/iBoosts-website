"use client";

import React from "react";
import { Search, ShoppingCart, ShieldCheck, HelpCircle, ChevronRight, User, CreditCard, ShieldAlert, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function SupportClient() {
    return (
        <div className="min-h-screen pb-20">
            {/* Hero Section */}
            <div className="relative pt-32 pb-24 px-6 overflow-hidden border-b border-[#2d333b]/50">
                {/* Cinematic Backgrounds */}
                <div className="absolute inset-0 bg-[#0a0e13]">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle,rgba(245,166,35,0.05)_0%,transparent_70%)] pointer-events-none" />
                    <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-[#f5a623]/5 blur-[120px] rounded-full pointer-events-none animate-pulse" />
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full glass border-[#f5a623]/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)] bg-[#f5a623]/5"
                    >
                        <Badge className="bg-[#f5a623] text-black border-0 px-2 py-0.5 text-[10px] uppercase font-black tracking-widest">
                            Support Hub
                        </Badge>
                        <span className="text-[11px] font-bold text-[#f5a623] uppercase tracking-widest">24/7 Live Assistance</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-tight"
                    >
                        HOW CAN WE <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f5a623] to-[#ffc107] animate-gradient">HELP YOU?</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-[#8b949e] text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium"
                    >
                        Search our elite knowledge base for instant answers on buying, selling, and iShield protection.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="max-w-2xl mx-auto relative group"
                    >
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#f5a623]/20 via-[#f5a623]/10 to-[#f5a623]/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                        <div className="relative">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8b949e] group-focus-within:text-[#f5a623] transition-colors" />
                            <Input
                                placeholder="Search the knowledge base..."
                                className="h-16 pl-16 pr-6 bg-[#0d1117]/80 backdrop-blur-xl border-[#30363d] hover:border-[#f5a623]/30 focus:border-[#f5a623] rounded-2xl text-white placeholder-[#8b949e] focus:ring-1 focus:ring-[#f5a623]/20 transition-all text-lg shadow-2xl"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Quick Link Categories */}
            <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            title: "Buying Guide",
                            desc: "Learn how to purchase accounts, currency and items securely.",
                            icon: ShoppingCart,
                            color: "#58a6ff",
                            link: "#buying"
                        },
                        {
                            title: "Selling on iBoosts",
                            desc: "Everything you need to know about listing and getting paid.",
                            icon: BadgeCheck,
                            color: "#3ecf8e",
                            link: "#selling"
                        },
                        {
                            title: "Account & Safety",
                            desc: "Managing your settings, 2FA, and protecting your data.",
                            icon: User,
                            color: "#f5a623",
                            link: "#account"
                        }
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + idx * 0.1 }}
                        >
                            <Card className="h-full p-8 rounded-3xl bg-[#161b22]/50 backdrop-blur-md border-[#30363d]/50 hover:border-[#f5a623]/30 hover:bg-[#161b22] transition-all duration-300 group cursor-pointer relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative z-10">
                                    <div className="h-14 w-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300" style={{ backgroundColor: `${item.color}15`, border: `1px solid ${item.color}30` }}>
                                        <item.icon className="h-7 w-7" style={{ color: item.color }} />
                                    </div>
                                    <h3 className="text-xl font-black text-white mb-3 uppercase tracking-tight group-hover:text-[#f5a623] transition-colors">{item.title}</h3>
                                    <p className="text-[#8b949e] text-sm leading-relaxed mb-6 font-medium">{item.desc}</p>
                                    <div className="mt-auto flex items-center text-[#c9d1d9] text-xs font-bold uppercase tracking-widest group-hover:text-[#f5a623] transition-colors">
                                        View Guides <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Support Content Sections */}
            <div className="max-w-5xl mx-auto px-6 py-20 space-y-24">

                {/* Buying & Selling Detailed Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <section id="buying" className="space-y-8">
                        <div className="flex items-center gap-4 border-b border-[#30363d] pb-4">
                            <div className="bg-[#58a6ff]/10 p-2 rounded-lg">
                                <ShoppingCart className="h-6 w-6 text-[#58a6ff]" />
                            </div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Buying <span className="text-[#58a6ff]">Guides</span></h2>
                        </div>
                        <div className="space-y-3">
                            {[
                                "How to buy your first account",
                                "Payment methods & verification",
                                "Understanding delivery types",
                                "What to do after purchase",
                                "Refund policy & iShield usage"
                            ].map((article, i) => (
                                <div key={i} className="group relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#58a6ff]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                                    <button className="w-full text-left p-4 rounded-xl border border-[#30363d]/50 hover:border-[#58a6ff]/50 bg-[#161b22]/50 hover:bg-[#161b22] text-[#c9d1d9] hover:text-white transition-all flex items-center justify-between group relative z-10">
                                        <span className="text-sm font-bold group-hover:translate-x-1 transition-transform">{article}</span>
                                        <ChevronRight className="h-4 w-4 text-[#58a6ff] opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section id="selling" className="space-y-8">
                        <div className="flex items-center gap-4 border-b border-[#30363d] pb-4">
                            <div className="bg-[#3ecf8e]/10 p-2 rounded-lg">
                                <BadgeCheck className="h-6 w-6 text-[#3ecf8e]" />
                            </div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Selling <span className="text-[#3ecf8e]">Guides</span></h2>
                        </div>
                        <div className="space-y-3">
                            {[
                                "How to list your game accounts",
                                "Verification & trust levels",
                                "Withdrawing your earnings",
                                "Managing active orders",
                                "Avoiding chargeback disputes"
                            ].map((article, i) => (
                                <div key={i} className="group relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#3ecf8e]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                                    <button className="w-full text-left p-4 rounded-xl border border-[#30363d]/50 hover:border-[#3ecf8e]/50 bg-[#161b22]/50 hover:bg-[#161b22] text-[#c9d1d9] hover:text-white transition-all flex items-center justify-between group relative z-10">
                                        <span className="text-sm font-bold group-hover:translate-x-1 transition-transform">{article}</span>
                                        <ChevronRight className="h-4 w-4 text-[#3ecf8e] opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* iShield Section */}
                <section id="ishield" className="space-y-12 relative">
                    <div className="absolute inset-0 bg-[#f5a623]/5 blur-[100px] rounded-full pointer-events-none" />

                    <div className="text-center mb-16 relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f5a623]/10 border border-[#f5a623]/20 text-[#f5a623] text-[11px] font-black uppercase tracking-widest mb-6 animate-pulse">
                            <ShieldCheck className="h-3 w-3" />
                            Security Protocol Active
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">THE <span className="text-[#f5a623]">iSHIELD</span> ADVANTAGE</h2>
                        <p className="text-[#8b949e] mt-4 text-lg max-w-2xl mx-auto">World-class protection for every transaction on our platform.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                        {/* Buyer iShield */}
                        <div className="p-10 rounded-3xl bg-[#0d1117]/80 backdrop-blur-xl border border-[#30363d] relative overflow-hidden group hover:border-[#58a6ff]/50 transition-colors duration-500">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity duration-500 transform group-hover:scale-110">
                                <ShieldCheck className="h-40 w-40 text-[#58a6ff]" />
                            </div>
                            <div className="h-12 w-12 rounded-xl bg-[#58a6ff]/10 border border-[#58a6ff]/20 flex items-center justify-center mb-8 text-[#58a6ff]">
                                <ShoppingCart className="h-6 w-6" />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">iShield for <span className="text-[#58a6ff]">Buyers</span></h3>
                            <ul className="space-y-6">
                                {[
                                    { t: "Money-Back Guarantee", d: "Funds are held in escrow until you confirm delivery." },
                                    { t: "Verified Sellers Only", d: "We vet our sellers to ensure they meet our reliability standards." },
                                    { t: "Account Recovery Support", d: "Lifetime protection against original owner reclamation." }
                                ].map((bullet, i) => (
                                    <li key={i} className="flex gap-4">
                                        <div className="h-6 w-6 rounded-full bg-[#58a6ff]/10 flex items-center justify-center mt-0.5 shrink-0 border border-[#58a6ff]/20">
                                            <div className="h-2 w-2 rounded-full bg-[#58a6ff]" />
                                        </div>
                                        <div>
                                            <div className="text-base font-bold text-white mb-1">{bullet.t}</div>
                                            <div className="text-sm text-[#8b949e] leading-relaxed font-medium">{bullet.d}</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Seller iShield */}
                        <div className="p-10 rounded-3xl bg-[#0d1117]/80 backdrop-blur-xl border border-[#30363d] relative overflow-hidden group hover:border-[#3ecf8e]/50 transition-colors duration-500">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity duration-500 transform group-hover:scale-110">
                                <ShieldCheck className="h-40 w-40 text-[#3ecf8e]" />
                            </div>
                            <div className="h-12 w-12 rounded-xl bg-[#3ecf8e]/10 border border-[#3ecf8e]/20 flex items-center justify-center mb-8 text-[#3ecf8e]">
                                <BadgeCheck className="h-6 w-6" />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">iShield for <span className="text-[#3ecf8e]">Sellers</span></h3>
                            <ul className="space-y-6">
                                {[
                                    { t: "Chargeback Protection", d: "We shoulder the risk of fraudulent buyer chargebacks." },
                                    { t: "Automated Payouts", d: "Get paid instantly once the buyer confirms delivery." },
                                    { t: "Identity Verification", d: "Our KYC systems ensure you are dealing with real humans." }
                                ].map((bullet, i) => (
                                    <li key={i} className="flex gap-4">
                                        <div className="h-6 w-6 rounded-full bg-[#3ecf8e]/10 flex items-center justify-center mt-0.5 shrink-0 border border-[#3ecf8e]/20">
                                            <div className="h-2 w-2 rounded-full bg-[#3ecf8e]" />
                                        </div>
                                        <div>
                                            <div className="text-base font-bold text-white mb-1">{bullet.t}</div>
                                            <div className="text-sm text-[#8b949e] leading-relaxed font-medium">{bullet.d}</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section id="faq" className="pt-20 border-t border-[#30363d]/50">
                    <div className="flex flex-col md:flex-row gap-12">
                        <div className="md:w-1/3">
                            <h2 className="text-3xl font-black text-white mb-6 uppercase tracking-tighter">Frequently Asked <span className="text-[#f5a623]">Questions</span></h2>
                            <p className="text-[#8b949e] text-base leading-relaxed font-medium">
                                Can't find what you're looking for? Reach out to our 24/7 support team via the chat widget.
                            </p>
                            <div className="mt-8 flex items-center gap-4 p-5 rounded-2xl bg-[#161b22]/50 border border-[#30363d] backdrop-blur-sm">
                                <div className="h-12 w-12 rounded-full bg-[#f5a623]/10 flex items-center justify-center shrink-0 border border-[#f5a623]/20">
                                    <ShieldAlert className="h-6 w-6 text-[#f5a623]" />
                                </div>
                                <div className="text-xs text-[#8b949e]">
                                    <span className="block font-bold text-white mb-0.5 uppercase tracking-wider">Average Response Time</span>
                                    <span className="text-[#f5a623] font-bold">under 15 minutes</span>
                                </div>
                            </div>
                        </div>
                        <div className="md:w-2/3">
                            <Accordion type="single" collapsible className="w-full space-y-4">
                                {[
                                    {
                                        q: "How does the buyer protection work?",
                                        a: "When you buy an item, your payment is securely held by iBoosts (iShield Escrow). The seller only receives the funds after you have confirmed the successful delivery of the goods or service."
                                    },
                                    {
                                        q: "What should I do if a seller is unresponsive?",
                                        a: "If a seller has not responded within the promised delivery time, you can open a dispute from the order details page. Our support team will intermediate and resolve the issue within 24 hours."
                                    },
                                    {
                                        q: "How can I verify my seller account?",
                                        a: "Head to your Dashboard Settings and click on 'Verify Identity'. You'll need to provide a government ID and a clear selfie. Verification usually takes 1-2 business days."
                                    },
                                    {
                                        q: "Are the accounts I buy permanent?",
                                        a: "Yes, all accounts sold through iBoosts come with a lifetime guarantee under iShield. If an account is ever reclaimed by the original owner, you are entitled to a full refund or a replacement."
                                    },
                                    {
                                        q: "What payment methods do you accept?",
                                        a: "We accept all major Credit/Debit cards (Visa, Mastercard, Amex), Apple Pay, Google Pay, and several major cryptocurrencies via our secure gateway."
                                    }
                                ].map((item, i) => (
                                    <AccordionItem key={i} value={`item-${i}`} className="bg-[#161b22]/30 border border-[#30363d]/50 rounded-2xl px-2 data-[state=open]:bg-[#161b22] data-[state=open]:border-[#f5a623]/20 transition-all duration-300">
                                        <AccordionTrigger className="text-base font-bold text-white hover:text-[#f5a623] hover:no-underline px-4 py-5">
                                            {item.q}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-[#8b949e] text-sm px-4 pb-6 leading-relaxed font-medium">
                                            {item.a}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    </div>
                </section>

                {/* Contact CTA */}
                <section className="bg-gradient-to-r from-[#1c2128] via-[#0d1117] to-[#1c2128] border border-[#30363d] rounded-3xl p-8 md:p-16 text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(245,166,35,0.05)_50%,transparent_75%)] bg-[length:250%_250%] animate-[gradient_15s_ease_infinite]" />
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter">Still need <span className="text-[#f5a623]">help</span>?</h2>
                        <p className="text-[#8b949e] text-lg mb-10 max-w-xl mx-auto font-medium">
                            Our dedicated support champions are ready to assist you with any inquiries regarding the platform.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button className="bg-[#f5a623] hover:bg-[#d48c1a] text-black font-black uppercase px-10 py-7 rounded-2xl transition-all w-full sm:w-auto text-base hover:scale-105 shadow-[0_0_20px_rgba(245,166,35,0.3)] hover:shadow-[0_0_30px_rgba(245,166,35,0.5)]">
                                Open Support Ticket
                            </Button>
                            <Button variant="outline" className="border-[#30363d] text-white font-bold px-10 py-7 rounded-2xl hover:bg-[#1c2128] w-full sm:w-auto text-base hover:border-white/20">
                                View Documentation
                            </Button>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}
