import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchOverlay } from "@/components/search/SearchOverlay";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#913FE2",
};

export const metadata: Metadata = {
  title: {
    default: "Asura Scans - Read Manga & Manhwa Online",
    template: "%s | Asura Scans",
  },
  description:
    "Read the latest manga, manhwa, and manhua online for free. Updated daily with high quality translations.",
  openGraph: {
    title: "Asura Scans",
    description: "Read manga & manhwa online for free",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn(inter.variable, "min-h-screen flex flex-col font-sans")}>
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <SearchOverlay />
        </Providers>
      </body>
    </html>
  );
}
