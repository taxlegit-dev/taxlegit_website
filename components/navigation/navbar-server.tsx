import { prisma } from "@/lib/prisma";
import { MegaNavbar } from "@/components/navigation/mega-navbar";
import { Region } from "@prisma/client";

type NavbarServerProps = {
  region: Region;
};

type NavbarChildItem = {
  id: string;
  label: string;
  href: string | null;
  order: number;
};


export async function NavbarServer({ region }: NavbarServerProps) {
  const items = await prisma.navbarItem.findMany({
    where: {
      region,
      pageType: "SERVICE",
      isActive: true,
      parentId: null, // top-level only
    },
    orderBy: { order: "asc" },
    select: {
      id: true,
      label: true,
      href: true,
      type: true,
      isLoginLink: true,
      order: true,
      children: {
        where: {
          isActive: true,
          pageType: "SERVICE",
        },
        orderBy: { order: "asc" },
        select: {
          id: true,
          label: true,
          href: true,
          order: true,
          groupLabel: true,
        },
      },
    },
  });


  const structuredItems = items.map((item) => {
  const groupedChildren = item.children.reduce<
    Record<string, NavbarChildItem[]>
  >((acc, child) => {
    const key = child.groupLabel || "default";

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push({
      id: child.id,
      label: child.label,
      href: child.href,
      order: child.order,
    });

    return acc;
  }, {});

  return {
    id: item.id,
    label: item.label,
    href: item.href,
    type: item.type,
    isLoginLink: item.isLoginLink,
    order: item.order,
    groups: Object.entries(groupedChildren).map(
      ([groupLabel, items]) => ({
        label: groupLabel === "default" ? null : groupLabel,
        items,
      })
    ),
  };
});


  return <MegaNavbar region={region} initialItems={structuredItems} />;
}
