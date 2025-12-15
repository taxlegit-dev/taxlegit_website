import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Region } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { NavbarServer } from "@/components/navigation/navbar-server";
import { IndiaHero } from "@/components/ServiceHeroSection/india-hero";
import { ServicePageView } from "@/components/service-page/service-page-view";
import { FAQSection } from "@/components/faq/faq-section";
import Footer from "@/components/footer";
import { MetaDataRenderer } from "@/components/seo/meta-data-renderer";
import { parseMetaBlockForMetadata } from "@/lib/seo-utils";

type DynamicPageProps = {
  params: Promise<{ slug: string }>;
};

/* =========================
   SEO METADATA (SERVICE ONLY)
========================= */
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
    return { title: "Page Not Found" };
  }

  const servicePage = await prisma.servicePage.findUnique({
    where: { navbarItemId: navbarItem.id },
  });

  let metaData = null;

  if (servicePage) {
    metaData = await prisma.metaData.findUnique({
      where: {
        pageType_pageId: {
          pageType: "SERVICE",
          pageId: servicePage.id,
        },
      },
    });
  }

  const baseUrl = "https://taxlegit.com";
  const pageUrl = `${baseUrl}/${slug}`;
  const defaultTitle = `${navbarItem.label} | Taxlegit`;
  const defaultDescription = `Learn more about ${navbarItem.label} services at Taxlegit`;

  if (metaData?.metaBlock) {
    const parsedMeta = parseMetaBlockForMetadata(metaData.metaBlock);

    return {
      ...parsedMeta,
      title: parsedMeta.title || defaultTitle,
      description: parsedMeta.description || defaultDescription,
      robots: parsedMeta.robots || "index, follow",
      alternates: {
        ...parsedMeta.alternates,
        canonical: parsedMeta.alternates?.canonical || pageUrl,
      },
      openGraph: {
        ...(parsedMeta.openGraph || {}),
        title: parsedMeta.openGraph?.title || defaultTitle,
        description: parsedMeta.openGraph?.description || defaultDescription,
        type: "website",
        url: parsedMeta.openGraph?.url || pageUrl,
      },
      twitter: {
        ...(parsedMeta.twitter || {}),
        card: "summary",
        title: parsedMeta.twitter?.title || defaultTitle,
        description: parsedMeta.twitter?.description || defaultDescription,
      },
    };
  }

  return {
    title: defaultTitle,
    description: defaultDescription,
    robots: "index, follow",
    alternates: { canonical: pageUrl },
    openGraph: {
      title: defaultTitle,
      description: defaultDescription,
      type: "website",
      url: pageUrl,
    },
    twitter: {
      card: "summary",
      title: defaultTitle,
      description: defaultDescription,
    },
  };
}

/* =========================
   PAGE RENDER
========================= */
export default async function DynamicPage({ params }: DynamicPageProps) {
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
    notFound();
  }

  const hero = await prisma.pageHero.findUnique({
    where: { navbarItemId: navbarItem.id },
  });

  const servicePage = await prisma.servicePage.findUnique({
    where: { navbarItemId: navbarItem.id },
    include: {
      sections: { orderBy: { order: "asc" } },
    },
  });

  const faq = await prisma.servicePageFAQ.findUnique({
    where: { navbarItemId: navbarItem.id },
    include: {
      questions: { orderBy: { order: "asc" } },
    },
  });

  // ✅ SERVICE SEO ONLY
  let metaPageType: "SERVICE" | null = null;
  let metaPageId: string | null = null;

  if (servicePage) {
    metaPageType = "SERVICE";
    metaPageId = servicePage.id;
  }

  return (
    <>
      {metaPageType && metaPageId && (
        <MetaDataRenderer pageType={metaPageType} pageId={metaPageId} />
      )}

      <div className="min-h-screen bg-white text-black">
        <NavbarServer region={region} />

        <main>
          {hero && hero.status === "PUBLISHED" && <IndiaHero hero={hero} />}

          {servicePage &&
          servicePage.status === "PUBLISHED" &&
          servicePage.sections.length > 0 ? (
            <ServicePageView sections={servicePage.sections} />
          ) : !hero ? (
            <section className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-12">
              <div className="rounded-3xl border border-zinc-100 bg-gradient-to-br from-indigo-50 via-white to-slate-50 p-10 shadow-sm">
                <div className="space-y-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-indigo-600">
                    India Region
                  </p>
                  <h1 className="text-4xl font-semibold leading-tight text-zinc-900">
                    {navbarItem.label}
                  </h1>
                  <p className="max-w-2xl text-lg text-zinc-600">
                    This is a dynamic page for{" "}
                    <strong>{navbarItem.label}</strong>. Create a hero section
                    or service page in admin panel to customize this page.
                  </p>
                </div>
              </div>
            </section>
          ) : null}

          {faq && faq.status === "PUBLISHED" && faq.questions.length > 0 && (
            <FAQSection questions={faq.questions} region="INDIA" />
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
