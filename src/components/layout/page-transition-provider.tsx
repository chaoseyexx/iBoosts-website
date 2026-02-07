"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { useEffect, useState } from "react";

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isPending, setIsPending] = useState(true);

    // Reset pending state on every route change to ensure overlay shows first
    useEffect(() => {
        setIsPending(true);
        // Explicitly block content slightly longer to allow branding to be seen
        const timer = setTimeout(() => setIsPending(false), 900);
        return () => clearTimeout(timer);
    }, [pathname]);

    return (
        <div className="w-full min-h-screen grid grid-cols-1 grid-rows-1">
            <AnimatePresence initial={false}>
                <motion.div
                    key={pathname}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="col-start-1 row-start-1 w-full h-full"
                >
                    {/* 1. Branded Entrance Overlay - Always mounts with opacity 1 */}
                    <motion.div
                        className="fixed inset-0 z-[10000] pointer-events-none flex items-center justify-center bg-[#0a0e13] overflow-hidden"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0 }}
                        transition={{ duration: 0.5, delay: 0.8, ease: "easeInOut" }}
                    >
                        {/* Branded Spinning Logo Hub */}
                        <div className="relative flex flex-col items-center gap-6">
                            <motion.div
                                initial={{ scale: 0.6, opacity: 0, rotate: -180 }}
                                animate={{ scale: 1.2, opacity: 1, rotate: 0 }}
                                transition={{
                                    duration: 0.6,
                                    ease: "backOut",
                                    delay: 0.1
                                }}
                            >
                                <Logo className="w-24 h-24 text-[#f5a623]" iconOnly={true} />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.4 }}
                                className="text-[#f5a623] font-black uppercase tracking-[0.3em] text-[10px]"
                            >
                                iBoosts
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* 2. Page Content - Strictly hidden while isPending is true */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: isPending ? 0 : 1, y: isPending ? 10 : 0 }}
                        transition={{
                            duration: 0.5,
                            delay: 0.1,
                            ease: "easeOut"
                        }}
                        style={{ visibility: isPending ? 'hidden' : 'visible' }}
                    >
                        {children}
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
