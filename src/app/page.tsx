import HeroSection from "@/components/home/HeroSection";
import FeaturedListings from "@/components/home/FeaturedListings";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import StatsCounter from "@/components/home/StatsCounter";
import CallToAction from "@/components/home/CallToAction";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedListings />
      <WhyChooseUs />
      <StatsCounter />
      <CallToAction />
    </>
  );
}
