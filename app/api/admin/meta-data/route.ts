import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MetaPageType } from "@prisma/client";
import { z } from "zod";

const metaDataSchema = z.object({
  pageType: z.enum(["SERVICE", "BLOG", "HERO"]),
  pageId: z.string().min(1),
  metaBlock: z.string(),
});

// GET - Fetch meta data for a specific page
export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const pageType = searchParams.get("pageType") as MetaPageType | null;
    const pageId = searchParams.get("pageId");

    if (!pageType || !pageId) {
      return NextResponse.json(
        { error: "pageType and pageId are required" },
        { status: 400 }
      );
    }

    const metaData = await prisma.metaData.findUnique({
      where: {
        pageType_pageId: {
          pageType,
          pageId,
        },
      },
    });

    return NextResponse.json({ metaData });
  } catch (error: unknown) {
    console.error("Error fetching meta data:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch meta data";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST - Create new meta data
export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const parsed = metaDataSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: parsed.error.errors },
        { status: 400 }
      );
    }

    const pageType = parsed.data.pageType as MetaPageType;

    // Check if meta data already exists
    const existing = await prisma.metaData.findUnique({
      where: {
        pageType_pageId: {
          pageType,
          pageId: parsed.data.pageId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Meta data already exists. Use PUT to update." },
        { status: 409 }
      );
    }

    const metaData = await prisma.metaData.create({
      data: {
        pageType,
        pageId: parsed.data.pageId,
        metaBlock: parsed.data.metaBlock,
      },
    });

    return NextResponse.json({ metaData });
  } catch (error: unknown) {
    console.error("Error creating meta data:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create meta data";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// PUT - Update existing meta data
export async function PUT(request: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const parsed = metaDataSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: parsed.error.errors },
        { status: 400 }
      );
    }

    const pageType = parsed.data.pageType as MetaPageType;

    const metaData = await prisma.metaData.upsert({
      where: {
        pageType_pageId: {
          pageType,
          pageId: parsed.data.pageId,
        },
      },
      update: {
        metaBlock: parsed.data.metaBlock,
      },
      create: {
        pageType,
        pageId: parsed.data.pageId,
        metaBlock: parsed.data.metaBlock,
      },
    });

    return NextResponse.json({ metaData });
  } catch (error: unknown) {
    console.error("Error updating meta data:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update meta data";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE - Delete meta data
export async function DELETE(request: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const pageType = searchParams.get("pageType") as MetaPageType | null;
    const pageId = searchParams.get("pageId");

    if (!pageType || !pageId) {
      return NextResponse.json(
        { error: "pageType and pageId are required" },
        { status: 400 }
      );
    }

    await prisma.metaData.delete({
      where: {
        pageType_pageId: {
          pageType,
          pageId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error deleting meta data:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete meta data";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
