import Image from "next/image";
import Link from "next/link";
import { BlogWithGroup } from "@/types/blog";

// this file used in blogGroup.
interface BlogCardProps {
  blog: BlogWithGroup;
  showCategory?: boolean;
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

function getExcerpt(content: string, limit = 12): string {
  const text = extractTextFromEditorData(content);
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= limit) {
    return words.join(" ");
  }
  return `${words.slice(0, limit).join(" ")}...`;
}

export default function BlogCard({ blog, showCategory = true }: BlogCardProps) {
  const excerpt = getExcerpt(blog.content, 12);
  const imageSrc = isValidImageSrc(blog.image)
    ? blog.image
    : FALLBACK_IMAGE_SRC;
  return (
    <Link
      href={`/blogs/${blog.slug || blog.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-40 sm:h-44 md:h-48 overflow-hidden">
        <Image
          src={imageSrc}
          alt={blog.title}
          fill
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          unoptimized
        />
      </div>
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
          {excerpt || "Fresh insights and practical takeaways from our team."}
        </p>
        <span className="mt-auto  text-xs sm:text-sm font-medium text-indigo-600 transition-colors group-hover:text-indigo-500">
          Continue reading →
        </span>
      </div>
    </Link>
  );
}
