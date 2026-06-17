import Link from "next/link";
import { Facebook, Instagram, Mail, Twitter } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { SITE_NAME } from "@/constants/config";

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
    <footer className="mt-20 bg-text-primary text-surface">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <span className="font-display text-2xl font-bold text-secondary-light">
              {SITE_NAME}
            </span>
            <p className="mt-3 max-w-sm text-sm text-text-muted">
              Pakistan&apos;s most trusted online bookstore and Print-on-Demand
              platform. Non-Fiction, Business, Self-Help, Fiction and Academic
              titles delivered nationwide.
            </p>
            <div className="mt-5 flex gap-3">
              {[Facebook, Instagram, Twitter, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-surface transition-colors hover:bg-secondary hover:text-primary-dark"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {FOOTER_LINKS.map((section) => (
            <div key={section.title}>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-secondary-light">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-muted transition-colors hover:text-surface"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-sm text-text-muted sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          <p>Made with care in Pakistan.</p>
        </div>
      </div>
    </footer>
  );
}
