"use client";

interface TrustBadgeProps {
    isVerified: boolean;
    size?: "sm" | "md" | "lg";
    showText?: boolean;
}

export function TrustBadge({ isVerified, size = "md", showText = true }: TrustBadgeProps) {
    if (!isVerified) return null;

    const sizeClasses = {
        sm: "text-xs px-1.5 py-0.5 gap-1",
        md: "text-sm px-2 py-1 gap-1.5",
        lg: "text-base px-3 py-1.5 gap-2",
    };

    const iconSizes = {
        sm: "w-3 h-3",
        md: "w-4 h-4",
        lg: "w-5 h-5",
    };

    return (
        <span
            className={`inline-flex items-center font-medium rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-400 border border-emerald-500/30 ${sizeClasses[size]}`}
            title="This listing has been verified by iShield AI for authenticity and safety"
        >
            <svg
                className={iconSizes[size]}
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path
                    fillRule="evenodd"
                    d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                />
            </svg>
            {showText && <span>Verified by iShield AI</span>}
        </span>
    );
}
