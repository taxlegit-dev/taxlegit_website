import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST - Increment blog view count
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Blog ID is required" },
        { status: 400 }
      );
    }

    // Increment view count atomically
    const blog = await prisma.blog.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
      select: {
        viewCount: true,
      },
    });

    return NextResponse.json({ viewCount: blog.viewCount });
  } catch (error: unknown) {
    console.error("Error incrementing view count:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to increment view count";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

