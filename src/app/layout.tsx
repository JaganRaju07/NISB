import type { Metadata } from "next";
import { Suspense } from "react";
import { Newsreader, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/ui/navbar";

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
  title: "NIE IEEE Student Branch — STB64141, Mysuru",
  description:
    "An institutional digital archive preserving the people, leadership, and milestones of NIE IEEE Student Branch (NISB), The National Institute of Engineering, Mysuru (IEEE Branch Code: STB64141, IEEE Bangalore Section).",
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
      </body>
    </html>
  );
}
