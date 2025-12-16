import { Region, ContentStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { NavbarServer } from "@/components/navigation/navbar-server";
import Footer from "@/components/footer";
import BlogHero from "@/components/pages/Blog/BlogHero";
import FeaturedBlog from "@/components/pages/Blog/FeaturedBlog";
import BlogGroups from "@/components/pages/Blog/BlogGroups";

export default async function BlogListingPage() {
  const region = Region.INDIA;

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

  const [featuredBlog, ...otherBlogs] = blogs;

  return (
    <div className="min-h-screen bg-white text-black">
      <NavbarServer region={region} />
      <main className="mx-auto w-full">
        <BlogHero />
        {!featuredBlog ? (
          <div className="py-12 text-center">
            <p className="text-slate-500">No blogs available at the moment.</p>
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
