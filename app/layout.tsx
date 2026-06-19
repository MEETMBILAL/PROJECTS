import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';
import { AppShell } from '@/components/layout/app-shell';
import { AppProviders } from '@/components/providers/app-providers';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Asura Scans - Read Manga, Manhwa & Manhua Online',
  description: 'A pixel-focused manga/manhwa reader clone with trending comics, bookmarks, search, and a dark reading experience.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  themeColor: '#913FE2',
  openGraph: {
    title: 'Asura Scans Clone',
    description: 'Read manga, manhwa, and manhua online in a polished dark interface.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#913FE2',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <AppProviders>
          <AppShell>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  );
}
