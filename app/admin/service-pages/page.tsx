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

  /**
   * 1️⃣ NAVBAR ITEMS (REQUIRED FOR LIST)
   */
  const navItems = await prisma.navbarItem.findMany({
    where: {
      region: selectedRegion,
      pageType: "SERVICE",
      type: "LINK",
      href: { not: null },
      isActive: true,
    },
    orderBy: { order: "asc" },
  });

  /**
   * 2️⃣ LIGHT SERVICE PAGE LINKS (NO SECTIONS, NO CONTENT)
   */
  const servicePageLinks = await prisma.servicePage.findMany({
    where: { region: selectedRegion },
    select: {
      id: true,
      navbarItemId: true,
      updatedAt: true,
    },
  });

  /**
   * 3️⃣ DERIVED VALUES (NO EXTRA DB CALL)
   */
  const existingServicePage = selectedNavbarItemId
    ? await prisma.servicePage.findFirst({
        where: {
          navbarItemId: selectedNavbarItemId,
          region: selectedRegion,
        },
        include: {
          sections: {
            orderBy: { order: "asc" },
          },
        },
      })
    : null;

  const navbarItem = selectedNavbarItemId
    ? navItems.find((item) => item.id === selectedNavbarItemId) || null
    : null;

  return (
    <div className="space-y-8 text-black ">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-blue-100 p-2 rounded-xl">
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
        servicePageLinks={servicePageLinks} // 🔥 LIGHT DATA ONLY
      />
    </div>
  );
}
