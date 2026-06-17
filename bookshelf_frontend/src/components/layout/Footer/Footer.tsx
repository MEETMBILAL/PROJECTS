import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";

import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/config";

const FOOTER_LINKS = [
  {
    title: "Shop",
    links: [
      { label: "All Books", href: ROUTES.books },
      { label: "Categories", href: ROUTES.categories },
      { label: "Authors", href: ROUTES.authors },
      { label: "Print on Demand", href: ROUTES.pod },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "My Profile", href: ROUTES.profile },
      { label: "My Orders", href: ROUTES.orders },
      { label: "Wishlist", href: ROUTES.wishlist },
      { label: "Sign In", href: ROUTES.login },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Shipping Policy", href: "#" },
      { label: "Returns", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-20 bg-text-primary text-surface">
      <div className="container-bs py-14">
        <div className="grid gap-10 lg:grid-cols-4">
          <div>
            <span className="font-display text-2xl font-bold">
              Bookshelf<span className="text-secondary">.pk</span>
            </span>
            <p className="mt-3 max-w-xs text-sm text-text-muted">{SITE.description}</p>
            <div className="mt-4 flex gap-3">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition-colors hover:bg-secondary hover:text-primary-dark"
                  aria-label="Social media"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {FOOTER_LINKS.map((column) => (
            <div key={column.title}>
              <h4 className="mb-4 font-display text-lg">{column.title}</h4>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-muted transition-colors hover:text-secondary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-text-muted sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-5">
            <span className="flex items-center gap-1.5">
              <MapPin size={14} /> Lahore, Pakistan
            </span>
            <span className="flex items-center gap-1.5">
              <Phone size={14} /> +92 300 1234567
            </span>
            <span className="flex items-center gap-1.5">
              <Mail size={14} /> hello@bookshelf.pk
            </span>
          </div>
          <p>© {new Date().getFullYear()} Bookshelf.pk. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
