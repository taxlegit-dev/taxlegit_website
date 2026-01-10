import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { Region } from "@prisma/client";
import { prisma } from "@/lib/prisma";

import { IndiaHero } from "@/components/ServiceHeroSection/india-hero";
import { ServicePageView } from "@/components/service-page/service-page-view";
import { FAQSection } from "@/components/faq/faq-section";
import Footer from "@/components/footer";
import { MetaDataRenderer } from "@/components/seo/meta-data-renderer";
import { parseMetaBlockForMetadata } from "@/lib/seo-utils";
import { getServiceContentCached } from "@/lib/service-cache";
import { getRelatedBlogsCached } from "@/lib/query/related-blogs";
import { RelatedBlogsSection } from "@/components/related-blogs/RelatedBlogsSection";


/* -------------------------------------------------
   ✅ ISR — HTML cached at CDN
------------------------------------------------- */
export const revalidate = 86400;

/* -------------------------------------------------
   TYPES (Next.js 16 SAFE)
------------------------------------------------- */
type PageProps = {
  params: Promise<{ slug: string }>;
};

/* -------------------------------------------------
   PURE FUNCTION CACHE
------------------------------------------------- */
const parseMetaCached = cache(parseMetaBlockForMetadata);

/* -------------------------------------------------
   SMALL DB CACHE (IDs + SEO only)
------------------------------------------------- */
function getServiceShellCached(slug: string, region: Region) {
  return unstable_cache(
    async () => {
      const navbarItem = await prisma.navbarItem.findFirst({
        where: {
          href: `/${slug}`,
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

      const servicePage = await prisma.servicePage.findUnique({
        where: { navbarItemId: navbarItem.id },
        select: { id: true, status: true },
      });

      const metaData = servicePage
        ? await prisma.metaData.findUnique({
            where: {
              pageType_pageId: {
                pageType: "SERVICE",
                pageId: servicePage.id,
              },
            },
            select: { metaBlock: true },
          })
        : null;

      return { navbarItem, servicePage, metaData };
    },
    ["service-shell", region, slug],
    { revalidate: 86400 }
  )();
}

/* -------------------------------------------------
   SEO METADATA (FAST + SAFE)
------------------------------------------------- */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const shell = await getServiceShellCached(slug, Region.INDIA);
  if (!shell) return { title: "Page Not Found" };

  const { navbarItem, metaData } = shell;

  const pageUrl = `https://taxlegit.com/${slug}`;
  const defaultTitle = `${navbarItem.label} | Taxlegit`;
  const defaultDescription = `Learn more about ${navbarItem.label} services at Taxlegit`;

  if (metaData?.metaBlock) {
    const parsed = parseMetaCached(metaData.metaBlock);
    return {
      ...parsed,
      title: parsed.title || defaultTitle,
      description: parsed.description || defaultDescription,
      alternates: { canonical: pageUrl },
    };
  }

  return {
    title: defaultTitle,
    description: defaultDescription,
    alternates: { canonical: pageUrl },
  };
}

/* -------------------------------------------------
   PAGE RENDER
------------------------------------------------- */
export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;

  /* ---------- small cached fetch ---------- */
  const shell = await getServiceShellCached(slug, Region.INDIA);
  if (!shell) notFound();

  const { navbarItem, servicePage, metaData } = shell;
  if (!servicePage) notFound();

  /* ---------- Redis cached heavy content ---------- */
  const { hero, sections, faq } = await getServiceContentCached(
    navbarItem.id,
    servicePage.id
  );
  const relatedBlogs = await getRelatedBlogsCached(
  navbarItem.label,
  Region.INDIA
);
console.log(relatedBlogs);


  return (
    <>
      {metaData && (
        <MetaDataRenderer
          pageType="SERVICE"
          pageId={servicePage.id}
          metaBlock={metaData.metaBlock}
        />
      )}

      <div className="min-h-screen bg-white text-black">
        <main className="pt-[89px]">
          {hero?.status === "PUBLISHED" && (
            <IndiaHero
              hero={hero}
              breadcrumbParent={
                navbarItem.parent?.label || navbarItem.groupLabel || "Services"
              }
              breadcrumbCurrent={navbarItem.label}
            />
          )}

          {servicePage.status === "PUBLISHED" && sections.length > 0 ? (
            <ServicePageView sections={sections} />
          ) : (
            <section className="mx-auto max-w-6xl px-6 py-12">
              <h1 className="text-4xl font-semibold">{navbarItem.label}</h1>
              <p className="mt-4 text-zinc-600">
                Content for this service is coming soon.
              </p>
            </section>
          )}

          <RelatedBlogsSection blogs={relatedBlogs} />

          {faq?.status === "PUBLISHED" && faq?.questions?.length > 0 && (
            <FAQSection questions={faq.questions} region="INDIA" />
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
