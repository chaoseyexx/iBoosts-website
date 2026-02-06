

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { NavbarServer } from "@/components/layout/navbar-server";
import { Footer } from "@/components/layout/footer";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#0a0e13] flex flex-col pt-[60px]">
            <NavbarServer />

            <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#f5a623]/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#5c9eff]/5 rounded-full blur-[120px]" />

                <div className="relative z-10 text-center space-y-8 max-w-md mx-auto">
                    {/* 404 Visual */}
                    <div className="relative">
                        <h1 className="text-[12rem] font-black text-white/5 select-none leading-none">
                            404
                        </h1>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="space-y-2">
                                <div className="text-7xl font-bold bg-gradient-to-r from-[#f5a623] to-[#ffb347] bg-clip-text text-transparent">
                                    Oops!
                                </div>
                                <div className="text-2xl font-semibold text-white">
                                    Page not found
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="text-[#9ca3af] text-lg">
                        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/">
                            <Button className="w-full sm:w-auto bg-[#f5a623] hover:bg-[#e09612] text-black font-semibold h-12 px-8">
                                <Home className="h-5 w-5 mr-2" />
                                Go to Homepage
                            </Button>
                        </Link>
                        <Link href="/dashboard">
                            <Button variant="outline" className="w-full sm:w-auto border-[#2d333b] text-white hover:bg-[#1c2128] h-12 px-8">
                                <ArrowLeft className="h-5 w-5 mr-2" />
                                Back to Dashboard
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
