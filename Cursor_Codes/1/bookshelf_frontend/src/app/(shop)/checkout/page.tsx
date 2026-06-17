import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { Breadcrumb } from "@/components/common/Breadcrumb";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <div className="container-page py-8">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Checkout" }]}
      />
      <h1 className="mb-6 font-display text-3xl text-text-primary">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
