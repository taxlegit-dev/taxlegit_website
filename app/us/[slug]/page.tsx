import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Region } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { NavbarServer } from "@/components/navigation/navbar-server";
import { UsHero } from "@/components/hero/us-hero";
import { ServicePageView } from "@/components/service-page/service-page-view";

type DynamicPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: DynamicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const region = Region.US;

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
    title: `${navbarItem.label} | Taxlegit US`,
    description: `Learn more about ${navbarItem.label} services at Taxlegit US`,
  };
}

export default async function UsDynamicPage({ params }: DynamicPageProps) {
  const { slug } = await params;
  const region = Region.US;

  // Find navbar item by href (slug should match href without leading slash and /us prefix)
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

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <NavbarServer region={region} />
      <main>
        {hero && hero.status === "PUBLISHED" && <UsHero hero={hero} />}
        {servicePage && servicePage.status === "PUBLISHED" && servicePage.sections.length > 0 ? (
          <ServicePageView sections={servicePage.sections} region="US" />
        ) : !hero ? (
          <section className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-12">
            <div className="rounded-3xl border border-white/10 bg-slate-900 p-10 shadow-2xl">
              <div className="space-y-5">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">United States</p>
                <h1 className="text-4xl font-semibold leading-tight">{navbarItem.label}</h1>
                <div className="max-w-2xl text-slate-200">
                  <p className="text-lg">
                    This is a dynamic page for <strong>{navbarItem.label}</strong>. Create a hero section or service page in admin panel to customize this page.
                  </p>
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </main>
      <footer className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-8 text-sm text-slate-400">
          <p>© {new Date().getFullYear()} Taxlegit. US Region</p>
          <p>Admin controlled content</p>
        </div>
      </footer>
    </div>
  );
}

