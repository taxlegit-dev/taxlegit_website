import Image from "next/image";
import Link from "next/link";
import { BlogWithGroup } from "@/types/blog";

// this file used in blogGroup.
interface BlogCardProps {
  blog: BlogWithGroup;
  showCategory?: boolean;
}

export default function BlogCard({ blog, showCategory = true }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${blog.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      {blog.image && (
        <div className="relative h-40 sm:h-44 md:h-48 overflow-hidden">
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2 sm:gap-3 p-4 sm:p-5">
        {showCategory && (
          <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-500">
            <span className="rounded-full bg-slate-100 px-2 sm:px-3 py-1 text-slate-700">
              {blog.blogGroup.name}
            </span>
            <span>
              {new Date(blog.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        )}
        <h4 className="text-base sm:text-lg font-semibold text-slate-900 transition-colors group-hover:text-indigo-600 line-clamp-2">
          {blog.title}
        </h4>
        <p className="text-xs sm:text-sm text-slate-600 line-clamp-2">
          Fresh insights and practical takeaways from our team.
        </p>
        <span className="mt-auto pt-2 sm:pt-3 text-xs sm:text-sm font-medium text-indigo-600 transition-colors group-hover:text-indigo-500">
          Continue reading →
        </span>
      </div>
    </Link>
  );
}
