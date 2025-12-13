import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MetaPageType } from "@prisma/client";

// GET - Fetch meta data for a specific page (public, no auth required)
export async function GET(request: Request) {
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

