// Platform constants
export const PLATFORM_NAME = "iBoosts";
export const PLATFORM_DOMAIN = "iboosts.gg";
export const PLATFORM_TAGLINE = "Premium Digital Goods Marketplace";

// Order timing (in hours)
export const ORDER_TIMERS = {
    AUTO_CANCEL_UNPAID: 24, // Auto-cancel unpaid orders after 24h
    DELIVERY_DEADLINE_DEFAULT: 24, // Default delivery deadline
    BUYER_CONFIRMATION: 72, // Time for buyer to confirm delivery
    DISPUTE_ESCALATION: 48, // Time before dispute auto-escalates
} as const;

// Fees (in percentage)
export const DEFAULT_FEES = {
    PLATFORM_FEE: 5, // 5% platform fee
    WITHDRAWAL_FEE: 1, // 1% withdrawal fee
    MINIMUM_WITHDRAWAL: 10, // Minimum $10 withdrawal
} as const;

// Seller levels
export const SELLER_LEVELS = [
    {
        level: 0,
        name: "New Seller",
        minSales: 0,
        minRating: 0,
        feeDiscount: 0,
        color: "#71717a",
        icon: "🌱",
    },
    {
        level: 1,
        name: "Rising Seller",
        minSales: 10,
        minRating: 4.0,
        feeDiscount: 5,
        color: "#22c55e",
        icon: "⭐",
    },
    {
        level: 2,
        name: "Trusted Seller",
        minSales: 50,
        minRating: 4.5,
        feeDiscount: 10,
        color: "#3b82f6",
        icon: "🌟",
    },
    {
        level: 3,
        name: "Premium Seller",
        minSales: 200,
        minRating: 4.7,
        feeDiscount: 15,
        color: "#8b5cf6",
        icon: "💎",
    },
    {
        level: 4,
        name: "Elite Seller",
        minSales: 500,
        minRating: 4.9,
        feeDiscount: 20,
        color: "#f59e0b",
        icon: "👑",
    },
] as const;

// Order statuses with display info
export const ORDER_STATUS_DISPLAY = {
    PENDING: {
        label: "Pending Payment",
        color: "yellow",
        description: "Waiting for payment",
    },
    ACTIVE: {
        label: "Active",
        color: "blue",
        description: "Payment received, awaiting delivery",
    },
    DELIVERED: {
        label: "Delivered",
        color: "purple",
        description: "Seller has delivered, awaiting confirmation",
    },
    COMPLETED: {
        label: "Completed",
        color: "green",
        description: "Order completed successfully",
    },
    DISPUTED: {
        label: "Disputed",
        color: "red",
        description: "Order is under dispute",
    },
    CANCELLED: {
        label: "Cancelled",
        color: "gray",
        description: "Order was cancelled",
    },
    REFUNDED: {
        label: "Refunded",
        color: "orange",
        description: "Order was refunded",
    },
} as const;

// KYC status display
export const KYC_STATUS_DISPLAY = {
    NOT_SUBMITTED: {
        label: "Not Submitted",
        color: "gray",
        description: "KYC documents not yet submitted",
    },
    PENDING: {
        label: "Under Review",
        color: "yellow",
        description: "KYC documents are being reviewed",
    },
    APPROVED: {
        label: "Verified",
        color: "green",
        description: "Identity verified successfully",
    },
    REJECTED: {
        label: "Rejected",
        color: "red",
        description: "KYC documents were rejected",
    },
    EXPIRED: {
        label: "Expired",
        color: "orange",
        description: "KYC verification has expired",
    },
} as const;

// CDN Configuration
export const CDN_URL = "https://cdn.iboosts.gg";

// Navigation items
export const NAV_ITEMS = {
    main: [
        { label: "Marketplace", href: "/marketplace", icon: "Store" },
        { label: "Sell", href: "/seller", icon: "DollarSign" },
    ],
    dashboard: [
        { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
        { label: "Orders", href: "/orders", icon: "ShoppingBag" },
        { label: "Wallet", href: "/wallet", icon: "Wallet" },
        { label: "Notifications", href: "/notifications", icon: "Bell" },
        { label: "Settings", href: "/settings", icon: "Settings" },
    ],
    seller: [
        { label: "My Listings", href: "/listings", icon: "Package" },
        { label: "Sales", href: "/seller/sales", icon: "TrendingUp" },
        { label: "Withdrawals", href: "/withdrawals", icon: "BanknoteIcon" },
        { label: "Analytics", href: "/seller/analytics", icon: "BarChart" },
    ],
    admin: [
        { label: "Overview", href: "/admin", icon: "LayoutDashboard" },
        { label: "Users", href: "/admin/users", icon: "Users" },
        { label: "Orders", href: "/admin/orders", icon: "ShoppingBag" },
        { label: "Disputes", href: "/admin/disputes", icon: "AlertTriangle" },
        { label: "KYC", href: "/admin/kyc", icon: "Shield" },
        { label: "Withdrawals", href: "/admin/withdrawals", icon: "BanknoteIcon" },
        { label: "Reports", href: "/admin/reports", icon: "Flag" },
        { label: "Analytics", href: "/admin/analytics", icon: "BarChart" },
        { label: "Config", href: "/admin/config", icon: "Settings" },
    ],
} as const;
