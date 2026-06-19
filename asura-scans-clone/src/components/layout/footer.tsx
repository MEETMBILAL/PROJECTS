import Link from "next/link";
import { MessageCircle, Twitter } from "lucide-react";
import { SITE } from "@/lib/constants";

const FOOTER_LINKS = [
  { href: "/browse", label: "About" },
  { href: "https://discord.com", label: "Discord", external: true },
  { href: "https://twitter.com", label: "Twitter", external: true },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/dmca", label: "DMCA" },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-brand-surface bg-brand-bg">
      <div className="container py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-purple font-extrabold text-white">
                A
              </span>
              <span className="text-lg font-bold text-white">{SITE.name}</span>
            </Link>
            <p className="mt-3 text-sm text-brand-text-secondary">{SITE.tagline}</p>
            <div className="mt-4 flex gap-3">
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Discord"
                className="rounded-md border border-brand-surface p-2 text-brand-text-secondary transition-colors hover:border-brand-purple hover:text-brand-purple-light"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="rounded-md border border-brand-surface p-2 text-brand-text-secondary transition-colors hover:border-brand-purple hover:text-brand-purple-light"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {FOOTER_LINKS.map((link) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-brand-text-secondary transition-colors hover:text-brand-purple-light"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-brand-text-secondary transition-colors hover:text-brand-purple-light"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>
        </div>

        <div className="mt-8 border-t border-brand-surface pt-6 text-center text-xs text-brand-text-muted">
          <p>
            © {new Date().getFullYear()} {SITE.name}. This is a demo clone built for
            educational purposes. All series are fictional placeholders.
          </p>
        </div>
      </div>
    </footer>
  );
}
