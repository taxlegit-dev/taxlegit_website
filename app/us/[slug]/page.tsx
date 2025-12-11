import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Region } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { NavbarServer } from "@/components/navigation/navbar-server";
import { UsHero } from "@/components/ServiceHeroSection/us-hero";
import { ServicePageView } from "@/components/service-page/service-page-view";
import { FAQSection } from "@/components/faq/faq-section";
import { MetaDataRenderer } from "@/components/seo/meta-data-renderer";
import { parseMetaBlockForMetadata } from "@/lib/seo-utils";

type DynamicPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: DynamicPageProps): Promise<Metadata> {
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

  // Check for custom meta data
  const hero = await prisma.pageHero.findUnique({
    where: { navbarItemId: navbarItem.id },
  });

  const servicePage = await prisma.servicePage.findUnique({
    where: { navbarItemId: navbarItem.id },
  });

  // Try to fetch meta data for hero or service page
  let metaData = null;
  if (hero) {
    metaData = await prisma.metaData.findUnique({
      where: {
        pageType_pageId: {
          pageType: "HERO",
          pageId: hero.id,
        },
      },
    });
  } else if (servicePage) {
    metaData = await prisma.metaData.findUnique({
      where: {
        pageType_pageId: {
          pageType: "SERVICE",
          pageId: servicePage.id,
        },
      },
    });
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
        ...(parsedMeta.openGraph || {}),
        title: parsedMeta.openGraph?.title || defaultTitle,
        description: parsedMeta.openGraph?.description || defaultDescription,
        type: (parsedMeta.openGraph?.type as "website" | "article" | undefined) || "website",
        url: parsedMeta.openGraph?.url || pageUrl,
      },
      twitter: {
        ...(parsedMeta.twitter || {}),
        card: (parsedMeta.twitter?.card as "summary" | "summary_large_image" | undefined) || "summary",
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

  // Determine which meta data to render
  let metaPageType: "SERVICE" | "HERO" | null = null;
  let metaPageId: string | null = null;

  if (hero) {
    metaPageType = "HERO";
    metaPageId = hero.id;
  } else if (servicePage) {
    metaPageType = "SERVICE";
    metaPageId = servicePage.id;
  }

  return (
    <>
      {/* Render meta tags server-side */}
      {metaPageType && metaPageId && (
        <MetaDataRenderer pageType={metaPageType} pageId={metaPageId} />
      )}
      <div className="min-h-screen bg-slate-950 text-white">
        <NavbarServer region={region} />
      <main>
        {hero && hero.status === "PUBLISHED" && <UsHero hero={hero} />}
        {servicePage &&
        servicePage.status === "PUBLISHED" &&
        servicePage.sections.length > 0 ? (
          // <ServicePageView sections={servicePage.sections} region="US" />
          <ServicePageView sections={servicePage.sections} />
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
                    <strong>{navbarItem.label}</strong>. Create a hero section
                    or service page in admin panel to customize this page.
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
      <footer className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-8 text-sm text-slate-400">
          <p>© {new Date().getFullYear()} Taxlegit. US Region</p>
          <p>Admin controlled content</p>
        </div>
      </footer>
      </div>
    </>
  );
}
