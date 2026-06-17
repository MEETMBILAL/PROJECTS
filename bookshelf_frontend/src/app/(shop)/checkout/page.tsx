"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ROUTES } from "@/constants/routes";
import { useCart } from "@/hooks/useCart";

export default function CheckoutPage() {
  const router = useRouter();
  const { status } = useSession();
  const { data: cart, isLoading } = useCart();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`${ROUTES.login}?callbackUrl=${ROUTES.checkout}`);
    }
  }, [status, router]);

  if (status === "loading" || isLoading) {
    return <LoadingSpinner className="min-h-[60vh]" />;
  }

  return (
    <div className="container-bs py-8">
      <Breadcrumb items={[{ label: "Cart", href: ROUTES.cart }, { label: "Checkout" }]} />
      <h1 className="mt-4 font-display text-3xl font-bold text-text-primary">Checkout</h1>

      <div className="mt-8">
        {!cart || cart.items.length === 0 ? (
          <EmptyState
            title="Your cart is empty"
            description="Add some books before checking out."
            actionLabel="Browse Books"
            actionHref={ROUTES.books}
          />
        ) : (
          <CheckoutForm cart={cart} />
        )}
      </div>
    </div>
  );
}
