import { NextResponse } from "next/server";
import { Region, ContentStatus, Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { revalidateBlogListing, revalidateBlogPage } from "@/lib/revalidate";

const blogSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(1, "Slug is required"),
  title: z.string().min(1, "Title is required"),
  image: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  blogGroupId: z.string().min(1, "Blog group is required"),
  authorId: z.string().optional(),
  readTime: z.string().optional(),
  region: z.enum(["INDIA", "US"]),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});

// GET - Fetch all blogs for a region
export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const regionParam = searchParams.get("region");
  const blogGroupId = searchParams.get("blogGroupId");
  const blogId = searchParams.get("id");

  const where: Prisma.BlogWhereInput = {};
  if (regionParam) {
    where.region = regionParam === "US" ? Region.US : Region.INDIA;
  }
  if (blogGroupId) {
    where.blogGroupId = blogGroupId;
  }
  if (blogId) {
    where.id = blogId;
  }

  const blogs = await prisma.blog.findMany({
    where,
    include: {
      blogGroup: true,
      author: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ blogs });
}

// POST - Create a new blog
export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const parsed = blogSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const region = parsed.data.region === "US" ? Region.US : Region.INDIA;
    const status = parsed.data.status
      ? (parsed.data.status as ContentStatus)
      : ContentStatus.DRAFT;

    const blog = await prisma.blog.create({
      data: {
        slug: parsed.data.slug,
        title: parsed.data.title,
        image: parsed.data.image,
        content: parsed.data.content,
        blogGroupId: parsed.data.blogGroupId,
        authorId: parsed.data.authorId || null,
        readTime: parsed.data.readTime || null,
        region,
        status,
      },
      include: {
        blogGroup: true,
        author: true,
      },
    });

    revalidateBlogPage(blog.slug || blog.id, blog.region);
    revalidateBlogListing(blog.region);

    return NextResponse.json({ blog });
  } catch (error: unknown) {
    console.error("Error creating blog:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create blog";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// PUT - Update a blog
export async function PUT(request: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const parsed = blogSchema.safeParse(payload);

    if (!parsed.success || !parsed.data.id) {
      return NextResponse.json(
        { error: "ID is required for update" },
        { status: 400 }
      );
    }

    const region = parsed.data.region === "US" ? Region.US : Region.INDIA;
    const status = parsed.data.status
      ? (parsed.data.status as ContentStatus)
      : undefined;

    const blog = await prisma.blog.update({
      where: { id: parsed.data.id },
      data: {
        slug: parsed.data.slug,
        title: parsed.data.title,
        image: parsed.data.image,
        content: parsed.data.content,
        blogGroupId: parsed.data.blogGroupId,
        authorId: parsed.data.authorId || null,
        readTime: parsed.data.readTime || null,
        region,
        ...(status && { status }),
      },
      include: {
        blogGroup: true,
        author: true,
      },
    });

    revalidateBlogPage(blog.slug || blog.id, blog.region);
    revalidateBlogListing(blog.region);

    return NextResponse.json({ blog });
  } catch (error: unknown) {
    console.error("Error updating blog:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update blog";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE - Delete a blog
export async function DELETE(request: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Blog ID is required" },
        { status: 400 }
      );
    }

    const existingBlog = await prisma.blog.findUnique({
      where: { id },
      select: { id: true, slug: true, region: true },
    });

    await prisma.blog.delete({
      where: { id },
    });

    if (existingBlog) {
      revalidateBlogPage(
        existingBlog.slug || existingBlog.id,
        existingBlog.region
      );
      revalidateBlogListing(existingBlog.region);
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error deleting blog:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete blog";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

