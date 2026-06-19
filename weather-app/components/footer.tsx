import Link from "next/link";

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "https://discord.com", label: "Discord" },
  { href: "https://twitter.com", label: "Twitter" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/dmca", label: "DMCA" },
];

export function Footer() {
  return (
    <footer className="border-t border-brand-surface bg-brand-background">
      <div className="container-shell py-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-primary text-lg font-black">A</span>
              <span className="text-lg font-extrabold">Asura Scans</span>
            </div>
            <p className="mt-3 max-w-md text-sm leading-6 text-brand-textSecondary">
              A dark, fast, responsive manga and manhwa reader experience built for binge reading, discovery, and bookmarks.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-brand-textSecondary" aria-label="Footer navigation">
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-white">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="mt-8 border-t border-brand-surface pt-6 text-xs text-brand-textMuted">
          Copyright {new Date().getFullYear()} Asura Scans Clone. Built as a functional platform clone for demonstration.
        </p>
      </div>
    </footer>
  );
}
