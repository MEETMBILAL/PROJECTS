import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { SITE, FOOTER_LINKS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-brand-surface bg-brand-bg">
      <div className="container flex flex-col gap-8 py-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-3 text-sm text-brand-text-secondary">{SITE.tagline}</p>
        </div>

        <nav className="flex flex-wrap gap-x-8 gap-y-3">
          {FOOTER_LINKS.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-brand-text-secondary transition-colors hover:text-brand-purple-light"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-brand-text-secondary transition-colors hover:text-brand-purple-light"
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>
      </div>

      <div className="border-t border-brand-surface">
        <div className="container py-5 text-center text-xs text-brand-text-muted">
          © {new Date().getFullYear()} {SITE.name}. This is an educational clone for demonstration
          purposes. All sample content is fictional.
        </div>
      </div>
    </footer>
  );
}
