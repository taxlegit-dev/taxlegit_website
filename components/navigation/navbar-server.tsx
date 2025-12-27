import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { MegaNavbar } from "@/components/navigation/mega-navbar";
import { Region } from "@prisma/client";

type NavbarServerProps = {
  region: Region;
};

const getNavbarItems = (region: Region) =>
  unstable_cache(
    async () =>
      prisma.navbarItem.findMany({
        where: {
          region,
          pageType: "SERVICE",
          isActive: true,
        },
        include: {
          children: {
            where: {
              isActive: true,
              pageType: "SERVICE",
            },
            orderBy: { order: "asc" },
          },
        },
        orderBy: { order: "asc" },
      }),
    ["navbar-items-by-region", region],
    { revalidate: 300, tags: [`navbar-items-${region}`] }
  )();

export async function NavbarServer({ region }: NavbarServerProps) {
  const items = await getNavbarItems(region);

  // Separate top-level items and their children
  const topLevelItems = items.filter((item) => !item.parentId);

  // Group children by groupLabel for mega-menu structure
  const structuredItems = topLevelItems.map((item) => {
    const children = item.children;

    // Group children by groupLabel
    const groupedChildren = children.reduce((acc, child) => {
      const groupKey = child.groupLabel || "default";
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(child);
      return acc;
    }, {} as Record<string, typeof children>);

    return {
      id: item.id,
      label: item.label,
      href: item.href,
      type: item.type,
      isLoginLink: item.isLoginLink,
      order: item.order,
      groups: Object.entries(groupedChildren).map(([groupLabel, items]) => ({
        label: groupLabel === "default" ? null : groupLabel,
        items: items.map((child) => ({
          id: child.id,
          label: child.label,
          href: child.href,
          order: child.order,
        })),
      })),
    };
  });

  return <MegaNavbar region={region} initialItems={structuredItems} />;
}
