import type { Metadata } from "next";
import { Printer } from "lucide-react";
import { PODConfigurator } from "@/components/pod/PODConfigurator";
import { Breadcrumb } from "@/components/common/Breadcrumb";

export const metadata: Metadata = {
  title: "Print on Demand",
  description:
    "Upload your PDF, choose your specifications, and we'll print and deliver your book — no minimum order.",
};

export default function PODPage() {
  return (
    <div className="container-page py-8">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Print on Demand" }]}
      />
      <div className="mb-8 max-w-2xl">
        <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent text-primary">
          <Printer className="h-6 w-6" />
        </span>
        <h1 className="font-display text-4xl text-text-primary">
          Print on Demand
        </h1>
        <p className="mt-3 text-text-secondary">
          From a single thesis to a full print run — upload your document, pick
          your paper, binding and color, and get an instant price. We print and
          ship anywhere in Pakistan.
        </p>
      </div>
      <PODConfigurator />
    </div>
  );
}
