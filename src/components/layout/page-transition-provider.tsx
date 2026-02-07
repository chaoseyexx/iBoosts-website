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
        const timer = setTimeout(() => setIsPending(false), 800); // Snappier delay
        return () => clearTimeout(timer);
    }, [pathname]);

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full relative"
            >
                {/* 1. Branded Entrance Overlay - Always mounts with opacity 1 */}
                <motion.div
                    className="fixed inset-0 z-[10000] pointer-events-none flex items-center justify-center bg-[#0a0e13]/90 backdrop-blur-xl"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.4, delay: 0.6, ease: "easeInOut" }}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, rotate: -180 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        transition={{
                            duration: 0.4,
                            ease: "easeOut",
                            rotate: {
                                repeat: Infinity,
                                duration: 2,
                                ease: "linear"
                            }
                        }}
                    >
                        <Logo className="w-24 h-24" iconOnly={true} />
                    </motion.div>
                </motion.div>

                {/* 2. Page Content - Strictly hidden while isPending is true */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isPending ? 0 : 1 }}
                    transition={{
                        duration: 0.4,
                        ease: "easeOut"
                    }}
                    style={{ visibility: isPending ? 'hidden' : 'visible' }}
                >
                    {children}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
