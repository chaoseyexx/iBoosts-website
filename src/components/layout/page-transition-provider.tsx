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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
            >
                {/* Content Fade In */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    {children}
                </motion.div>

                {/* Overlay Loader Animation */}
                <motion.div
                    className="fixed inset-0 z-[10000] pointer-events-none flex items-center justify-center bg-[#0a0e13]/60 backdrop-blur-md"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, rotate: -180 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        transition={{
                            duration: 0.4,
                            ease: "easeOut",
                            // Continuous spin while visible
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
            </motion.div>
        </AnimatePresence>
    );
}
