import Link from "next/link";
import { ArrowRight, BookOpen, Printer } from "lucide-react";
import { ROUTES } from "@/constants/routes";

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-accent via-surface to-surface-alt">
      <div className="container-page grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
        <div className="animate-fade-in">
          <span className="badge bg-secondary/15 text-secondary">
            Pakistan&apos;s #1 Online Bookstore
          </span>
          <h1 className="mt-4 font-display text-4xl leading-tight text-text-primary sm:text-5xl lg:text-6xl">
            Pakistan&apos;s Most
            <span className="text-primary"> Trusted </span>
            Bookstore
          </h1>
          <p className="mt-5 max-w-lg text-lg text-text-secondary">
            Discover thousands of Non-Fiction, Business, Self-Help, Fiction and
            Academic titles. Plus, print your own books with our Print-on-Demand
            service.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={ROUTES.books} className="btn-primary">
              <BookOpen className="h-4 w-4" />
              Shop Now
            </Link>
            <Link href={ROUTES.pod} className="btn-outline">
              <Printer className="h-4 w-4" />
              Explore POD
            </Link>
          </div>
          <div className="mt-10 flex gap-8">
            {[
              { value: "10K+", label: "Titles" },
              { value: "50K+", label: "Happy Readers" },
              { value: "24h", label: "Fast Dispatch" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-2xl font-bold text-primary">
                  {stat.value}
                </p>
                <p className="text-sm text-text-secondary">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative hidden h-[420px] lg:block">
          <div className="absolute inset-0 flex items-center justify-center">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute aspect-[2/3] w-56 rounded-xl border border-bordercolor bg-white shadow-card-hover"
                style={{
                  transform: `rotate(${(i - 1) * 8}deg) translateX(${
                    (i - 1) * 60
                  }px)`,
                  zIndex: 3 - Math.abs(i - 1),
                  background:
                    i === 1
                      ? "linear-gradient(135deg,#2C4A3E,#3D6B5C)"
                      : i === 0
                        ? "linear-gradient(135deg,#C4933F,#DFB466)"
                        : "linear-gradient(135deg,#1A2E25,#2C4A3E)",
                }}
              >
                <div className="flex h-full flex-col justify-end p-6">
                  <span className="font-display text-xl font-bold text-surface">
                    {i === 1 ? "Bestseller" : i === 0 ? "New" : "Editor's Pick"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
