export const dynamic = "force-dynamic";

import { Region, ContentStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import Footer from "@/components/footer";
import BlogHero from "@/components/pages/Blog/BlogHero";
import FeaturedBlog from "@/components/pages/Blog/FeaturedBlog";
import BlogGroups from "@/components/pages/Blog/BlogGroups";

type BlogListingPageProps = {
  searchParams?: {
    q?: string;
  };
};

export default async function BlogListingPage({
  searchParams,
}: BlogListingPageProps) {
  const region = Region.INDIA;
  const query = (searchParams?.q ?? "").trim().toLowerCase();

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

  const filteredBlogs = query
    ? blogs.filter((blog) => {
        const target = `${blog.title ?? ""} ${blog.blogGroup?.name ?? ""} ${
          blog.author?.name ?? ""
        }`.toLowerCase();
        return target.includes(query);
      })
    : blogs;

  const [featuredBlog, ...otherBlogs] = filteredBlogs;

  return (
    <div className="min-h-screen bg-white text-black">
      <main className="mx-auto w-full pt-[89px]">
        <BlogHero />
        {!featuredBlog ? (
          <div className="py-12 text-center">
            <p className="text-slate-500">
              {query
                ? "No blogs match your search."
                : "No blogs available at the moment."}
            </p>
          </div>
        ) : (
          <>
            <FeaturedBlog blog={featuredBlog} />
            <BlogGroups blogs={otherBlogs} />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
