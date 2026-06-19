import Link from "next/link";
import Image from "next/image";

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "https://discord.gg/asurascans", label: "Discord", external: true },
  { href: "https://twitter.com/asurascans", label: "Twitter", external: true },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/dmca", label: "DMCA" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-brand-surface bg-brand-dark">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-brand-purple">
              <Image src="/logo.svg" alt="Asura Scans" fill className="object-contain p-1" />
            </div>
            <div>
              <p className="text-lg font-bold text-brand-text-primary">Asura Scans</p>
              <p className="text-sm text-brand-text-secondary">
                Read the best manga & manhwa online for free.
              </p>
            </div>
          </div>

          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-brand-text-secondary transition-colors duration-150 hover:text-brand-purple-light"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-brand-text-secondary transition-colors duration-150 hover:text-brand-purple-light"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-8 border-t border-brand-surface pt-6">
          <p className="text-center text-xs text-brand-muted">
            © {new Date().getFullYear()} Asura Scans Clone. All rights reserved. For educational purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}
