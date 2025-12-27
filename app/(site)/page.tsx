import { Region } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import TaxLegitHero from "@/components/pages/home/hero";
import ServicesSection from "@/components/pages/home/serviceSection";
import HowWeWorkSection from "@/components/pages/home/HowWeWorkSection";
import WhyChooseTaxLegitMinimal from "@/components/pages/home/WhyTaxlegit";
import Testimonial from "@/components/pages/home/ReviewSlider";
import RecentBlogsSection from "@/components/pages/home/RecentBlogsSection";
import { FAQSection } from "@/components/faq/faq-section";
// import AboutUs from "@/components/pages/about/AboutTaxlegit";
import AnimatedFlowDiagram from "@/components/pages/home/AnimatedFlowDiagram";
import RunningLogoCarousel from "@/components/pages/common/RunningLogoCarousel";
import Footer from "@/components/footer";
import OurProduct from "@/components/pages/home/OurProduct";
import MediaMentions from "@/components/pages/home/MediaMentions";
export default async function IndiaHomePage() {
  const region = Region.INDIA;

  // FIX → Do NOT use null. Use a special navbarItemId for homepage FAQ.
  const faq = await prisma.servicePageFAQ.findFirst({
    where: {
      navbarItemId: "cmj8eku4d000puo1sqyhqldh2", // create this manually in DB
      region: region,
      status: "PUBLISHED",
    },
    include: {
      questions: {
        orderBy: { order: "asc" },
      },
    },
  });

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="mt-18">
        <TaxLegitHero />
        <AnimatedFlowDiagram />
        <RunningLogoCarousel />
        {/* <AboutUs /> */}
        <ServicesSection />
        <HowWeWorkSection />
        <OurProduct />
        <WhyChooseTaxLegitMinimal />
        <RecentBlogsSection />
        <MediaMentions />
        <Testimonial />

        {faq && faq.questions.length > 0 && (
          <FAQSection questions={faq.questions} region="INDIA" />
        )}
        <Footer />
      </div>
    </div>
  );
}
