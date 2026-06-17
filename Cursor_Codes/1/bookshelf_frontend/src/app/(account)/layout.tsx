"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Package, Printer, Heart, User } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar/Navbar";
import { Footer } from "@/components/layout/Footer/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Profile", href: ROUTES.profile, icon: User },
  { label: "Orders", href: ROUTES.orders, icon: Package },
  { label: "Wishlist", href: ROUTES.wishlist, icon: Heart },
  { label: "POD Orders", href: ROUTES.podOrders, icon: Printer },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="container-page flex-1 py-8">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="h-fit">
            <nav className="card overflow-hidden p-2">
              {NAV.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary text-surface"
                        : "text-text-secondary hover:bg-surface-alt",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-error transition-colors hover:bg-error/10"
              >
                <LogOut className="h-4 w-4" />
                Log Out
              </button>
            </nav>
          </aside>
          <div>{children}</div>
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
