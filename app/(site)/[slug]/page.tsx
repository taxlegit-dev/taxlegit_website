import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { Region } from "@prisma/client";
import { prisma } from "@/lib/prisma";

import { IndiaHero } from "@/components/ServiceHeroSection/india-hero";
import { ServicePageView } from "@/components/service-page/service-page-view";
import { FAQSection } from "@/components/faq/faq-section";
import Footer from "@/components/footer";
import { MetaDataRenderer } from "@/components/seo/meta-data-renderer";
import { parseMetaBlockForMetadata } from "@/lib/seo-utils";

type DynamicPageProps = {
  params: Promise<{ slug: string }>;
};

/* ----------------------------------------
   PURE FUNCTION CACHE (SEO PARSING)
---------------------------------------- */
const parseMetaCached = cache(parseMetaBlockForMetadata);

/* ----------------------------------------
   SINGLE BUNDLED DATA LOADER (CRITICAL)
---------------------------------------- */
const getServicePageBundle = async (
  slug: string,
  region: Region
) => {
  const cachedFn = unstable_cache(
    async () => {
      const navbarItem = await prisma.navbarItem.findFirst({
        where: {
          region,
          href: `/${slug}`,
          isActive: true,
        },
        include: {
          parent: true,
        },
      });

      if (!navbarItem) return null;

      const [hero, servicePage, faq] = await Promise.all([
        prisma.pageHero.findUnique({
          where: { navbarItemId: navbarItem.id },
        }),
        prisma.servicePage.findUnique({
          where: { navbarItemId: navbarItem.id },
          include: {
            sections: { orderBy: { order: "asc" } },
          },
        }),
        prisma.servicePageFAQ.findUnique({
          where: { navbarItemId: navbarItem.id },
          include: {
            questions: { orderBy: { order: "asc" } },
          },
        }),
      ]);

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

      return {
        navbarItem,
        hero,
        servicePage,
        faq,
        metaData,
      };
    },
    [
      "service-page-bundle",
      slug,
      region,
    ],
    { revalidate: 600 }
  );

  return cachedFn();
};


/* ----------------------------------------
   SEO METADATA (NO DUPLICATE QUERIES)
---------------------------------------- */
export async function generateMetadata({
  params,
}: DynamicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const region = Region.INDIA;

  const data = await getServicePageBundle(slug, region);

  if (!data) {
    return { title: "Page Not Found" };
  }

  const { navbarItem, metaData } = data;

  const baseUrl = "https://taxlegit.com";
  const pageUrl = `${baseUrl}/${slug}`;
  const defaultTitle = `${navbarItem.label} | Taxlegit`;
  const defaultDescription = `Learn more about ${navbarItem.label} services at Taxlegit`;

  if (metaData?.metaBlock) {
    const parsed = parseMetaCached(metaData.metaBlock);

    return {
      ...parsed,
      title: parsed.title || defaultTitle,
      description: parsed.description || defaultDescription,
      robots: parsed.robots || "index, follow",
      alternates: {
        canonical: parsed.alternates?.canonical || pageUrl,
      },
      openGraph: {
        ...(parsed.openGraph || {}),
        title: parsed.openGraph?.title || defaultTitle,
        description:
          parsed.openGraph?.description || defaultDescription,
        type: "website",
        url: parsed.openGraph?.url || pageUrl,
      },
      twitter: {
        ...(parsed.twitter || {}),
        card: "summary",
        title: parsed.twitter?.title || defaultTitle,
        description:
          parsed.twitter?.description || defaultDescription,
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

/* ----------------------------------------
   PAGE RENDER
---------------------------------------- */
export default async function DynamicPage({
  params,
}: DynamicPageProps) {
  const { slug } = await params;
  const region = Region.INDIA;

  const data = await getServicePageBundle(slug, region);

  if (!data) notFound();

  const { navbarItem, hero, servicePage, faq, metaData } =
    data;

  return (
    <>
      {metaData && servicePage && (
        <MetaDataRenderer
          pageType="SERVICE"
          pageId={servicePage.id}
          metaBlock={metaData.metaBlock}
        />
      )}

      <div className="min-h-screen bg-white text-black">
        <main className="pt-[72px]">
          {hero?.status === "PUBLISHED" && (
            <IndiaHero
              hero={hero}
              breadcrumbParent={
                navbarItem.parent?.label ||
                navbarItem.groupLabel ||
                "Services"
              }
              breadcrumbCurrent={navbarItem.label}
            />
          )}

          {servicePage?.status === "PUBLISHED" &&
          servicePage.sections.length > 0 ? (
            <ServicePageView
              sections={servicePage.sections}
            />
          ) : (
            <section className="mx-auto max-w-6xl px-6 py-12">
              <h1 className="text-4xl font-semibold">
                {navbarItem.label}
              </h1>
              <p className="mt-4 text-zinc-600">
                Content for this service is coming soon.
              </p>
            </section>
          )}

          {faq?.status === "PUBLISHED" &&
            faq.questions.length > 0 && (
              <FAQSection
                questions={faq.questions}
                region="INDIA"
              />
            )}
        </main>

        <Footer />
      </div>
    </>
  );
}
