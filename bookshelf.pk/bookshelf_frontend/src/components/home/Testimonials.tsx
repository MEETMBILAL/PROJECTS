import { Quote } from "lucide-react";

import { SectionHeader } from "@/components/common/SectionHeader";
import { StarRating } from "@/components/common/StarRating";
import { getInitials } from "@/lib/utils";

const testimonials = [
  {
    name: "Ayesha Khan",
    city: "Lahore",
    rating: 5,
    text: "Fast delivery and authentic books. Bookshelf.pk has become my go-to for business reads.",
  },
  {
    name: "Bilal Ahmed",
    city: "Karachi",
    rating: 5,
    text: "The Print-on-Demand service is brilliant — I printed my thesis and it looked professional.",
  },
  {
    name: "Sana Tariq",
    city: "Islamabad",
    rating: 4,
    text: "Great prices and a huge selection of self-help titles. Highly recommend!",
  },
];

export function Testimonials() {
  return (
    <section className="bg-surface-alt py-16">
      <div className="container-bs">
        <SectionHeader
          title="Loved by Readers"
          subtitle="What our customers say"
          align="center"
        />
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <div key={item.name} className="card relative p-6">
              <Quote className="absolute right-5 top-5 h-8 w-8 text-accent" />
              <StarRating rating={item.rating} />
              <p className="mt-3 text-ink-secondary">“{item.text}”</p>
              <div className="mt-5 flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-semibold text-primary">
                  {getInitials(item.name)}
                </span>
                <div>
                  <p className="font-medium text-ink">{item.name}</p>
                  <p className="text-xs text-ink-muted">{item.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
