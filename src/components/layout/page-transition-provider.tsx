"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/logo";

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                className="w-full h-full"
            >
                {/* 1. Branded Entrance Overlay - Guaranteed to be visible first */}
                <motion.div
                    className="fixed inset-0 z-[10000] pointer-events-none flex items-center justify-center bg-[#0a0e13]/60 backdrop-blur-md"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.8, delay: 1.0, ease: "easeInOut" }}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, rotate: -180 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        transition={{
                            duration: 0.6,
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

                {/* 2. Page Content - Explicitly hidden while overlay is solid */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{
                        duration: 0.8,
                        delay: 1.2, // Wait for overlay to start fading
                        ease: "easeOut"
                    }}
                >
                    {children}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
