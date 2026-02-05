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
            preserveAspectRatio="xMinYMid meet"
            {...props}
        >
            {/* 1. Icon Part (User-provided SVG integrated) */}
            <g transform="translate(0, 4) scale(0.32)">
                <rect width="100" height="100" rx="20" ry="20" fill="url(#goldGradient)" />
                <path d="M50 20 L58 40 L70 45 L58 50 L70 55 L58 60 L50 80 L42 60 L30 55 L42 50 L30 45 L42 40 Z" fill="black" />
                <circle cx="50" cy="50" r="6" fill="#FFB900" />
                <defs>
                    <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="100%">
                        <stop offset="0%" stop-color="#FFB900" />
                        <stop offset="100%" stop-color="#FFC700" />
                    </linearGradient>
                </defs>
            </g>

            {/* 2. Typography "iboosts.gg" - Geometric Reconstruction with Absolute Spacing */}
            <g transform="translate(44, 28)" fill="white">
                {/* i */}
                <g transform="translate(0, 0)">
                    <circle cx="2" cy="-21" r="2.2" />
                    <rect x="0" y="-16" width="4.5" height="16" rx="1" />
                </g>

                {/* b */}
                <g transform="translate(10, 0)">
                    <rect x="0" y="-22" width="4" height="22" rx="1" />
                    <path fillRule="evenodd" d="M4 -14.5 A6 6 0 1 1 4 -2.5 A6 6 0 0 1 4 -14.5 Z M4 -11.5 A3 3 0 1 1 4 -5.5 A3 3 0 0 1 4 -11.5 Z" />
                </g>

                {/* o */}
                <g transform="translate(28, 0)">
                    <path fillRule="evenodd" d="M6.5 -14.5 A6.5 6.5 0 1 1 6.5 -1.5 A6.5 6.5 0 0 1 6.5 -14.5 Z M6.5 -11.5 A3.5 3.5 0 1 1 6.5 -4.5 A3.5 3.5 0 0 1 6.5 -11.5 Z" />
                </g>

                {/* o */}
                <g transform="translate(46, 0)">
                    <path fillRule="evenodd" d="M6.5 -14.5 A6.5 6.5 0 1 1 6.5 -1.5 A6.5 6.5 0 0 1 6.5 -14.5 Z M6.5 -11.5 A3.5 3.5 0 1 1 6.5 -4.5 A3.5 3.5 0 0 1 6.5 -11.5 Z" />
                </g>

                {/* s */}
                <g transform="translate(64, 0)">
                    <path d="M1 -3.5 Q1 0 5 0 L9 0 L9 -3.5 L5 -3.5 Q4 -3.5 4 -4.5 Q4 -5.5 5 -5.5 L7 -5.5 Q10 -5.5 10 -9 Q10 -13 6.5 -13 L1 -13 L1 -9.5 L5.5 -9.5 Q7 -9.5 7 -8.5 Q7 -7.5 5.5 -7.5 L3.5 -7.5 Q1 -7.5 1 -3.5 Z" />
                </g>

                {/* t */}
                <g transform="translate(79, 0)">
                    <rect x="2.5" y="-19" width="3.5" height="19" rx="1" />
                    <rect x="0" y="-14" width="8.5" height="3" rx="1" />
                    <path d="M6 -3 L6 0 L9 0 L9 -3 Z" />
                </g>

                {/* s */}
                <g transform="translate(93, 0)">
                    <path d="M1 -3.5 Q1 0 5 0 L9 0 L9 -3.5 L5 -3.5 Q4 -3.5 4 -4.5 Q4 -5.5 5 -5.5 L7 -5.5 Q10 -5.5 10 -9 Q10 -13 6.5 -13 L1 -13 L1 -9.5 L5.5 -9.5 Q7 -9.5 7 -8.5 Q7 -7.5 5.5 -7.5 L3.5 -7.5 Q1 -7.5 1 -3.5 Z" />
                </g>

                {/* . */}
                <g transform="translate(108, 0)" fill="#f5a623">
                    <circle cx="2" cy="-2.5" r="2.8" />
                </g>

                {/* g */}
                <g transform="translate(116, 0)" fill="#f5a623">
                    <path fillRule="evenodd" d="M5.5 -14.5 A6 6 0 1 1 5.5 -2.5 A6 6 0 0 1 5.5 -14.5 Z M5.5 -11.5 A3 3 0 1 1 5.5 -5.5 A3 3 0 0 1 5.5 -11.5 Z" />
                    <path d="M9.5 -13 L11.5 -13 L11.5 2 Q11.5 5 7 5 L2 5 L2 2 L7 2 Q8.5 2 8.5 0 L9.5 -11.5 Z" />
                </g>

                {/* g */}
                <g transform="translate(133, 0)" fill="#f5a623">
                    <path fillRule="evenodd" d="M5.5 -14.5 A6 6 0 1 1 5.5 -2.5 A6 6 0 0 1 5.5 -14.5 Z M5.5 -11.5 A3 3 0 1 1 5.5 -5.5 A3 3 0 0 1 5.5 -11.5 Z" />
                    <path d="M9.5 -13 L11.5 -13 L11.5 2 Q11.5 5 7 5 L2 5 L2 2 L7 2 Q8.5 2 8.5 0 L9.5 -11.5 Z" />
                </g>
            </g>
        </svg>
    );
}
