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

export function SupportClient() {
    return (
        <div className="min-h-screen pb-20">
            {/* Hero Section */}
            <div className="relative pt-24 pb-16 px-6 overflow-hidden border-b border-[#1c2128]">
                <div className="absolute inset-0 bg-gradient-to-b from-[#f5a623]/5 to-transparent pointer-events-none" />
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-center mb-6"
                    >
                        <div className="h-16 w-16 rounded-2xl bg-[#f5a623]/10 border border-[#f5a623]/20 flex items-center justify-center">
                            <HelpCircle className="h-8 w-8 text-[#f5a623]" />
                        </div>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight"
                    >
                        How can we <span className="text-[#f5a623]">help</span> you?
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-[#8b949e] text-lg mb-8 max-w-2xl mx-auto"
                    >
                        Search our knowledge base for articles on buying, selling, and staying safe with iShield protection.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="max-w-2xl mx-auto relative group"
                    >
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8b949e] group-focus-within:text-[#f5a623] transition-colors" />
                        <Input
                            placeholder="Search for articles, guides..."
                            className="h-14 pl-14 pr-6 bg-[#161b22] border-[#30363d] rounded-2xl text-white placeholder-[#8b949e] focus:border-[#f5a623] focus:ring-1 focus:ring-[#f5a623]/20 transition-all text-lg"
                        />
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
                        <motion.button
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + idx * 0.1 }}
                            className="flex flex-col items-start p-8 rounded-2xl bg-[#0d1117] border border-[#30363d] hover:border-[#f5a623]/50 hover:bg-[#161b22] transition-all group text-left"
                        >
                            <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: `${item.color}15`, border: `1px solid ${item.color}30` }}>
                                <item.icon className="h-6 w-6" style={{ color: item.color }} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#f5a623] transition-colors">{item.title}</h3>
                            <p className="text-[#8b949e] text-sm leading-relaxed mb-6">{item.desc}</p>
                            <div className="mt-auto flex items-center text-[#f5a623] text-sm font-bold group-hover:translate-x-1 transition-transform">
                                Explore Guides <ChevronRight className="h-4 w-4 ml-1" />
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Support Content Sections */}
            <div className="max-w-5xl mx-auto px-6 py-20 space-y-24">

                {/* Buying & Selling Detailed Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <section id="buying" className="space-y-6">
                        <div className="flex items-center gap-3">
                            <ShoppingCart className="h-6 w-6 text-[#58a6ff]" />
                            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Buying <span className="text-[#58a6ff]">Guides</span></h2>
                        </div>
                        <div className="space-y-2">
                            {[
                                "How to buy your first account",
                                "Payment methods & verification",
                                "Understanding delivery types",
                                "What to do after purchase",
                                "Refund policy & iShield usage"
                            ].map((article, i) => (
                                <button key={i} className="w-full text-left p-4 rounded-xl border border-transparent hover:border-[#30363d] hover:bg-[#161b22] text-[#8b949e] hover:text-[#58a6ff] transition-all flex items-center justify-between group">
                                    <span className="text-sm font-bold">{article}</span>
                                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>
                    </section>

                    <section id="selling" className="space-y-6">
                        <div className="flex items-center gap-3">
                            <BadgeCheck className="h-6 w-6 text-[#3ecf8e]" />
                            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Selling <span className="text-[#3ecf8e]">Guides</span></h2>
                        </div>
                        <div className="space-y-2">
                            {[
                                "How to list your game accounts",
                                "Verification & trust levels",
                                "Withdrawing your earnings",
                                "Managing active orders",
                                "Avoiding chargeback disputes"
                            ].map((article, i) => (
                                <button key={i} className="w-full text-left p-4 rounded-xl border border-transparent hover:border-[#30363d] hover:bg-[#161b22] text-[#8b949e] hover:text-[#3ecf8e] transition-all flex items-center justify-between group">
                                    <span className="text-sm font-bold">{article}</span>
                                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>
                    </section>
                </div>

                {/* iShield Section */}
                <section id="ishield" className="space-y-12">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f5a623]/10 border border-[#f5a623]/20 text-[#f5a623] text-[10px] font-black uppercase tracking-widest mb-4">
                            <ShieldCheck className="h-3 w-3" />
                            Security Protocol
                        </div>
                        <h2 className="text-3xl font-black text-white">The <span className="text-[#f5a623]">iShield</span> Advantage</h2>
                        <p className="text-[#8b949e] mt-2">World-class protection for every transaction on our platform.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Buyer iShield */}
                        <div className="p-8 rounded-3xl bg-[#0d1117] border border-[#30363d] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <ShieldCheck className="h-24 w-24 text-[#f5a623]" />
                            </div>
                            <div className="h-10 w-10 rounded-lg bg-[#58a6ff]/10 border border-[#58a6ff]/20 flex items-center justify-center mb-6 text-[#58a6ff]">
                                <ShoppingCart className="h-5 w-5" />
                            </div>
                            <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tight">iShield for Buyers</h3>
                            <ul className="space-y-4">
                                {[
                                    { t: "Money-Back Guarantee", d: "Funds are held in escrow until you confirm delivery." },
                                    { t: "Verified Sellers Only", d: "We vet our sellers to ensure they meet our reliability standards." },
                                    { t: "Account Recovery Support", d: "Lifetime protection against original owner reclamation." }
                                ].map((bullet, i) => (
                                    <li key={i} className="flex gap-4">
                                        <div className="h-5 w-5 rounded-full bg-[#3ecf8e]/10 flex items-center justify-center mt-0.5 shrink-0">
                                            <div className="h-1.5 w-1.5 rounded-full bg-[#3ecf8e]" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white mb-1">{bullet.t}</div>
                                            <div className="text-xs text-[#8b949e] leading-relaxed">{bullet.d}</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Seller iShield */}
                        <div className="p-8 rounded-3xl bg-[#0d1117] border border-[#30363d] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <ShieldCheck className="h-24 w-24 text-[#f5a623]" />
                            </div>
                            <div className="h-10 w-10 rounded-lg bg-[#3ecf8e]/10 border border-[#3ecf8e]/20 flex items-center justify-center mb-6 text-[#3ecf8e]">
                                <BadgeCheck className="h-5 w-5" />
                            </div>
                            <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tight">iShield for Sellers</h3>
                            <ul className="space-y-4">
                                {[
                                    { t: "Chargeback Protection", d: "We shoulder the risk of fraudulent buyer chargebacks." },
                                    { t: "Automated Payouts", d: "Get paid instantly once the buyer confirms delivery." },
                                    { t: "Identity Verification", d: "Our KYC systems ensure you are dealing with real humans." }
                                ].map((bullet, i) => (
                                    <li key={i} className="flex gap-4">
                                        <div className="h-5 w-5 rounded-full bg-[#f5a623]/10 flex items-center justify-center mt-0.5 shrink-0">
                                            <div className="h-1.5 w-1.5 rounded-full bg-[#f5a623]" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white mb-1">{bullet.t}</div>
                                            <div className="text-xs text-[#8b949e] leading-relaxed">{bullet.d}</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section id="faq" className="pt-20 border-t border-[#1c2128]">
                    <div className="flex flex-col md:flex-row gap-12">
                        <div className="md:w-1/3">
                            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Frequently Asked <span className="text-[#f5a623]">Questions</span></h2>
                            <p className="text-[#8b949e] text-sm leading-relaxed">
                                Can't find what you're looking for? Reach out to our 24/7 support team via the chat widget in the dashboard.
                            </p>
                            <div className="mt-8 flex items-center gap-4 p-4 rounded-xl bg-[#161b22] border border-[#30363d]">
                                <div className="h-10 w-10 rounded-full bg-[#f5a623]/10 flex items-center justify-center shrink-0">
                                    <ShieldAlert className="h-5 w-5 text-[#f5a623]" />
                                </div>
                                <div className="text-xs text-[#8b949e]">
                                    <span className="block font-bold text-white mb-0.5 uppercase">Average Response Time</span>
                                    under 15 minutes
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
                                    <AccordionItem key={i} value={`item-${i}`} className="bg-[#0d1117] border border-[#30363d] rounded-xl px-2">
                                        <AccordionTrigger className="text-sm font-bold text-white hover:text-[#f5a623] hover:no-underline px-4">
                                            {item.q}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-[#8b949e] text-sm px-4 pb-4 leading-relaxed">
                                            {item.a}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    </div>
                </section>

                {/* Contact CTA */}
                <section className="bg-gradient-to-r from-[#1c2128] to-[#0d1117] border border-[#30363d] rounded-3xl p-12 text-center">
                    <h2 className="text-3xl font-black text-white mb-4">Still need <span className="text-[#f5a623]">help</span>?</h2>
                    <p className="text-[#8b949e] mb-8 max-w-xl mx-auto">
                        Our dedicated support champions are ready to assist you with any inquiries regarding the platform.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button className="bg-[#f5a623] hover:bg-[#d48c1a] text-black font-black uppercase px-8 py-6 rounded-xl transition-all">
                            Open Support Ticket
                        </Button>
                        <Button variant="outline" className="border-[#30363d] text-white font-bold px-8 py-6 rounded-xl hover:bg-[#1c2128]">
                            View Documentation
                        </Button>
                    </div>
                </section>

            </div>
        </div>
    );
}
