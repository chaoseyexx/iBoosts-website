import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
    {
        variants: {
            variant: {
                default: "bg-[var(--olive-900)] text-[var(--olive-400)]",
                success: "bg-[var(--success-muted)] text-[var(--success)]",
                warning: "bg-[var(--warning-muted)] text-[var(--warning)]",
                error: "bg-[var(--error-muted)] text-[var(--error)]",
                info: "bg-[var(--info-muted)] text-[var(--info)]",
                secondary: "bg-[var(--bg-elevated)] text-[var(--text-secondary)]",
                outline: "border border-[var(--border-default)] text-[var(--text-secondary)]",
            },
            size: {
                default: "px-2.5 py-0.5 text-xs",
                sm: "px-2 py-0.5 text-[10px]",
                lg: "px-3 py-1 text-sm",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
    dot?: boolean;
    dotColor?: string;
}

function Badge({
    className,
    variant,
    size,
    dot,
    dotColor,
    children,
    ...props
}: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
            {dot && (
                <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{
                        backgroundColor: dotColor || "currentColor",
                    }}
                />
            )}
            {children}
        </div>
    );
}

export { Badge, badgeVariants };
