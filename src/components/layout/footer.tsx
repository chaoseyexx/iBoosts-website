import Link from "next/link";
import Image from "next/image";
import {
    Instagram,
    Twitter,
    Youtube,
    Facebook,
    Globe,
    MessageCircle,
    ShieldCheck
} from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-[#050506] border-t border-[#2d333b] pt-10 pb-6">
            <div className="max-w-7xl mx-auto px-6">

                {/* Top Strip: Payments & Language */}
                <div className="flex flex-col md:flex-row items-center justify-between pb-10 border-b border-[#2d333b] gap-6">

                    {/* Payment Methods */}
                    <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
                        <div className="h-6 flex items-center"><Image src="/images/payments/visa.png" alt="Visa" width={32} height={20} className="object-contain" /></div>
                        <div className="h-6 flex items-center"><Image src="/images/payments/mastercard.png" alt="Mastercard" width={32} height={20} className="object-contain" /></div>
                        <div className="h-6 flex items-center"><Image src="/images/payments/amex.png" alt="Amex" width={32} height={20} className="object-contain" /></div>
                        <div className="h-6 flex items-center"><Image src="/images/payments/discover.png" alt="Discover" width={32} height={20} className="object-contain" /></div>

                        {/* Generic Placeholders for Bitcoin/GPay/ApplePay since user didn't upload them yet, or maybe I should use icons */}
                        {/* Using text placeholder for "+15 more" style */}
                        <div className="h-6 px-2 bg-[#2d333b] rounded text-[10px] font-bold text-white flex items-center">
                            +15 more
                        </div>
                    </div>

                    {/* Language Selector */}
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#1c2128] border border-[#2d333b] rounded-lg text-sm text-white hover:bg-[#252b33] transition-colors">
                        <Globe className="h-4 w-4" />
                        <span>English | USD - $</span>
                    </button>
                </div>

                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12">

                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f5a623] font-bold text-black text-sm">
                                IB
                            </div>
                            <span className="font-bold text-white text-xl">iBoosts</span>
                        </Link>
                        <p className="text-[#9ca3af] text-sm leading-relaxed">
                            Join us today to level up your gaming experience!
                        </p>

                        {/* Trustpilot Placeholder */}
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-1 text-[#00b67a] font-bold text-sm">
                                <span className="text-lg">★</span> Trustpilot
                            </div>
                            <div className="flex bg-[#00b67a] w-fit px-2 py-1 gap-1">
                                {[1, 2, 3, 4, 5].map(i => <span key={i} className="text-white text-xs">★</span>)}
                            </div>
                            <div className="text-xs text-[#9ca3af]">TrustScore 4.4 128,816 reviews</div>
                        </div>

                        {/* Social Icons */}
                        <div className="flex items-center gap-4">
                            {/* Using generic icons for now */}
                            <Link href="#" className="text-white hover:text-[#f5a623]"><Facebook className="h-5 w-5" /></Link>
                            <Link href="#" className="text-white hover:text-[#f5a623]"><Instagram className="h-5 w-5" /></Link>
                            <Link href="#" className="text-white hover:text-[#f5a623]"><Twitter className="h-5 w-5" /></Link>
                            <Link href="#" className="text-white hover:text-[#f5a623]"><Youtube className="h-5 w-5" /></Link>
                        </div>
                    </div>

                    {/* Links Column 1 */}
                    <div>
                        <h4 className="font-medium text-white mb-6">Help Center</h4>
                        <ul className="space-y-3 text-sm text-[#9ca3af]">
                            <li><Link href="#" className="hover:text-white transition-colors">Contact us</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Bug Bounty</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Become a Partner</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Become a Seller</Link></li>
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div>
                        <h4 className="font-medium text-white mb-6">Account Warranty</h4>
                        <ul className="space-y-3 text-sm text-[#9ca3af]">
                            <li><Link href="#" className="hover:text-white transition-colors">TradeShield (Buying)</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">TradeShield (Selling)</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Deposits</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Withdrawals</Link></li>
                        </ul>
                    </div>

                    {/* Links Column 3 */}
                    <div>
                        <h4 className="font-medium text-white mb-6">Account Seller Rules</h4>
                        <ul className="space-y-3 text-sm text-[#9ca3af]">
                            <li><Link href="#" className="hover:text-white transition-colors">Seller Rules</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Changing Username</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Fees</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Refund Policy</Link></li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="border-t border-[#2d333b] pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#6b7280]">
                    <p>© 2026. The iboosts.gg website is operated by ChaosLabs.</p>
                    <div className="flex items-center gap-6">
                        <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition-colors">DMCA</Link>
                    </div>
                </div>

                {/* Fixed Chat Button */}
                <button className="fixed bottom-6 right-6 h-14 w-14 bg-[#1da1f2] rounded-full flex items-center justify-center shadow-lg hover:bg-[#1a91da] transition-colors z-[100]">
                    <MessageCircle className="h-7 w-7 text-white" />
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full border-2 border-[#050506] flex items-center justify-center text-[10px] font-bold text-white">4</span>
                </button>

            </div>
        </footer>
    );
}
