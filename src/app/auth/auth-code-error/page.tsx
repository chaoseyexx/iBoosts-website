"use client";

import Link from "next/link";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuthCodeErrorPage() {
    return (
        <div className="min-h-screen bg-[#0a0e13] flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-[#161b22] border border-[#30363d] rounded-2xl p-8 shadow-2xl text-center space-y-6">
                <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-white uppercase tracking-tight">Authentication Error</h1>
                    <p className="text-[#8b949e]">
                        Something went wrong while trying to sign you in. This could be due to an expired link or a configuration mismatch.
                    </p>
                </div>

                <div className="bg-[#0d1117] rounded-xl p-4 border border-[#30363d] text-left">
                    <p className="text-xs text-[#8b949e] font-medium uppercase tracking-wider mb-2">Common Fixes:</p>
                    <ul className="text-sm text-[#c9d1d9] space-y-2">
                        <li className="flex gap-2">
                            <span className="text-[#f5a623]">•</span>
                            Try logging in again.
                        </li>
                        <li className="flex gap-2">
                            <span className="text-[#f5a623]">•</span>
                            Clear your browser cookies and try again.
                        </li>
                    </ul>
                </div>

                <div className="flex flex-col gap-3">
                    <Link href="/login" className="w-full">
                        <Button className="w-full bg-[#f5a623] text-black hover:bg-[#e09612] font-bold h-12">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Login
                        </Button>
                    </Link>
                    <Link href="/" className="w-full">
                        <Button variant="ghost" className="w-full text-[#8b949e] hover:text-white h-12">
                            <Home className="mr-2 h-4 w-4" />
                            Go to Homepage
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
