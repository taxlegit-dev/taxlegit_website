import { Region, ContentStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { NavbarServer } from "@/components/navigation/navbar-server";
import { EditorJsRenderer } from "@/components/rich-text/editorjs-renderer";
import type { OutputData } from "@editorjs/editorjs";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MetaDataRenderer } from "@/components/seo/meta-data-renderer";
import { parseMetaBlockForMetadata } from "@/lib/seo-utils";

type UsBlogDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: UsBlogDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const region = Region.US;

  const blog = await prisma.blog.findFirst({
    where: {
      id,
      region,
      status: ContentStatus.PUBLISHED,
    },
    include: {
      blogGroup: true,
    },
  });

  if (!blog) {
    return {
      title: "Blog Not Found",
    };
  }

  // Check for custom meta data
  const metaData = await prisma.metaData.findUnique({
    where: {
      pageType_pageId: {
        pageType: "BLOG",
        pageId: blog.id,
      },
    },
  });

  // If custom meta data exists, parse it
  if (metaData?.metaBlock) {
    const parsedMeta = parseMetaBlockForMetadata(metaData.metaBlock);
    return {
      ...parsedMeta,
      // Fallback to defaults if not in meta block
      title: parsedMeta.title || `${blog.title} | Taxlegit US Blog`,
      description: parsedMeta.description || blog.title,
    };
  }

  // Default metadata
  return {
    title: `${blog.title} | Taxlegit US Blog`,
    description: blog.title,
  };
}

export default async function UsBlogDetailPage({
  params,
}: UsBlogDetailPageProps) {
  const { id } = await params;
  const region = Region.US;

  // Fetch the blog
  const blog = await prisma.blog.findFirst({
    where: {
      id,
      region,
      status: ContentStatus.PUBLISHED,
    },
    include: {
      blogGroup: true,
    },
  });

  if (!blog) {
    notFound();
  }

  // Try to parse content as Editor.js JSON
  let editorData: OutputData | null = null;
  try {
    const parsed = JSON.parse(blog.content);
    if (parsed && typeof parsed === "object" && "blocks" in parsed) {
      editorData = parsed as OutputData;
    }
  } catch {
    // Not JSON, will render as HTML
  }

  return (
    <>
      {/* Render meta tags server-side */}
      <MetaDataRenderer pageType="BLOG" pageId={blog.id} />
      <div className="min-h-screen bg-slate-950 text-white">
        <NavbarServer region={region} />
      <main className="mx-auto w-full max-w-4xl px-6 py-12">
        <Link
          href="/us/blog"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 mb-8"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Blogs
        </Link>

        <article>
          <div className="mb-6">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-900/50 text-emerald-300 text-sm font-medium mb-4">
              {blog.blogGroup.name}
            </span>
            <h1 className="text-4xl font-semibold mb-4">{blog.title}</h1>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span>
                {new Date(blog.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

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

          <div className="prose prose-lg max-w-none prose-invert prose-slate prose-headings:text-white prose-p:text-slate-300">
            {editorData ? (
              <EditorJsRenderer data={editorData} theme="dark" />
            ) : (
              <div
                dangerouslySetInnerHTML={{ __html: blog.content }}
                className="blog-content"
              />
            )}
          </div>
        </article>
      </main>
      <footer className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-8 text-sm text-slate-400">
          <p>© {new Date().getFullYear()} Taxlegit. US Region</p>
        </div>
      </footer>
      </div>
    </>
  );
}
