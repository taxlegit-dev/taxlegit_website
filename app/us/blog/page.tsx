import { Region, ContentStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

export default async function UsBlogListingPage() {
  const region = Region.US;

  // Fetch published blogs with their groups
  const blogs = await prisma.blog.findMany({
    where: {
      region,
      status: ContentStatus.PUBLISHED,
    },
    include: {
      blogGroup: true,
      author: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Group blogs by blog group
  const blogsByGroup = blogs.reduce((acc, blog) => {
    const groupName = blog.blogGroup.name;
    if (!acc[groupName]) {
      acc[groupName] = [];
    }
    acc[groupName].push(blog);
    return acc;
  }, {} as Record<string, typeof blogs>);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto w-full max-w-6xl px-6 pt-[89px] pb-12">
        <div className="mb-12">
          <h1 className="text-4xl font-semibold mb-4">Blog</h1>
          <p className="text-lg text-slate-300">
            Stay updated with the latest insights, tips, and news
          </p>
        </div>

        {Object.keys(blogsByGroup).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">No blogs available at the moment.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(blogsByGroup).map(([groupName, groupBlogs]) => (
              <div key={groupName}>
                <h2 className="text-2xl font-semibold mb-6">{groupName}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupBlogs.map((blog) => (
                    <Link
                      key={blog.id}
                      href={`/us/blog/${blog.slug || blog.id}`}
                      className="group rounded-lg border border-white/10 overflow-hidden hover:border-white/20 transition"
                    >
                      {blog.image && (
                        <div className="w-full h-48 overflow-hidden">
                          <Image
                            src={blog.image}
                            alt={blog.title}
                            width={800}
                            height={500}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            unoptimized
                          />
                        </div>
                      )}

                      <div className="p-6 bg-slate-900">
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-emerald-400 transition">
                          {blog.title}
                        </h3>
                        <div className="flex items-center justify-between text-sm text-slate-400">
                          <span>
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </span>
                          <span className="px-2 py-1 rounded-full bg-slate-800 text-slate-300">
                            {blog.blogGroup.name}
                          </span>
                        </div>
                        <p className="mt-4 text-slate-300 text-sm">
                          Read more →
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <footer className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-8 text-sm text-slate-400">
          <p>© {new Date().getFullYear()} Taxlegit. US Region</p>
        </div>
      </footer>
    </div>
  );
}
