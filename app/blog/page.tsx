import { Region, ContentStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { NavbarServer } from "@/components/navigation/navbar-server";
import Footer from "@/components/footer";
import Link from "next/link";
import Image from "next/image";

export default async function BlogListingPage() {
  const region = Region.INDIA;

  // Fetch published blogs with their groups
  const blogs = await prisma.blog.findMany({
    where: {
      region,
      status: ContentStatus.PUBLISHED,
    },
    include: {
      blogGroup: true,
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
    <div className="min-h-screen bg-white text-black">
      <NavbarServer region={region} />
      <main className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-semibold text-slate-900 mb-4">Blog</h1>
          <p className="text-lg text-slate-600">
            Stay updated with the latest insights, tips, and news
          </p>
        </div>

        {Object.keys(blogsByGroup).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">No blogs available at the moment.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(blogsByGroup).map(([groupName, groupBlogs]) => (
              <div key={groupName}>
                <h2 className="text-2xl font-semibold text-slate-900 mb-6">
                  {groupName}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupBlogs.map((blog) => (
                    <Link
                      key={blog.id}
                      href={`/blog/${blog.id}`}
                      className="group rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition"
                    >
{blog.image && (
  <div className="w-full h-48 overflow-hidden">
    <Image
      src={blog.image}
      alt={blog.title}
      width={800}
      height={500}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
    />
  </div>
)}

                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-indigo-600 transition">
                          {blog.title}
                        </h3>
                        <div className="flex items-center justify-between text-sm text-slate-500">
                          <span>
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </span>
                          <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                            {blog.blogGroup.name}
                          </span>
                        </div>
                        <p className="mt-4 text-slate-600 text-sm line-clamp-2">
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
      <Footer />
    </div>
  );
}
