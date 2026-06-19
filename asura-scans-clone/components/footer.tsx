import Link from "next/link";
import { Logo } from "@/components/logo";

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "https://discord.com", label: "Discord" },
  { href: "https://twitter.com", label: "Twitter" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/dmca", label: "DMCA" }
];

export function Footer() {
  return (
    <footer className="border-t border-brand-surface bg-brand-background">
      <div className="container-shell py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md space-y-3">
            <Logo />
            <p className="text-sm leading-6 text-brand-textSecondary">
              Read the latest manga, manhwa, and fantasy comics in a fast, dark, reader-first experience.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm" aria-label="Footer">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-brand-textSecondary transition-colors duration-150 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="mt-8 border-t border-brand-surface pt-6 text-xs text-brand-textMuted">
          Copyright {new Date().getFullYear()} Asura Scans Clone. Built for demonstration purposes.
        </p>
      </div>
    </footer>
  );
}
