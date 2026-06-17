import type { Metadata } from "next";

import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { Breadcrumb } from "@/components/common/Breadcrumb";

export const metadata: Metadata = {
  title: "Checkout",
};

export default function CheckoutPage() {
  return (
    <div className="container-bs py-8">
      <Breadcrumb items={[{ label: "Checkout" }]} />
      <h1 className="mb-6 mt-3 text-4xl text-primary">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
