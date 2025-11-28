import { NextResponse } from "next/server";
import { Region, ContentStatus } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const servicePageSectionSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  order: z.number().min(1).max(10),
});

const servicePageSchema = z.object({
  id: z.string().optional(),
  navbarItemId: z.string().min(1, "Navbar item is required"),
  region: z.enum(["INDIA", "US"]),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  sections: z.array(servicePageSectionSchema).min(1, "At least one section is required"),
});

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const region = searchParams.get("region");
  const navbarItemId = searchParams.get("navbarItemId");

  const where: any = {};
  if (region) {
    where.region = region === "US" ? Region.US : Region.INDIA;
  }
  if (navbarItemId) {
    where.navbarItemId = navbarItemId;
  }

  const servicePages = await prisma.servicePage.findMany({
    where,
    include: {
      sections: {
        orderBy: { order: "asc" },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ servicePages });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const parsed = servicePageSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const region = parsed.data.region === "US" ? Region.US : Region.INDIA;
    const status = parsed.data.status ? (parsed.data.status as ContentStatus) : ContentStatus.DRAFT;

    // Check if service page already exists
    const existing = await prisma.servicePage.findUnique({
      where: { navbarItemId: parsed.data.navbarItemId },
    });

    if (existing) {
      // Update existing service page
      const servicePage = await prisma.servicePage.update({
        where: { id: existing.id },
        data: {
          region,
          status,
        },
      });

      // Delete existing sections
      await prisma.servicePageSection.deleteMany({
        where: { servicePageId: servicePage.id },
      });

      // Create new sections
      const sections = await Promise.all(
        parsed.data.sections.map((section) =>
          prisma.servicePageSection.create({
            data: {
              servicePageId: servicePage.id,
              title: section.title,
              content: section.content,
              order: section.order,
            },
          })
        )
      );

      return NextResponse.json({ servicePage: { ...servicePage, sections } });
    } else {
      // Create new service page
      const servicePage = await prisma.servicePage.create({
        data: {
          navbarItemId: parsed.data.navbarItemId,
          region,
          status,
          sections: {
            create: parsed.data.sections.map((section) => ({
              title: section.title,
              content: section.content,
              order: section.order,
            })),
          },
        },
        include: {
          sections: {
            orderBy: { order: "asc" },
          },
        },
      });

      return NextResponse.json({ servicePage });
    }
  } catch (error: any) {
    console.error("Error creating/updating service page:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save service page" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  return POST(request); // Same logic for update
}

