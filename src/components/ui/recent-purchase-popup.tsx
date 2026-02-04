"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X } from "lucide-react";
import Image from "next/image";

interface Purchase {
    id: string;
    user: string;
    game: string;
    amount: string;
    time: string;
    image: string;
}

const mockPurchases: Purchase[] = [
    {
        id: "1",
        user: "KillerPVP",
        game: "Rust",
        amount: "$45.00",
        time: "2 minutes ago",
        image: "https://i.imgur.com/u7FvX8B.png",
    },
    {
        id: "2",
        user: "BeeMaster99",
        game: "Bee Swarm Sim",
        amount: "$12.50",
        time: "5 minutes ago",
        image: "https://i.imgur.com/8N48l8b.png",
    },
    {
        id: "3",
        user: "RobloxTrader",
        game: "Roblox",
        amount: "$120.00",
        time: "12 minutes ago",
        image: "https://i.imgur.com/39A8n8A.png",
    },
    {
        id: "4",
        user: "NexusPlayer",
        game: "GTA 5",
        amount: "$25.00",
        time: "1 minute ago",
        image: "https://i.imgur.com/gta5-icon.png", // Fallback handles this
    },
];

export function RecentPurchasePopup() {
    const [isVisible, setIsVisible] = React.useState(false);
    const [currentPurchase, setCurrentPurchase] = React.useState<Purchase | null>(null);

    React.useEffect(() => {
        const showNotification = () => {
            const randomPurchase = mockPurchases[Math.floor(Math.random() * mockPurchases.length)];
            setCurrentPurchase(randomPurchase);
            setIsVisible(true);

            // Hide after 5 seconds
            setTimeout(() => {
                setIsVisible(false);
            }, 5000);
        };

        // Initial delay
        const initialTimer = setTimeout(showNotification, 3000);

        // Repeat sequence
        const interval = setInterval(() => {
            if (!isVisible) {
                showNotification();
            }
        }, 15000 + Math.random() * 10000); // Random interval between 15-25s

        return () => {
            clearTimeout(initialTimer);
            clearInterval(interval);
        };
    }, [isVisible]);

    return (
        <AnimatePresence>
            {isVisible && currentPurchase && (
                <motion.div
                    initial={{ x: -100, opacity: 0, scale: 0.9 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    exit={{ x: -20, opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="fixed bottom-6 left-6 z-[9999] flex w-[320px] items-center gap-4 overflow-hidden rounded-2xl border border-[#2d333b] bg-[#0d1117]/95 p-3 shadow-2xl backdrop-blur-md"
                >
                    {/* Activity Pulse Dot */}
                    <div className="absolute top-2 right-2">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00b67a] opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00b67a]"></span>
                        </span>
                    </div>

                    {/* Icon/Image Wrapper */}
                    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#1c2128] border border-[#2d333b]/50 p-2">
                        <Image
                            src={currentPurchase.image}
                            alt={currentPurchase.game}
                            width={40}
                            height={40}
                            className="object-contain"
                            onError={(e: any) => {
                                e.target.src = "https://i.imgur.com/u7FvX8B.png"; // Fallback to Rust icon
                            }}
                        />
                        <div className="absolute -bottom-1 -right-1 rounded-full bg-[#f5a623] p-1 shadow-lg">
                            <ShoppingBag className="h-3 w-3 text-black stroke-[3]" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col min-w-0">
                        <p className="text-[13px] font-bold text-white truncate">
                            {currentPurchase.user}
                        </p>
                        <p className="text-[12px] text-[#9ca3af] leading-tight mt-0.5">
                            Purchased <span className="text-[#f5a623] font-bold">{currentPurchase.game}</span>
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                            <span className="text-[11px] font-black text-white bg-[#2d333b] px-1.5 py-0.5 rounded uppercase">
                                {currentPurchase.amount}
                            </span>
                            <span className="text-[10px] font-bold text-[#4b5563] uppercase">
                                • {currentPurchase.time}
                            </span>
                        </div>
                    </div>

                    {/* Close Button (Hidden by default, shows on hover if needed) */}
                    <button
                        onClick={() => setIsVisible(false)}
                        className="ml-auto rounded-lg p-1 text-[#4b5563] hover:text-white transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
