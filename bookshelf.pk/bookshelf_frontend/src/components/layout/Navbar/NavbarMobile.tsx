"use client";

import Link from "next/link";
import { X } from "lucide-react";

import { ROUTES } from "@/constants/routes";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";

const links = [
  { label: "Home", href: ROUTES.home },
  { label: "Books", href: ROUTES.books },
  { label: "Categories", href: ROUTES.categories },
  { label: "Authors", href: ROUTES.authors },
  { label: "Print on Demand", href: ROUTES.pod },
];

export function NavbarMobile() {
  const open = useUIStore((state) => state.mobileMenuOpen);
  const setMobileMenu = useUIStore((state) => state.setMobileMenu);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-ink/40 transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setMobileMenu(false)}
      />
      <div
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-72 transform bg-white shadow-xl transition-transform lg:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <span className="font-display text-xl text-primary">Bookshelf</span>
          <button
            type="button"
            onClick={() => setMobileMenu(false)}
            aria-label="Close menu"
          >
            <X className="h-5 w-5 text-ink-secondary" />
          </button>
        </div>
        <nav className="flex flex-col p-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenu(false)}
              className="rounded-lg px-4 py-3 text-sm font-medium text-ink-secondary transition hover:bg-surface-alt hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
