import { Hero } from "@/components/marketing/hero";
import { Features } from "@/components/marketing/features";
import { Downloads } from "@/components/marketing/downloads";
import { Pricing } from "@/components/marketing/pricing";
import { Testimonials } from "@/components/marketing/testimonials";
import { FAQ } from "@/components/marketing/faq";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <Downloads />
      <Testimonials />
      <Pricing />
      <FAQ />
    </>
  );
}
