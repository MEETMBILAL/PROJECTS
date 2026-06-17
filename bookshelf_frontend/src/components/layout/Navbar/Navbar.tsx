"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Heart, LogOut, Menu, User } from "lucide-react";

import { CartIcon } from "./CartIcon";
import { SearchBar } from "./SearchBar";
import { NavbarMobile } from "./NavbarMobile";
import { ROUTES } from "@/constants/routes";
import { useUIStore } from "@/store/uiStore";

const NAV_LINKS = [
  { label: "Books", href: ROUTES.books },
  { label: "Categories", href: ROUTES.categories },
  { label: "Authors", href: ROUTES.authors },
  { label: "Print on Demand", href: ROUTES.pod },
];

export function Navbar() {
  const { data: session, status } = useSession();
  const toggleMobileMenu = useUIStore((state) => state.toggleMobileMenu);

  return (
    <header className="sticky top-0 z-40 border-b border-bsborder bg-surface/95 backdrop-blur">
      <div className="container-bs">
        <div className="flex h-16 items-center gap-4">
          <button
            type="button"
            onClick={toggleMobileMenu}
            className="lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>

          <Link href={ROUTES.home} className="shrink-0">
            <span className="font-display text-2xl font-bold text-primary">Bookshelf</span>
            <span className="font-display text-2xl font-bold text-secondary">.pk</span>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-text-secondary hover:text-primary"
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
              className="flex h-10 w-10 items-center justify-center rounded-xl text-text-primary hover:text-primary"
              aria-label="Wishlist"
            >
              <Heart size={22} />
            </Link>
            <CartIcon />
            {status === "authenticated" ? (
              <div className="flex items-center gap-1">
                <Link
                  href={ROUTES.profile}
                  className="flex h-10 items-center gap-2 rounded-xl px-2 text-sm text-text-primary hover:text-primary"
                >
                  <User size={20} />
                  <span className="hidden xl:inline">
                    {session?.user?.full_name || session?.user?.username || "Account"}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: ROUTES.home })}
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-text-secondary hover:text-error"
                  aria-label="Sign out"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link href={ROUTES.login} className="btn-primary ml-2 px-4 py-2 text-sm">
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
