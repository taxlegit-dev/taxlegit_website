import { unstable_cache } from "next/cache";
import { Region, ContentStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export function getRelatedBlogsCached(
  label: string,
  region: Region,
  limit = 6
) {
  return unstable_cache(
    async () => {
      return prisma.blog.findMany({
        where: {
          region,
          status: ContentStatus.PUBLISHED,
          title: {
            contains: label,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
          slug: true,
          title: true,
          image: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
      });
    },
    ["related-blogs", region, label],
    { revalidate: 86400 }
  )();
}
