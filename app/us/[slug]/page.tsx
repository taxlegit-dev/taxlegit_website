import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { Region } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { UsHero } from "@/components/ServiceHeroSection/us-hero";
import { ServicePageView } from "@/components/service-page/service-page-view";
import { GenericPageView } from "@/components/generic-page/generic-page-view";
import { FAQSection } from "@/components/faq/faq-section";
import { MetaDataRenderer } from "@/components/seo/meta-data-renderer";
import { parseMetaBlockForMetadata } from "@/lib/seo-utils";
import Footer from "@/components/footer";

const normalizeSlug = (value: string) => value.replace(/^\/+/, "");

type DynamicPageProps = {
  params: Promise<{ slug: string }>;
};

const getNavbarItemBySlug = unstable_cache(
  async (slug: string, region: Region) =>
    prisma.navbarItem.findFirst({
      where: {
        region,
        href: `/${normalizeSlug(slug)}`,
        isActive: true,
      },
    }),
  ["navbar-item-by-slug"],
  { revalidate: 300 }
);

const getHeroByNavbarItemId = unstable_cache(
  async (navbarItemId: string) =>
    prisma.pageHero.findUnique({
      where: { navbarItemId },
    }),
  ["page-hero-by-navbar-item"],
  { revalidate: 300 }
);

const getServicePageByNavbarItemId = unstable_cache(
  async (navbarItemId: string) =>
    prisma.servicePage.findUnique({
      where: { navbarItemId },
      include: {
        sections: {
          orderBy: { order: "asc" },
        },
      },
    }),
  ["service-page-by-navbar-item"],
  { revalidate: 300 }
);

const getServicePageMetaByNavbarItemId = unstable_cache(
  async (navbarItemId: string) =>
    prisma.servicePage.findUnique({
      where: { navbarItemId },
      select: { id: true },
    }),
  ["service-page-meta-by-navbar-item"],
  { revalidate: 300 }
);

const getGenericPageByNavbarItemId = unstable_cache(
  async (navbarItemId: string, region: Region) =>
    prisma.genericPage.findFirst({
      where: {
        navbarItemId,
        region,
      },
    }),
  ["generic-page-by-navbar-item"],
  { revalidate: 300 }
);

const getFaqByNavbarItemId = unstable_cache(
  async (navbarItemId: string) =>
    prisma.servicePageFAQ.findUnique({
      where: { navbarItemId },
      include: {
        questions: {
          orderBy: { order: "asc" },
        },
      },
    }),
  ["service-page-faq-by-navbar-item"],
  { revalidate: 300 }
);

const getMetaDataByPage = unstable_cache(
  async (pageType: "SERVICE" | "BLOG" | "GENERIC", pageId: string) =>
    prisma.metaData.findUnique({
      where: {
        pageType_pageId: {
          pageType,
          pageId,
        },
      },
    }),
  ["meta-data-by-page"],
  { revalidate: 300 }
);

export async function generateMetadata({
  params,
}: DynamicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const region = Region.US;

  const navbarItem = await getNavbarItemBySlug(slug, region);

  if (!navbarItem) {
    return {
      title: "Page Not Found",
    };
  }

  const [servicePage, genericPage] = await Promise.all([
    getServicePageMetaByNavbarItemId(navbarItem.id),
    getGenericPageByNavbarItemId(navbarItem.id, region),
  ]);

  // Try to fetch meta data for hero or service page
  // Try to fetch meta data ONLY for service page
  let metaData = null;

  if (servicePage) {
    metaData = await getMetaDataByPage("SERVICE", servicePage.id);
  } else if (genericPage) {
    metaData = await getMetaDataByPage("GENERIC", genericPage.id);
  }

  // Build base URL
  const baseUrl = "https://taxlegit.com";
  const pageUrl = `${baseUrl}/us/${slug}`;
  const defaultTitle = `${navbarItem.label} | Taxlegit US`;
  const defaultDescription = `Learn more about ${navbarItem.label} services at Taxlegit US`;

  // If custom meta data exists, parse it
  if (metaData?.metaBlock) {
    const parsedMeta = parseMetaBlockForMetadata(metaData.metaBlock);
    return {
      ...parsedMeta,
      // Fallback to defaults if not in meta block
      title: parsedMeta.title || defaultTitle,
      description: parsedMeta.description || defaultDescription,
      robots: parsedMeta.robots || "index, follow",
      alternates: {
        ...parsedMeta.alternates,
        canonical: parsedMeta.alternates?.canonical || pageUrl,
      },
      openGraph: {
        ...parsedMeta.openGraph,
        title: parsedMeta.openGraph?.title || defaultTitle,
        description: parsedMeta.openGraph?.description || defaultDescription,
        type: "website",
        url: parsedMeta.openGraph?.url || pageUrl,
      },
      twitter: {
        ...parsedMeta.twitter,

        card: "summary",
        title: parsedMeta.twitter?.title || defaultTitle,
        description: parsedMeta.twitter?.description || defaultDescription,
      },
    };
  }

  // Default metadata with all required tags
  return {
    title: defaultTitle,
    description: defaultDescription,
    robots: "index, follow",
    alternates: {
      canonical: pageUrl,
    },
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

export default async function UsDynamicPage({ params }: DynamicPageProps) {
  const { slug } = await params;
  const region = Region.US;

  // Find navbar item by href (slug should match href without leading slash and /us prefix)
  const navbarItem = await getNavbarItemBySlug(slug, region);

  // If navbar item doesn't exist, return 404
  if (!navbarItem) {
    notFound();
  }

  // Fetch hero content if exists
  const [hero, servicePage, genericPage, faq] = await Promise.all([
    getHeroByNavbarItemId(navbarItem.id),
    getServicePageByNavbarItemId(navbarItem.id),
    getGenericPageByNavbarItemId(navbarItem.id, region),
    getFaqByNavbarItemId(navbarItem.id),
  ]);

  // Determine which meta data to render
  let metaPageType: "SERVICE" | "GENERIC" | null = null;
  let metaPageId: string | null = null;

  if (servicePage) {
    metaPageType = "SERVICE";
    metaPageId = servicePage.id;
  } else if (genericPage) {
    metaPageType = "GENERIC";
    metaPageId = genericPage.id;
  }

  const metaData =
    metaPageType && metaPageId
      ? await getMetaDataByPage(metaPageType, metaPageId)
      : null;

  return (
    <>
      {/* Render meta tags server-side */}
      {metaPageType && metaPageId && (
        <MetaDataRenderer
          pageType={metaPageType}
          pageId={metaPageId}
          metaBlock={metaData?.metaBlock}
        />
      )}
        <div className="min-h-screen bg-slate-950 text-white">
          <main>
          {hero && hero.status === "PUBLISHED" && <UsHero hero={hero} />}
          {servicePage &&
          servicePage.status === "PUBLISHED" &&
          servicePage.sections.length > 0 ? (
            // <ServicePageView sections={servicePage.sections} region="US" />
            <ServicePageView sections={servicePage.sections} />
          ) : genericPage && genericPage.status === "PUBLISHED" ? (
            <GenericPageView genericPage={genericPage} />
          ) : !hero ? (
            <section className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-12">
              <div className="rounded-3xl border border-white/10 bg-slate-900 p-10 shadow-2xl">
                <div className="space-y-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">
                    United States
                  </p>
                  <h1 className="text-4xl font-semibold leading-tight">
                    {navbarItem.label}
                  </h1>
                  <div className="max-w-2xl text-slate-200">
                    <p className="text-lg">
                      This is a dynamic page for{" "}
                      <strong>{navbarItem.label}</strong>. Create a hero section,
                      service page, or generic page in admin panel to customize this page.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          ) : null}
          {faq && faq.status === "PUBLISHED" && faq.questions.length > 0 && (
            <FAQSection questions={faq.questions} region="US" />
          )}
        </main>
        <Footer></Footer>
      </div>
    </>
  );
}
