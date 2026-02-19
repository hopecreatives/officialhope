import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FloatingWhatsAppButton } from "@/components/layout/floating-whatsapp-button";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { STORE_DOMAIN, STORE_NAME, STORE_URL } from "@/lib/constants/store";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(STORE_URL),
  title: {
    default: `${STORE_NAME} | Camera Gear + Electronics`,
    template: `%s | ${STORE_NAME}`,
  },
  description:
    `${STORE_NAME} is a premium tech store on ${STORE_DOMAIN} for cameras, lenses, production gear, MacBook, and iPhone devices in Rwanda.`,
  keywords: [
    STORE_NAME,
    STORE_DOMAIN,
    "camera gear Rwanda",
    "electronics Kigali",
    "buy camera WhatsApp",
    "MacBook Rwanda",
    "iPhone Rwanda",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: STORE_URL,
    siteName: STORE_NAME,
    title: `${STORE_NAME} | Camera Gear + Electronics`,
    description:
      `Shop cameras, lenses, lights, recorders, MacBook, and iPhone from ${STORE_NAME}.`,
    images: [
      {
        url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: `${STORE_NAME} premium camera and electronics selection`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${STORE_NAME} | Camera Gear + Electronics`,
    description:
      `Shop cameras, lenses, lights, recorders, MacBook, and iPhone from ${STORE_NAME}.`,
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  alternates: {
    canonical: STORE_URL,
  },
};

export const viewport: Viewport = {
  themeColor: "#0b2a4a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} min-h-screen bg-[#f8fafc] text-[#0f172a] antialiased`}>
        <SiteHeader />
        <main className="mx-auto w-full max-w-7xl px-4 py-8">{children}</main>
        <SiteFooter />
        <FloatingWhatsAppButton />
      </body>
    </html>
  );
}
