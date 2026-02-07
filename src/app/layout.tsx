import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "iBoosts - Premium Digital Goods Marketplace",
    template: "%s | iBoosts",
  },
  description: "The most trusted marketplace for premium digital goods, accounts, and boosting services.",
  keywords: ["roblox", "bloxfruits", "valorant", "accounts", "boosting", "market", "tradingshield"],
  authors: [{ name: "iBoosts" }],
  creator: "iBoosts",
  metadataBase: new URL("https://iboosts.gg"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://iboosts.gg",
    siteName: "iBoosts",
    title: "iBoosts - Premium Digital Goods Marketplace",
    description: "The most trusted marketplace for premium digital goods, accounts, and boosting services.",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "iBoosts - Premium Digital Goods Marketplace",
    description:
      "The trusted marketplace for digital goods. Buy and sell with secure escrow, instant delivery, and verified sellers.",
    creator: "@iboosts",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "https://cdn.iboosts.gg/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "https://cdn.iboosts.gg/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "https://cdn.iboosts.gg/favicon.ico" },
    ],
    apple: [
      { url: "https://cdn.iboosts.gg/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "android-chrome-192x192", url: "https://cdn.iboosts.gg/android-chrome-192x192.png" },
      { rel: "android-chrome-512x512", url: "https://cdn.iboosts.gg/android-chrome-512x512.png" },
    ],
  },
  manifest: "https://cdn.iboosts.gg/site.webmanifest",
};

import { RecentPurchasePopup } from "@/components/ui/recent-purchase-popup";
import { DemoNoticeModal } from "@/components/modals/demo-notice-modal";
import { fetchRecentActivity } from "@/app/(admin)/admin/actions";
import Script from "next/script";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cfToken = process.env.NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN;
  const initialActivities = await fetchRecentActivity();

  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[var(--bg-primary)]`}
      >
        {children}
        <RecentPurchasePopup initialActivities={initialActivities} />
        <DemoNoticeModal />
        {cfToken && (
          <Script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={`{"token": "${cfToken}"}`}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
