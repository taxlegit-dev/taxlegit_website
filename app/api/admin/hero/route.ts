import { NextResponse } from "next/server";
import { Region, ContentStatus } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createPageHeroSchema, updatePageHeroSchema } from "@/lib/validators";
import { revalidateContentPage } from "@/lib/revalidate";

// GET - Fetch hero sections for a region
export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const regionParam = searchParams.get("region");
  const navbarItemId = searchParams.get("navbarItemId");

  const region = regionParam === "US" ? Region.US : Region.INDIA;

  if (navbarItemId) {
    const hero = await prisma.pageHero.findUnique({
      where: { navbarItemId },
    });
    return NextResponse.json({ hero });
  }

  const heroes = await prisma.pageHero.findMany({
    where: { region },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ heroes });
}

// POST - Create a new hero section
export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();
  const parsed = createPageHeroSchema.safeParse(payload);

  if (!parsed.success) {
    const errorMessages = parsed.error.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');
    return NextResponse.json({ 
      error: errorMessages || "Validation failed",
      details: parsed.error.flatten() 
    }, { status: 400 });
  }

  // Verify navbar item exists and matches region
  const navbarItem = await prisma.navbarItem.findUnique({
    where: { id: parsed.data.navbarItemId },
  });

  if (!navbarItem) {
    return NextResponse.json({ error: "Navbar item not found" }, { status: 404 });
  }

  if (navbarItem.region !== (parsed.data.region === "US" ? Region.US : Region.INDIA)) {
    return NextResponse.json({ error: "Navbar item region mismatch" }, { status: 400 });
  }

  // Check if hero already exists for this navbar item
  // If it exists, we should update it instead (but this is POST, so we'll allow update via PUT)
  const existing = await prisma.pageHero.findUnique({
    where: { navbarItemId: parsed.data.navbarItemId },
  });

  if (existing) {
    // If hero exists, update it instead of creating new
    const hero = await prisma.pageHero.update({
      where: { id: existing.id },
      data: {
        title: parsed.data.title,
        subtitle: parsed.data.subtitle,
        description: parsed.data.description,
        content: parsed.data.content,
        status: parsed.data.status === "PUBLISHED" ? ContentStatus.PUBLISHED : ContentStatus.DRAFT,
      },
    });
    if (navbarItem.href) {
      revalidateContentPage(navbarItem.href, navbarItem.region);
    }

    return NextResponse.json({ hero, message: "Hero section updated successfully" });
  }

  const hero = await prisma.pageHero.create({
    data: {
      navbarItemId: parsed.data.navbarItemId,
      region: parsed.data.region === "US" ? Region.US : Region.INDIA,
      title: parsed.data.title,
      subtitle: parsed.data.subtitle,
      description: parsed.data.description,
      content: parsed.data.content,
      status: parsed.data.status === "PUBLISHED" ? ContentStatus.PUBLISHED : ContentStatus.DRAFT,
    },
  });

  if (navbarItem.href) {
    revalidateContentPage(navbarItem.href, navbarItem.region);
  }

  return NextResponse.json({ hero });
}

// PUT - Update a hero section
export async function PUT(request: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();
  const parsed = updatePageHeroSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.pageHero.findUnique({
    where: { id: parsed.data.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Hero section not found" }, { status: 404 });
  }

  // Verify navbar item if changed
  if (parsed.data.navbarItemId !== existing.navbarItemId) {
    const navbarItem = await prisma.navbarItem.findUnique({
      where: { id: parsed.data.navbarItemId },
    });

    if (!navbarItem) {
      return NextResponse.json({ error: "Navbar item not found" }, { status: 404 });
    }
  }

  const hero = await prisma.pageHero.update({
    where: { id: parsed.data.id },
    data: {
      navbarItemId: parsed.data.navbarItemId,
      title: parsed.data.title,
      subtitle: parsed.data.subtitle,
      description: parsed.data.description,
      content: parsed.data.content,
      status: parsed.data.status === "PUBLISHED" ? ContentStatus.PUBLISHED : ContentStatus.DRAFT,
    },
  });

  const navbarItem = await prisma.navbarItem.findUnique({
    where: { id: parsed.data.navbarItemId },
    select: { href: true, region: true },
  });

  if (navbarItem?.href) {
    revalidateContentPage(navbarItem.href, navbarItem.region);
  }

  return NextResponse.json({ hero });
}

// DELETE - Delete a hero section
export async function DELETE(request: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Hero ID is required" }, { status: 400 });
  }

  const hero = await prisma.pageHero.findUnique({
    where: { id },
  });

  await prisma.pageHero.delete({
    where: { id },
  });

  if (hero) {
    const navbarItem = await prisma.navbarItem.findUnique({
      where: { id: hero.navbarItemId },
      select: { href: true, region: true },
    });

    if (navbarItem?.href) {
      revalidateContentPage(navbarItem.href, navbarItem.region);
    }
  }

  return NextResponse.json({ success: true, message: "Hero section deleted successfully" });
}

