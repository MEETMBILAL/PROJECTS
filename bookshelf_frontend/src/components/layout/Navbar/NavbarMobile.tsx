"use client";

import Link from "next/link";
import { X } from "lucide-react";

import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";

interface NavbarMobileProps {
  links: { label: string; href: string }[];
}

export function NavbarMobile({ links }: NavbarMobileProps) {
  const open = useUIStore((s) => s.mobileMenuOpen);
  const close = useUIStore((s) => s.closeMobileMenu);
  const { isAuthenticated } = useAuth();

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={close}
      />
      <div
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-72 bg-surface p-5 shadow-xl transition-transform lg:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="mb-6 flex items-center justify-between">
          <span className="font-display text-xl font-bold text-primary">
            Bookshelf<span className="text-secondary">.pk</span>
          </span>
          <button type="button" onClick={close} aria-label="Close menu">
            <X size={22} />
          </button>
        </div>
        <nav className="flex flex-col gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={close}
              className="rounded-lg px-3 py-2.5 text-text-primary hover:bg-surface-alt"
            >
              {link.label}
            </Link>
          ))}
          <Link href={ROUTES.wishlist} onClick={close} className="rounded-lg px-3 py-2.5 hover:bg-surface-alt">
            Wishlist
          </Link>
          <div className="my-2 border-t border-bsborder" />
          {isAuthenticated ? (
            <>
              <Link href={ROUTES.profile} onClick={close} className="rounded-lg px-3 py-2.5 hover:bg-surface-alt">
                My Profile
              </Link>
              <Link href={ROUTES.orders} onClick={close} className="rounded-lg px-3 py-2.5 hover:bg-surface-alt">
                My Orders
              </Link>
            </>
          ) : (
            <Link href={ROUTES.login} onClick={close} className="btn-primary mt-2">
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </>
  );
}
