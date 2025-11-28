import { Region } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { RegionFilter } from "@/components/admin/region-filter";
import { HeroSectionManager } from "@/components/admin/hero-section-manager";

type AdminHeroPageProps = {
  searchParams?: Promise<{ region?: string; navbarItemId?: string }>;
};

export default async function AdminHeroPage({ searchParams }: AdminHeroPageProps) {
  const params = await searchParams;
  const selectedRegion = params?.region === "US" ? Region.US : Region.INDIA;
  const selectedNavbarItemId = params?.navbarItemId;

  // Fetch all navbar items for the selected region (only LINK type items with href)
  const navItems = await prisma.navbarItem.findMany({
    where: {
      region: selectedRegion,
      type: "LINK",
      href: { not: null },
      isActive: true,
    },
    orderBy: { order: "asc" },
  });

  // Fetch existing hero if navbarItemId is selected
  let existingHero = null;
  if (selectedNavbarItemId) {
    existingHero = await prisma.pageHero.findUnique({
      where: {
        navbarItemId: selectedNavbarItemId,
      },
    });
  }

  // Get navbar item details if hero exists
  let navbarItem = null;
  if (existingHero || selectedNavbarItemId) {
    navbarItem = await prisma.navbarItem.findUnique({
      where: { id: selectedNavbarItemId || existingHero?.navbarItemId || "" },
    });
  }

  // Fetch all hero sections for this region
  const allHeroes = await prisma.pageHero.findMany({
    where: { region: selectedRegion },
    orderBy: { updatedAt: "desc" },
  });

  // Get navbar items for all heroes
  const heroesWithNavItems = await Promise.all(
    allHeroes.map(async (hero) => {
      const navItem = await prisma.navbarItem.findUnique({
        where: { id: hero.navbarItemId },
      });
      return { ...hero, navbarItem: navItem };
    })
  );

  return (
    <div className="space-y-8 text-black">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Hero Sections</p>
          <h1 className="text-3xl font-semibold text-slate-900">Create Hero Section</h1>
          <p className="mt-2 text-sm text-slate-600">
            Create and manage hero sections for dynamic service pages
          </p>
        </div>
        <RegionFilter value={selectedRegion === Region.US ? "US" : "INDIA"} />
      </div>
      <HeroSectionManager
        region={selectedRegion === Region.US ? "US" : "INDIA"}
        navItems={navItems}
        selectedNavbarItemId={selectedNavbarItemId || undefined}
        existingHero={existingHero}
        navbarItem={navbarItem}
        allHeroes={heroesWithNavItems}
      />
    </div>
  );
}

