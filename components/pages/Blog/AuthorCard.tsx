import Link from "next/link";
import Image from "next/image";
import Newsletter from "@/components/pages/common/newsletter";
import FollowUs from "@/components/pages/common/FollowUs";

interface Blog {
  id: string;
  title: string;
  image?: string;
  createdAt: string;
  blogGroup: {
    name: string;
  };
}

interface AuthorCardProps {
  region?: string;
}

export default async function AuthorCard({
  region = "INDIA",
}: AuthorCardProps) {
  // Fetch recent 3 blogs for the specified region
  let recentBlogs: Blog[] = [];

  try {
    const res = await fetch(
      `${
        process.env.NEXTAUTH_URL || "http://localhost:3000"
      }/api/blogs?region=${region}&limit=3`,
      {
        next: { revalidate: 3600 }, // Revalidate every hour
      }
    );

    if (res.ok) {
      const data = await res.json();
      recentBlogs = data.blogs?.slice(0, 3) || [];
    }
  } catch (error) {
    console.error("Error fetching recent blogs:", error);
    // Fallback to empty array if fetch fails
    recentBlogs = [];
  }

  return (
    <div className="sticky top-6 space-y-8 mt-8">
      {/* Recent Articles Widget - Dynamic */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-bold text-slate-900">
          Recent Articles
        </h3>
        {recentBlogs.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {recentBlogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.id}`}
                className="group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-slate-50"
              >
                {/* Blog Image */}
                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-slate-100">
                  {blog.image ? (
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      width={48}
                      height={48}
                      className="object-contain bg-white"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-slate-300 to-slate-400" />
                  )}
                </div>

                {/* Blog Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-medium text-slate-900 group-hover:text-indigo-600 line-clamp-2">
                    {blog.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(blog.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-slate-500">No recent articles found.</p>
          </div>
        )}
      </div>

      {/* Newsletter Signup */}
      <div className="rounded-2xl bg-purple-600 p-4 sm:p-6 text-white">
        <h3 className="mb-2 sm:mb-3 text-base sm:text-lg font-bold">
          Stay Updated
        </h3>
        <p className="mb-3 sm:mb-4 text-xs sm:text-sm text-indigo-100">
          Get the latest articles delivered to your inbox.
        </p>
        <Newsletter />
      </div>
      <FollowUs />
    </div>
  );
}
