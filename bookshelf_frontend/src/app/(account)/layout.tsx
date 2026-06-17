"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Heart, Package, Printer, User as UserIcon } from "lucide-react";

import { CartDrawer } from "@/components/cart/CartDrawer";
import { Footer } from "@/components/layout/Footer/Footer";
import { Navbar } from "@/components/layout/Navbar/Navbar";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Profile", href: ROUTES.profile, icon: UserIcon },
  { label: "Orders", href: ROUTES.orders, icon: Package },
  { label: "Wishlist", href: ROUTES.wishlist, icon: Heart },
  { label: "Print Orders", href: ROUTES.podOrders, icon: Printer },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`${ROUTES.login}?callbackUrl=${pathname}`);
    }
  }, [status, router, pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container-bs py-8">
          {status === "loading" ? (
            <LoadingSpinner className="min-h-[50vh]" />
          ) : (
            <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
              <aside className="h-fit">
                <nav className="card flex flex-col gap-1 p-2">
                  {NAV.map((item) => {
                    const active = pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                          active
                            ? "bg-accent text-primary"
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
              <div>{children}</div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
