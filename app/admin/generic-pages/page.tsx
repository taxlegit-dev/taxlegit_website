import { Region } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { RegionFilter } from "@/components/admin/region-filter";
import { GenericPageManager } from "@/components/admin/generic-page-manager";

type AdminGenericPagesProps = {
  searchParams?: Promise<{ region?: string; navbarItemId?: string }>;
};

export default async function AdminGenericPagesPage({
  searchParams,
}: AdminGenericPagesProps) {
  const params = await searchParams;

  const selectedRegion = params?.region === "US" ? Region.US : Region.INDIA;
  const selectedNavbarItemId = params?.navbarItemId;

  /**
   * 1️⃣ NAVBAR ITEMS (GENERIC LINKS ONLY)
   */
  const genericNavbarItems = await prisma.navbarItem.findMany({
    where: {
      region: selectedRegion,
      pageType: "GENERIC",
      type: "LINK",
      href: { not: null },
    },
    orderBy: { order: "asc" },
  });

  /**
   * 2️⃣ ALL GENERIC PAGES (LIGHT LIST)
   */
  const allGenericPages = await prisma.genericPage.findMany({
    where: { region: selectedRegion, navbarItemId: { not: null } },
    select: {
      id: true,
      navbarItemId: true,
      title: true,
      status: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  /**
   * 3️⃣ SELECTED PAGE (ONLY WHEN EDITING)
   */
  const existingGenericPage = selectedNavbarItemId
    ? await prisma.genericPage.findFirst({
        where: {
          region: selectedRegion,
          navbarItemId: selectedNavbarItemId,
        },
      })
    : null;

  return (
    <div className="space-y-8 text-black">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-yellow-100 p-2 rounded-xl">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
            Generic Pages
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            Manage Generic Pages
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Create and manage static content pages like About, Privacy Policy,
            Terms, etc.
          </p>
        </div>

        <RegionFilter value={selectedRegion === Region.US ? "US" : "INDIA"} />
      </div>

      <GenericPageManager
        region={selectedRegion === Region.US ? "US" : "INDIA"}
        selectedNavbarItemId={selectedNavbarItemId}
        existingGenericPage={existingGenericPage}
        genericNavbarItems={genericNavbarItems}
        allGenericPages={allGenericPages}
      />
    </div>
  );
}
