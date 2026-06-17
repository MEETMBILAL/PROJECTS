import Link from "next/link";
import { ArrowRight, Printer } from "lucide-react";

import { ROUTES } from "@/constants/routes";

export function HeroBanner() {
  return (
    <section className="bg-accent">
      <div className="container-bs grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
        <div className="flex flex-col gap-6">
          <span className="w-fit rounded-full bg-secondary/15 px-4 py-1.5 text-sm font-medium text-secondary">
            Free delivery on orders over PKR 3,000
          </span>
          <h1 className="text-4xl leading-tight text-primary sm:text-5xl lg:text-6xl">
            Pakistan&apos;s Most Trusted Bookstore
          </h1>
          <p className="max-w-md text-lg text-text-secondary">
            Discover thousands of titles across Non-Fiction, Business, Self-Help, Fiction
            and Academic course books — plus on-demand printing for your own work.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href={ROUTES.books} className="btn-primary">
              Shop Now <ArrowRight size={18} />
            </Link>
            <Link href={ROUTES.pod} className="btn-outline">
              <Printer size={18} /> Explore POD
            </Link>
          </div>
        </div>

        <div className="relative flex h-80 items-center justify-center lg:h-96">
          <div className="relative" style={{ perspective: "1000px" }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute aspect-[2/3] w-44 rounded-xl border border-bsborder bg-white shadow-card-hover transition-transform"
                style={{
                  transform: `translateX(${i * 48 - 48}px) translateY(${i * -10}px) rotateY(-18deg) rotateZ(${i * 2 - 2}deg)`,
                  zIndex: 3 - i,
                  background:
                    i === 0
                      ? "linear-gradient(135deg,#2C4A3E,#3D6B5C)"
                      : i === 1
                        ? "linear-gradient(135deg,#C4933F,#DFB466)"
                        : "linear-gradient(135deg,#1A2E25,#2C4A3E)",
                }}
              >
                <div className="flex h-full flex-col justify-end p-4">
                  <span className="font-display text-lg font-bold text-surface">
                    Bookshelf.pk
                  </span>
                  <span className="text-xs text-surface/70">Featured Reads</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
