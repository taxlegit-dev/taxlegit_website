import AboutCompanyHero from "@/components/pages/about/aboutHero";
import RunningLogoCarousel from "@/components/pages/common/RunningLogoCarousel";
import MissionVisionValues from "@/components/pages/about/MissionStatement";
import Ceo from "@/components/pages/about/ceo";
import RecentBlogsSection from "@/components/pages/home/RecentBlogsSection";
import WhyChooseTaxlegit from "@/components/pages/home/WhyTaxlegit";
import Footer from "@/components/footer";
import AboutUsSection from "@/components/pages/about/AboutTaxlegit";
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="pt-[72px]">
        <AboutCompanyHero />
        <AboutUsSection />
        <RunningLogoCarousel />
        <MissionVisionValues />
        <Ceo />
        <WhyChooseTaxlegit />
        <RecentBlogsSection />
        <Footer />
      </div>
    </div>
  );
}
