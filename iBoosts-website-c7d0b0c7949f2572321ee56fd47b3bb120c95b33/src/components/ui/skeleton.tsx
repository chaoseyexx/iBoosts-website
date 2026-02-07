import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "text" | "circular" | "rectangular";
    width?: string | number;
    height?: string | number;
}

export function Skeleton({
    className,
    variant = "rectangular",
    width,
    height,
    style,
    ...props
}: SkeletonProps) {
    return (
        <div
            className={cn(
                "skeleton animate-pulse",
                variant === "circular" && "rounded-full",
                variant === "text" && "rounded h-4",
                variant === "rectangular" && "rounded-lg",
                className
            )}
            style={{
                width: width,
                height: height,
                ...style,
            }}
            {...props}
        />
    );
}

// Pre-built skeleton patterns
export function SkeletonCard() {
    return (
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 space-y-4">
            <Skeleton variant="rectangular" height={160} className="w-full" />
            <div className="space-y-2">
                <Skeleton variant="text" className="w-3/4" />
                <Skeleton variant="text" className="w-1/2" />
            </div>
            <div className="flex items-center justify-between">
                <Skeleton variant="text" className="w-20" />
                <Skeleton variant="text" className="w-16" />
            </div>
        </div>
    );
}

export function SkeletonListItem() {
    return (
        <div className="flex items-center gap-4 p-4">
            <Skeleton variant="circular" width={40} height={40} />
            <div className="flex-1 space-y-2">
                <Skeleton variant="text" className="w-1/3" />
                <Skeleton variant="text" className="w-1/2" />
            </div>
        </div>
    );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
    return (
        <div className="space-y-3">
            {/* Header */}
            <div className="flex gap-4 p-4 border-b border-[var(--border-subtle)]">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} variant="text" className="flex-1 h-4" />
                ))}
            </div>
            {/* Rows */}
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex gap-4 p-4">
                    {[1, 2, 3, 4].map((j) => (
                        <Skeleton key={j} variant="text" className="flex-1 h-4" />
                    ))}
                </div>
            ))}
        </div>
    );
}
