
import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export default async function middleware(request: NextRequest) {
    const url = request.nextUrl;
    let hostname = request.headers.get("host") || "";

    // Remove port if present for checking subdomain
    const domain = hostname.split(':')[0];

    const isStatusSubdomain = domain.startsWith("status.");
    const isSupportSubdomain = domain.startsWith("support.");
    const isBlogSubdomain = domain.startsWith("blog.");

    // 1. Handle Status Subdomain
    if (isStatusSubdomain) {
        // Rewrite root to /status
        if (url.pathname === "/") {
            return await updateSession(request, NextResponse.rewrite(new URL("/status", request.url)));
        }
        // Allow access to /status subpaths directly (rewriting them to keep URL clean if needed, 
        // but here we want to map subdomain root to /status)

        // If the path is ALREADY starting with /status, rewrite to it directly (this might happen if internal links are used)
        if (url.pathname.startsWith('/status')) {
            return await updateSession(request, NextResponse.rewrite(new URL(url.pathname, request.url)));
        }

        // START STRICT MODE: checking if the path is NOT a status path, we might want to block or redirect
        // For now, let's assume anything else on this subdomain should be treated as relative to /status 
        // OR if it's a resource (api, static) let it pass.
        // If it's a main app page like /currency, /dashboard -> Redirect to main domain
        const isPublicResource = url.pathname.startsWith('/_next') || url.pathname.startsWith('/api') || url.pathname.match(/\.(png|jpg|jpeg|gif|ico|svg)$/);

        if (!isPublicResource && !url.pathname.startsWith('/status')) {
            // If user tries to access /currency on status.iboosts.gg, redirect to iboosts.gg/currency
            const baseDomain = hostname.replace('status.', '');
            return NextResponse.redirect(`${url.protocol}//${baseDomain}${url.pathname}${url.search}`, 307);
        }

        // Rewrite logic update: valid status paths are likely just /status or /status/api (if any). 
        // Actually the logic above for "/" -> "/status" covers the main case.
        // If they go to /status/history, we rewrite to /status/history.
        // But if they go to /status (the path), on the subdomain, it effectively means status.iboosts.gg/status.
        // We probably want to canonicalize: status.iboosts.gg/ -> serves /status content.
    }

    // 2. Handle Support Subdomain
    if (isSupportSubdomain) {
        if (url.pathname === "/") {
            return await updateSession(request, NextResponse.rewrite(new URL("/support", request.url)));
        }

        const isPublicResource = url.pathname.startsWith('/_next') || url.pathname.startsWith('/api') || url.pathname.match(/\.(png|jpg|jpeg|gif|ico|svg)$/);

        // If path starts with /support, let it pass (rewrite to clear if needed, but Next handles it)
        if (url.pathname.startsWith('/support')) {
            return await updateSession(request, NextResponse.rewrite(new URL(url.pathname, request.url)));
        }

        // Strict mode for support: Redirect other paths to main domain
        if (!isPublicResource) {
            const baseDomain = hostname.replace('support.', '');
            return NextResponse.redirect(`${url.protocol}//${baseDomain}${url.pathname}${url.search}`, 307);
        }
    }

    // 2b. Handle Blog Subdomain
    if (isBlogSubdomain) {
        if (url.pathname === "/") {
            return await updateSession(request, NextResponse.rewrite(new URL("/blog", request.url)));
        }

        const isPublicResource = url.pathname.startsWith('/_next') || url.pathname.startsWith('/api') || url.pathname.match(/\.(png|jpg|jpeg|gif|ico|svg)$/);

        if (url.pathname.startsWith('/blog')) {
            return await updateSession(request, NextResponse.rewrite(new URL(url.pathname, request.url)));
        }

        if (!isPublicResource) {
            const baseDomain = hostname.replace('blog.', '');
            return NextResponse.redirect(`${url.protocol}//${baseDomain}${url.pathname}${url.search}`, 307);
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

    // Redirect /blog on main domain to blog subdomain
    if (!isBlogSubdomain && url.pathname.startsWith("/blog") && !url.pathname.startsWith("/blog/api")) {
        const protocol = request.nextUrl.protocol;
        let baseDomain = hostname;
        if (baseDomain.startsWith('www.')) {
            baseDomain = baseDomain.replace('www.', '');
        }

        const newHost = `blog.${baseDomain}`;
        const newPath = url.pathname.replace(/^\/blog/, '') || '/';

        return NextResponse.redirect(`${protocol}//${newHost}${newPath}${url.search}`, 307);
    }

    return await updateSession(request);
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
