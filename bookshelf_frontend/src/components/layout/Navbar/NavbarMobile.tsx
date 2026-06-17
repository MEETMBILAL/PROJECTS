"use client";

import Link from "next/link";
import { X } from "lucide-react";

import { useUIStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";

interface NavbarMobileProps {
  links: { label: string; href: string }[];
}

export function NavbarMobile({ links }: NavbarMobileProps) {
  const open = useUIStore((state) => state.mobileMenuOpen);
  const close = useUIStore((state) => state.closeMobileMenu);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={close}
      />
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-72 transform bg-surface p-6 shadow-card-hover transition-transform lg:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between">
          <span className="font-display text-xl font-bold text-primary">Menu</span>
          <button type="button" onClick={close} aria-label="Close menu">
            <X size={22} />
          </button>
        </div>
        <nav className="mt-6 flex flex-col gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={close}
              className="rounded-xl px-3 py-2.5 text-text-primary hover:bg-surface-alt"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
