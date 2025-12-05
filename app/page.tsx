import { Region } from "@prisma/client";
import { NavbarServer } from "@/components/navigation/navbar-server";
import Footer from "@/components/footer";
import TaxLegitHero from "@/components/pages/home/hero";
import ServicesSection from "@/components/pages/home/serviceSection";
import HowWeWorkSection from "@/components/pages/home/HowWeWorkSection";
import ReadyToGetStarted from "@/components/pages/home/ReadyStarted";
import WhyChooseTaxLegitMinimal from "@/components/pages/home/WhyTaxlegit";

export default async function IndiaHomePage() {
  const region = Region.INDIA;

  return (
    <div className="min-h-screen bg-white text-black">
      <NavbarServer region={region} />
      <div>
        {/* <IndiaHeroSection /> */}
        <TaxLegitHero />
        <ServicesSection />
        <HowWeWorkSection />
        <WhyChooseTaxLegitMinimal />

        <ReadyToGetStarted />
      </div>

      <Footer />
    </div>
  );
}
