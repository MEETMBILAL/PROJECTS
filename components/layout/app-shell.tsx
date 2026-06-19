use client';

import { usePathname } from 'next/navigation';
import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isReader = /^\/comics\/[^/]+\/chapter\/[^/]+/.test(pathname);
  if (isReader) return <>{children}</>;
  return (
    <>
      <Navbar />
      <div className="min-h-screen">{children}</div>
      <Footer />
    </>
  );
}
