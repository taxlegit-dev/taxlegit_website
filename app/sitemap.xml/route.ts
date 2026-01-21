import { prisma } from "@/lib/prisma";
import { ContentStatus, NavbarPageType } from "@prisma/client";

export const revalidate = 86400; // 24 hours

export async function GET() {
  const baseUrl = "https://taxlegit.com";

  // ✅ Static pages
  const staticUrls = [
    `${baseUrl}`,
    `${baseUrl}/nameCheck`,
    `${baseUrl}/calculateQuote`,
    `${baseUrl}/contact-us`,
    `${baseUrl}/about-us`,
    `${baseUrl}/blogs`,
  ].map((url) => ({
    url,
    lastModified: new Date().toISOString(),
  }));

  // ✅ Published Navbar pages (SERVICE + GENERIC)
  const navbarItems = await prisma.navbarItem.findMany({
    where: {
      isActive: true,
      href: { not: null },
      OR: [
        {
          pageType: NavbarPageType.SERVICE,
          servicePages: {
            is: { status: ContentStatus.PUBLISHED },
          },
        },
        {
          pageType: NavbarPageType.GENERIC,
          genericPage: {
            is: { status: ContentStatus.PUBLISHED },
          },
        },
      ],
    },
    select: {
      href: true,
      updatedAt: true,
      servicePages: { select: { updatedAt: true } },
      genericPage: { select: { updatedAt: true } },
    },
  });

  const navbarUrls = navbarItems
    .filter((item) => item.href && item.href.startsWith("/")) // ✅ block external links
    .map((item) => ({
      url: `${baseUrl}${item.href!}`,
      lastModified: (
        item.servicePages?.updatedAt ||
        item.genericPage?.updatedAt ||
        item.updatedAt ||
        new Date()
      ).toISOString(),
    }));

  // ✅ Published Blogs
  const blogs = await prisma.blog.findMany({
    where: {
      status: ContentStatus.PUBLISHED,
      slug: { not: null },
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  const blogUrls = blogs
    .filter((b) => b.slug)
    .map((blog) => ({
      url: `${baseUrl}/blogs/${blog.slug}`,
      lastModified: (blog.updatedAt || new Date()).toISOString(),
    }));

  // ✅ Combine all
  const allUrls = [...staticUrls, ...navbarUrls, ...blogUrls];

  // ✅ Remove duplicates
  const unique = Array.from(new Map(allUrls.map((u) => [u.url, u])).values());

  // ✅ XML generation with changefreq + priority
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${unique
  .map((u) => {
    let priority = "0.5"; // default
    let changefreq = "monthly"; // default

    // ✅ Homepage
    if (u.url === baseUrl) {
      priority = "1.0";
      changefreq = "weekly";
    }

    // ✅ Blogs listing page
    else if (u.url === `${baseUrl}/blogs`) {
      priority = "0.6";
      changefreq = "weekly";
    }

    // ✅ Individual blog pages
    else if (u.url.startsWith(`${baseUrl}/blogs/`)) {
      priority = "0.6";
      changefreq = "weekly";
    }

    // ✅ Utility pages
    else if (
      u.url === `${baseUrl}/contact-us` ||
      u.url === `${baseUrl}/about`
    ) {
      priority = "0.5";
      changefreq = "yearly";
    } else if (
      u.url === `${baseUrl}/nameCheck` ||
      u.url === `${baseUrl}/calculateQuote`
    ) {
      priority = "0.4";
      changefreq = "monthly";
    }

    // ✅ All other service / business pages
    else {
      priority = "0.8";
      changefreq = "monthly";
    }

    return `
  <url>
    <loc>${u.url}</loc>
    <lastmod>${u.lastModified}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  })
  .join("")}
</urlset>`;

  return new Response(xml.trim(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
