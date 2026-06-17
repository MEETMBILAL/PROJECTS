import { Quote } from "lucide-react";

import { SectionHeader } from "@/components/common/SectionHeader";
import { StarRating } from "@/components/common/StarRating";

const TESTIMONIALS = [
  {
    name: "Ayesha K.",
    location: "Lahore",
    rating: 5,
    text: "Fast delivery and the books were perfectly packaged. Bookshelf.pk has become my go-to for all my reading.",
  },
  {
    name: "Bilal R.",
    location: "Karachi",
    rating: 5,
    text: "I printed my thesis through their POD service — excellent quality and very affordable. Highly recommended!",
  },
  {
    name: "Fatima S.",
    location: "Islamabad",
    rating: 4,
    text: "Great selection of business and self-help titles. The prices are better than anywhere else I've checked.",
  },
];

export function Testimonials() {
  return (
    <section className="container-bs py-14">
      <SectionHeader
        title="What Our Readers Say"
        subtitle="Trusted by thousands across Pakistan"
        align="center"
      />
      <div className="grid gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <div key={t.name} className="card-bs flex flex-col gap-4 p-6">
            <Quote size={28} className="text-secondary" />
            <p className="text-text-secondary">{t.text}</p>
            <StarRating rating={t.rating} size={16} />
            <div>
              <p className="font-medium text-text-primary">{t.name}</p>
              <p className="text-sm text-text-muted">{t.location}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
