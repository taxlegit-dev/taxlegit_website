import { NextResponse } from "next/server";
import { Region } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { revalidateBlogListing, revalidateBlogPage } from "@/lib/revalidate";

const blogAuthorSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Author name is required"),
  image: z.string().optional(),
  description: z.string().optional(),
  region: z.enum(["INDIA", "US"]),
});

// GET - Fetch all blog authors for a region
export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const regionParam = searchParams.get("region");
  const region = regionParam === "US" ? Region.US : Region.INDIA;

  const blogAuthors = await prisma.blogAuthor.findMany({
    where: { region },
    include: {
      blogs: {
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ blogAuthors });
}

// POST - Create a new blog author
export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const parsed = blogAuthorSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const region = parsed.data.region === "US" ? Region.US : Region.INDIA;

    const blogAuthor = await prisma.blogAuthor.create({
      data: {
        name: parsed.data.name,
        image: parsed.data.image,
        description: parsed.data.description,
        region,
      },
      include: {
        blogs: true,
      },
    });

    revalidateBlogListing(blogAuthor.region);

    return NextResponse.json({ blogAuthor });
  } catch (error: unknown) {
    console.error("Error creating blog author:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create blog author";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// PUT - Update a blog author
export async function PUT(request: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const parsed = blogAuthorSchema.safeParse(payload);

    if (!parsed.success || !parsed.data.id) {
      return NextResponse.json(
        { error: "ID is required for update" },
        { status: 400 }
      );
    }

    const blogAuthor = await prisma.blogAuthor.update({
      where: { id: parsed.data.id },
      data: {
        name: parsed.data.name,
        image: parsed.data.image,
        description: parsed.data.description,
      },
      include: {
        blogs: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    blogAuthor.blogs.forEach((blog) => {
      revalidateBlogPage(blog.slug || blog.id, blog.region);
    });
    revalidateBlogListing(blogAuthor.region);

    return NextResponse.json({ blogAuthor });
  } catch (error: unknown) {
    console.error("Error updating blog author:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update blog author";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE - Delete a blog author
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
        { error: "Blog author ID is required" },
        { status: 400 }
      );
    }

    // Check if author has blogs
    const author = await prisma.blogAuthor.findUnique({
      where: { id },
      include: { blogs: true },
    });

    if (author && author.blogs.length > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete author with existing blogs. Please remove or reassign blogs first.",
        },
        { status: 400 }
      );
    }

    await prisma.blogAuthor.delete({
      where: { id },
    });

    if (author) {
      revalidateBlogListing(author.region);
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error deleting blog author:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete blog author";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

