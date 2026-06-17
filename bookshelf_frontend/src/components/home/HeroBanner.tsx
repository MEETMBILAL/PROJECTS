import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen } from "lucide-react";

import { ROUTES } from "@/constants/routes";

const HERO_COVERS = [
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80",
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80",
  "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80",
];

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-accent">
      <div className="container-bs grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
        <div className="animate-fade-in">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <BookOpen size={16} /> Print-on-Demand now available
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-text-primary sm:text-5xl lg:text-6xl">
            Pakistan&apos;s Most Trusted Bookstore
          </h1>
          <p className="mt-5 max-w-lg text-lg text-text-secondary">
            Discover thousands of Non-Fiction, Business, Self-Help, Fiction and Academic
            titles — delivered to your doorstep across Pakistan.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href={ROUTES.books} className="btn-primary px-7 py-3 text-base">
              Shop Now <ArrowRight size={18} />
            </Link>
            <Link href={ROUTES.pod} className="btn-outline px-7 py-3 text-base">
              Explore POD
            </Link>
          </div>
          <div className="mt-10 flex gap-8">
            {[
              { value: "10,000+", label: "Titles" },
              { value: "50,000+", label: "Happy Readers" },
              { value: "4.8★", label: "Avg. Rating" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-2xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-text-secondary">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative hidden h-[420px] lg:block" style={{ perspective: "1200px" }}>
          {HERO_COVERS.map((cover, index) => (
            <div
              key={cover}
              className="absolute aspect-[2/3] w-56 overflow-hidden rounded-xl border-4 border-white shadow-card-hover transition-transform duration-500"
              style={{
                left: `${index * 90}px`,
                top: `${index * 30}px`,
                transform: `rotate(${index * 4 - 4}deg)`,
                zIndex: HERO_COVERS.length - index,
              }}
            >
              <Image src={cover} alt="Featured book" fill sizes="224px" className="object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
