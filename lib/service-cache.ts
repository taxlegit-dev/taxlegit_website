import { redis } from "./redis";
import { prisma } from "@/lib/prisma";

type ServiceCache = {
  hero: any;
  sections: any[];
  faq: any;
};

export async function getServiceContentCached(
  navbarItemId: string,
  servicePageId: string,
  options?: { bypassCache?: boolean }
): Promise<ServiceCache> {
  const cacheKey = `service:${navbarItemId}`;

  if (!options?.bypassCache) {
    // 1️⃣ Try Redis
    const cached = await redis.get<ServiceCache>(cacheKey);
    if (cached) {
      return cached;
    }
  }

  // 2️⃣ Fetch from Supabase (Prisma)
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
    }),
  ]);

  const data = { hero, sections, faq };

  if (!options?.bypassCache) {
    // 3️⃣ Cache for 24 hours
    await redis.set(cacheKey, data, { ex: 20 });
  }

  return data;
}
