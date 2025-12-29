import { NextResponse } from "next/server";
import { Region } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { revalidateBlogListing, revalidateBlogPage } from "@/lib/revalidate";

const blogGroupSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Group name is required"),
  region: z.enum(["INDIA", "US"]),
  order: z.number().optional(),
});

// GET - Fetch all blog groups for a region
export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const regionParam = searchParams.get("region");
  const region = regionParam === "US" ? Region.US : Region.INDIA;

  const blogGroups = await prisma.blogGroup.findMany({
    where: { region },
    include: {
      blogs: {
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { order: "asc" },
  });

  return NextResponse.json({ blogGroups });
}

// POST - Create a new blog group
export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const parsed = blogGroupSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const region = parsed.data.region === "US" ? Region.US : Region.INDIA;

    // Check if group already exists
    const existing = await prisma.blogGroup.findUnique({
      where: {
        name_region: {
          name: parsed.data.name,
          region,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Blog group with this name already exists" },
        { status: 400 }
      );
    }

    // Get max order for this region
    const maxOrder = await prisma.blogGroup.findFirst({
      where: { region },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const blogGroup = await prisma.blogGroup.create({
      data: {
        name: parsed.data.name,
        region,
        order: parsed.data.order ?? (maxOrder?.order ?? 0) + 1,
      },
      include: {
        blogs: true,
      },
    });

    revalidateBlogListing(blogGroup.region);

    return NextResponse.json({ blogGroup });
  } catch (error: unknown) {
    console.error("Error creating blog group:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create blog group";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// PUT - Update a blog group
export async function PUT(request: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const parsed = blogGroupSchema.safeParse(payload);

    if (!parsed.success || !parsed.data.id) {
      return NextResponse.json(
        { error: "ID is required for update" },
        { status: 400 }
      );
    }

    const blogGroup = await prisma.blogGroup.update({
      where: { id: parsed.data.id },
      data: {
        name: parsed.data.name,
        order: parsed.data.order,
      },
      include: {
        blogs: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    blogGroup.blogs.forEach((blog) => {
      revalidateBlogPage(blog.slug || blog.id, blog.region);
    });
    revalidateBlogListing(blogGroup.region);

    return NextResponse.json({ blogGroup });
  } catch (error: unknown) {
    console.error("Error updating blog group:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update blog group";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE - Delete a blog group
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
        { error: "Blog group ID is required" },
        { status: 400 }
      );
    }

    const existingGroup = await prisma.blogGroup.findUnique({
      where: { id },
      include: { blogs: true },
    });

    // Delete will cascade to blogs
    await prisma.blogGroup.delete({
      where: { id },
    });

    if (existingGroup) {
      existingGroup.blogs.forEach((blog) => {
        revalidateBlogPage(blog.slug || blog.id, blog.region);
      });
      revalidateBlogListing(existingGroup.region);
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error deleting blog group:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete blog group";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
