import { Region } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { RegionFilter } from "@/components/admin/region-filter";
import { ServicePageManager } from "@/components/admin/service-page-manager";

type AdminServicePagesProps = {
  searchParams?: Promise<{ region?: string; navbarItemId?: string }>;
};

export default async function AdminServicePagesPage({ searchParams }: AdminServicePagesProps) {
  const params = await searchParams;
  const selectedRegion = params?.region === "US" ? Region.US : Region.INDIA;
  const selectedNavbarItemId = params?.navbarItemId;

  // Fetch all navbar items for the selected region (only SERVICE pageType items with href)
  const navItems = await prisma.navbarItem.findMany({
    where: {
      region: selectedRegion,
      pageType: "GENERIC",
      type: "LINK",
      href: { not: null },
      isActive: true,
    },
    orderBy: { order: "asc" },
  });

  // Fetch existing service page if navbarItemId is selected
  let existingServicePage = null;
  if (selectedNavbarItemId) {
    existingServicePage = await prisma.servicePage.findUnique({
      where: {
        navbarItemId: selectedNavbarItemId,
      },
      include: {
        sections: {
          orderBy: { order: "asc" },
        },
      },
    });
  }

  // Get navbar item details if service page exists
  let navbarItem = null;
  if (existingServicePage || selectedNavbarItemId) {
    navbarItem = await prisma.navbarItem.findUnique({
      where: { id: selectedNavbarItemId || existingServicePage?.navbarItemId || "" },
    });
  }

  // Fetch all service pages for this region
  const allServicePages = await prisma.servicePage.findMany({
    where: { region: selectedRegion },
    orderBy: { updatedAt: "desc" },
    include: {
      sections: {
        orderBy: { order: "asc" },
      },
    },
  });

  // Get navbar items for all service pages
  const servicePagesWithNavItems = await Promise.all(
    allServicePages.map(async (servicePage) => {
      const navItem = await prisma.navbarItem.findUnique({
        where: { id: servicePage.navbarItemId },
      });
      return { ...servicePage, navbarItem: navItem };
    })
  );

  return (
    <div className="space-y-8 text-black">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Generic Pages</p>
          <h1 className="text-3xl font-semibold text-slate-900">Add Generic Pages</h1>
          <p className="mt-2 text-sm text-slate-600">
            Create and manage generic pages with multiple sections, table of contents, and rich content
          </p>
        </div>
        <RegionFilter value={selectedRegion === Region.US ? "US" : "INDIA"} />
      </div>
      <ServicePageManager
        pageType="GENERIC"
        region={selectedRegion === Region.US ? "US" : "INDIA"}
        navItems={navItems}
        selectedNavbarItemId={selectedNavbarItemId || undefined}
        existingServicePage={existingServicePage}
        navbarItem={navbarItem}
        allServicePages={servicePagesWithNavItems}
      />
    </div>
  );
}

