import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Providers } from "@/app/providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "Asura Scans Clone",
    template: "%s | Asura Scans Clone",
  },
  description: "A dark manga and manhwa reading platform inspired by Asura Scans.",
};

export const viewport: Viewport = {
  themeColor: "#913FE2",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} min-h-screen bg-brand-background font-sans text-brand-text`}>
        <Providers>
          <Navbar />
          <main className="min-h-screen pt-[60px]">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
