import type { Metadata } from "next";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["500"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hwsystem.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "HWSystem — Garage door motors, controls & components",
    template: "%s | HWSystem",
  },
  description:
    "UK trade and retail supplier of garage door automation, motors, and components. Trade accounts with exclusive pricing and next-day delivery.",
  openGraph: {
    siteName: "HWSystem",
    type: "website",
    locale: "en_GB",
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "HWSystem",
  url: SITE_URL,
  parentOrganization: {
    "@type": "Organization",
    name: "SBI Group International Ltd",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+44-330-123-4567",
    email: "sales@hwsystem.co.uk",
    contactType: "sales",
    areaServed: "GB",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GB"
      className={`${inter.variable} ${interTight.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
