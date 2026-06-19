import Link from "next/link";

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "https://discord.gg", label: "Discord", external: true },
  { href: "https://twitter.com", label: "Twitter", external: true },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/dmca", label: "DMCA" },
];

export function Footer() {
  return (
    <footer className="border-t border-brand-surface bg-brand-dark mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-purple">
                <span className="text-sm font-bold text-white">A</span>
              </div>
              <span className="text-lg font-bold text-white">Asura Scans</span>
            </div>
            <p className="text-sm text-brand-secondary max-w-xs">
              Read the best manga, manhwa, and manhua online for free. Updated daily with the latest chapters.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Footer navigation">
            {footerLinks.map((link) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-brand-secondary hover:text-brand-purple-light transition-colors duration-150"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-brand-secondary hover:text-brand-purple-light transition-colors duration-150"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-brand-surface">
          <p className="text-xs text-brand-muted text-center">
            © {new Date().getFullYear()} Asura Scans Clone. All rights reserved. For educational purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}
