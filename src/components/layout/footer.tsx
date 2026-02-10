import Link from "next/link";
import Image from "next/image";
import {
    Instagram,
    Twitter,
    Youtube,
    Facebook,
    Globe,
    MessageCircle,
    ShieldCheck,
    Gamepad2
} from "lucide-react";

import { Logo } from "@/components/ui/logo";
import { CDN_URL } from "@/lib/constants";

export function Footer() {
    return (
        <footer className="bg-[#050506] border-t border-[#2d333b] pt-10 pb-6">
            <div className="max-w-7xl mx-auto px-6">
                {/* Top Strip: Payments & Language */}
                <div className="flex flex-col lg:flex-row items-center justify-between pb-10 border-b border-[#2d333b] gap-8">
                    {/* Payment Methods */}
                    <div className="flex flex-col items-center lg:items-start gap-4">
                        <p className="text-[10px] font-black text-[#8b949e] uppercase tracking-[0.2em]">Supported Payments</p>
                        <div className="flex items-center gap-2 flex-wrap justify-center lg:justify-start">
                            <div className="h-6 flex items-center bg-[#1c2128] px-2 py-1 rounded border border-[#2d333b]"><Image src={`${CDN_URL}/images/payments/visa.png`} alt="Visa" width={32} height={20} className="object-contain" /></div>
                            <div className="h-6 flex items-center bg-[#1c2128] px-2 py-1 rounded border border-[#2d333b]"><Image src={`${CDN_URL}/images/payments/mastercard.png`} alt="Mastercard" width={32} height={20} className="object-contain" /></div>
                            <div className="h-6 flex items-center bg-[#1c2128] px-2 py-1 rounded border border-[#2d333b]"><Image src={`${CDN_URL}/images/payments/amex.png`} alt="Amex" width={32} height={20} className="object-contain" /></div>
                            <div className="h-6 flex items-center bg-[#1c2128] px-2 py-1 rounded border border-[#2d333b]"><Image src={`${CDN_URL}/images/payments/discover.png`} alt="Discover" width={32} height={20} className="object-contain" /></div>
                            <div className="h-6 px-3 bg-[#2d333b] rounded text-[10px] font-bold text-white flex items-center border border-white/5">
                                +15 more
                            </div>
                        </div>
                    </div>

                    {/* Language Selector */}
                    <div className="flex flex-col items-center lg:items-end gap-3 w-full lg:w-auto">
                        <p className="text-[10px] font-black text-[#8b949e] uppercase tracking-[0.2em]">Regional Settings</p>
                        <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#1c2128] border border-[#2d333b] rounded-xl text-sm text-white hover:bg-[#252b33] transition-colors w-full sm:w-auto">
                            <Globe className="h-4 w-4 text-[#f5a623]" />
                            <span className="font-bold">English | USD - $</span>
                        </button>
                    </div>
                </div>

                {/* Main Footer Content */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 py-16">
                    {/* Brand Column */}
                    <div className="space-y-6 text-center sm:text-left">
                        <Link href="/" className="flex items-center justify-center sm:justify-start gap-2">
                            <Logo className="h-10 sm:h-12 w-auto" />
                        </Link>
                        <p className="text-[#9ca3af] text-sm leading-relaxed max-w-xs mx-auto sm:mx-0">
                            The largest digital gaming marketplace. Join us today to level up your gaming experience!
                        </p>

                        {/* Trustpilot Placeholder */}
                        <Link href="https://www.trustpilot.com/review/iboosts.gg" target="_blank" className="flex flex-col items-center sm:items-start gap-2 hover:opacity-80 transition-opacity">
                            <div className="flex items-center gap-1 text-[#00b67a] font-black text-sm uppercase tracking-wider">
                                <span className="text-lg">★</span> Trustpilot
                            </div>
                            <div className="flex gap-1.5 p-1 bg-[#101419] border border-[#2d333b] rounded">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="bg-[#00b67a] p-0.5 rounded-sm">
                                        <span className="text-white text-[10px]">★</span>
                                    </div>
                                ))}
                            </div>
                            <div className="text-[11px] font-medium text-[#8b949e]">TrustScore <span className="text-white font-bold">4.9</span> | 1,248 reviews</div>
                        </Link>

                        {/* Social Icons */}
                        <div className="flex items-center justify-center sm:justify-start gap-4">
                            <Link href="#" className="h-9 w-9 rounded-lg bg-[#1c2128] border border-[#2d333b] flex items-center justify-center text-white hover:text-[#f5a623] hover:border-[#f5a623]/30 transition-all group">
                                <Facebook className="h-4 w-4 group-hover:scale-110 transition-transform" />
                            </Link>
                            <Link href="#" className="h-9 w-9 rounded-lg bg-[#1c2128] border border-[#2d333b] flex items-center justify-center text-white hover:text-[#f5a623] hover:border-[#f5a623]/30 transition-all group">
                                <Instagram className="h-4 w-4 group-hover:scale-110 transition-transform" />
                            </Link>
                            <Link href="#" className="h-9 w-9 rounded-lg bg-[#1c2128] border border-[#2d333b] flex items-center justify-center text-white hover:text-[#f5a623] hover:border-[#f5a623]/30 transition-all group">
                                <Twitter className="h-4 w-4 group-hover:scale-110 transition-transform" />
                            </Link>
                            <Link href="#" className="h-9 w-9 rounded-lg bg-[#1c2128] border border-[#2d333b] flex items-center justify-center text-white hover:text-[#f5a623] hover:border-[#f5a623]/30 transition-all group">
                                <Youtube className="h-4 w-4 group-hover:scale-110 transition-transform" />
                            </Link>
                            <Link href="https://discord.gg/MhBBdsWHhZ" target="_blank" className="h-9 w-9 rounded-lg bg-[#5865F2] border border-[#5865F2] flex items-center justify-center text-white hover:bg-[#4752c4] transition-all group shadow-[0_0_15px_rgba(88,101,242,0.3)] hover:shadow-[0_0_25px_rgba(88,101,242,0.5)]">
                                <Gamepad2 className="h-5 w-5 group-hover:scale-110 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    {/* Links Column 1 */}
                    <div className="text-center sm:text-left">
                        <h4 className="font-black text-xs uppercase tracking-[0.2em] text-[#8b949e] mb-6">Help Center</h4>
                        <ul className="space-y-4 text-sm font-bold text-[#c9d1d9]">
                            <li><Link href="https://support.iboosts.gg" className="hover:text-[#f5a623] transition-colors">Help Center</Link></li>
                            <li><Link href="https://support.iboosts.gg#faq" className="hover:text-[#f5a623] transition-colors">FAQ</Link></li>
                            <li><Link href="/blog" className="hover:text-[#f5a623] transition-colors">Blog</Link></li>
                            <li><Link href="#" className="hover:text-[#f5a623] transition-colors">Become a Partner</Link></li>
                            <li><Link href="https://status.iboosts.gg" className="inline-flex items-center gap-2 text-green-500/80 hover:text-green-500 transition-colors">
                                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                System Status
                            </Link></li>
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div className="text-center sm:text-left">
                        <h4 className="font-black text-xs uppercase tracking-[0.2em] text-[#8b949e] mb-6">Security & Warranty</h4>
                        <ul className="space-y-4 text-sm font-bold text-[#c9d1d9]">
                            <li><Link href="/ishield" className="hover:text-[#f5a623] transition-colors inline-flex items-center gap-2 justify-center sm:justify-start">
                                <ShieldCheck className="h-4 w-4 text-[#f5a623]" />
                                iShield AI
                            </Link></li>
                            <li><Link href="#" className="hover:text-[#f5a623] transition-colors">Anti-Scam Guide</Link></li>
                            <li><Link href="#" className="hover:text-[#f5a623] transition-colors">Purchase Protection</Link></li>
                            <li><Link href="#" className="hover:text-[#f5a623] transition-colors">Verified Sellers</Link></li>
                        </ul>
                    </div>

                    {/* Links Column 3 */}
                    <div className="text-center sm:text-left">
                        <h4 className="font-black text-xs uppercase tracking-[0.2em] text-[#8b949e] mb-6">Platform Rules</h4>
                        <ul className="space-y-4 text-sm font-bold text-[#c9d1d9]">
                            <li><Link href="#" className="hover:text-[#f5a623] transition-colors">Seller Rules</Link></li>
                            <li><Link href="#" className="hover:text-[#f5a623] transition-colors">Buying Policy</Link></li>
                            <li><Link href="#" className="hover:text-[#f5a623] transition-colors">Fee Structure</Link></li>
                            <li><Link href="#" className="hover:text-[#f5a623] transition-colors">Refund Policy</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-[#2d333b] pt-10 flex flex-col items-center justify-between gap-6 text-[11px] text-[#6e7681] text-center lg:flex-row lg:text-left">
                    <div className="space-y-2">
                        <p className="font-bold text-[#8b949e]">© 2026 iBoosts.gg. All rights reserved.</p>
                        <p>Not affiliated with Roblox Corporation or Valve. Trademarks belong to their respective owners.</p>
                    </div>
                    <div className="flex items-center gap-6 font-bold">
                        <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition-colors">DMCA</Link>
                    </div>
                </div>
            </div>

            {/* Fixed Chat Button */}
            <button className="fixed bottom-6 right-6 h-14 w-14 bg-[#1da1f2] rounded-full flex items-center justify-center shadow-lg hover:bg-[#1a91da] transition-colors z-[100]">
                <MessageCircle className="h-7 w-7 text-white" />
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full border-2 border-[#050506] flex items-center justify-center text-[10px] font-bold text-white">4</span>
            </button>
        </footer>
    );
}
