import Link from "next/link";
import { Region, PageKey } from "@prisma/client";
import { NavbarServer } from "@/components/navigation/navbar-server";
import { RichContent } from "@/components/rich-text/rich-content";
import { getBlogs, getStaticPage } from "@/lib/queries";
import type { RichTextDocument } from "@/types/rich-text";
import Footer from "@/components/footer";
import IndiaHeroSection from "@/components/pages/home/heroSection";
import TaxLegitHero from "@/components/pages/home/hero";
import ServicesSection from "@/components/pages/home/serviceSection";

export default async function IndiaHomePage() {
  const region = Region.INDIA;
  const [page, blogs] = await Promise.all([
    getStaticPage(region, PageKey.HOME),
    getBlogs(region),
  ]);
  const heroContent = page?.content as RichTextDocument | null;

  return (
    <div className="min-h-screen bg-white text-black">
      <NavbarServer region={region} />
      <div>

      {/* <IndiaHeroSection /> */}
      <TaxLegitHero />
      <ServicesSection />

      </div>

      <Footer />
      
    </div>
  );
}
