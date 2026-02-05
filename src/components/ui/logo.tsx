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
            {/* Icon Part: Rounded Square with 'i' */}
            <rect x="0" y="4" width="32" height="32" rx="8" fill="#f5a623" />
            <text
                x="16"
                y="28"
                textAnchor="middle"
                fill="black"
                style={{
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontWeight: 900,
                    fontSize: "24px",
                }}
            >
                i
            </text>

            {/* Text Part: boosts.gg */}
            <text
                x="40"
                y="28"
                fill="white"
                style={{
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontWeight: 800,
                    fontSize: "24px",
                    letterSpacing: "-0.02em",
                }}
            >
                boosts
                <tspan fill="#f5a623">.gg</tspan>
            </text>
        </svg>
    );
}
