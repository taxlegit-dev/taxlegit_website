import BlogCard from "./BlogCard";
import AuthorCard from "./AuthorCard";
import { BlogWithGroup } from "@/types/blog";
import { prisma } from "@/lib/prisma";
import { Region } from "@prisma/client";
import Image from "next/image";

type BlogAuthor = {
  id: string;
  name: string;
  image: string | null;
  description: string | null;
  region: Region;
  createdAt: Date;
  updatedAt: Date;
};

interface BlogGroupsProps {
  blogs: BlogWithGroup[];
  region?: string;
}

export default async function BlogGroups({
  blogs,
  region = "INDIA",
}: BlogGroupsProps) {
  if (blogs.length === 0) {
    return (
      <p className="text-center py-8 text-slate-500">No more articles yet.</p>
    );
  }

  // Fetch all authors for the region
  const regionEnum = region === "US" ? Region.US : Region.INDIA;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const authors = (await (prisma as any).blogAuthor.findMany({
    where: {
      region: regionEnum,
    },
    orderBy: {
      createdAt: "desc",
    },
  })) as BlogAuthor[];

  // Group blogs by category
  const groupedBlogs = blogs.reduce((groups, blog) => {
    const groupName = blog.blogGroup.name;
    if (!groups[groupName]) {
      groups[groupName] = [];
    }
    groups[groupName].push(blog);
    return groups;
  }, {} as Record<string, BlogWithGroup[]>);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12 lg:px-10">
      <div className="space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg sm:text-xl font-semibold text-slate-900">
            More from the blog
          </h3>
          <span className="text-xs sm:text-sm text-slate-500">
            Showing {blogs.length} article{blogs.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Left Column - 75% width (2 of 3 columns) */}
          <div className="lg:col-span-2 space-y-16">
            {Object.entries(groupedBlogs).map(([groupName, groupBlogs]) => (
              <div key={groupName} className="space-y-6">
                {/* Group Header */}
                <div className="border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-2 rounded-full bg-indigo-600" />
                    <h4 className="text-xl font-bold text-slate-900">
                      {groupName}
                    </h4>
                    <span className="ml-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      {groupBlogs.length}{" "}
                      {groupBlogs.length === 1 ? "article" : "articles"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    Latest insights and updates from {groupName.toLowerCase()}
                  </p>
                </div>
                {/* Blog Cards Grid - 2 columns for desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                  {groupBlogs.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} showCategory={false} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right Column - 25% width (1 of 3 columns) */}
          <div className="mt-12 lg:mt-0">
            {/* Authors Section */}
            {authors.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm mb-8">
                <h3 className="mb-4 text-lg font-bold text-slate-900">
                  Our Authors
                </h3>
                <div className="space-y-4">
                  {authors.map((author) => (
                    <div
                      key={author.id}
                      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                    >
                      <div className="text-center">
                        {author.image ? (
                          <div className="mx-auto mb-3 h-20 w-20 overflow-hidden rounded-full border-4 border-white shadow-md">
                            <Image
                              src={author.image}
                              alt={author.name}
                              width={80}
                              height={80}
                              className="h-full w-full object-cover"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <div className="mx-auto mb-3 h-20 w-20 overflow-hidden rounded-full border-4 border-white shadow-md">
                            <div className="h-full w-full bg-gradient-to-br from-indigo-400 to-purple-500" />
                          </div>
                        )}
                        <h3 className="text-lg font-bold text-slate-900">
                          {author.name}
                        </h3>
                        {author.description && (
                          <p className="text-sm text-slate-600 line-clamp-2">
                            {author.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AuthorCard component with Recent Articles */}
            <AuthorCard region={region} />
          </div>
        </div>
      </div>
    </section>
  );
}
