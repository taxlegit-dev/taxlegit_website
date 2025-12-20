import { NextResponse } from "next/server";
import { Region } from "@prisma/client";
import { prisma } from "@/lib/prisma";

// GET - Fetch service page sections by navbarItemId
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const navbarItemId = searchParams.get("navbarItemId");
  const regionParam = searchParams.get("region");
  const region = regionParam === "US" ? Region.US : Region.INDIA;

  if (!navbarItemId) {
    return NextResponse.json(
      { error: "navbarItemId is required" },
      { status: 400 }
    );
  }

  try {
    const servicePage = await prisma.servicePage.findUnique({
      where: {
        navbarItemId_region: {
          navbarItemId,
          region,
        },
      },
      include: {
        sections: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!servicePage || servicePage.status !== "PUBLISHED") {
      return NextResponse.json({ error: "Service page not found" }, { status: 404 });
    }

    return NextResponse.json({
      sections: servicePage.sections,
    });
  } catch (error: unknown) {
    console.error("Error fetching service page:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch service page";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}