import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { ROUTES } from "@/constants/routes";

const heroCovers = [
  "https://picsum.photos/seed/1/300/450",
  "https://picsum.photos/seed/5/300/450",
  "https://picsum.photos/seed/8/300/450",
];

export function HeroBanner() {
  return (
    <section className="overflow-hidden bg-accent">
      <div className="container-bs grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
        <div className="animate-fade-in">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-secondary" />
            Nationwide delivery across Pakistan
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-ink sm:text-5xl lg:text-6xl">
            Pakistan&apos;s Most
            <span className="block text-primary">Trusted Bookstore</span>
          </h1>
          <p className="mt-5 max-w-md text-lg text-ink-secondary">
            Discover Non-Fiction, Business, Self-Help, Fiction and Academic
            titles — plus custom Print-on-Demand for your own documents.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={ROUTES.books} className="btn-primary">
              Shop Now <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href={ROUTES.pod} className="btn-outline">
              Explore POD
            </Link>
          </div>
          <div className="mt-10 flex gap-8">
            <Stat value="10k+" label="Titles" />
            <Stat value="50k+" label="Happy Readers" />
            <Stat value="4.9★" label="Avg. Rating" />
          </div>
        </div>

        <div className="relative hidden h-[420px] items-center justify-center lg:flex">
          <div className="book-3d flex gap-4">
            {heroCovers.map((cover, index) => (
              <div
                key={cover}
                className="relative h-72 w-48 overflow-hidden rounded-lg shadow-card animate-float"
                style={{
                  transform: `translateY(${index * 18}px)`,
                  animationDelay: `${index * 0.4}s`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cover}
                  alt="Featured book cover"
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-2xl font-bold text-primary">{value}</p>
      <p className="text-sm text-ink-secondary">{label}</p>
    </div>
  );
}
