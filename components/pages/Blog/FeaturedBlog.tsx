import Image from "next/image";
import Link from "next/link";
import { BlogWithGroup } from "@/types/blog";

interface FeaturedBlogProps {
  blog: BlogWithGroup;
}

const FALLBACK_IMAGE_SRC = "/hero1.jpg";

const isValidImageSrc = (src?: string | null): src is string => {
  if (!src) return false;
  if (src.startsWith("/")) return true;
  try {
    new URL(src);
    return true;
  } catch {
    return false;
  }
};

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTextFromEditorData(content: string): string {
  try {
    const parsed = JSON.parse(content);
    if (
      !parsed ||
      typeof parsed !== "object" ||
      !Array.isArray(parsed.blocks)
    ) {
      return stripHtml(content);
    }

    const chunks: string[] = [];
    for (const block of parsed.blocks) {
      const data = block?.data;
      if (!data) continue;

      if (typeof data.text === "string") {
        chunks.push(data.text);
      }
      if (typeof data.heading === "string") {
        chunks.push(data.heading);
      }
      if (typeof data.description === "string") {
        chunks.push(data.description);
      }
      if (typeof data.caption === "string") {
        chunks.push(data.caption);
      }
      if (Array.isArray(data.items)) {
        chunks.push(data.items.join(" "));
      }
      if (Array.isArray(data.points)) {
        chunks.push(data.points.join(" "));
      }
      if (Array.isArray(data.content)) {
        const tableText = data.content
          .map((row: string[]) => row.join(" "))
          .join(" ");
        chunks.push(tableText);
      }
    }

    return stripHtml(chunks.join(" "));
  } catch {
    return stripHtml(content);
  }
}

function getExcerpt(content: string, limit = 30): string {
  const text = extractTextFromEditorData(content);
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= limit) {
    return words.join(" ");
  }
  return `${words.slice(0, limit).join(" ")}...`;
}

export default function FeaturedBlog({ blog }: FeaturedBlogProps) {
  const excerpt = getExcerpt(blog.content, 30);
  const imageSrc = isValidImageSrc(blog.image)
    ? blog.image
    : FALLBACK_IMAGE_SRC;
  const authorImageSrc = blog.author
    ? isValidImageSrc(blog.author.image)
      ? blog.author.image
      : null
    : null;
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12 lg:px-10">
      <div className="grid gap-6 md:gap-8 lg:gap-10 rounded-3xl lg:grid-cols-2 ">
        {/* LEFT : IMAGE */}
        <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 w-full overflow-hidden rounded-2xl order-1 lg:order-1">
          <Image
            src={imageSrc}
            alt={blog.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 45vw"
            priority
            unoptimized
          />
        </div>

        {/* RIGHT : CONTENT */}
        <div className="space-y-2 sm:space-y-3 md:space-y-4 order-2 lg:order-2">
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

          {/* DESCRIPTION */}
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed line-clamp-2">
            {excerpt || "Fresh insights and practical takeaways from our team."}
          </p>

          {/* AUTHOR */}
          {blog.author && (
            <div className="flex items-center gap-3 pt-1 sm:pt-2">
              {authorImageSrc ? (
                <Image
                  src={authorImageSrc}
                  alt={blog.author.name}
                  width={36}
                  height={36}
                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-full object-cover"
                  unoptimized
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
            href={`/blogs/${blog.slug || blog.id}`}
            className="inline-block  text-sm sm:text-base font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            Read Article →
          </Link>
        </div>
      </div>
    </section>
  );
}
