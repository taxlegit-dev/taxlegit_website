import { Region } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { RegionFilter } from "@/components/admin/region-filter";
import { GenericPageManager } from "@/components/admin/generic-page-manager";

type AdminGenericPagesProps = {
  searchParams?: Promise<{ region?: string; slug?: string }>;
};

export default async function AdminGenericPagesPage({ searchParams }: AdminGenericPagesProps) {
  const params = await searchParams;
  const selectedRegion = params?.region === "US" ? Region.US : Region.INDIA;
  const selectedSlug = params?.slug;

  // Fetch existing generic page if slug is selected
  let existingGenericPage = null;
  if (selectedSlug) {
    existingGenericPage = await prisma.genericPage.findUnique({
      where: {
        slug: selectedSlug,
        region: selectedRegion,
      },
    });
  }

  // Fetch all generic pages for this region
  const allGenericPages = await prisma.genericPage.findMany({
    where: { region: selectedRegion },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-8 text-black">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Generic Pages</p>
          <h1 className="text-3xl font-semibold text-slate-900">Manage Generic Pages</h1>
          <p className="mt-2 text-sm text-slate-600">
            Create and manage generic pages with rich content. First add a menu item in Navigation with pageType GENERIC.
          </p>
        </div>
        <RegionFilter value={selectedRegion === Region.US ? "US" : "INDIA"} />
      </div>
      <GenericPageManager
        region={selectedRegion === Region.US ? "US" : "INDIA"}
        selectedSlug={selectedSlug || undefined}
        existingGenericPage={existingGenericPage}
        allGenericPages={allGenericPages}
      />
    </div>
  );
}