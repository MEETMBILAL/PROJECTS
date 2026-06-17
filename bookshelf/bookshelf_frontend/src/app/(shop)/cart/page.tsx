"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { EmptyState } from "@/components/common/EmptyState";
import { CartSummary } from "@/components/cart/CartSummary";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  return (
    <div className="container-page py-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
      <h1 className="mb-6 font-display text-3xl text-text-primary">
        Shopping Cart
      </h1>

      {items.length === 0 ? (
        <EmptyState
          title="Your cart is empty"
          description="Looks like you haven't added any books yet."
          actionLabel="Browse Books"
          actionHref={ROUTES.books}
        />
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.book.id}
                className="card flex gap-4 p-4"
              >
                <div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-lg bg-surface-alt">
                  <Image
                    src={item.book.cover_image}
                    alt={item.book.title}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col">
                  <Link
                    href={ROUTES.book(item.book.slug)}
                    className="font-medium text-text-primary hover:text-primary"
                  >
                    {item.book.title}
                  </Link>
                  <p className="text-sm text-text-secondary">
                    {item.book.authors.map((a) => a.name).join(", ")}
                  </p>
                  <p className="mt-1 text-primary">
                    {formatPrice(item.book.effective_price)}
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center rounded-lg border border-bordercolor">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.book.id, item.quantity - 1)
                        }
                        className="grid h-9 w-9 place-items-center text-text-secondary hover:text-primary"
                        aria-label="Decrease"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-10 text-center">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.book.id, item.quantity + 1)
                        }
                        className="grid h-9 w-9 place-items-center text-text-secondary hover:text-primary"
                        aria-label="Increase"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-text-primary">
                        {formatPrice(
                          parseFloat(item.book.effective_price) *
                            item.quantity,
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeItem(item.book.id)}
                        className="text-text-muted hover:text-error"
                        aria-label="Remove"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <CartSummary subtotal={subtotal} showCheckoutButton />
        </div>
      )}
    </div>
  );
}
