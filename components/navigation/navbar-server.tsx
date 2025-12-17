import { Region } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { MegaNavbar } from "@/components/navigation/mega-navbar";

type NavbarServerProps = {
  region: Region;
};

export async function NavbarServer({ region }: NavbarServerProps) {
  const items = await prisma.navbarItem.findMany({
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
  });
  console.log(items);

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
