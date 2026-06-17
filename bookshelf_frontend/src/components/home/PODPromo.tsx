import Link from "next/link";
import { ArrowRight, FileText, Layers, Printer, Truck } from "lucide-react";

import { ROUTES } from "@/constants/routes";

const STEPS = [
  { icon: FileText, label: "Upload your PDF" },
  { icon: Layers, label: "Choose specifications" },
  { icon: Printer, label: "We print it" },
  { icon: Truck, label: "Delivered to you" },
];

export function PODPromo() {
  return (
    <section className="bg-primary text-surface">
      <div className="container-bs grid items-center gap-10 py-16 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Print Your Own Book with POD
          </h2>
          <p className="mt-4 max-w-lg text-surface/80">
            From thesis to self-published novels — upload your manuscript and get a
            professionally printed, bound copy delivered anywhere in Pakistan. No minimum
            order quantity.
          </p>
          <Link href={ROUTES.pod} className="btn-secondary mt-7 px-7 py-3 text-base">
            Start Printing <ArrowRight size={18} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {STEPS.map((step, index) => (
            <div
              key={step.label}
              className="rounded-xl bg-white/10 p-5 backdrop-blur transition-colors hover:bg-white/15"
            >
              <span className="grid h-11 w-11 place-items-center rounded-full bg-secondary text-primary-dark">
                <step.icon size={20} />
              </span>
              <p className="mt-3 text-sm font-medium">
                Step {index + 1}
              </p>
              <p className="text-surface/80">{step.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
