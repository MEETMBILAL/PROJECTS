import Image from "next/image";
import Link from "next/link";

const links = ["About", "Discord", "Twitter", "Privacy Policy", "DMCA"];

export function Footer() {
  return (
    <footer className="border-t border-brand-surface bg-brand-background">
      <div className="asura-container py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="flex max-w-md gap-3">
            <Image src="/logo.svg" alt="Asura Scans" width={44} height={44} className="rounded-xl" />
            <div>
              <p className="text-lg font-bold text-white">Asura Scans</p>
              <p className="mt-2 text-sm leading-6 text-brand-secondary">
                Premium dark-mode manga and manhwa reading, updated hourly with fantasy, system, and regression titles.
              </p>
            </div>
          </div>
          <nav aria-label="Footer links" className="flex flex-wrap gap-4 text-sm text-brand-secondary">
            {links.map((link) => (
              <Link key={link} href="#" className="hover:text-brand-light">
                {link}
              </Link>
            ))}
          </nav>
        </div>
        <p className="mt-8 border-t border-brand-surface pt-6 text-xs text-brand-muted">
          Copyright 2026 Asura Scans Clone. Built for demonstration with sample data.
        </p>
      </div>
    </footer>
  );
}
