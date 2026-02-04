"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            type,
            label,
            error,
            helperText,
            leftIcon,
            rightIcon,
            id,
            ...props
        },
        ref
    ) => {
        const generatedId = React.useId();
        const inputId = id || generatedId;

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--text-muted)]">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        type={type}
                        id={inputId}
                        className={cn(
                            "flex h-10 w-full rounded-lg border bg-[var(--bg-input)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition-all duration-200",
                            "border-[var(--border-subtle)] focus:border-[var(--olive-600)] focus:outline-none focus:ring-2 focus:ring-[var(--olive-600)]/20",
                            "disabled:cursor-not-allowed disabled:opacity-50",
                            error && "border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error)]/20",
                            leftIcon && "pl-10",
                            rightIcon && "pr-10",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                    {rightIcon && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-[var(--text-muted)]">
                            {rightIcon}
                        </div>
                    )}
                </div>
                {(error || helperText) && (
                    <p
                        className={cn(
                            "mt-1.5 text-xs",
                            error ? "text-[var(--error)]" : "text-[var(--text-muted)]"
                        )}
                    >
                        {error || helperText}
                    </p>
                )}
            </div>
        );
    }
);
Input.displayName = "Input";

export { Input };
