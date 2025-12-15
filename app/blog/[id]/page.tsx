import { Region, ContentStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { NavbarServer } from "@/components/navigation/navbar-server";
import Footer from "@/components/footer";
import { EditorJsRenderer } from "@/components/rich-text/editorjs-renderer";
import type { OutputData } from "@editorjs/editorjs";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MetaDataRenderer } from "@/components/seo/meta-data-renderer";
import { parseMetaBlockForMetadata } from "@/lib/seo-utils";
import AuthorCard from "@/components/pages/Blog/AuthorCard";
import RecentBlogsSection from "@/components/pages/home/RecentBlogsSection";

type BlogDetailPageProps = {
  params: Promise<{ id: string }>;
};

/* ===================== SEO ===================== */
export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const region = Region.INDIA;

  const blog = await prisma.blog.findFirst({
    where: {
      id,
      region,
      status: ContentStatus.PUBLISHED,
    },
  });

  if (!blog) {
    return { title: "Blog Not Found" };
  }

  const metaData = await prisma.metaData.findUnique({
    where: {
      pageType_pageId: {
        pageType: "BLOG",
        pageId: blog.id,
      },
    },
  });

  if (metaData?.metaBlock) {
    const parsedMeta = parseMetaBlockForMetadata(metaData.metaBlock);
    return {
      ...parsedMeta,
      title: parsedMeta.title || `${blog.title} | Taxlegit Blog`,
      description: parsedMeta.description || blog.title,
    };
  }

  return {
    title: `${blog.title} | Taxlegit Blog`,
    description: blog.title,
  };
}

/* ===================== PAGE ===================== */
export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { id } = await params;
  const region = Region.INDIA;

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

  let editorData: OutputData | null = null;
  try {
    const parsed = JSON.parse(blog.content);
    if (parsed && typeof parsed === "object" && "blocks" in parsed) {
      editorData = parsed as OutputData;
    }
  } catch {
    // fallback to HTML
  }

  return (
    <>
      <MetaDataRenderer pageType="BLOG" pageId={blog.id} />

      <div className="min-h-screen bg-white text-black">
        <NavbarServer region={region} />

        <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Back */}
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
          >
            ← Back to Blogs
          </Link>

          {/* FLEX LAYOUT: 75% CONTENT | 25% AUTHOR */}
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* LEFT : BLOG CONTENT - 75% */}
            <article className="lg:w-3/4">
              <div className="mb-6">
                <span className="mb-4 inline-block rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700">
                  {blog.blogGroup.name}
                </span>

                <h1 className="mb-4 text-3xl font-semibold text-slate-900 md:text-4xl">
                  {blog.title}
                </h1>

                <div className="text-sm text-slate-500">
                  {new Date(blog.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>

              {/* Featured Image */}
              {blog.image && (
                <div className="relative mb-8 h-64 w-full overflow-hidden rounded-xl md:h-80 lg:h-96">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    priority
                    className="object-cover"
                    sizes="(min-width: 1024px) 75vw, 100vw"
                  />
                </div>
              )}

              {/* Content */}
              <div className="prose prose-lg max-w-none prose-slate prose-headings:text-slate-900 prose-p:text-slate-700">
                {editorData ? (
                  <EditorJsRenderer data={editorData} theme="light" />
                ) : (
                  <div
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                    className="blog-content"
                  />
                )}
              </div>
            </article>

            {/* RIGHT : AUTHOR CARD - 25% */}
            <aside className="lg:w-1/4">
              <div className="sticky top-28">
                <AuthorCard />

                {/* Optional: Additional sidebar content */}
                <div className=" rounded-xl border border-slate-200 bg-slate-50 p-6">
                  <h3 className="mb-4 font-semibold text-slate-900">
                    Related Topics
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-slate-200 px-3 py-1 text-sm text-slate-700">
                      {blog.blogGroup.name}
                    </span>
                    {/* Add more tags here if available */}
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* Recent Blogs Section */}
          <RecentBlogsSection />
        </main>

        <Footer />
      </div>
    </>
  );
}
