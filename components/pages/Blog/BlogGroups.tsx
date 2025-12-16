import BlogCard from "./BlogCard";
import AuthorCard from "./AuthorCard";
import { BlogWithGroup } from "@/types/blog";

interface BlogGroupsProps {
  blogs: BlogWithGroup[];
}

export default function BlogGroups({ blogs }: BlogGroupsProps) {
  if (blogs.length === 0) {
    return (
      <p className="text-center py-8 text-slate-500">No more articles yet.</p>
    );
  }

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
            <AuthorCard />
          </div>
        </div>
      </div>
    </section>
  );
}
