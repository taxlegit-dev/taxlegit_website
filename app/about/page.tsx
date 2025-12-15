import { Region } from "@prisma/client";
import { NavbarServer } from "@/components/navigation/navbar-server";
import HeroSection from "@/components/pages/about/HeroSection";
import MissionStatement from "@/components/pages/about/MissionStatement";
import WhatWeDo from "@/components/pages/about/WhatWeDo";
import WhyChooseUs from "@/components/pages/about/WhyChooseUs";
import StatsSection from "@/components/pages/about/StatsSection";
import ValuesSection from "@/components/pages/about/ValuesSection";
import WhyChooseTaxlegit from "@/components/pages/home/WhyTaxlegit";
import AboutHeroSection from "@/components/pages/about/HeroSection";
import OurServicesSection from "@/components/pages/about/OurServiceSection";
import RecentBlogsSection from "@/components/pages/home/RecentBlogsSection";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">

      <div>
        <AboutHeroSection />
        <OurServicesSection />
        <WhyChooseUs />
        <RecentBlogsSection />
      </div>

    </div>
  );
}

