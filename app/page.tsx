import { Region } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { NavbarServer } from "@/components/navigation/navbar-server";
import Footer from "@/components/footer";
import TaxLegitHero from "@/components/pages/home/hero";
import ServicesSection from "@/components/pages/home/serviceSection";
import HowWeWorkSection from "@/components/pages/home/HowWeWorkSection";
import WhyChooseTaxLegitMinimal from "@/components/pages/home/WhyTaxlegit";
import Testimonial from "@/components/pages/home/ReviewSlider";
import RecentBlogsSection from "@/components/pages/home/RecentBlogsSection";
import { FAQSection } from "@/components/faq/faq-section";

export default async function IndiaHomePage() {
  const region = Region.INDIA;

  // FIX → Do NOT use null. Use a special navbarItemId for homepage FAQ.
  const faq = await prisma.servicePageFAQ.findFirst({
    where: {
      navbarItemId: "cmiyhgn0f0000uoyglukgbinw", // create this manually in DB
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

      <div>
        <TaxLegitHero />
        <ServicesSection />
        <HowWeWorkSection />
        <WhyChooseTaxLegitMinimal />
        <RecentBlogsSection />
        <Testimonial />

        {faq && faq.questions.length > 0 && (
          <FAQSection questions={faq.questions} region="INDIA" />
        )}
      </div>

    </div>
  );
}
