"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { ShoppingBag } from "lucide-react";

import { Breadcrumb } from "@/components/common/Breadcrumb";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { EmptyState } from "@/components/common/EmptyState";
import { ROUTES } from "@/constants/routes";
import { cartApi } from "@/lib/api/cart";
import { useCartStore } from "@/store/cartStore";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal());
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [applying, setApplying] = useState(false);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplying(true);
    try {
      const result = await cartApi.applyCoupon(couponCode.trim(), subtotal);
      setDiscount(parseFloat(result.discount));
      toast.success("Coupon applied!");
    } catch {
      setDiscount(0);
      toast.error("Invalid or expired coupon.");
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="container-bs py-8">
      <Breadcrumb items={[{ label: "Cart" }]} />
      <h1 className="mt-3 text-4xl text-primary">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={ShoppingBag}
            title="Your cart is empty"
            description="Looks like you haven't added any books yet."
            actionLabel="Start Shopping"
            actionHref={ROUTES.books}
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <div key={item.book.id} className="card-bs p-4">
                <CartItem item={item} />
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <div className="card-bs flex flex-col gap-2 p-5">
              <label className="text-sm font-medium text-text-primary">Coupon code</label>
              <div className="flex gap-2">
                <input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="WELCOME10"
                  className="input-bs flex-1 uppercase"
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  disabled={applying}
                  className="btn-outline px-4"
                >
                  Apply
                </button>
              </div>
            </div>
            <CartSummary subtotal={subtotal} discount={discount} />
          </div>
        </div>
      )}
    </div>
  );
}
