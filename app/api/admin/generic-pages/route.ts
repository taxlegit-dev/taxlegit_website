import { NextResponse } from "next/server";
import { Region, ContentStatus, Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { revalidateContentPage } from "@/lib/revalidate";

const genericPageSchema = z.object({
  id: z.string().optional(),
  navbarItemId: z.string().min(1, "Navbar item is required"),
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
  const navbarItemId = searchParams.get("navbarItemId");
  const pageId = searchParams.get("id");

  const where: Prisma.GenericPageWhereInput = {};
  if (regionParam) {
    where.region = regionParam === "US" ? Region.US : Region.INDIA;
  }
  if (navbarItemId) {
    where.navbarItemId = navbarItemId;
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

    const region =
      parsed.data.region === "US" ? Region.US : Region.INDIA;

    const status = ContentStatus.PUBLISHED;

    // ✅ Correct uniqueness check
    const existingPage = await prisma.genericPage.findUnique({
      where: {
        navbarItemId_region: {
          navbarItemId: parsed.data.navbarItemId,
          region,
        },
      },
    });

    if (existingPage) {
      return NextResponse.json(
        { error: "Generic page already exists for this navbar item and region" },
        { status: 400 }
      );
    }

    const genericPage = await prisma.genericPage.create({
      data: {
        navbarItemId: parsed.data.navbarItemId,
        region,
        title: parsed.data.title,
        content: parsed.data.content,
        status,
      },
    });

    const navbarItem = await prisma.navbarItem.findUnique({
      where: { id: parsed.data.navbarItemId },
      select: { href: true },
    });
    revalidateContentPage(navbarItem?.href, region);

    return NextResponse.json({ genericPage });
  } catch (error) {
    console.error("Error creating generic page:", error);
    return NextResponse.json(
      { error: "Failed to create generic page" },
      { status: 500 }
    );
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
    const status = ContentStatus.PUBLISHED;

    const genericPage = await prisma.genericPage.update({
      where: { id: parsed.data.id },
      data: {
        navbarItemId: parsed.data.navbarItemId,
        region,
        title: parsed.data.title,
        content: parsed.data.content,
        status,
      },
    });

    const navbarItem = await prisma.navbarItem.findUnique({
      where: { id: parsed.data.navbarItemId },
      select: { href: true },
    });
    revalidateContentPage(navbarItem?.href, region);

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

    const existingPage = await prisma.genericPage.findUnique({
      where: { id },
      select: { navbarItemId: true, region: true },
    });

    await prisma.genericPage.delete({
      where: { id },
    });

    if (existingPage?.navbarItemId) {
      const navbarItem = await prisma.navbarItem.findUnique({
        where: { id: existingPage.navbarItemId },
        select: { href: true },
      });
      revalidateContentPage(navbarItem?.href, existingPage.region);
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error deleting generic page:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete generic page";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
