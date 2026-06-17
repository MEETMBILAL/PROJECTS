import Link from "next/link";
import { ArrowRight, FileText, Package, Printer } from "lucide-react";

import { ROUTES } from "@/constants/routes";

const steps = [
  { icon: FileText, title: "Upload your PDF", text: "Drag & drop your document" },
  { icon: Printer, title: "Choose specs", text: "Paper, binding & color" },
  { icon: Package, title: "Get it printed", text: "Delivered to your door" },
];

export function PODPromo() {
  return (
    <section className="container-bs py-16">
      <div className="overflow-hidden rounded-2xl bg-primary px-6 py-12 text-white sm:px-12">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wide text-secondary-light">
              Print on Demand
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              Turn your manuscript into a printed book
            </h2>
            <p className="mt-4 max-w-md text-white/70">
              Self-publish, print course notes, or produce custom documents.
              Upload a PDF, choose your specifications and we&apos;ll handle the
              rest — no minimum order required.
            </p>
            <Link
              href={ROUTES.pod}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-secondary px-6 py-3 text-sm font-semibold text-white transition hover:bg-secondary-light"
            >
              Start Printing <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="flex items-center gap-4 rounded-xl bg-white/10 p-4"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-white">
                  <step.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold">
                    {index + 1}. {step.title}
                  </p>
                  <p className="text-sm text-white/60">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
