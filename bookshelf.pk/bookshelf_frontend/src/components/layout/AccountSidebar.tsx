"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, LogOut, Package, Printer, User } from "lucide-react";

import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const links = [
  { label: "Profile", href: ROUTES.profile, icon: User },
  { label: "Orders", href: ROUTES.orders, icon: Package },
  { label: "Wishlist", href: ROUTES.wishlist, icon: Heart },
  { label: "Print Orders", href: ROUTES.podOrders, icon: Printer },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <nav className="card flex flex-col gap-1 p-3">
      {links.map((link) => {
        const active = pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
              active
                ? "bg-accent text-primary"
                : "text-ink-secondary hover:bg-surface-alt",
            )}
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}
      <button
        type="button"
        onClick={() => logout()}
        className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-error transition hover:bg-error/10"
      >
        <LogOut className="h-4 w-4" /> Log out
      </button>
    </nav>
  );
}
