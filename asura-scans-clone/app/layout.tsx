import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { SiteShell } from "@/components/site-shell";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

export const metadata: Metadata = {
  title: {
    default: "Asura Scans Clone | Manga & Manhwa Reader",
    template: "%s | Asura Scans Clone"
  },
  description: "A production-ready manga and manhwa reader built with Next.js, Prisma, Tailwind CSS, and NextAuth."
};

export const viewport: Viewport = {
  themeColor: "#913FE2"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} min-h-screen bg-brand-background font-sans text-brand-text`}>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
