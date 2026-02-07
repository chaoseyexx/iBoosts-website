"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { useEffect, useState } from "react";

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="w-full min-h-screen grid grid-cols-1 grid-rows-1">
            <AnimatePresence mode="popLayout" initial={false}>
                <TransitionContent key={pathname} pathname={pathname}>
                    {children}
                </TransitionContent>
            </AnimatePresence>
        </div>
    );
}

function TransitionContent({ pathname, children }: { pathname: string, children: React.ReactNode }) {
    const [isPending, setIsPending] = useState(true);

    useEffect(() => {
        // Super snappy 50ms duration - just enough to prevent FOUC
        const timer = setTimeout(() => setIsPending(false), 50);
        return () => clearTimeout(timer);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="col-start-1 row-start-1 w-full h-full"
        >
            {/* 1. Branded Entrance Overlay - Instant mount at opacity 1 */}
            <motion.div
                className="fixed inset-0 z-[10000] pointer-events-none flex items-center justify-center bg-[#0a0e13] overflow-hidden"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
            >
                {/* Branded Spinning Logo Hub */}
                <div className="relative flex flex-col items-center gap-6">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, rotate: -90 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        transition={{
                            duration: 0.2,
                            ease: "easeOut",
                            delay: 0
                        }}
                    >
                        <Logo className="w-20 h-20 text-[#f5a623]" iconOnly={true} />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.2 }}
                        className="text-[#f5a623] font-black uppercase tracking-[0.3em] text-[10px]"
                    >
                        iBoosts
                    </motion.div>
                </div>
            </motion.div>

            {/* 2. Page Content - Instant state awareness through keyed mounting */}
            <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: isPending ? 0 : 1, y: isPending ? 5 : 0 }}
                transition={{
                    duration: 0.4,
                    delay: 0.05,
                    ease: "easeOut"
                }}
                style={{ visibility: isPending ? 'hidden' : 'visible' }}
            >
                {children}
            </motion.div>
        </motion.div>
    );
}
