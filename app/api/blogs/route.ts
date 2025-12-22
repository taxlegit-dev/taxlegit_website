import { NextResponse } from "next/server";
import { Region, ContentStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

// Public API - Fetch published blogs for a region
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const regionParam = searchParams.get("region");
  const blogGroupId = searchParams.get("blogGroupId");
  const blogId = searchParams.get("id");

  const region = regionParam === "US" ? Region.US : Region.INDIA;

  const where: Prisma.BlogWhereInput = {
    region,
    status: ContentStatus.PUBLISHED,
  };

  if (blogGroupId) {
    where.blogGroupId = blogGroupId;
  }
  if (blogId) {
    where.id = blogId;
  }

  const blogs = await prisma.blog.findMany({
    where,
    include: {
      blogGroup: true,
      author: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ blogs });
}

