import { Region } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { RegionFilter } from "@/components/admin/region-filter";
import { BlogManager } from "@/components/admin/blog-manager";

type AdminBlogPageProps = {
  searchParams?: Promise<{
    region?: string;
    blogGroupId?: string;
    blogId?: string;
  }>;
};

export default async function AdminBlogPage({
  searchParams,
}: AdminBlogPageProps) {
  const params = await searchParams;
  const selectedRegion = params?.region === "US" ? Region.US : Region.INDIA;

  const blogGroups = await prisma.blogGroup.findMany({
    where: { region: selectedRegion },
    orderBy: { order: "asc" },
    include: {
      blogs: {
        select: {
          id: true,
          title: true,
          status: true,
          updatedAt: true,
          createdAt: true,
        },
        orderBy: { updatedAt: "desc" },
      },
    },
  });

  return (
    <div className="space-y-8 text-black">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-green-100 p-2 rounded-xl">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
            Blog Management
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            Manage Blogs
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Create and manage blog posts for{" "}
            {selectedRegion === Region.US ? "US" : "India"} region
          </p>
        </div>
        <RegionFilter value={selectedRegion === Region.US ? "US" : "INDIA"} />
      </div>

      <BlogManager
        region={selectedRegion === Region.US ? "US" : "INDIA"}
        blogGroups={blogGroups}
      />
    </div>
  );
}
