import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Region } from "@prisma/client";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const region = formData.get("region") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    }

    // Convert file to base64 or upload to cloud storage
    // For now, we'll use base64 encoding (in production, use cloud storage like S3, Cloudinary, etc.)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    // Save to MediaAsset table
    const mediaAsset = await prisma.mediaAsset.create({
      data: {
        url: dataUrl,
        alt: file.name,
        mimeType: file.type,
        region: region === "US" ? Region.US : Region.INDIA,
        uploadedBy: session.user.id,
      },
    });

    return NextResponse.json({ url: dataUrl, id: mediaAsset.id });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}

