"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SearchModal } from "@/components/search/search-modal";

/**
 * Renders the global navbar/footer/search — except inside the immersive
 * chapter reader, which provides its own minimal chrome.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isReader = /\/comics\/[^/]+\/chapter\//.test(pathname);

  if (isReader) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-60px)]">{children}</main>
      <Footer />
      <SearchModal />
    </>
  );
}
