import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
    className?: string;
}

export function Logo({ className, ...props }: LogoProps) {
    return (
        <svg
            viewBox="0 0 450 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn("h-full w-auto", className)}
            preserveAspectRatio="xMinYMid meet"
            {...props}
        >
            {/* 1. Icon Part - Using the exact path and color provided by the user */}
            <g transform="translate(0, 0)">
                <rect width="100" height="100" rx="20" fill="#f5a623" />
                <path
                    d="M50 20 L58 40 L70 45 L58 50 L70 55 L58 60 L50 80 L42 60 L30 55 L42 50 L30 45 L42 40 Z"
                    fill="black"
                />
                <circle cx="50" cy="50" r="6" fill="#f5a623" />
            </g>

            {/* 2. Text Part - Matching user style and color exactly */}
            <text
                x="120"
                y="68"
                style={{
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    fontWeight: 800,
                    fontSize: "56px",
                    fill: "white",
                    letterSpacing: "-0.02em"
                }}
            >
                iboosts
                <tspan
                    style={{
                        fill: "#f5a623"
                    }}
                >
                    .gg
                </tspan>
            </text>
        </svg>
    );
}
