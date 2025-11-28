import { ContentStatus, PageKey, Region } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function getStaticPage(region: Region, key: PageKey) {
  return prisma.staticPage.findUnique({
    where: {
      key_region: {
        key,
        region,
      },
    },
  });
}

export async function getBlogs(region: Region) {
  return prisma.blog.findMany({
    where: { region, status: ContentStatus.PUBLISHED },
    orderBy: {
      publishedAt: "desc",
    },
  });
}

export async function getBlogBySlug(region: Region, slug: string) {
  return prisma.blog.findUnique({
    where: {
      slug_region: {
        slug,
        region,
      },
    },
  });
}

