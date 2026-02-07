"use client";

import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Mail, DollarSign } from "lucide-react";

export function DemoNoticeModal() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        // Show after a short delay for better UX
        const timer = setTimeout(() => {
            setOpen(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] shadow-2xl">
                <DialogHeader className="space-y-4">
                    <div className="mx-auto bg-[#f5a623]/10 w-12 h-12 rounded-full flex items-center justify-center mb-2 border border-[#f5a623]/20">
                        <AlertCircle className="h-6 w-6 text-[#f5a623]" />
                    </div>
                    <DialogTitle className="text-center text-xl font-bold text-white uppercase tracking-tight">
                        Demo Preview
                    </DialogTitle>
                    <DialogDescription className="text-center text-[#8b949e] font-medium">
                        This website is currently a <span className="text-[#f5a623]">demo</span> and is still under active development.
                    </DialogDescription>
                </DialogHeader>

                <div className="bg-[#161b22] rounded-xl p-4 border border-[#30363d] my-4 space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#238636]/10 p-2 rounded-lg">
                            <DollarSign className="h-5 w-5 text-[#238636]" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-white">Seeking Angel Investors</h4>
                            <p className="text-xs text-[#8b949e]">We are looking for partners to scale.</p>
                        </div>
                    </div>
                    <div className="h-[1px] bg-[#30363d]" />
                    <div className="flex items-center gap-3">
                        <div className="bg-[#1f6feb]/10 p-2 rounded-lg">
                            <Mail className="h-5 w-5 text-[#58a6ff]" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-white">Contact Us</h4>
                            <a href="mailto:chaoseyex@gmail.com" className="text-xs text-[#58a6ff] hover:underline break-all">
                                chaoseyex@gmail.com
                            </a>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center">
                    <Button
                        onClick={() => setOpen(false)}
                        className="w-full bg-[#f5a623] text-black hover:bg-[#e09612] font-bold"
                    >
                        Understood, Continue
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
