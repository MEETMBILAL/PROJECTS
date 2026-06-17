import { HeroBanner } from "@/components/home/HeroBanner";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedBooks } from "@/components/home/FeaturedBooks";
import { NewArrivals } from "@/components/home/NewArrivals";
import { BestSellers } from "@/components/home/BestSellers";
import { PODPromo } from "@/components/home/PODPromo";
import { Testimonials } from "@/components/home/Testimonials";
import { Newsletter } from "@/components/home/Newsletter";

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
