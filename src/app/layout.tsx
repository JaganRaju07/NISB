import type { Metadata } from "next";
import { Suspense } from "react";
import { Newsreader, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/ui/navbar";
import { Toaster } from "@/components/ui/sonner";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  weight: ["400", "600", "700"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nisb.vercel.app"),
  title: {
    default: "NIE IEEE Student Branch | NISB Mysuru",
    template: "%s | NISB",
  },
  description:
    "NIE IEEE Student Branch (NISB) at The National Institute of Engineering, Mysuru.",
  keywords: ["NISB", "IEEE", "NIE Mysuru", "IEEE Bangalore Section", "STB64141"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://nisb.vercel.app",
    siteName: "NIE IEEE Student Branch",
    title: "NIE IEEE Student Branch | NISB Mysuru",
    description:
      "Hands-on learning, technical events, leadership and community impact at NIE Mysuru.",
  },
  twitter: {
    card: "summary",
    title: "NIE IEEE Student Branch | NISB Mysuru",
    description:
      "Hands-on learning, technical events, leadership and community impact at NIE Mysuru.",
  },
  icons: {
    icon: "/assets/images/Condensed---White-Circle.ico",
    shortcut: "/assets/images/Condensed---White-Circle.ico",
    apple: "/assets/images/Condensed---White-Circle.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "NIE IEEE Student Branch",
    alternateName: "NISB",
    url: "https://nisb.vercel.app",
    logo: "https://nisb.vercel.app/assets/images/Condensed---White-Circle.png",
    description:
      "The IEEE student branch of The National Institute of Engineering, Mysuru.",
    parentOrganization: {
      "@type": "Organization",
      name: "IEEE Bangalore Section",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Manandavadi Road",
      addressLocality: "Mysuru",
      addressRegion: "Karnataka",
      postalCode: "570008",
      addressCountry: "IN",
    },
  };

  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased scroll-smooth",
        newsreader.variable,
        geistSans.variable,
        geistMono.variable
      )}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-sky-600 selection:text-white">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-sky-600 focus:px-4 focus:py-2 focus:text-white focus:outline-none focus:ring-2 focus:ring-white"
        >
          Skip to main content
        </a>
        <Suspense fallback={<div className="h-24 w-full bg-slate-950 border-b border-slate-800" />}>
          <Navbar />
        </Suspense>
        <div id="main-content" className="flex-1 flex flex-col">
          {children}
        </div>
        <Toaster position="top-right" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </body>
    </html>
  );
}
