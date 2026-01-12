import { Region } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { RegionFilter } from "@/components/admin/region-filter";
import { ServicePageManager } from "@/components/admin/service-page-manager";

type AdminServicePagesProps = {
  searchParams?: Promise<{ region?: string; navbarItemId?: string }>;
};

export default async function AdminServicePagesPage({
  searchParams,
}: AdminServicePagesProps) {
  const params = await searchParams;
  const selectedRegion = params?.region === "US" ? Region.US : Region.INDIA;
  const selectedNavbarItemId = params?.navbarItemId;

  const [navItems, allServicePages] = await Promise.all([
    // Query 1: Navbar items
    prisma.navbarItem.findMany({
      where: {
        region: selectedRegion,
        pageType: "SERVICE",
        type: "LINK",
        href: { not: null },
        isActive: true,
      },
      orderBy: { order: "asc" },
    }),

    prisma.servicePage.findMany({
      where: { region: selectedRegion },
      orderBy: { updatedAt: "desc" },
      include: {
        sections: {
          orderBy: { order: "asc" },
        },
        navbarItem: true,
      },
    }),
  ]);

  let existingServicePage = null;
  let navbarItem = null;

  if (selectedNavbarItemId) {
    // Find from already fetched data - NO DATABASE CALL!
    existingServicePage =
      allServicePages.find((sp) => sp.navbarItemId === selectedNavbarItemId) ||
      null;

    if (existingServicePage) {
      // Use the already included navbarItem
      navbarItem = existingServicePage.navbarItem;
    } else {
      // If no service page exists yet, find from navItems
      navbarItem =
        navItems.find((item) => item.id === selectedNavbarItemId) || null;
    }
  }

  return (
    <div className="space-y-8 text-black">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
            Service Pages
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            Add Service Pages
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Create and manage service pages with multiple sections, table of
            contents, and rich content
          </p>
        </div>
        <RegionFilter value={selectedRegion === Region.US ? "US" : "INDIA"} />
      </div>
      <ServicePageManager
        pageType="SERVICE"
        region={selectedRegion === Region.US ? "US" : "INDIA"}
        navItems={navItems}
        selectedNavbarItemId={selectedNavbarItemId || undefined}
        existingServicePage={existingServicePage}
        navbarItem={navbarItem}
        allServicePages={allServicePages}
      />
    </div>
  );
}
