import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Alfa_Slab_One, Cinzel, Inter } from "next/font/google";
import "./globals.css";
import { GoogleTagManagerScript, GoogleTagManagerNoScript } from "./GoogleTagManager";
import GtmPageviewTracker from "./GtmPageviewTracker";
import { SITE_URL } from "@/lib/site";

const alfaSlabOne = Alfa_Slab_One({
  variable: "--font-alfa-slab",
  weight: "400",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  weight: ["400", "600"],
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AkshaAstra — Which Eyes Will You Wear?",
    template: "%s · AkshaAstra",
  },
  description:
    "AkshaAstra: a superhero mythology split across three worlds — the warm world of Rudrakshi, the cold world of Tamasa, and the border city of Vaitarandor.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${alfaSlabOne.variable} ${cinzel.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <GoogleTagManagerScript />
      </head>
      <body className="min-h-full flex flex-col">
        <GoogleTagManagerNoScript />
        <Suspense fallback={null}>
          <GtmPageviewTracker />
        </Suspense>
        <div className="flex-1">{children}</div>
        <footer
          style={{
            fontFamily: "var(--font-inter), Arial, Helvetica, sans-serif",
            fontSize: 12,
            lineHeight: 1.6,
            color: "rgba(232,230,223,.35)",
            textAlign: "center",
            padding: "18px 24px",
          }}
        >
          <p>© 2026 Pragyan Sharma / ThoughtLeadersConsulting. All Rights Reserved.</p>
          <p>AkshaAstra Comics™ and all related characters, worlds, and artwork © AkshaAstra Comics, July 2026.</p>
          <p>
            <Link href="/about" style={{ color: "rgba(232,230,223,.55)", textDecoration: "underline" }}>
              About the Creator
            </Link>
          </p>
        </footer>
      </body>
    </html>
  );
}
