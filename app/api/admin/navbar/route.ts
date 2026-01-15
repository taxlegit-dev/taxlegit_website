import { NextResponse } from "next/server";
import { NavbarItemType, NavbarPageType, Region } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  createNavItemSchema,
  updateNavItemSchema,
  reorderNavItemsSchema,
} from "@/lib/validators";
import { revalidateContentPage, revalidateNavbarItems } from "@/lib/revalidate";

const navTypeMap: Record<"LINK" | "DROPDOWN", NavbarItemType> = {
  LINK: NavbarItemType.LINK,
  DROPDOWN: NavbarItemType.DROPDOWN,
};

const pageTypeMap: Record<"SERVICE" | "GENERIC", NavbarPageType> = {
  SERVICE: NavbarPageType.SERVICE,
  GENERIC: NavbarPageType.GENERIC,
};

// GET - Fetch all navbar items for a region
export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const regionParam = searchParams.get("region");
  const region = regionParam === "US" ? Region.US : Region.INDIA;

  const items = await prisma.navbarItem.findMany({
    where: {
      region,
    },
    include: {
      children: {
        orderBy: { order: "asc" },
      },
    },
    orderBy: { order: "asc" },
  });

  // Separate top-level items and their children
  const topLevelItems = items.filter((item) => !item.parentId);
  const structuredItems = topLevelItems.map((item) => ({
    ...item,
    href:
      item.pageType === NavbarPageType.GENERIC
        ? `/gen/${item.href}`
        : item.href,
    children: item.children.map((child) => ({
      ...child,
      href:
        child.pageType === NavbarPageType.GENERIC
          ? `/gen/${child.href}`
          : child.href,
    })),
  }));

  return NextResponse.json({ items: structuredItems });
}

// POST - Create a new navbar item
export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();
  const parsed = createNavItemSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // Validate parent exists if parentId is provided
  if (parsed.data.parentId) {
    const parent = await prisma.navbarItem.findUnique({
      where: { id: parsed.data.parentId },
    });

    if (!parent) {
      return NextResponse.json(
        { error: "Parent item not found" },
        { status: 404 }
      );
    }

    if (
      parent.region !== (parsed.data.region === "US" ? Region.US : Region.INDIA)
    ) {
      return NextResponse.json(
        { error: "Parent item must be in the same region" },
        { status: 400 }
      );
    }
  }

  const item = await prisma.navbarItem.create({
    data: {
      label: parsed.data.label,
      href: parsed.data.href,
      order: parsed.data.order ?? 0,
      type: navTypeMap[parsed.data.type],
      pageType: pageTypeMap[parsed.data.pageType],
      region: parsed.data.region === "US" ? Region.US : Region.INDIA,
      isLoginLink: parsed.data.isLoginLink ?? false,
      ...(parsed.data.parentId && parsed.data.parentId.trim() !== ""
        ? { parent: { connect: { id: parsed.data.parentId } } }
        : {}),
      groupLabel: parsed.data.groupLabel,
    },
    include: {
      parent: true,
      children: true,
    },
  });

  revalidateNavbarItems(parsed.data.region === "US" ? Region.US : Region.INDIA);

  return NextResponse.json({ item });
}

// Define a proper type for update data
type UpdateData = {
  label?: string;
  href?: string;
  order?: number;
  type?: NavbarItemType;
  pageType?: NavbarPageType;
  isLoginLink?: boolean;
  groupLabel?: string | null;
  isActive?: boolean;
  parent?: { connect: { id: string } } | { disconnect: boolean };
};

// PUT - Update a navbar item
export async function PUT(request: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();
  const parsed = updateNavItemSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // Check if item exists
  const existingItem = await prisma.navbarItem.findUnique({
    where: { id: parsed.data.id },
  });

  if (!existingItem) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  // Validate parent if parentId is being changed
  if (parsed.data.parentId && parsed.data.parentId !== existingItem.parentId) {
    const parent = await prisma.navbarItem.findUnique({
      where: { id: parsed.data.parentId },
    });

    if (!parent) {
      return NextResponse.json(
        { error: "Parent item not found" },
        { status: 404 }
      );
    }

    // Prevent circular references
    if (parsed.data.parentId === parsed.data.id) {
      return NextResponse.json(
        { error: "Item cannot be its own parent" },
        { status: 400 }
      );
    }

    // Check if parent is a descendant (prevent deep nesting)
    const checkDescendant = async (
      itemId: string,
      targetId: string
    ): Promise<boolean> => {
      const item = await prisma.navbarItem.findUnique({
        where: { id: itemId },
        include: { children: true },
      });
      if (!item) return false;
      if (item.children.some((child) => child.id === targetId)) return true;
      for (const child of item.children) {
        if (await checkDescendant(child.id, targetId)) return true;
      }
      return false;
    };

    if (await checkDescendant(parsed.data.id, parsed.data.parentId)) {
      return NextResponse.json(
        { error: "Cannot set parent to a descendant" },
        { status: 400 }
      );
    }
  }

  const updateData: UpdateData = {
    label: parsed.data.label,
    href: parsed.data.href,
    order: parsed.data.order,
    type: parsed.data.type ? navTypeMap[parsed.data.type] : undefined,
    pageType: parsed.data.pageType
      ? pageTypeMap[parsed.data.pageType]
      : undefined,
    isLoginLink: parsed.data.isLoginLink ?? false,
    groupLabel: parsed.data.groupLabel,
    isActive: parsed.data.isActive ?? existingItem.isActive,
  };

  // Handle parentId: if provided and not empty, connect; if empty string, disconnect; if undefined, don't change
  if (parsed.data.parentId !== undefined) {
    if (parsed.data.parentId.trim() !== "") {
      updateData.parent = { connect: { id: parsed.data.parentId } };
    } else {
      updateData.parent = { disconnect: true };
    }
  }

  const item = await prisma.navbarItem.update({
    where: { id: parsed.data.id },
    data: updateData,
    include: {
      parent: true,
      children: true,
    },
  });

  revalidateNavbarItems(existingItem.region);
  revalidateContentPage(existingItem.href, existingItem.region);
  if (item.href && item.href !== existingItem.href) {
    revalidateContentPage(item.href, item.region);
  }

  return NextResponse.json({ item });
}

// DELETE - Delete a navbar item
// DELETE - Delete a navbar item
export async function DELETE(request: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Item ID is required" },
        { status: 400 }
      );
    }

    // Check if item exists
    const existingItem = await prisma.navbarItem.findUnique({
      where: { id },
      include: { children: true },
    });

    if (!existingItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // Store region before deletion
    const region = existingItem.region;

    // Delete item (children will be cascade deleted)
    await prisma.navbarItem.delete({
      where: { id },
    });

    // Revalidate after successful deletion
    try {
      await revalidateNavbarItems(region);
      revalidateContentPage(existingItem.href, region);
    } catch (revalidateError) {
      console.error("Revalidation error:", revalidateError);
      // Continue even if revalidation fails
    }

    return NextResponse.json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      {
        error: "Failed to delete item",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// PATCH - Reorder navbar items
export async function PATCH(request: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();
  const parsed = reorderNavItemsSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // Update order for all items in a transaction
  await prisma.$transaction(
    parsed.data.items.map((item) =>
      prisma.navbarItem.update({
        where: { id: item.id },
        data: { order: item.order },
      })
    )
  );

  revalidateNavbarItems(parsed.data.region === "US" ? Region.US : Region.INDIA);

  return NextResponse.json({
    success: true,
    message: "Items reordered successfully",
  });
}
