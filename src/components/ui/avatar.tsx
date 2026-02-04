"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    src?: string | null;
    alt?: string;
    fallback?: string;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    status?: "online" | "offline" | "busy";
}

const sizeClasses = {
    xs: "h-6 w-6 text-[10px]",
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
};

const statusClasses = {
    online: "bg-[var(--success)]",
    offline: "bg-[var(--text-muted)]",
    busy: "bg-[var(--warning)]",
};

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
    ({ className, src, alt, fallback, size = "md", status, ...props }, ref) => {
        const [imageError, setImageError] = React.useState(false);

        const initials = fallback
            ? fallback
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)
            : "?";

        return (
            <div
                ref={ref}
                className={cn("relative inline-flex shrink-0", className)}
                {...props}
            >
                <div
                    className={cn(
                        "flex items-center justify-center rounded-full bg-[var(--olive-900)] font-medium text-[var(--olive-400)] overflow-hidden",
                        sizeClasses[size]
                    )}
                >
                    {src && !imageError ? (
                        <img
                            src={src}
                            alt={alt || fallback || "Avatar"}
                            className="h-full w-full object-cover"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <span>{initials}</span>
                    )}
                </div>
                {status && (
                    <span
                        className={cn(
                            "absolute bottom-0 right-0 block rounded-full ring-2 ring-[var(--bg-primary)]",
                            statusClasses[status],
                            size === "xs" && "h-1.5 w-1.5",
                            size === "sm" && "h-2 w-2",
                            size === "md" && "h-2.5 w-2.5",
                            size === "lg" && "h-3 w-3",
                            size === "xl" && "h-4 w-4"
                        )}
                    />
                )}
            </div>
        );
    }
);
Avatar.displayName = "Avatar";

export { Avatar };
