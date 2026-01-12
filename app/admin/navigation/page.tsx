import { Region } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { RegionFilter } from "@/components/admin/region-filter";
import { NavMenuManager } from "@/components/admin/nav-menu-manager";

type AdminNavigationPageProps = {
  searchParams?: Promise<{ region?: string }>;
};

export default async function AdminNavigationPage({
  searchParams,
}: AdminNavigationPageProps) {
  const params = await searchParams;
  const selectedRegion = params?.region === "US" ? Region.US : Region.INDIA;
  const navItems = await prisma.navbarItem.findMany({
    where: {
      region: selectedRegion,
    },
    include: {
      children: {
        orderBy: { order: "asc" },
      },
    },
    orderBy: { order: "asc" },
  });

  console.log(navItems);

  // Structure items hierarchically
  const topLevelItems = navItems.filter((item) => !item.parentId);

  // Define the NavItem type to match what NavMenuManager expects
  type NavItem = {
    id: string;
    label: string;
    href: string | null;
    order: number;
    type: string;
    pageType: "SERVICE" | "GENERIC";
    isLoginLink: boolean;
    isActive: boolean;
    parentId: string | null;
    groupLabel: string | null;
    children: NavItem[];
  };

  // Transform to match NavItem type - recursively structure children
  function transformItem(item: (typeof navItems)[0]): NavItem {
    const children = navItems
      .filter((child) => child.parentId === item.id)
      .map(transformItem);

    return {
      id: item.id,
      label: item.label,
      href: item.href,
      order: item.order,
      type: item.type,
      pageType: item.pageType,
      isLoginLink: item.isLoginLink,
      isActive: item.isActive,
      parentId: item.parentId,
      groupLabel: item.groupLabel,
      children,
    };
  }

  const structuredItems = topLevelItems.map(transformItem);

  return (
    <div className="space-y-8 text-black">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
            Navigation
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            Mega Menu Manager
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Manage your dynamic navbar with mega-menu dropdowns, groups, and
            submenus
          </p>
        </div>
        <RegionFilter value={selectedRegion === Region.US ? "US" : "INDIA"} />
      </div>
      <NavMenuManager
        region={selectedRegion === Region.US ? "US" : "INDIA"}
        initialItems={structuredItems}
      />
    </div>
  );
}
