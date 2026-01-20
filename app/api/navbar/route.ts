import { NextResponse } from "next/server";
import { Region } from "@prisma/client";
import { prisma } from "@/lib/prisma";

// GET - Fetch navbar items for a region (public endpoint)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const regionParam = searchParams.get("region");
  const region = regionParam === "US" ? Region.US : Region.INDIA;

  const items = await prisma.navbarItem.findMany({
    where: {
      region,
      isActive: true,
    },
    include: {
      children: {
        where: {
          isActive: true,
        },
        orderBy: { order: "asc" },
      },
    },
    orderBy: { order: "asc" },
  });

  // Separate top-level items and their children
  const topLevelItems = items.filter((item) => !item.parentId);

  const structuredItems = topLevelItems.map((item) => {
    const children = item.children;

    const groupedChildren = children.reduce((acc, child) => {
      const groupKey = child.groupLabel || "default";
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(child);
      return acc;
    }, {} as Record<string, typeof children>);

    return {
      id: item.id,
      label: item.label,
      href: item.href,
      type: item.type,
      isLoginLink: item.isLoginLink,
      order: item.order,
      groups: Object.entries(groupedChildren).map(([groupLabel, items]) => ({
        label: groupLabel === "default" ? null : groupLabel,
        items: items.map((child) => ({
          id: child.id,
          label: child.label,
          href: child.href,
          order: child.order,
        })),
      })),
    };
  });

  return NextResponse.json({ items: structuredItems, region });
}

// POST - Fetch services for contact form
export async function POST(request: Request) {
  const { region } = await request.json();
  const regionEnum = region === "US" ? Region.US : Region.INDIA;

  const services = await prisma.navbarItem.findMany({
    where: {
      region: regionEnum,
      isActive: true,
      pageType: "SERVICE",
    },
    select: {
      label: true,
    },
    orderBy: { order: "asc" },
  });

  const serviceLabels = services.map((s) => s.label);

  return NextResponse.json({ services: serviceLabels });
}
