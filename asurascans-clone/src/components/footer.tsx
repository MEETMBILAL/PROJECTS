import Link from "next/link";

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
    <footer className="mt-16 border-t border-brand-border bg-brand-bg">
      <div className="container max-w-screen-2xl py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-purple text-sm font-black text-white">
                AS
              </span>
              <span className="text-lg font-extrabold text-white">
                {SITE.name}
              </span>
            </div>
            <p className="mt-3 text-sm text-brand-text-secondary">
              {SITE.tagline}
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-text-secondary transition-colors hover:text-brand-purple-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-8 border-t border-brand-border pt-6 text-xs text-brand-text-muted">
          <p>
            © {new Date().getFullYear()} {SITE.name} Clone. Built for educational
            purposes. All comics, covers, and data shown are randomly generated
            placeholders and not affiliated with any real publication.
          </p>
        </div>
      </div>
    </footer>
  );
}
