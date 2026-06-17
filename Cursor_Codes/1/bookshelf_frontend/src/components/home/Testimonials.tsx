import { SectionHeader } from "@/components/common/SectionHeader";
import { StarRating } from "@/components/common/StarRating";
import { getInitials } from "@/lib/utils";

const TESTIMONIALS = [
  {
    name: "Ayesha Khan",
    role: "Student, Lahore",
    rating: 5,
    text: "Fast delivery and the books were perfectly packed. The academic titles I needed were all in stock. Highly recommended!",
  },
  {
    name: "Bilal Ahmed",
    role: "Entrepreneur, Karachi",
    rating: 5,
    text: "I printed my startup's handbook using their POD service. The quality was outstanding and the pricing was fair.",
  },
  {
    name: "Sana Malik",
    role: "Avid Reader, Islamabad",
    rating: 4,
    text: "Great selection of self-help and business books. The wishlist feature keeps me coming back. Love the clean experience.",
  },
];

export function Testimonials() {
  return (
    <section className="bg-surface-alt py-14">
      <div className="container-page">
        <SectionHeader
          title="What Our Readers Say"
          subtitle="Trusted by thousands of readers across Pakistan"
          align="center"
        />
        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="card flex flex-col gap-4 p-6">
              <StarRating value={t.rating} />
              <p className="flex-1 text-text-secondary">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-sm font-semibold text-surface">
                  {getInitials(t.name)}
                </span>
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {t.name}
                  </p>
                  <p className="text-xs text-text-muted">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
