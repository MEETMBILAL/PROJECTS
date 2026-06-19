"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isReader = /\/comics\/[^/]+\/chapter\/[^/]+/.test(pathname);

  if (isReader) {
    return <main>{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
