import Link from "next/link";
import { ArrowRight, FileText, Printer, Truck } from "lucide-react";

import { ROUTES } from "@/constants/routes";

const STEPS = [
  { icon: FileText, title: "Upload your PDF", desc: "Drag & drop your manuscript" },
  { icon: Printer, title: "Choose specs", desc: "Paper, binding & cover" },
  { icon: Truck, title: "We print & ship", desc: "Delivered to your door" },
];

export function PODPromo() {
  return (
    <section className="bg-primary text-surface">
      <div className="container-bs grid gap-10 py-16 lg:grid-cols-2 lg:items-center">
        <div className="flex flex-col gap-5">
          <span className="w-fit rounded-full bg-white/10 px-4 py-1.5 text-sm text-secondary-light">
            Print on Demand
          </span>
          <h2 className="text-4xl text-surface">Print your book, your way</h2>
          <p className="max-w-md text-surface/80">
            From a single copy to bulk runs — upload your document, pick your
            specifications, and we&apos;ll print and deliver professional-quality books
            across Pakistan.
          </p>
          <Link
            href={ROUTES.pod}
            className="btn-outline w-fit border-surface text-surface hover:bg-surface hover:text-primary"
          >
            Start Printing <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {STEPS.map((step) => (
            <div
              key={step.title}
              className="flex flex-col items-center gap-3 rounded-xl bg-white/5 p-6 text-center"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-surface">
                <step.icon size={22} />
              </span>
              <h4 className="text-surface">{step.title}</h4>
              <p className="text-sm text-surface/70">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
