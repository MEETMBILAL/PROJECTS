import Link from "next/link";
import { ArrowRight, FileUp, Printer, Settings2, Truck } from "lucide-react";
import { ROUTES } from "@/constants/routes";

const STEPS = [
  { icon: FileUp, label: "Upload your PDF" },
  { icon: Settings2, label: "Choose specifications" },
  { icon: Printer, label: "We print it" },
  { icon: Truck, label: "Delivered to you" },
];

export function PODPromo() {
  return (
    <section className="container-page py-14">
      <div className="overflow-hidden rounded-2xl bg-primary px-8 py-12 text-surface lg:px-14">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="badge bg-secondary text-primary-dark">
              Print on Demand
            </span>
            <h2 className="mt-4 font-display text-3xl text-surface lg:text-4xl">
              Print your own book, one copy at a time
            </h2>
            <p className="mt-4 max-w-md text-surface/80">
              Self-publishing, thesis printing, course packs or personal
              projects — upload a PDF, pick your binding and paper, and we
              handle the rest. No minimum order.
            </p>
            <Link
              href={ROUTES.pod}
              className="btn mt-7 bg-secondary text-primary-dark hover:bg-secondary-light"
            >
              Start Printing
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {STEPS.map((step, i) => (
              <div
                key={i}
                className="rounded-xl bg-white/10 p-5 backdrop-blur"
              >
                <step.icon className="h-7 w-7 text-secondary-light" />
                <p className="mt-3 text-sm font-medium">
                  {i + 1}. {step.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
