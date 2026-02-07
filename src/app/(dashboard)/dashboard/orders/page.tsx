"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    ChevronDown,
    Download,
    Search,
    ShoppingBag,
    Check,
    Database
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getOrders, seedDemoOrders } from "./orders-actions";
import { toast } from "sonner";

interface Order {
    id: string;
    game: string;
    productName: string;
    type: string;
    user: string;
    date: string;
    status: "completed" | "cancelled" | "active" | "delivered";
    quantity: string | number;
    price: number;
    discount?: number;
    icon: string;
}

const statusOptions = [
    { label: "All statuses", value: "all", count: null },
    { label: "Pending delivery", value: "pending_delivery", count: 0 },
    { label: "Disputed", value: "disputed", count: 0 },
    { label: "Delivered", value: "delivered", count: 0 },
    { label: "Received", value: "received", count: 0 },
    { label: "Completed", value: "completed", count: 10 },
    { label: "Canceled", value: "cancelled", count: 4 },
];

const timeOptions = [
    { label: "Recent", value: "recent" },
    { label: "3 months or older", value: "older" },
];

function OrdersContent() {
    const searchParams = useSearchParams();
    const type = (searchParams.get("type") as 'purchased' | 'sold') || "purchased";
    const title = type === "purchased" ? "Purchased orders" : "Sold orders";

    const [orders, setOrders] = React.useState<Order[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [statusFilter, setStatusFilter] = React.useState("all");
    const [statusOpen, setStatusOpen] = React.useState(false);
    const [timeFilter, setTimeFilter] = React.useState("recent");
    const [timeOpen, setTimeOpen] = React.useState(false);
    const [isSeeding, setIsSeeding] = React.useState(false);

    // Refs for clicking outside
    const statusRef = React.useRef<HTMLDivElement>(null);
    const timeRef = React.useRef<HTMLDivElement>(null);

    const loadOrders = React.useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await getOrders(type);
            if (result.orders) {
                setOrders(result.orders);
            } else if (result.error) {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error("Failed to load orders");
        } finally {
            setIsLoading(false);
        }
    }, [type]);

    React.useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    const handleSeed = async () => {
        setIsSeeding(true);
        try {
            const result = await seedDemoOrders();
            if (result.success) {
                toast.success("Demo data seeded successfully!");
                loadOrders();
            } else {
                toast.error(result.error || "Failed to seed demo data");
            }
        } catch (error) {
            toast.error("Error seeding demo data");
        } finally {
            setIsSeeding(false);
        }
    };

    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
                setStatusOpen(false);
            }
            if (timeRef.current && !timeRef.current.contains(event.target as Node)) {
                setTimeOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const activeStatusLabel = statusOptions.find(o => o.value === statusFilter)?.label || "All statuses";
    const activeTimeLabel = timeOptions.find(o => o.value === timeFilter)?.label || "Recent";

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-24 space-y-4">
                <div className="h-10 w-10 border-2 border-[#f5a623] border-t-transparent rounded-full animate-spin" />
                <p className="text-white/60 font-bold uppercase tracking-widest text-xs">Fetching your orders...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <ChevronDown className="h-6 w-6 text-[#f5a623] rotate-[-90deg]" />
                    <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSeed}
                    disabled={isSeeding}
                    className="border-[#f5a623]/20 bg-[#f5a623]/5 text-[#f5a623] hover:bg-[#f5a623]/10 h-8 gap-2 font-bold text-[10px] uppercase tracking-wider"
                >
                    <Database className={cn("h-3 w-3", isSeeding && "animate-pulse")} />
                    {isSeeding ? "Seeding..." : "Seed Demo Data"}
                </Button>
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-3">
                {/* Status Dropdown */}
                <div className="relative" ref={statusRef}>
                    <Button
                        variant="secondary"
                        onClick={() => setStatusOpen(!statusOpen)}
                        className={cn(
                            "bg-black/20 border text-white hover:bg-black/30 h-10 px-4 min-w-[160px] flex items-center justify-between transition-all outline-none",
                            statusOpen ? "border-[#f5a623] ring-1 ring-[#f5a623]" : "border-[#2d333b]"
                        )}
                    >
                        {activeStatusLabel}
                        <ChevronDown className={cn("h-4 w-4 text-[#6b7280] transition-transform", statusOpen && "rotate-180")} />
                    </Button>

                    {statusOpen && (
                        <div className="absolute top-[calc(100%+4px)] left-0 w-64 bg-[#0d1117] border border-[#2d333b] rounded-lg shadow-2xl z-50 py-1.5 animate-in fade-in zoom-in-95 duration-100">
                            {statusOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => {
                                        setStatusFilter(opt.value);
                                        setStatusOpen(false);
                                    }}
                                    className="w-full flex items-center justify-between px-4 py-2 text-[13px] text-white hover:bg-[#252b33] transition-colors group"
                                >
                                    <span className={cn(statusFilter === opt.value && "text-white font-medium")}>
                                        {opt.label} {opt.count !== null && `(${opt.count})`}
                                    </span>
                                    {statusFilter === opt.value && <Check className="h-4 w-4 text-[#f5a623]" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Time Dropdown */}
                <div className="relative" ref={timeRef}>
                    <Button
                        variant="secondary"
                        onClick={() => setTimeOpen(!timeOpen)}
                        className={cn(
                            "bg-black/20 border text-white hover:bg-black/30 h-10 px-4 min-w-[140px] flex items-center justify-between transition-all outline-none",
                            timeOpen ? "border-[#f5a623] ring-1 ring-[#f5a623]" : "border-[#2d333b]"
                        )}
                    >
                        {activeTimeLabel}
                        <ChevronDown className={cn("h-4 w-4 text-[#6b7280] transition-transform", timeOpen && "rotate-180")} />
                    </Button>

                    {timeOpen && (
                        <div className="absolute top-[calc(100%+4px)] left-0 w-48 bg-[#0d1117] border border-[#2d333b] rounded-lg shadow-2xl z-50 py-1.5 animate-in fade-in zoom-in-95 duration-100">
                            {timeOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => {
                                        setTimeFilter(opt.value);
                                        setTimeOpen(false);
                                    }}
                                    className="w-full flex items-center justify-between px-4 py-2 text-[13px] text-white hover:bg-[#252b33] transition-colors"
                                >
                                    <span className={cn(timeFilter === opt.value && "text-white font-medium")}>
                                        {opt.label}
                                    </span>
                                    {timeFilter === opt.value && <Check className="h-4 w-4 text-[#f5a623]" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="relative flex-1 min-w-[200px]">
                    <input
                        type="text"
                        placeholder="Search Orders"
                        className="h-10 w-full rounded-lg border border-[#2d333b] bg-black/20 pl-4 pr-10 text-sm text-white placeholder:text-[#6b7280] focus:border-[#f5a623] focus:outline-none focus:ring-1 focus:ring-[#f5a623]"
                    />
                    <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7280]" />
                </div>

                {type === "sold" && (
                    <div className="ml-auto">
                        <Button variant="outline" className="border-[#2d333b] text-white hover:bg-black/20 h-10 gap-2 font-semibold">
                            Download invoice
                            <Download className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto min-h-[400px]">
                {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-20 bg-black/10 rounded-2xl border border-dashed border-[#2d333b]">
                        <ShoppingBag className="h-10 w-10 text-[#2d333b] mb-4" />
                        <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-1">No orders found</h3>
                        <p className="text-[#6b7280] text-xs">Try seeding demo data to see it in action.</p>
                    </div>
                ) : (
                    <table className="w-full border-separate border-spacing-0">
                        <thead>
                            <tr className="text-left border-b border-[#2d333b]">
                                <th className="pb-4 px-4 text-[11px] font-bold text-white/60 uppercase tracking-tight">
                                    <div className="flex items-center gap-1">
                                        Order name
                                        <ChevronDown className="h-3 w-3 text-[#f5a623]" />
                                    </div>
                                </th>
                                <th className="pb-4 px-4 text-[11px] font-bold text-white/60 uppercase tracking-tight">Type</th>
                                <th className="pb-4 px-4 text-[11px] font-bold text-white/60 uppercase tracking-tight">{type === "purchased" ? "Seller" : "Buyer"}</th>
                                <th className="pb-4 px-4 text-[11px] font-bold text-white/60 uppercase tracking-tight">Ordered date</th>
                                <th className="pb-4 px-4 text-[11px] font-bold text-white/60 uppercase tracking-tight">Order status</th>
                                <th className="pb-4 px-4 text-[11px] font-bold text-white/60 uppercase tracking-tight">Quantity</th>
                                <th className="pb-4 px-4 text-[11px] font-bold text-white/60 uppercase tracking-tight">Price ($)</th>
                                {type === "purchased" && (
                                    <th className="pb-4 px-4 text-[11px] font-bold text-white/60 uppercase tracking-tight">Discount</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2d333b]/50">
                            {orders.map((order) => (
                                <tr
                                    key={order.id}
                                    onClick={() => window.location.href = `/dashboard/orders/${order.id}`}
                                    className="group hover:bg-white/[0.02] transition-colors cursor-pointer"
                                >
                                    <td className="py-2.5 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded bg-[#0a0e13] flex-shrink-0 relative overflow-hidden flex items-center justify-center p-1.5 border border-[#2d333b]/40">
                                                <img src={order.icon} alt={order.game} className="object-contain" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-[10px] font-bold text-[#6b7280] uppercase leading-none mb-1">{order.game}</div>
                                                <div className="text-[13px] text-white font-medium truncate max-w-[200px]">{order.productName}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-2.5 px-4 text-[13px] text-white/80">{order.type}</td>
                                    <td className="py-2.5 px-4 text-[13px] text-[#5c9eff] hover:underline cursor-pointer" onClick={(e) => e.stopPropagation()}>{order.user}</td>
                                    <td className="py-2.5 px-4 text-[13px] text-white/80 whitespace-nowrap">{order.date}</td>
                                    <td className="py-2.5 px-4">
                                        <div className={cn(
                                            "inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider",
                                            order.status === "completed" ? "bg-[#14b8a6] text-[#0a0e13]" :
                                                order.status === "cancelled" ? "bg-[#ef4444] text-white" :
                                                    "bg-[#3b82f6] text-white"
                                        )}>
                                            {order.status === "cancelled" ? "Canceled" : order.status}
                                        </div>
                                    </td>
                                    <td className="py-2.5 px-4 text-[13px] text-white/80">{order.quantity}</td>
                                    <td className="py-2.5 px-4 text-[13px] text-white font-bold">${order.price.toFixed(2)}</td>
                                    {type === "purchased" && (
                                        <td className="py-2.5 px-4 text-[13px] text-white/80">${order.discount?.toFixed(2)}</td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default function OrdersPage() {
    return (
        <React.Suspense fallback={
            <div className="flex flex-col items-center justify-center p-24 space-y-4">
                <div className="h-10 w-10 border-2 border-[#f5a623] border-t-transparent rounded-full animate-spin" />
                <p className="text-white/60 font-bold uppercase tracking-widest text-xs">Loading orders view...</p>
            </div>
        }>
            <OrdersContent />
        </React.Suspense>
    );
}
