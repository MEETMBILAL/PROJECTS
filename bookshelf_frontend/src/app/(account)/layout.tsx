"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { Heart, Package, Printer, User } from "lucide-react";

import { CartDrawer } from "@/components/cart/CartDrawer";
import { Footer } from "@/components/layout/Footer/Footer";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Navbar } from "@/components/layout/Navbar/Navbar";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Profile", href: ROUTES.profile, icon: User },
  { label: "Orders", href: ROUTES.orders, icon: Package },
  { label: "Wishlist", href: ROUTES.wishlist, icon: Heart },
  { label: "POD Orders", href: ROUTES.podOrders, icon: Printer },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`${ROUTES.login}?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [status, router, pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container-bs py-8">
          {status === "loading" || status === "unauthenticated" ? (
            <LoadingSpinner className="min-h-[50vh]" />
          ) : (
            <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
              <aside className="card-bs h-fit p-3">
                <nav className="flex flex-col gap-1">
                  {NAV.map((item) => {
                    const active = pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                          active
                            ? "bg-primary text-surface"
                            : "text-text-secondary hover:bg-surface-alt",
                        )}
                      >
                        <item.icon size={18} />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </aside>
              <section>{children}</section>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
