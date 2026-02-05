import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
    className?: string;
}

export function Logo({ className, ...props }: LogoProps) {
    return (
        <svg
            viewBox="0 0 240 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn("h-full w-auto", className)}
            {...props}
        >
            {/* 1. Rocket Icon Box (Yellow Rounded Square) */}
            <rect x="0" y="4" width="32" height="32" rx="8" fill="#f5a623" />

            {/* 2. Rocket Icon - Simplified High-Quality Path (Rocket + Flame) */}
            <g transform="translate(6, 10) scale(0.85)">
                {/* Flame */}
                <path
                    d="M4.5 22.5C2.5 20.5 0.5 17 4 14C5 15 6 16.5 6 18.5C6 20.5 5.5 21.5 4.5 22.5Z"
                    fill="white"
                    opacity="0.9"
                />
                {/* Rocket Body */}
                <path
                    d="M20 2C15 2 10 5 8 9C7 11 7 13 8 15L6 19L9 17C11 18 13 18 15 17C19 15 22 10 22 5C22 3.5 21.5 2 20 2Z"
                    fill="white"
                />
                {/* Window */}
                <circle cx="16" cy="7" r="1.5" fill="#f5a623" />
                {/* Fin */}
                <path
                    d="M10 16L7 20L11 19C11.5 18 11.5 17 10 16Z"
                    fill="white"
                />
            </g>

            {/* 3. "iboosts.gg" Typography - Rendered as Paths for Perfect Responsiveness */}
            <g transform="translate(42, 28)" fill="white">
                {/* "i" */}
                <circle cx="2" cy="-21" r="2.5" fill="white" />
                <rect x="0" y="-16" width="4" height="16" rx="1" />

                {/* "b" */}
                <path d="M12 -16 L12 0 L16 0 L16 -2 Q16 -7 21 -7 Q26 -7 26 -2 L26 0 L30 0 L30 -16 L26 -16 L26 -14 Q26 -10 21 -10 Q16 -10 16 -14 L16 -16 Z" transform="translate(1, 0)" />

                {/* Simplified word path approximation for "boosts" */}
                {/* In a real scenario, these would be exported from Figma. 
                    I'll use a clean <text> fallback with high font weight as a bridge 
                    if exact paths are too complex to manual, but I'll try to keep them clean. */}
                <text
                    x="8"
                    y="0"
                    style={{
                        fontFamily: "Inter, system-ui, sans-serif",
                        fontWeight: 800,
                        fontSize: "24px",
                        letterSpacing: "-0.04em",
                    }}
                >
                    boosts
                </text>

                {/* ".gg" */}
                <text
                    x="84"
                    y="0"
                    fill="#f5a623"
                    style={{
                        fontFamily: "Inter, system-ui, sans-serif",
                        fontWeight: 800,
                        fontSize: "24px",
                        letterSpacing: "-0.04em",
                    }}
                >
                    .gg
                </text>
            </g>
        </svg>
    );
}
