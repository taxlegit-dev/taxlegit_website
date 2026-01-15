// NIkita code -------------------------------------------------------------
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cache } from "react";
import { unstable_cache, unstable_noStore } from "next/cache";
import { Region } from "@prisma/client";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";

import { IndiaHero } from "@/components/ServiceHeroSection/india-hero";
import { ServicePageView } from "@/components/service-page/service-page-view";
import { GenericPageView } from "@/components/generic-page/generic-page-view";
import { FAQSection } from "@/components/faq/faq-section";
import Footer from "@/components/footer";
import { MetaDataRenderer } from "@/components/seo/meta-data-renderer";
import { parseMetaBlockForMetadata } from "@/lib/seo-utils";
import { getRelatedBlogsCached } from "@/lib/query/related-blogs";
import { RelatedBlogsSection } from "@/components/related-blogs/RelatedBlogsSection";

/* -------------------------------------------------
   ISR
------------------------------------------------- */
export const revalidate = 86400;

/* -------------------------------------------------
   TYPES
------------------------------------------------- */
type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ preview?: string }>;
};

/* -------------------------------------------------
   META CACHE
------------------------------------------------- */
const parseMetaCached = cache(parseMetaBlockForMetadata);

const normalizeSlug = (value: string) => value.replace(/^\/+/, "");

/* -------------------------------------------------
   FAST SHELL (MIN DB)
------------------------------------------------- */
async function fetchPageShell(normalizedSlug: string, region: Region) {
  const navbarItem = await prisma.navbarItem.findFirst({
    where: {
      href: `/${normalizedSlug}`,
      region,
      isActive: true,
    },
    select: {
      id: true,
      label: true,
      groupLabel: true,
      parent: { select: { label: true } },
    },
  });

  if (!navbarItem) return null;

  const [servicePage, genericPage] = await Promise.all([
    prisma.servicePage.findUnique({
      where: { navbarItemId: navbarItem.id },
      select: { id: true, status: true },
    }),
    prisma.genericPage.findFirst({
      where: {
        navbarItemId: navbarItem.id,
        region,
      },
      select: { id: true, status: true, title: true, content: true },
    }),
  ]);

  if (!servicePage && !genericPage) return null;

  const metaData = await prisma.metaData.findUnique({
    where: {
      pageType_pageId: {
        pageType: servicePage ? "SERVICE" : "GENERIC",
        pageId: servicePage ? servicePage.id : genericPage!.id,
      },
    },
    select: { metaBlock: true },
  });

  return { navbarItem, servicePage, genericPage, metaData };
}

function getPageShellCached(slug: string, region: Region) {
  const normalizedSlug = normalizeSlug(slug);
  return unstable_cache(
    () => fetchPageShell(normalizedSlug, region),
    ["service-page-shell", region, normalizedSlug],
    { revalidate: 3600 }
  )();
}

async function fetchServiceContent(
  navbarItemId: string,
  servicePageId: string
) {
  const [hero, sections, faq] = await Promise.all([
    prisma.pageHero.findUnique({
      where: { navbarItemId },
    }),
    prisma.servicePageSection.findMany({
      where: { servicePageId },
      orderBy: { order: "asc" },
    }),
    prisma.servicePageFAQ.findUnique({
      where: { navbarItemId },
      include: {
        questions: {
          orderBy: { order: "asc" },
        },
      },
    }),
  ]);

  return { hero, sections, faq };
}

function getServiceContentCached(
  navbarItemId: string,
  servicePageId: string
) {
  return unstable_cache(
    () => fetchServiceContent(navbarItemId, servicePageId),
    ["service-page-content", navbarItemId, servicePageId],
    { revalidate: 3600 }
  )();
}

/* -------------------------------------------------
   SEO
------------------------------------------------- */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const shell = await getPageShellCached(slug, Region.INDIA);

  if (!shell) return { title: "Page Not Found" };

  const { navbarItem, metaData } = shell;

  const canonical = `https://taxlegit.com/${slug}`;
  const defaultTitle = `${navbarItem.label} | Taxlegit`;
  const defaultDescription = `Learn more about ${navbarItem.label} services at Taxlegit`;

  if (metaData?.metaBlock) {
    const parsed = parseMetaCached(metaData.metaBlock);
    return {
      ...parsed,
      title: parsed.title || defaultTitle,
      description: parsed.description || defaultDescription,
      alternates: { canonical },
    };
  }

  return {
    title: defaultTitle,
    description: defaultDescription,
    alternates: { canonical },
  };
}

/* -------------------------------------------------
   SKELETON
------------------------------------------------- */
function SectionSkeleton() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12 animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-5/6" />
    </section>
  );
}

/* -------------------------------------------------
   PAGE
------------------------------------------------- */
export default async function ServicePage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const isPreview = query?.preview === "1";
  if (isPreview) {
    unstable_noStore();
  }

  /* ---------- FAST SHELL ---------- */
  const normalizedSlug = normalizeSlug(slug);
  const shell = isPreview
    ? await fetchPageShell(normalizedSlug, Region.INDIA)
    : await getPageShellCached(slug, Region.INDIA);
  if (!shell) notFound();

  const { navbarItem, servicePage, genericPage, metaData } = shell;

  const serviceData = servicePage
    ? isPreview
      ? await fetchServiceContent(navbarItem.id, servicePage.id)
      : await getServiceContentCached(navbarItem.id, servicePage.id)
    : null;

  return (
    <>
      {metaData?.metaBlock && (
        <MetaDataRenderer
          pageType={servicePage ? "SERVICE" : "GENERIC"}
          pageId={servicePage ? servicePage.id : genericPage!.id}
          metaBlock={metaData.metaBlock}
        />
      )}

      <div className="min-h-screen bg-white text-black">
        <main className="pt-[89px]">
          {servicePage && serviceData ? (
            <>
              {/* HERO */}
              {serviceData.hero?.status === "PUBLISHED" && (
                <IndiaHero
                  hero={serviceData.hero}
                  breadcrumbParent={
                    navbarItem.parent?.label ||
                    navbarItem.groupLabel ||
                    "Services"
                  }
                  breadcrumbCurrent={navbarItem.label}
                />
              )}

              {/* SERVICE CONTENT */}
              <Suspense fallback={<SectionSkeleton />}>
                {servicePage.status === "PUBLISHED" &&
                  serviceData.sections?.length > 0 && (
                    <ServicePageView sections={serviceData.sections} />
                  )}
              </Suspense>

              {/* FAQ */}
              <Suspense fallback={<SectionSkeleton />}>
                {serviceData.faq?.status === "PUBLISHED" &&
                  serviceData.faq.questions?.length > 0 && (
                    <FAQSection
                      questions={serviceData.faq.questions}
                      region="INDIA"
                    />
                  )}
              </Suspense>

              {/* RELATED BLOGS */}
              <Suspense fallback={null}>
                <RelatedBlogsSection
                  blogs={await getRelatedBlogsCached(
                    navbarItem.label,
                    Region.INDIA
                  )}
                />
              </Suspense>
            </>
          ) : genericPage && genericPage.status === "PUBLISHED" ? (
            <GenericPageView genericPage={genericPage} />
          ) : (
            <section className="mx-auto max-w-6xl px-6 py-12">
              <h1 className="text-4xl font-semibold">{navbarItem.label}</h1>
              <p className="mt-4 text-zinc-600">
                Content for this page is coming soon.
              </p>
            </section>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
