import AboutHeroSection from "@/components/pages/about/HeroSection";
import OurServicesSection from "@/components/pages/about/OurServiceSection";
import WhyChooseUs from "@/components/pages/about/WhyChooseUs";
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

