import { SectionHeader } from "@/components/common/SectionHeader";
import { StarRating } from "@/components/common/StarRating";
import { getInitials } from "@/lib/utils";

const TESTIMONIALS = [
  {
    name: "Ayesha Khan",
    city: "Karachi",
    rating: 5,
    text: "Fast delivery and the books were perfectly packaged. Bookshelf.pk has become my go-to for all my reading needs.",
  },
  {
    name: "Bilal Ahmed",
    city: "Lahore",
    rating: 5,
    text: "I used the POD service to print my thesis. The quality was outstanding and the price was very reasonable.",
  },
  {
    name: "Fatima Riaz",
    city: "Islamabad",
    rating: 4,
    text: "Great selection of business and self-help books. The discounts make it even better. Highly recommended!",
  },
];

export function Testimonials() {
  return (
    <section className="section-alt">
      <div className="container-bs py-14">
        <SectionHeader
          title="What Our Readers Say"
          subtitle="Trusted by thousands of readers across Pakistan"
          align="center"
        />
        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <div key={item.name} className="card flex flex-col p-6">
              <StarRating rating={item.rating} />
              <p className="mt-4 flex-1 text-text-secondary">&ldquo;{item.text}&rdquo;</p>
              <div className="mt-5 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-sm font-semibold text-surface">
                  {getInitials(item.name)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{item.name}</p>
                  <p className="text-xs text-text-muted">{item.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
