import { NextResponse } from "next/server";
import { Region, ContentStatus, Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const genericPageSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(1, "Slug is required"),
  region: z.enum(["INDIA", "US"]),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});

// GET - Fetch all generic pages for a region
export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const regionParam = searchParams.get("region");
  const slug = searchParams.get("slug");
  const pageId = searchParams.get("id");

  const where: Prisma.GenericPageWhereInput = {};
  if (regionParam) {
    where.region = regionParam === "US" ? Region.US : Region.INDIA;
  }
  if (slug) {
    where.slug = slug;
  }
  if (pageId) {
    where.id = pageId;
  }

  const genericPages = await prisma.genericPage.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ genericPages });
}

// POST - Create a new generic page
export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const parsed = genericPageSchema.safeParse(payload);

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

    // Check if generic page already exists for this slug and region
    const existingPage = await prisma.genericPage.findUnique({
      where: {
        slug,
        region,
      },
    });

    if (existingPage) {
      return NextResponse.json(
        { error: "Generic page already exists for this slug and region" },
        { status: 400 }
      );
    }

    const genericPage = await prisma.genericPage.create({
      data: {
        slug: parsed.data.slug,
        region,
        title: parsed.data.title,
        content: parsed.data.content,
        status,
      },
    });

    return NextResponse.json({ genericPage });
  } catch (error: unknown) {
    console.error("Error creating generic page:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create generic page";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// PUT - Update a generic page
export async function PUT(request: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const parsed = genericPageSchema.safeParse(payload);

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

    const genericPage = await prisma.genericPage.update({
      where: { id: parsed.data.id },
      data: {
        slug: parsed.data.slug,
        region,
        title: parsed.data.title,
        content: parsed.data.content,
        ...(status && { status }),
      },
    });

    return NextResponse.json({ genericPage });
  } catch (error: unknown) {
    console.error("Error updating generic page:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update generic page";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE - Delete a generic page
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
        { error: "Generic page ID is required" },
        { status: 400 }
      );
    }

    await prisma.genericPage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error deleting generic page:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete generic page";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}