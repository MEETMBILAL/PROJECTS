import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Bookshelf.pk — Pakistan's Most Trusted Bookstore",
    template: "%s | Bookshelf.pk",
  },
  description:
    "Online bookstore and Print-on-Demand platform for Pakistan. Non-Fiction, Business, Self-Help, Fiction, and Academic Course books.",
  keywords: [
    "bookstore Pakistan",
    "buy books online",
    "print on demand",
    "academic books",
  ],
  openGraph: {
    title: "Bookshelf.pk — Pakistan's Most Trusted Bookstore",
    description:
      "Online bookstore and Print-on-Demand platform for Pakistan.",
    type: "website",
    locale: "en_PK",
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
      className={`${inter.variable} ${playfair.variable} ${jetbrains.variable}`}
    >
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
