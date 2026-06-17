"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Heart, LogOut, Menu, User as UserIcon } from "lucide-react";

import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { useUIStore } from "@/store/uiStore";
import { CartIcon } from "./CartIcon";
import { NavbarMobile } from "./NavbarMobile";
import { SearchBar } from "./SearchBar";

const NAV_LINKS = [
  { label: "Books", href: ROUTES.books },
  { label: "Categories", href: ROUTES.categories },
  { label: "Authors", href: ROUTES.authors },
  { label: "Print on Demand", href: ROUTES.pod },
];

export function Navbar() {
  const { isAuthenticated, user } = useAuth();
  const toggleMobileMenu = useUIStore((s) => s.toggleMobileMenu);

  return (
    <header className="sticky top-0 z-40 border-b border-bsborder bg-surface/95 backdrop-blur">
      <div className="container-bs">
        <div className="flex h-16 items-center gap-4">
          <button
            type="button"
            onClick={toggleMobileMenu}
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface-alt lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <Link href={ROUTES.home} className="shrink-0">
            <span className="font-display text-2xl font-bold text-primary">
              Bookshelf<span className="text-secondary">.pk</span>
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
              className="hidden h-10 w-10 place-items-center rounded-full text-text-primary hover:bg-surface-alt sm:grid"
              aria-label="Wishlist"
            >
              <Heart size={20} />
            </Link>
            <CartIcon />
            {isAuthenticated ? (
              <div className="group relative">
                <button
                  type="button"
                  className="grid h-10 w-10 place-items-center rounded-full text-text-primary hover:bg-surface-alt"
                  aria-label="Account"
                >
                  <UserIcon size={20} />
                </button>
                <div className="invisible absolute right-0 z-50 mt-1 w-48 rounded-xl border border-bsborder bg-white p-1.5 opacity-0 shadow-card-hover transition-all group-hover:visible group-hover:opacity-100">
                  <p className="truncate px-3 py-2 text-xs text-text-muted">
                    {user?.email}
                  </p>
                  <Link href={ROUTES.profile} className="block rounded-lg px-3 py-2 text-sm hover:bg-surface-alt">
                    My Profile
                  </Link>
                  <Link href={ROUTES.orders} className="block rounded-lg px-3 py-2 text-sm hover:bg-surface-alt">
                    My Orders
                  </Link>
                  <Link href={ROUTES.podOrders} className="block rounded-lg px-3 py-2 text-sm hover:bg-surface-alt">
                    Print Orders
                  </Link>
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: ROUTES.home })}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-error hover:bg-surface-alt"
                  >
                    <LogOut size={15} /> Sign out
                  </button>
                </div>
              </div>
            ) : (
              <Link href={ROUTES.login} className="btn-primary ml-1 hidden sm:inline-flex">
                Sign In
              </Link>
            )}
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
