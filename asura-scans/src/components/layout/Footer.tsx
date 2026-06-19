import Link from "next/link";

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "https://discord.gg/asurascans", label: "Discord", external: true },
  { href: "https://twitter.com/asurascans", label: "Twitter", external: true },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/dmca", label: "DMCA" },
];

export function Footer() {
  return (
    <footer className="bg-brand-dark border-t border-brand-surface mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-brand-purple flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-white font-bold text-lg">Asura Scans</span>
            </div>
            <p className="text-brand-text-secondary text-sm max-w-xs">
              Read the best manga, manhwa, and manhua online for free. Updated daily with the latest chapters.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Footer navigation">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="text-sm text-brand-text-secondary hover:text-brand-purple-light transition-colors duration-150"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-brand-surface">
          <p className="text-xs text-brand-text-muted text-center">
            &copy; {new Date().getFullYear()} Asura Scans. All rights reserved. This is a fan project clone for educational purposes.
          </p>
        </div>
      </div>
    </footer>
  );
}
