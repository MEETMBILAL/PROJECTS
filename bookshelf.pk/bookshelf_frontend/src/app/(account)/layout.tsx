"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

import { CartDrawer } from "@/components/cart/CartDrawer";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { AccountSidebar } from "@/components/layout/AccountSidebar";
import { Footer } from "@/components/layout/Footer/Footer";
import { Navbar } from "@/components/layout/Navbar/Navbar";
import { ROUTES } from "@/constants/routes";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(ROUTES.login);
    }
  }, [status, router]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container-bs py-8">
          {status === "loading" ? (
            <LoadingSpinner className="py-32" />
          ) : (
            <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
              <AccountSidebar />
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
