import { Region } from "@prisma/client";
// import WhyChooseUs from "@/components/pages/about/WhyChooseUs";
import OurServicesSection from "@/components/pages/about/OurServiceSection";
// import WhyChooseUs from "@/components/pages/about/WhyChooseUs";
import RecentBlogsSection from "@/components/pages/home/RecentBlogsSection";
import { NavbarServer } from "@/components/navigation/navbar-server";
import Footer from "@/components/footer";
import AboutUsSection from "@/components/pages/about/AboutTaxlegit";
export default function AboutPage() {
  const region = Region.INDIA;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <NavbarServer region={region} />
      <div className="pt-[72px]">
        <AboutUsSection />
        <OurServicesSection />
        {/* <WhyChooseUs /> */}
        <RecentBlogsSection />
        <Footer />
      </div>
    </div>
  );
}
