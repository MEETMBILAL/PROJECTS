"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./navbar";
import { Footer } from "./footer";

const READER_ROUTE = /^\/comics\/[^/]+\/chapter\//;

/**
 * Renders the global navbar/footer chrome, except on the immersive chapter
 * reader route, which manages its own full-screen UI.
 */
export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isReader = READER_ROUTE.test(pathname);

  if (isReader) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
