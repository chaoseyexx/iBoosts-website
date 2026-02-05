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

            {/* 3. "iboosts.gg" Typography - Full SVG Paths for Perfect Responsiveness */}
            <g transform="translate(42, 28)" fill="white">
                {/* i */}
                <circle cx="2" cy="-21" r="2.5" />
                <rect x="0" y="-16" width="4" height="16" rx="1" />

                {/* b - Manual Path */}
                <path d="M7 -16 L7 0 L11 0 L11 -2 A6 6 0 1 0 11 -14 L11 -16 Z M11 -4 A3 3 0 1 1 11 -12 Z" />

                {/* o - Manual Path */}
                <path d="M26 -8 A6 6 0 1 0 26 -8.001 Z M26 -11 A3 3 0 1 1 26 -11.001 Z" transform="translate(-1, 0)" />

                {/* o - Manual Path */}
                <path d="M39 -8 A6 6 0 1 0 39 -8.001 Z M39 -11 A3 3 0 1 1 39 -11.001 Z" transform="translate(-1, 0)" />

                {/* s - Manual Path */}
                <path d="M48 -4 Q48 -1 51 -1 L56 -1 L56 -4 L52 -4 Q51 -4 51 -5 Q51 -6 52 -6 L54 -6 Q56 -6 56 -9 Q56 -12 53 -12 L48 -12 L48 -9 L52 -9 Q53 -9 53 -8 Q53 -7 52 -7 L50 -7 Q48 -7 48 -4 Z" transform="translate(1, 0)" />

                {/* t - Manual Path */}
                <path d="M60 -19 L60 -16 L58 -16 L58 -13 L60 -13 L60 -4 Q60 -1 63 -1 L66 -1 L66 -4 L64 -4 Q64 -4 64 -5 L64 -13 L66 -13 L66 -16 L64 -16 L64 -19 Z" transform="translate(1, 0)" />

                {/* s - Manual Path */}
                <path d="M69 -4 Q69 -1 72 -1 L77 -1 L77 -4 L73 -4 Q72 -4 72 -5 Q72 -6 73 -6 L75 -6 Q77 -6 77 -9 Q77 -12 74 -12 L69 -12 L69 -9 L73 -9 Q74 -9 74 -8 Q74 -7 73 -7 L71 -7 Q69 -7 69 -4 Z" transform="translate(1, 0)" />

                {/* . - Dot */}
                <circle cx="83" cy="-2" r="2.5" fill="#f5a623" />

                {/* g - Manual Path */}
                <path d="M88 -8 A5 5 0 1 0 88 -8.1 Z M90 -4.5 A2.5 2.5 0 1 1 90 -4.6 Z M97 -12 L97 0 Q97 4 93 4 L88 4 L88 1 L92 1 Q94 1 94 -1 L94 -4.5" fill="#f5a623" transform="translate(1, 0)" />

                {/* g - Manual Path */}
                <path d="M102 -8 A5 5 0 1 0 102 -8.1 Z M104 -4.5 A2.5 2.5 0 1 1 104 -4.6 Z M111 -12 L111 0 Q111 4 107 4 L102 4 L102 1 L106 1 Q108 1 108 -1 L108 -4.5" fill="#f5a623" transform="translate(1, 0)" />
            </g>
        </svg>
    );
}
