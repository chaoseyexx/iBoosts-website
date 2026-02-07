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

const names = ["KillerPVP", "BeeMaster99", "RobloxTrader", "NexusPlayer", "ShadowGamer", "SkyWalker", "TradeKing", "EliteSlayer"];
const amounts = ["$5.00", "$15.00", "$25.00", "$45.00", "$99.00", "$120.00", "$2.50", "$60.00"];
const times = ["Just now", "2 minutes ago", "5 minutes ago", "12 minutes ago", "1 minute ago", "8 minutes ago"];

interface RecentPurchasePopupProps {
    initialActivities?: { name: string; icon: string | null }[];
}

export function RecentPurchasePopup({ initialActivities = [] }: RecentPurchasePopupProps) {
    const [activePurchases, setActivePurchases] = React.useState<Purchase[]>([]);

    const removeNotification = React.useCallback((id: string) => {
        setActivePurchases((prev) => prev.filter((p) => p.id !== id));
    }, []);

    const showNotification = React.useCallback(() => {
        if (initialActivities.length === 0) return;

        const randomGame = initialActivities[Math.floor(Math.random() * initialActivities.length)];
        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomAmount = amounts[Math.floor(Math.random() * amounts.length)];
        const randomTime = times[Math.floor(Math.random() * times.length)];
        const id = Math.random().toString();

        const newPurchase: Purchase = {
            id,
            user: randomName,
            game: randomGame.name,
            amount: randomAmount,
            time: randomTime,
            image: randomGame.icon || "https://cdn.iboosts.gg/favicon-32x32.png",
        };

        setActivePurchases((prev) => {
            const next = [newPurchase, ...prev];
            return next.slice(0, 3); // Max 3 notifications
        });

        // Hide after 5 seconds
        setTimeout(() => {
            removeNotification(id);
        }, 5000);
    }, [initialActivities, removeNotification]);

    React.useEffect(() => {
        // Initial delay
        const initialTimer = setTimeout(showNotification, 3000);

        // Repeat sequence with random interval
        const interval = setInterval(() => {
            showNotification();
        }, 8000 + Math.random() * 5000); // 8-13 seconds between new notifications

        return () => {
            clearTimeout(initialTimer);
            clearInterval(interval);
        };
    }, [showNotification]);

    return (
        <div className="fixed bottom-6 left-6 z-[9999] flex flex-col gap-3 pointer-events-none">
            <AnimatePresence mode="popLayout">
                {activePurchases.map((purchase) => (
                    <motion.div
                        key={purchase.id}
                        layout
                        initial={{ x: -100, opacity: 0, scale: 0.9 }}
                        animate={{ x: 0, opacity: 1, scale: 1 }}
                        exit={{ x: -20, opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="pointer-events-auto flex w-[320px] items-center gap-4 overflow-hidden rounded-2xl border border-[#2d333b] bg-[#0d1117]/95 p-3 shadow-2xl backdrop-blur-md"
                    >
                        {/* Activity Pulse Dot */}
                        <div className="absolute top-2 right-2">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00b67a] opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00b67a]"></span>
                            </span>
                        </div>

                        {/* Icon/Image Wrapper */}
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#0d1117]">
                            <Image
                                src={(purchase.image && (purchase.image.startsWith('http') || purchase.image.startsWith('/')))
                                    ? purchase.image
                                    : "https://i.imgur.com/u7FvX8B.png"}
                                alt={purchase.game}
                                fill
                                className="object-cover"
                                onError={(e: any) => {
                                    e.target.style.display = 'none'; // Fallback behavior for error
                                }}
                            />
                            <div className="absolute bottom-1 right-1 z-10 rounded-full bg-[#f5a623] p-1 shadow-lg">
                                <ShoppingBag className="h-3 w-3 text-black stroke-[3]" />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col min-w-0">
                            <p className="text-[13px] font-bold text-white truncate">
                                {purchase.user}
                            </p>
                            <p className="text-[12px] text-[#9ca3af] leading-tight mt-0.5">
                                Purchased <span className="text-[#f5a623] font-bold">{purchase.game}</span>
                            </p>
                            <div className="mt-1 flex items-center gap-2">
                                <span className="text-[11px] font-black text-white bg-[#2d333b] px-1.5 py-0.5 rounded uppercase">
                                    {purchase.amount}
                                </span>
                                <span className="text-[10px] font-bold text-[#4b5563] uppercase">
                                    • {purchase.time}
                                </span>
                            </div>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={() => removeNotification(purchase.id)}
                            className="ml-auto rounded-lg p-1 text-[#4b5563] hover:text-white transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
