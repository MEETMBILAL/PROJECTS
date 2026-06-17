"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ROUTES } from "@/constants/routes";
import { useCart } from "@/hooks/useCart";

export default function CheckoutPage() {
  const { status } = useSession();
  const { cart, isLoading } = useCart();

  if (status === "loading" || isLoading) return <LoadingSpinner className="py-32" />;

  if (status !== "authenticated") {
    return (
      <div className="container-bs py-20">
        <EmptyState
          title="Please log in to checkout"
          description="You need an account to place an order."
          actionLabel="Log in"
          actionHref={ROUTES.login}
        />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container-bs py-20">
        <EmptyState
          title="Your cart is empty"
          actionLabel="Browse Books"
          actionHref={ROUTES.books}
        />
      </div>
    );
  }

  return (
    <div className="container-bs py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: ROUTES.home },
          { label: "Cart", href: ROUTES.cart },
          { label: "Checkout" },
        ]}
        className="mb-6"
      />
      <h1 className="mb-6 font-display text-4xl text-ink">Checkout</h1>
      <CheckoutForm />
      <p className="mt-6 text-center text-sm text-ink-secondary">
        Changed your mind?{" "}
        <Link href={ROUTES.cart} className="font-semibold text-primary">
          Return to cart
        </Link>
      </p>
    </div>
  );
}
