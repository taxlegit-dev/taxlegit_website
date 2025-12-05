import { Region } from "@prisma/client";
import { RegionFilter } from "@/components/admin/region-filter";

type AdminPageProps = {
  searchParams?: Promise<{ region?: string }>;
};

export default async function AdminDashboard({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const selectedRegion = params?.region === "US" ? Region.US : Region.INDIA;

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
            Control center
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            Admin overview
          </h1>
          <p className="text-sm text-slate-500">
            All data lives in Postgres via Prisma and renders dynamically on the
            site.
          </p>
        </div>
        <RegionFilter value={selectedRegion === Region.US ? "US" : "INDIA"} />
      </div>
    </div>
  );
}
