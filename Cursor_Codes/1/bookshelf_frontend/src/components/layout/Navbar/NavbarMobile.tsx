"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";

interface NavbarMobileProps {
  links: { label: string; href: string }[];
}

export function NavbarMobile({ links }: NavbarMobileProps) {
  const open = useUIStore((s) => s.mobileMenuOpen);
  const close = useUIStore((s) => s.closeMobileMenu);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-text-primary/40 transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={close}
      />
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-72 bg-surface shadow-xl transition-transform lg:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-bordercolor p-4">
          <span className="font-display text-xl font-bold text-primary">
            Menu
          </span>
          <button
            type="button"
            onClick={close}
            className="grid h-9 w-9 place-items-center rounded-lg hover:bg-surface-alt"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-col p-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={close}
              className="rounded-lg px-4 py-3 text-sm font-medium text-text-secondary hover:bg-surface-alt hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
