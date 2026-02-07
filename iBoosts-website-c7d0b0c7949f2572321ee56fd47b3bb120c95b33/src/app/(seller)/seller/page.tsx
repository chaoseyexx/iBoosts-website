import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    Package,
    DollarSign,
    TrendingUp,
    ShoppingBag,
    ArrowUpRight,
    ArrowDownRight,
    Plus,
    Clock,
    CheckCircle,
    AlertTriangle,
    Star,
} from "lucide-react";

// Mock data
const sellerStats = [
    {
        title: "Total Revenue",
        value: "$12,345.67",
        change: "+18%",
        trend: "up",
        icon: DollarSign,
    },
    {
        title: "Active Listings",
        value: "24",
        change: "+3 this week",
        trend: "up",
        icon: Package,
    },
    {
        title: "Orders This Month",
        value: "156",
        change: "+24%",
        trend: "up",
        icon: ShoppingBag,
    },
    {
        title: "Avg. Rating",
        value: "4.9",
        change: "+0.1",
        trend: "up",
        icon: Star,
    },
];

const recentSales = [
    {
        id: "IB-A1B2C-3D4E",
        title: "Valorant Immortal Account",
        buyer: "buyer123",
        status: "DELIVERED",
        amount: 149.99,
        date: "2 hours ago",
    },
    {
        id: "IB-B2C3D-4E5F",
        title: "Discord Nitro 1 Year",
        buyer: "gamer456",
        status: "PENDING_CONFIRMATION",
        amount: 79.99,
        date: "5 hours ago",
    },
    {
        id: "IB-C3D4E-5F6G",
        title: "Spotify Premium Lifetime",
        buyer: "music_lover",
        status: "ACTIVE",
        amount: 29.99,
        date: "1 day ago",
    },
];

const topListings = [
    {
        id: "1",
        title: "Valorant Immortal Account",
        sold: 45,
        revenue: 6749.55,
        stock: 5,
    },
    {
        id: "2",
        title: "Discord Nitro 1 Year",
        sold: 102,
        revenue: 8158.98,
        stock: 50,
    },
    {
        id: "3",
        title: "Spotify Premium Lifetime",
        sold: 87,
        revenue: 2609.13,
        stock: 100,
    },
];

const statusColors: Record<string, "success" | "warning" | "error" | "info" | "default"> = {
    PENDING_CONFIRMATION: "warning",
    ACTIVE: "info",
    DELIVERED: "default",
    COMPLETED: "success",
    DISPUTED: "error",
};

export default function SellerDashboardPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                        Seller Dashboard
                    </h1>
                    <p className="text-[var(--text-muted)] mt-1">
                        Manage your listings and track your sales
                    </p>
                </div>
                <Link href="/listings/new">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        New Listing
                    </Button>
                </Link>
            </div>

            {/* Seller Level Card */}
            <Card className="border-[var(--olive-600)]/30 bg-gradient-to-r from-[var(--olive-900)]/20 to-transparent">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[var(--text-muted)]">Seller Level</p>
                            <p className="text-2xl font-bold text-[var(--olive-400)]">Level 2</p>
                            <p className="text-sm text-[var(--text-muted)] mt-1">
                                10% fee reduction • Priority support
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-[var(--text-muted)]">Progress to Level 3</p>
                            <div className="mt-2 h-2 w-48 rounded-full bg-[var(--bg-secondary)]">
                                <div
                                    className="h-full rounded-full bg-[var(--olive-600)]"
                                    style={{ width: "65%" }}
                                />
                            </div>
                            <p className="text-xs text-[var(--text-muted)] mt-1">
                                234 / 500 sales
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {sellerStats.map((stat) => (
                    <Card key={stat.title}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--olive-900)]/50">
                                    <stat.icon className="h-5 w-5 text-[var(--olive-400)]" />
                                </div>
                                <div
                                    className={`flex items-center gap-1 text-xs font-medium ${stat.trend === "up"
                                            ? "text-[var(--success)]"
                                            : "text-[var(--error)]"
                                        }`}
                                >
                                    {stat.trend === "up" ? (
                                        <ArrowUpRight className="h-3 w-3" />
                                    ) : (
                                        <ArrowDownRight className="h-3 w-3" />
                                    )}
                                    {stat.change}
                                </div>
                            </div>
                            <div className="mt-4">
                                <p className="text-2xl font-bold text-[var(--text-primary)]">
                                    {stat.value}
                                </p>
                                <p className="text-sm text-[var(--text-muted)]">{stat.title}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Recent Sales */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg">Recent Sales</CardTitle>
                        <Link href="/seller/sales">
                            <Button variant="ghost" size="sm">
                                View All
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentSales.map((sale) => (
                                <Link
                                    key={sale.id}
                                    href={`/orders/${sale.id}`}
                                    className="flex items-center justify-between rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4 transition-all hover:border-[var(--border-default)]"
                                >
                                    <div>
                                        <p className="font-medium text-[var(--text-primary)]">
                                            {sale.title}
                                        </p>
                                        <p className="text-sm text-[var(--text-muted)]">
                                            @{sale.buyer} · {sale.date}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-[var(--olive-400)]">
                                            +${sale.amount.toFixed(2)}
                                        </p>
                                        <Badge variant={statusColors[sale.status]} size="sm">
                                            {sale.status.replace("_", " ")}
                                        </Badge>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Listings */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg">Top Listings</CardTitle>
                        <Link href="/listings">
                            <Button variant="ghost" size="sm">
                                View All
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topListings.map((listing, index) => (
                                <Link
                                    key={listing.id}
                                    href={`/listings/${listing.id}/edit`}
                                    className="flex items-center gap-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4 transition-all hover:border-[var(--border-default)]"
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--olive-900)]/50 text-sm font-bold text-[var(--olive-400)]">
                                        #{index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-[var(--text-primary)]">
                                            {listing.title}
                                        </p>
                                        <div className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
                                            <span>{listing.sold} sold</span>
                                            <span>·</span>
                                            <span>${listing.revenue.toFixed(2)} revenue</span>
                                        </div>
                                    </div>
                                    <Badge
                                        variant={listing.stock > 10 ? "success" : "warning"}
                                        size="sm"
                                    >
                                        {listing.stock} stock
                                    </Badge>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <Link href="/listings/new">
                            <Button
                                variant="secondary"
                                className="w-full h-auto py-4 flex-col gap-2"
                            >
                                <Plus className="h-5 w-5" />
                                <span>Create Listing</span>
                            </Button>
                        </Link>
                        <Link href="/withdrawals">
                            <Button
                                variant="secondary"
                                className="w-full h-auto py-4 flex-col gap-2"
                            >
                                <DollarSign className="h-5 w-5" />
                                <span>Withdraw Funds</span>
                            </Button>
                        </Link>
                        <Link href="/seller/analytics">
                            <Button
                                variant="secondary"
                                className="w-full h-auto py-4 flex-col gap-2"
                            >
                                <TrendingUp className="h-5 w-5" />
                                <span>View Analytics</span>
                            </Button>
                        </Link>
                        <Link href="/settings/seller">
                            <Button
                                variant="secondary"
                                className="w-full h-auto py-4 flex-col gap-2"
                            >
                                <AlertTriangle className="h-5 w-5" />
                                <span>Seller Settings</span>
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
