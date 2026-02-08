
import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export default async function middleware(request: NextRequest) {
    const url = request.nextUrl;
    let hostname = request.headers.get("host") || "";

    // Remove port if present for checking subdomain
    const domain = hostname.split(':')[0];

    const isStatusSubdomain = domain.startsWith("status.");
    const isSupportSubdomain = domain.startsWith("support.");

    // 1. Handle Status Subdomain
    if (isStatusSubdomain) {
        if (url.pathname === "/") {
            return await updateSession(request, NextResponse.rewrite(new URL("/status", request.url)));
        }
        if (!url.pathname.startsWith('/status')) {
            return await updateSession(request, NextResponse.rewrite(new URL(`/status${url.pathname}`, request.url)));
        }
    }

    // 2. Handle Support Subdomain
    if (isSupportSubdomain) {
        if (url.pathname === "/") {
            return await updateSession(request, NextResponse.rewrite(new URL("/support", request.url)));
        }
        if (!url.pathname.startsWith('/support')) {
            return await updateSession(request, NextResponse.rewrite(new URL(`/support${url.pathname}`, request.url)));
        }
    }

    // 3. Handle Main Domain Redirects (Redirect /status and /support to subdomains)
    if (!isStatusSubdomain && url.pathname.startsWith("/status") && !url.pathname.startsWith("/status/api")) {
        const protocol = request.nextUrl.protocol;
        let baseDomain = hostname;
        if (baseDomain.startsWith('www.')) {
            baseDomain = baseDomain.replace('www.', '');
        }

        const newHost = `status.${baseDomain}`;
        const newPath = url.pathname.replace(/^\/status/, '') || '/';

        return NextResponse.redirect(`${protocol}//${newHost}${newPath}${url.search}`, 307);
    }

    if (!isSupportSubdomain && url.pathname.startsWith("/support") && !url.pathname.startsWith("/support/api")) {
        const protocol = request.nextUrl.protocol;
        let baseDomain = hostname;
        if (baseDomain.startsWith('www.')) {
            baseDomain = baseDomain.replace('www.', '');
        }

        const newHost = `support.${baseDomain}`;
        const newPath = url.pathname.replace(/^\/support/, '') || '/';

        return NextResponse.redirect(`${protocol}//${newHost}${newPath}${url.search}`, 307);
    }

    return await updateSession(request);
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
