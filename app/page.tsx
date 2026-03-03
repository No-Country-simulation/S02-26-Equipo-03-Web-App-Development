import Faqs from "@/shared/components/LandingPage/Faqs";
import {
  AttributionIssuesSection,
  Hero,
  IntegrationsSection,
  Navbar,
  SetupStepsSection,
  TrackingHealthSection,
} from "@/shared/components/LandingPage";
import BenefitsSection from "@/shared/components/LandingPage/BenefitsSection";
import RoleSelectorSection from "@/shared/components/LandingPage/RoleSelectorSection";
import TestimonialsSection from "@/shared/components/LandingPage/TestimonialsSection";
import StatsSection from "@/shared/components/LandingPage/StatsSection";
import PricingSection from "@/shared/components/LandingPage/PricingSection";
import CTASection from "@/shared/components/LandingPage/CTASection";
import Footer from "@/shared/components/LandingPage/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-screen w-full flex-col items-center justify-center bg-white">
        <Hero />
        <AttributionIssuesSection />
        <TrackingHealthSection />
        <IntegrationsSection />
        <SetupStepsSection />
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
    </>
  );
}
