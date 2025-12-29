import { NextResponse } from "next/server";
import { Region } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { revalidateContentPage } from "@/lib/revalidate";

const sectionCreateSchema = z.object({
  servicePageId: z.string().optional(),
  navbarItemId: z.string().optional(),
  region: z.enum(["INDIA", "US"]).optional(),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  order: z.number().min(1).max(10),
}).refine(
  (data) => data.servicePageId || (data.navbarItemId && data.region),
  {
    message: "Either servicePageId or (navbarItemId and region) must be provided",
  }
);

const sectionUpdateSchema = z.object({
  id: z.string().min(1, "Section ID is required"),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  order: z.number().min(1).max(10),
});

// POST - Create new section for existing service page or create service page if needed
export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const parsed = sectionCreateSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    let servicePageId = parsed.data.servicePageId;

    // If servicePageId not provided, find or create service page
    if (!servicePageId) {
      if (!parsed.data.navbarItemId || !parsed.data.region) {
        return NextResponse.json(
          { error: "navbarItemId and region are required when servicePageId is not provided" },
          { status: 400 }
        );
      }

      const region = parsed.data.region === "US" ? Region.US : Region.INDIA;

      // Find or create service page
      let servicePage = await prisma.servicePage.findFirst({
        where: {
          navbarItemId: parsed.data.navbarItemId,
          region: region,
        },
      });

      if (!servicePage) {
        servicePage = await prisma.servicePage.create({
          data: {
            navbarItemId: parsed.data.navbarItemId,
            region: region,
            status: "PUBLISHED",
          },
        });
      }

      servicePageId = servicePage.id;
    } else {
      // Verify service page exists
      const servicePage = await prisma.servicePage.findUnique({
        where: { id: servicePageId },
      });

      if (!servicePage) {
        return NextResponse.json(
          { error: "Service page not found" },
          { status: 404 }
        );
      }
    }

    // Create the section
    const section = await prisma.servicePageSection.create({
      data: {
        servicePageId: servicePageId,
        title: parsed.data.title,
        content: parsed.data.content,
        order: parsed.data.order,
      },
    });

    const servicePage = await prisma.servicePage.findUnique({
      where: { id: servicePageId },
      select: {
        navbarItem: {
          select: { href: true, region: true },
        },
      },
    });

    if (servicePage?.navbarItem?.href) {
      revalidateContentPage(
        servicePage.navbarItem.href,
        servicePage.navbarItem.region
      );
    }

    return NextResponse.json({ section });
  } catch (error: unknown) {
    console.error("Error creating section:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create section";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// PUT - Update existing section
export async function PUT(request: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const parsed = sectionUpdateSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Verify section exists
    const existingSection = await prisma.servicePageSection.findUnique({
      where: { id: parsed.data.id },
    });

    if (!existingSection) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    // Update the section
    const section = await prisma.servicePageSection.update({
      where: { id: parsed.data.id },
      data: {
        title: parsed.data.title,
        content: parsed.data.content,
        order: parsed.data.order,
      },
    });

    const servicePage = await prisma.servicePage.findUnique({
      where: { id: existingSection.servicePageId },
      select: {
        navbarItem: {
          select: { href: true, region: true },
        },
      },
    });

    if (servicePage?.navbarItem?.href) {
      revalidateContentPage(
        servicePage.navbarItem.href,
        servicePage.navbarItem.region
      );
    }

    return NextResponse.json({ section });
  } catch (error: unknown) {
    console.error("Error updating section:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update section";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE - Delete a section
export async function DELETE(request: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const sectionId = searchParams.get("id");

    if (!sectionId) {
      return NextResponse.json(
        { error: "Section ID is required" },
        { status: 400 }
      );
    }

    // Verify section exists
    const existingSection = await prisma.servicePageSection.findUnique({
      where: { id: sectionId },
    });

    if (!existingSection) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    // Delete the section
    await prisma.servicePageSection.delete({
      where: { id: sectionId },
    });

    const servicePage = await prisma.servicePage.findUnique({
      where: { id: existingSection.servicePageId },
      select: {
        navbarItem: {
          select: { href: true, region: true },
        },
      },
    });

    if (servicePage?.navbarItem?.href) {
      revalidateContentPage(
        servicePage.navbarItem.href,
        servicePage.navbarItem.region
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error deleting section:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete section";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

