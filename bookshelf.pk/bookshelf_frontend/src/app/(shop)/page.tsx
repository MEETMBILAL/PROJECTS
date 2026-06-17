import { BestSellers } from "@/components/home/BestSellers";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedBooks } from "@/components/home/FeaturedBooks";
import { HeroBanner } from "@/components/home/HeroBanner";
import { Newsletter } from "@/components/home/Newsletter";
import { NewArrivals } from "@/components/home/NewArrivals";
import { PODPromo } from "@/components/home/PODPromo";
import { Testimonials } from "@/components/home/Testimonials";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <CategoryGrid />
      <FeaturedBooks />
      <NewArrivals />
      <BestSellers />
      <PODPromo />
      <Testimonials />
      <Newsletter />
    </>
  );
}
