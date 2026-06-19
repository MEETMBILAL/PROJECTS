import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { AppChrome } from "@/components/app-chrome";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Asura Scans Clone",
    template: "%s | Asura Scans Clone",
  },
  description: "A pixel-focused manga and manhwa reader platform built with Next.js, Prisma, Tailwind, and NextAuth.",
  themeColor: "#913FE2",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className="font-sans antialiased">
        <Providers>
          <div className="flex min-h-screen flex-col bg-brand-background">
            <AppChrome>{children}</AppChrome>
          </div>
        </Providers>
      </body>
    </html>
  );
}
