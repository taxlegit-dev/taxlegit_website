import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Region } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { NavbarServer } from "@/components/navigation/navbar-server";
import { IndiaHero } from "@/components/ServiceHeroSection/india-hero";
import { ServicePageView } from "@/components/service-page/service-page-view";
import { FAQSection } from "@/components/faq/faq-section";
import Footer from "@/components/footer";
type DynamicPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: DynamicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const region = Region.INDIA;

  const navbarItem = await prisma.navbarItem.findFirst({
    where: {
      region,
      href: `/${slug}`,
      isActive: true,
    },
  });

  if (!navbarItem) {
    return {
      title: "Page Not Found",
    };
  }

  return {
    title: `${navbarItem.label} | Taxlegit`,
    description: `Learn more about ${navbarItem.label} services at Taxlegit`,
  };
}

export default async function DynamicPage({ params }: DynamicPageProps) {
  const { slug } = await params;
  const region = Region.INDIA;

  // Find navbar item by href (slug should match href without leading slash)
  const navbarItem = await prisma.navbarItem.findFirst({
    where: {
      region,
      href: `/${slug}`,
      isActive: true,
    },
  });

  // If navbar item doesn't exist, return 404
  if (!navbarItem) {
    notFound();
  }

  // Fetch hero content if exists
  const hero = await prisma.pageHero.findUnique({
    where: { navbarItemId: navbarItem.id },
  });

  // Fetch service page if exists
  const servicePage = await prisma.servicePage.findUnique({
    where: { navbarItemId: navbarItem.id },
    include: {
      sections: {
        orderBy: { order: "asc" },
      },
    },
  });

  // Fetch FAQ if exists
  const faq = await prisma.servicePageFAQ.findUnique({
    where: { navbarItemId: navbarItem.id },
    include: {
      questions: {
        orderBy: { order: "asc" },
      },
    },
  });

  return (
    <div className="min-h-screen bg-white text-black">
      <NavbarServer region={region} />
      <main>
        {hero && hero.status === "PUBLISHED" && <IndiaHero hero={hero} />}
        {servicePage &&
        servicePage.status === "PUBLISHED" &&
        servicePage.sections.length > 0 ? (
          <ServicePageView sections={servicePage.sections} />
        ) : // <ServicePageView sections={servicePage.sections} region="INDIA" />
        !hero ? (
          <section className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-12">
            <div className="rounded-3xl border border-zinc-100 bg-gradient-to-br from-indigo-50 via-white to-slate-50 p-10 shadow-sm">
              <div className="space-y-6">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-indigo-600">
                  India Region
                </p>
                <h1 className="text-4xl font-semibold leading-tight text-zinc-900">
                  {navbarItem.label}
                </h1>
                <div className="max-w-2xl">
                  <p className="text-lg text-zinc-600">
                    This is a dynamic page for{" "}
                    <strong>{navbarItem.label}</strong>. Create a hero section
                    or service page in admin panel to customize this page.
                  </p>
                </div>
              </div>
            </div>
          </section>
        ) : null}
        {faq && faq.status === "PUBLISHED" && faq.questions.length > 0 && (
          <FAQSection questions={faq.questions} region="INDIA" />
        )}
      </main>
      <Footer></Footer>
    </div>
  );
}
