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
            {/* 1. Rocket Icon Box (Yellow Rounded Square) */}
            <rect x="0" y="4" width="32" height="32" rx="8" fill="#f5a623" />

            {/* 2. Rocket Icon - Simplified High-Quality Path */}
            <g transform="translate(6, 12) scale(0.9)">
                <path
                    d="M14 2C10 2 6 5 5 9C4 11 4 13 5 15L3 19L7 17C9 18 11 18 13 17C17 15 20 10 20 5C20 3.5 19.5 2 18 2Z"
                    fill="white"
                />
                <circle cx="14" cy="7" r="1.5" fill="#f5a623" />
                <path d="M2.5 20.5C1 19 0 16 3 13.5Q5 15 5 17Q5 19 4 20Z" fill="white" opacity="0.8" />
            </g>

            {/* 3. "iboosts.gg" Typography - Individual groups for guaranteed spacing */}
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
