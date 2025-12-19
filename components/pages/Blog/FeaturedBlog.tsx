import Image from "next/image";
import Link from "next/link";
import { BlogWithGroup } from "@/types/blog";

interface FeaturedBlogProps {
  blog: BlogWithGroup;
}

export default function FeaturedBlog({ blog }: FeaturedBlogProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12 lg:px-10">
      <div className="grid gap-6 md:gap-8 lg:gap-10 rounded-3xl lg:grid-cols-2 ">
        {/* LEFT : IMAGE */}
        {blog.image && (
          <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 w-full overflow-hidden rounded-2xl order-1 lg:order-1">
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 45vw"
              priority
            />
          </div>
        )}

        {/* RIGHT : CONTENT */}
        <div className="space-y-3 sm:space-y-4 md:space-y-5 order-2 lg:order-2">
          {/* META */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-500">
            <span>
              {new Date(blog.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-400" />
            <span className="uppercase tracking-wide">
              {blog.blogGroup.name}
            </span>
          </div>

          {/* TITLE */}
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight sm:leading-snug text-slate-900">
            {blog.title}
          </h2>

          {/* AUTHOR */}
          {blog.author && (
            <div className="flex items-center gap-3 pt-1 sm:pt-2">
              {blog.author.image ? (
                <Image
                  src={blog.author.image}
                  alt={blog.author.name}
                  width={36}
                  height={36}
                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-full object-cover"
                />
              ) : (
                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-slate-300" />
              )}
              <div className="text-xs sm:text-sm">
                <p className="font-medium text-slate-900">{blog.author.name}</p>
                {blog.author.description && (
                  <p className="text-slate-500 line-clamp-1">
                    {blog.author.description}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* CTA */}
          <Link
            href={`/blog/${blog.id}`}
            className="inline-block pt-2 sm:pt-3 md:pt-4 text-sm sm:text-base font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            Read Article →
          </Link>
        </div>
      </div>
    </section>
  );
}
