
import Faqs from "@/shared/components/LandingPage/Faqs";
import { Hero} from "@/shared/components/LandingPage";
import BenefitsSection from "@/shared/components/LandingPage/BenefitsSection";
import RoleSelectorSection from "@/shared/components/LandingPage/RoleSelectorSection";
import TestimonialsSection from "@/shared/components/LandingPage/TestimonialsSection";
import StatsSection from "@/shared/components/LandingPage/StatsSection";
import PricingSection from "@/shared/components/LandingPage/PricingSection";
import CTASection from "@/shared/components/LandingPage/CTASection";
import Footer from "@/shared/components/LandingPage/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white w-full">
      <Hero />

      <div className="w-full">

   
       <BenefitsSection />
       <RoleSelectorSection />
       <TestimonialsSection />
      <StatsSection />
        <PricingSection />
        <Faqs />
        <CTASection />
        <Footer />
      </div>
    </main>
  );
}
