import { PageKey, Region } from "@prisma/client";
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
