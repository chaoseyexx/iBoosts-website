import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
    className?: string;
}

export function Logo({ className, ...props }: LogoProps) {
    return (
        <svg
            viewBox="0 0 260 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn("h-full w-auto", className)}
            {...props}
        >
            {/* 1. Rocket Icon Box (Yellow Rounded Square) */}
            <rect x="0" y="4" width="32" height="32" rx="8" fill="#f5a623" />

            {/* 2. Rocket Icon */}
            <g transform="translate(6, 10) scale(0.85)">
                <path
                    d="M4.5 22.5C2.5 20.5 0.5 17 4 14C5 15 6 16.5 6 18.5C6 20.5 5.5 21.5 4.5 22.5Z"
                    fill="white"
                    opacity="0.9"
                />
                <path
                    d="M20 2C15 2 10 5 8 9C7 11 7 13 8 15L6 19L9 17C11 18 13 18 15 17C19 15 22 10 22 5C22 3.5 21.5 2 20 2Z"
                    fill="white"
                />
                <circle cx="16" cy="7" r="1.5" fill="#f5a623" />
                <path
                    d="M10 16L7 20L11 19C11.5 18 11.5 17 10 16Z"
                    fill="white"
                />
            </g>

            {/* 3. "iboosts.gg" Typography - Individual groups for perfect spacing */}
            <g transform="translate(42, 28)" fill="white">
                {/* i */}
                <g transform="translate(0, 0)">
                    <circle cx="2" cy="-21" r="2.5" />
                    <rect x="0" y="-16" width="4.5" height="16" rx="1" />
                </g>

                {/* b */}
                <g transform="translate(8, 0)">
                    <path d="M0 -22 L0 0 L4 0 L4 -2 A6.5 6.5 0 1 0 4 -14.5 L4 -16.5 Z M4 -4.5 A3 3 0 1 1 4 -12 Z" />
                </g>

                {/* o */}
                <g transform="translate(24, 0)">
                    <path d="M6.5 -8 A6.5 6.5 0 1 0 6.5 -8.001 Z M6.5 -11.5 A3 3 0 1 1 6.5 -11.501 Z" />
                </g>

                {/* o */}
                <g transform="translate(40, 0)">
                    <path d="M6.5 -8 A6.5 6.5 0 1 0 6.5 -8.001 Z M6.5 -11.5 A3 3 0 1 1 6.5 -11.501 Z" />
                </g>

                {/* s */}
                <g transform="translate(56, 0)">
                    <path d="M0 -4.5 Q0 -1 3.5 -1 L8.5 -1 L8.5 -4.5 L4.5 -4.5 Q3.5 -4.5 3.5 -5.5 Q3.5 -6.5 4.5 -6.5 L6.5 -6.5 Q8.5 -6.5 8.5 -10 Q8.5 -13.5 5 -13.5 L0 -13.5 L0 -10 L4.5 -10 Q5.5 -10 5.5 -9 Q5.5 -8 4.5 -8 L3 -8 Q0 -8 0 -4.5 Z" />
                </g>

                {/* t */}
                <g transform="translate(68, 0)">
                    <path d="M2.5 -19 L2.5 -15 L0 -15 L0 -11.5 L2.5 -11.5 L2.5 -3 Q2.5 0 5.5 0 L8.5 0 L8.5 -3.5 L6.5 -3.5 Q6 -3.5 6 -4.5 L6 -11.5 L8.5 -11.5 L8.5 -15 L6 -15 L6 -19 Z" />
                </g>

                {/* s */}
                <g transform="translate(80, 0)">
                    <path d="M0 -4.5 Q0 -1 3.5 -1 L8.5 -1 L8.5 -4.5 L4.5 -4.5 Q3.5 -4.5 3.5 -5.5 Q3.5 -6.5 4.5 -6.5 L6.5 -6.5 Q8.5 -6.5 8.5 -10 Q8.5 -13.5 5 -13.5 L0 -13.5 L0 -10 L4.5 -10 Q5.5 -10 5.5 -9 Q5.5 -8 4.5 -8 L3 -8 Q0 -8 0 -4.5 Z" />
                </g>

                {/* . */}
                <g transform="translate(93, 0)">
                    <circle cx="2" cy="-2" r="2.5" fill="#f5a623" />
                </g>

                {/* g */}
                <g transform="translate(100, 0)" fill="#f5a623">
                    <path d="M4 -7.5 A5 5 0 1 0 4 -7.6 Z M4 -5 Q1 -5 1 -8 Q1 -11 4 -11 Q7 -11 7 -8 Q7 -5 4 -5 Z" />
                    <path d="M9 -11.5 L9 0 Q9 4 5 4 L0 4 L0 1 L4 1 Q5 1 5 -1 L5 -4.5" />
                </g>

                {/* g */}
                <g transform="translate(114, 0)" fill="#f5a623">
                    <path d="M4 -7.5 A5 5 0 1 0 4 -7.6 Z M4 -5 Q1 -5 1 -8 Q1 -11 4 -11 Q7 -11 7 -8 Q7 -5 4 -5 Z" />
                    <path d="M9 -11.5 L9 0 Q9 4 5 4 L0 4 L0 1 L4 1 Q5 1 5 -1 L5 -4.5" />
                </g>
            </g>
        </svg>
    );
}
