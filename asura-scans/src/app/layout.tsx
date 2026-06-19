import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { Providers } from "@/components/providers/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Asura Scans - Read Manga, Manhwa & Manhua Online",
    template: "%s | Asura Scans",
  },
  description:
    "Read the best manga, manhwa, and manhua online for free. Updated daily with the latest chapters.",
};

export const viewport = {
  themeColor: "#913FE2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans min-h-screen flex flex-col`}>
        <Providers>
          <Navbar />
          <main className="flex-1 pt-[60px]">{children}</main>
          <Footer />
          <SearchOverlay />
        </Providers>
      </body>
    </html>
  );
}
