import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
    className?: string;
}

export function Logo({ className, ...props }: LogoProps) {
    return (
        <svg
            viewBox="0 0 180 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn("h-full w-auto", className)}
            {...props}
        >
            {/* Rocket Icon Box */}
            <rect width="32" height="32" rx="8" fill="#F5A623" />

            {/* Rocket Icon Path */}
            <path d="M22.6667 9.33333C22.6667 9.33333 22.6667 14.6667 18.6667 18.6667C17.3333 20 16 20.6667 14.6667 21.3333L12 24L13.3333 20C12.6667 18.6667 12 17.3333 13.3333 16C17.3333 12 22.6667 9.33333 22.6667 9.33333Z" fill="white" />
            <path d="M12 24C12 24 6.66667 24 2.66667 20C1.33333 18.6667 0.666667 17.3333 0 16L4 17.3333C5.33333 16.6667 6.66667 16 8 17.3333C12 21.3333 12 24 12 24Z" fill="white" transform="translate(4, -2)" />
            <circle cx="18" cy="14" r="1.5" fill="#F5A623" />

            {/* "iboosts.gg" Typography as high-quality paths */}
            <g transform="translate(40, 22)" fill="white">
                {/* i */}
                <path d="M0 -16 H4 V0 H0 Z M0 -21 H4 V-18 H0 Z" />

                {/* b */}
                <path fillRule="evenodd" clipRule="evenodd" d="M7 -22 H11 V-14.5 C11 -12.5 12 -11 15 -11 C18 -11 19 -12.5 19 -14.5 V-22 H23 V-14.5 C23 -10 21 -7 15 -7 C9 -7 7 -10 7 -14.5 V-22Z" />

                {/* o */}
                <path fillRule="evenodd" clipRule="evenodd" d="M32 -14.5 C32 -10 34 -7 38.5 -7 C43 -7 45 -10 45 -14.5 C45 -19 43 -22 38.5 -22 C34 -22 32 -19 32 -14.5 Z M36 -14.5 C36 -17.5 37 -19 38.5 -19 C40 -19 41 -17.5 41 -14.5 C41 -11.5 40 -10 38.5 -10 C37 -10 36 -11.5 36 -14.5 Z" />

                {/* o */}
                <path fillRule="evenodd" clipRule="evenodd" d="M50 -14.5 C50 -10 52 -7 56.5 -7 C61 -7 63 -10 63 -14.5 C63 -19 61 -22 56.5 -22 C52 -22 50 -19 50 -14.5 Z M54 -14.5 C54 -17.5 55 -19 56.5 -19 C58 -19 59 -17.5 59 -14.5 C59 -11.5 58 -10 56.5 -10 C55 -10 54 -11.5 54 -14.5 Z" />

                {/* s */}
                <path d="M68 -10 C68 -8 69 -7 72 -7 H77 V-10 H73 C72 -10 72 -10.5 72 -11 C72 -11.5 72 -12 73 -12 H75 C78 -12 79 -13 79 -16 C79 -19 78 -22 73 -22 H68 V-19 H73 C74 -19 75 -18.5 75 -18 C75 -17.5 75 -17 74 -17 H72 C69 -17 68 -15 68 -13 V-10 Z" />

                {/* t */}
                <path d="M84 -22 H88 V-12 H91 V-9 H88 V-3 C88 -1 89 0 91 0 H93 V3 H90 C86 3 84 1 84 -3 V-22 Z" transform="translate(0, -3) scale(1, 0.9)" />

                {/* s */}
                <path d="M96 -10 C96 -8 97 -7 100 -7 H105 V-10 H101 C100 -10 100 -10.5 100 -11 C100 -11.5 100 -12 101 -12 H103 C106 -12 107 -13 107 -16 C107 -19 106 -22 101 -22 H96 V-19 H101 C102 -19 103 -18.5 103 -18 C103 -17.5 103 -17 102 -17 H100 C97 -17 96 -15 96 -13 V-10 Z" />

                {/* . */}
                <circle cx="113" cy="-10" r="2.5" fill="#F5A623" transform="translate(0, 8)" />

                {/* g */}
                <g fill="#F5A623">
                    <path fillRule="evenodd" clipRule="evenodd" d="M118 -14.5 C118 -10 120 -7 124.5 -7 C129 -7 131 -10 131 -14.5 C131 -19 129 -22 124.5 -22 C120 -22 118 -19 118 -14.5 Z M122 -14.5 C122 -17.5 123 -19 124.5 -19 C126 -19 127 -17.5 127 -14.5 C127 -11.5 126 -10 124.5 -10 C123 -10 122 -11.5 122 -14.5 Z" />
                    <path d="M131 -14.5 V-1 C131 3 129 5 124.5 5 H120 V2 H124.5 C126 2 127 1 127 -1 V-14.5 H131 Z" />
                </g>

                {/* g */}
                <g fill="#F5A623" transform="translate(16, 0)">
                    <path fillRule="evenodd" clipRule="evenodd" d="M118 -14.5 C118 -10 120 -7 124.5 -7 C129 -7 131 -10 131 -14.5 C131 -19 129 -22 124.5 -22 C120 -22 118 -19 118 -14.5 Z M122 -14.5 C122 -17.5 123 -19 124.5 -19 C126 -19 127 -17.5 127 -14.5 C127 -11.5 126 -10 124.5 -10 C123 -10 122 -11.5 122 -14.5 Z" />
                    <path d="M131 -14.5 V-1 C131 3 129 5 124.5 5 H120 V2 H124.5 C126 2 127 1 127 -1 V-14.5 H131 Z" />
                </g>
            </g>
        </svg>
    );
}
