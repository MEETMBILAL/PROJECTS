"use client";

import Link from "next/link";
import { Heart, LogOut, Menu, User as UserIcon } from "lucide-react";

import { CartIcon } from "./CartIcon";
import { NavbarMobile } from "./NavbarMobile";
import { SearchBar } from "./SearchBar";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useUIStore } from "@/store/uiStore";

const navLinks = [
  { label: "Books", href: ROUTES.books },
  { label: "Categories", href: ROUTES.categories },
  { label: "Authors", href: ROUTES.authors },
  { label: "Print on Demand", href: ROUTES.pod },
];

export function Navbar() {
  const setMobileMenu = useUIStore((state) => state.setMobileMenu);
  const { isAuthenticated, logout } = useAuth();
  // Keep the cart store in sync globally.
  useCart();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur">
      <div className="bg-primary py-1.5 text-center text-xs text-white">
        Free delivery on orders over PKR 3,000 across Pakistan
      </div>
      <div className="container-bs flex h-16 items-center gap-4">
        <button
          type="button"
          onClick={() => setMobileMenu(true)}
          className="lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6 text-ink" />
        </button>

        <Link href={ROUTES.home} className="flex-shrink-0">
          <span className="font-display text-2xl font-bold text-primary">
            Bookshelf<span className="text-secondary">.pk</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-secondary transition hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden flex-1 justify-center px-4 md:flex">
          <SearchBar />
        </div>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <Link
            href={ROUTES.wishlist}
            className="hidden h-10 w-10 items-center justify-center rounded-full text-ink transition hover:bg-surface-alt sm:inline-flex"
            aria-label="Wishlist"
          >
            <Heart className="h-5 w-5" />
          </Link>
          <CartIcon />
          {isAuthenticated ? (
            <div className="flex items-center">
              <Link
                href={ROUTES.profile}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink transition hover:bg-surface-alt"
                aria-label="Account"
              >
                <UserIcon className="h-5 w-5" />
              </Link>
              <button
                type="button"
                onClick={() => logout()}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink transition hover:bg-surface-alt"
                aria-label="Log out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <Link href={ROUTES.login} className="btn-primary ml-2 px-4 py-2">
              Login
            </Link>
          )}
        </div>
      </div>

      <div className="container-bs pb-3 md:hidden">
        <SearchBar />
      </div>

      <NavbarMobile />
    </header>
  );
}
