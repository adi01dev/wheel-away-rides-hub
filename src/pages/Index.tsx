
import BecomeHost from "@/components/home/BecomeHost";
import CarCategories from "@/components/home/CarCategories";
import FeaturedCars from "@/components/home/FeaturedCars";
import HeroBanner from "@/components/home/HeroBanner";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";

const Index = () => {
  return (
    <div>
      <HeroBanner />
      <FeaturedCars />
      <HowItWorks />
      <CarCategories />
      <BecomeHost />
      <Testimonials />
    </div>
  );
};

export default Index;
