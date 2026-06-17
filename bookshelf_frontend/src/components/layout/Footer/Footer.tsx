import Link from "next/link";
import { Facebook, Instagram, Mail, Twitter } from "lucide-react";

import { ROUTES } from "@/constants/routes";

const FOOTER_LINKS = {
  Shop: [
    { label: "All Books", href: ROUTES.books },
    { label: "Categories", href: ROUTES.categories },
    { label: "Authors", href: ROUTES.authors },
    { label: "Print on Demand", href: ROUTES.pod },
  ],
  Account: [
    { label: "My Profile", href: ROUTES.profile },
    { label: "Orders", href: ROUTES.orders },
    { label: "Wishlist", href: ROUTES.wishlist },
    { label: "POD Orders", href: ROUTES.podOrders },
  ],
  Company: [
    { label: "About Us", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Shipping Policy", href: "#" },
    { label: "Returns", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="mt-20 bg-text-primary text-surface">
      <div className="container-bs py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="font-display text-2xl font-bold">
              Bookshelf<span className="text-secondary">.pk</span>
            </span>
            <p className="mt-3 max-w-xs text-sm text-text-muted">
              Pakistan&apos;s most trusted online bookstore and Print-on-Demand platform.
              Discover, read, and print with us.
            </p>
            <div className="mt-4 flex gap-3">
              {[Facebook, Instagram, Twitter, Mail].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-secondary"
                  aria-label="Social link"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="font-display text-lg">{heading}</h4>
              <ul className="mt-4 flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-muted hover:text-secondary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-text-muted">
          © {new Date().getFullYear()} Bookshelf.pk — All rights reserved.
        </div>
      </div>
    </footer>
  );
}
