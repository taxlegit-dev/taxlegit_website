import { NextResponse } from "next/server";
import { Region, ContentStatus } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  createServicePageFAQSchema,
  updateServicePageFAQSchema,
} from "@/lib/validators";
import { revalidateContentPage } from "@/lib/revalidate";

// GET - Fetch FAQ sections for a region
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
    const faq = await prisma.servicePageFAQ.findUnique({
      where: { navbarItemId },
      include: {
        questions: {
          orderBy: { order: "asc" },
        },
      },
    });
    return NextResponse.json({ faq });
  }

  const faqs = await prisma.servicePageFAQ.findMany({
    where: { region },
    include: {
      questions: {
        orderBy: { order: "asc" },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ faqs });
}

// POST - Create a new FAQ section
export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();
  const parsed = createServicePageFAQSchema.safeParse(payload);

  if (!parsed.success) {
    const errorMessages = parsed.error.errors
      .map((err) => `${err.path.join(".")}: ${err.message}`)
      .join(", ");
    return NextResponse.json(
      {
        error: errorMessages || "Validation failed",
        details: parsed.error.flatten(),
      },
      { status: 400 }
    );
  }

  // Verify navbar item exists and matches region
  const navbarItem = await prisma.navbarItem.findUnique({
    where: { id: parsed.data.navbarItemId },
    select: { href: true, region: true },
  });

  if (!navbarItem) {
    return NextResponse.json(
      { error: "Navbar item not found" },
      { status: 404 }
    );
  }

  if (
    navbarItem.region !==
    (parsed.data.region === "US" ? Region.US : Region.INDIA)
  ) {
    return NextResponse.json(
      { error: "Navbar item region mismatch" },
      { status: 400 }
    );
  }

  // Check if FAQ already exists for this navbar item
  const existing = await prisma.servicePageFAQ.findUnique({
    where: { navbarItemId: parsed.data.navbarItemId },
  });

  if (existing) {
    // If FAQ exists, update it instead of creating new
    // Delete existing questions
    await prisma.servicePageFAQItem.deleteMany({
      where: { faqId: existing.id },
    });

    // Update FAQ and create new questions
    const faq = await prisma.servicePageFAQ.update({
      where: { id: existing.id },
      data: {
        status:
          parsed.data.status === "PUBLISHED"
            ? ContentStatus.PUBLISHED
            : ContentStatus.DRAFT,
        questions: {
          create: parsed.data.questions.map((q) => ({
            question: q.question,
            answer: q.answer,
            order: q.order,
          })),
        },
      },
      include: {
        questions: {
          orderBy: { order: "asc" },
        },
      },
    });
    if (navbarItem?.href) {
      revalidateContentPage(navbarItem.href, navbarItem.region);
    }

    return NextResponse.json({
      faq,
      message: "FAQ section updated successfully",
    });
  }

  const faq = await prisma.servicePageFAQ.create({
    data: {
      navbarItemId: parsed.data.navbarItemId,
      region: parsed.data.region === "US" ? Region.US : Region.INDIA,
      status:
        parsed.data.status === "PUBLISHED"
          ? ContentStatus.PUBLISHED
          : ContentStatus.DRAFT,
      questions: {
        create: parsed.data.questions.map((q) => ({
          question: q.question,
          answer: q.answer,
          order: q.order,
        })),
      },
    },
    include: {
      questions: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (navbarItem?.href) {
    revalidateContentPage(navbarItem.href, navbarItem.region);
  }

  return NextResponse.json({ faq });
}

// PUT - Update a FAQ section
export async function PUT(request: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();
  const parsed = updateServicePageFAQSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existing = await prisma.servicePageFAQ.findUnique({
    where: { id: parsed.data.id },
  });

  if (!existing) {
    return NextResponse.json(
      { error: "FAQ section not found" },
      { status: 404 }
    );
  }

  // Verify navbar item if changed
  if (parsed.data.navbarItemId !== existing.navbarItemId) {
    const navbarItem = await prisma.navbarItem.findUnique({
      where: { id: parsed.data.navbarItemId },
    });

    if (!navbarItem) {
      return NextResponse.json(
        { error: "Navbar item not found" },
        { status: 404 }
      );
    }
  }

  // Delete existing questions
  await prisma.servicePageFAQItem.deleteMany({
    where: { faqId: existing.id },
  });

  // Update FAQ and create new questions
  const faq = await prisma.servicePageFAQ.update({
    where: { id: parsed.data.id },
    data: {
      navbarItemId: parsed.data.navbarItemId,
      status:
        parsed.data.status === "PUBLISHED"
          ? ContentStatus.PUBLISHED
          : ContentStatus.DRAFT,
      questions: {
        create: parsed.data.questions.map((q) => ({
          question: q.question,
          answer: q.answer,
          order: q.order,
        })),
      },
    },
    include: {
      questions: {
        orderBy: { order: "asc" },
      },
    },
  });

  const navbarItem = await prisma.navbarItem.findUnique({
    where: { id: parsed.data.navbarItemId },
    select: { href: true, region: true },
  });

  if (navbarItem?.href) {
    revalidateContentPage(navbarItem.href, navbarItem.region);
  }

  return NextResponse.json({ faq });
}

// DELETE - Delete a FAQ section
export async function DELETE(request: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "FAQ ID is required" }, { status: 400 });
  }

  const faq = await prisma.servicePageFAQ.findUnique({
    where: { id },
  });

  await prisma.servicePageFAQ.delete({
    where: { id },
  });

  if (faq) {
    const navbarItem = await prisma.navbarItem.findUnique({
      where: { id: faq.navbarItemId },
      select: { href: true, region: true },
    });

    if (navbarItem?.href) {
      revalidateContentPage(navbarItem.href, navbarItem.region);
    }
  }

  return NextResponse.json({
    success: true,
    message: "FAQ section deleted successfully",
  });
}
