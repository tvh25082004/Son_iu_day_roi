import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "vietnamese"],
  variable: "--font-manrope",
  display: "swap",
});

const SITE_URL = "https://son-iu-day-roi.vercel.app";

export const metadata: Metadata = {
  title: "Son Turns One — Lê Nguyễn Khánh Đăng",
  description: "Join us in celebrating Son's first birthday.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "Son Turns One — Lê Nguyễn Khánh Đăng",
    description: "Join us in celebrating Son's first birthday.",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Son Turns One" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f2ea",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${cormorant.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
