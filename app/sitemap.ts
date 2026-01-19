import type { MetadataRoute } from "next";
import { ContentStatus, NavbarPageType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const revalidate = 86400; // ✅ 24 hours


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://taxlegit.com";

  // ✅ Static pages (add more if needed)
const staticUrls: MetadataRoute.Sitemap = [
  {
    url: `${baseUrl}`,
    lastModified: new Date(),
  },
  {
    url: `${baseUrl}/nameCheck`,
    lastModified: new Date(),
  },
  {
    url: `${baseUrl}/calculateQuote`,
    lastModified: new Date(),
  },
  {
    url: `${baseUrl}/contact-us`,
    lastModified: new Date(),
  },
  {
    url: `${baseUrl}/about`,
    lastModified: new Date(),
  },
  {
    url: `${baseUrl}/blogs`,
    lastModified: new Date(),
  },
];

  // ✅ Published Navbar pages (SERVICE + GENERIC)
  const navbarItems = await prisma.navbarItem.findMany({
    where: {
      isActive: true,
      href: { not: null },
      OR: [
        // SERVICE published
        {
          pageType: NavbarPageType.SERVICE,
          servicePages: {
            is: { status: ContentStatus.PUBLISHED },
          },
        },

        // GENERIC published
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

  const navbarUrls: MetadataRoute.Sitemap = navbarItems
    .filter((item) => item.href && item.href.startsWith("/")) // ✅ block external links
    .map((item) => ({
      url: `${baseUrl}${item.href!}`,
      lastModified:
        item.servicePages?.updatedAt ||
        item.genericPage?.updatedAt ||
        item.updatedAt ||
        new Date(),
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

  const blogUrls: MetadataRoute.Sitemap = blogs
    .filter((b) => b.slug)
    .map((blog) => ({
      url: `${baseUrl}/blogs/${blog.slug}`,
      lastModified: blog.updatedAt || new Date(),
    }));

  // ✅ Remove duplicates (safe)
  const allUrls = [...staticUrls, ...navbarUrls, ...blogUrls];
  const unique = Array.from(new Map(allUrls.map((u) => [u.url, u])).values());

  return unique;
}
