"use client";

import Link from "next/link";
import { Heart, Menu, User } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { SITE_NAME } from "@/constants/config";
import { useUIStore } from "@/store/uiStore";
import { useAuth } from "@/hooks/useAuth";
import { SearchBar } from "./SearchBar";
import { CartIcon } from "./CartIcon";
import { NavbarMobile } from "./NavbarMobile";

const NAV_LINKS = [
  { label: "Books", href: ROUTES.books },
  { label: "Categories", href: ROUTES.categories },
  { label: "Authors", href: ROUTES.authors },
  { label: "Print on Demand", href: ROUTES.pod },
];

export function Navbar() {
  const toggleMobileMenu = useUIStore((s) => s.toggleMobileMenu);
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-bordercolor bg-surface/90 backdrop-blur">
      <div className="container-page">
        <div className="flex h-16 items-center gap-4">
          <button
            type="button"
            onClick={toggleMobileMenu}
            className="grid h-10 w-10 place-items-center rounded-lg text-text-primary hover:bg-surface-alt lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link href={ROUTES.home} className="flex shrink-0 items-center gap-2">
            <span className="font-display text-2xl font-bold text-primary">
              {SITE_NAME}
            </span>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-text-secondary transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden flex-1 justify-center px-4 md:flex">
            <SearchBar />
          </div>

          <div className="ml-auto flex items-center gap-1">
            <Link
              href={ROUTES.wishlist}
              className="grid h-10 w-10 place-items-center rounded-lg text-text-primary transition-colors hover:bg-surface-alt"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
            </Link>
            <Link
              href={isAuthenticated ? ROUTES.profile : ROUTES.login}
              className="grid h-10 w-10 place-items-center rounded-lg text-text-primary transition-colors hover:bg-surface-alt"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </Link>
            <CartIcon />
          </div>
        </div>

        <div className="pb-3 md:hidden">
          <SearchBar />
        </div>
      </div>

      <NavbarMobile links={NAV_LINKS} />
    </header>
  );
}
