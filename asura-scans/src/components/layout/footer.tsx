import Link from "next/link";
import { Logo } from "./logo";
import { SITE } from "@/lib/constants";

const FOOTER_LINKS = [
  { label: "About", href: "/about" },
  { label: "Discord", href: SITE.discord },
  { label: "Twitter", href: SITE.twitter },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "DMCA", href: "/dmca" },
];

export function Footer() {
  return (
    <footer className="border-t border-brand-surface bg-brand-bg">
      <div className="container py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-3 text-sm leading-relaxed text-brand-text-secondary">
              Read the latest manhwa, manga and manhua with official-quality
              translations. New chapters every day on {SITE.name}.
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-brand-text-secondary transition-colors hover:text-brand-purple-light"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8 border-t border-brand-surface pt-6 text-center text-xs text-brand-text-muted">
          © {new Date().getFullYear()} {SITE.name}. All rights reserved. This is a
          non-commercial fan-made clone for educational purposes.
        </div>
      </div>
    </footer>
  );
}
