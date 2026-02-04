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
};

import { RecentPurchasePopup } from "@/components/ui/recent-purchase-popup";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[var(--bg-primary)]`}
      >
        {children}
        <RecentPurchasePopup />
      </body>
    </html>
  );
}
