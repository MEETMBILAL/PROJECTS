import Link from "next/link";
import { Facebook, Instagram, Mail, Twitter } from "lucide-react";

import { ROUTES } from "@/constants/routes";

const columns = [
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
      { label: "Orders", href: ROUTES.orders },
      { label: "Wishlist", href: ROUTES.wishlist },
      { label: "Cart", href: ROUTES.cart },
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
    <footer className="mt-20 bg-ink text-white">
      <div className="container-bs grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <span className="font-display text-2xl font-bold">
            Bookshelf<span className="text-secondary">.pk</span>
          </span>
          <p className="mt-3 max-w-sm text-sm text-white/60">
            Pakistan&apos;s most trusted online bookstore and Print-on-Demand
            platform. Non-Fiction, Business, Self-Help, Fiction and Academic
            titles delivered to your door.
          </p>
          <div className="mt-4 flex gap-3">
            {[Facebook, Instagram, Twitter].map((Icon, index) => (
              <a
                key={index}
                href="#"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-secondary"
                aria-label="Social link"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <h4 className="font-display text-lg">{column.title}</h4>
            <ul className="mt-4 space-y-2">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition hover:text-secondary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="container-bs flex flex-col items-center justify-between gap-3 py-5 text-sm text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Bookshelf.pk. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <Mail className="h-4 w-4" /> support@book-shelf.pk
          </p>
        </div>
      </div>
    </footer>
  );
}
