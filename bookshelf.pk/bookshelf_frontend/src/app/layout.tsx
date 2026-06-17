import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";
import { Toaster } from "react-hot-toast";

import { Providers } from "@/components/providers/Providers";
import "./globals.css";

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
    "Buy Non-Fiction, Business, Self-Help, Fiction and Academic books online in Pakistan. Fast delivery and Print-on-Demand services.",
  keywords: [
    "books pakistan",
    "online bookstore",
    "buy books online",
    "print on demand",
    "bookshelf.pk",
  ],
  openGraph: {
    title: "Bookshelf.pk — Pakistan's Most Trusted Bookstore",
    description:
      "Buy books online in Pakistan with fast delivery and Print-on-Demand.",
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
      <body>
        <Providers>{children}</Providers>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: "12px",
              border: "1px solid #E2DDD5",
              color: "#1C1C1A",
            },
          }}
        />
      </body>
    </html>
  );
}
