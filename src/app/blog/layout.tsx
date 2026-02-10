import Link from "next/link";
import "@/app/globals.css";
import { Logo } from "@/components/ui/logo";
import { Search } from "lucide-react";

export const metadata = {
    title: "iBoosts Blog | Gaming Marketplace News & Updates",
    description: "The latest news, tips, and updates from iBoosts - the #1 gaming marketplace for accounts, items, and boosting services.",
};

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#0a0e13] text-white">
            {/* Blog Header */}
            <header className="sticky top-0 z-50 bg-[#0a0e13]/95 backdrop-blur-sm border-b border-white/5">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="h-14 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <Link href="/" className="flex items-center gap-2">
                                <Logo className="h-7 w-auto" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#f5a623] bg-[#f5a623]/10 px-2 py-0.5 rounded">
                                    Blog
                                </span>
                            </Link>
                            {/* Category Filters */}
                            <div className="hidden sm:flex items-center gap-1">
                                <Link href="/blog" className="px-3 py-1.5 text-xs font-bold bg-[#f5a623] text-[#0a0e13] rounded-full">All</Link>
                                <button className="px-3 py-1.5 text-xs font-medium text-white/50 hover:text-white hover:bg-white/5 rounded-full transition-colors">Gaming</button>
                                <button className="px-3 py-1.5 text-xs font-medium text-white/50 hover:text-white hover:bg-white/5 rounded-full transition-colors">Guides</button>
                            </div>
                        </div>
                        <nav className="flex items-center gap-3">
                            {/* Search */}
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/5">
                                <Search className="h-3 w-3 text-white/30" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="bg-transparent text-xs text-white placeholder:text-white/30 focus:outline-none w-24"
                                />
                            </div>
                            <Link
                                href="/"
                                className="h-8 px-4 flex items-center bg-[#f5a623] text-[#0a0e13] font-bold text-xs rounded-lg hover:bg-[#ffc107] transition-colors"
                            >
                                Marketplace
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main>
                {children}
            </main>

            {/* Blog Footer */}
            <footer className="border-t border-white/5 mt-12">
                <div className="max-w-6xl mx-auto px-6 py-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/30">
                        <span>© {new Date().getFullYear()} iBoosts. All rights reserved.</span>
                        <span>Powered by iShield AI</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
