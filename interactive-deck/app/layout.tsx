import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-inter-tight",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DRK. — Launch & Institutional Trading",
  description:
    "One runtime for wallets, liquidity, execution, and reporting across token launches, DEXs, perps and onchain assets.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#05080a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${interTight.variable} ${inter.variable} ${mono.variable}`}>
      <body>
        <a href="#main" className="sr-only-focusable">
          Skip to content
        </a>
        <div id="drk-root">{children}</div>
      </body>
    </html>
  );
}
