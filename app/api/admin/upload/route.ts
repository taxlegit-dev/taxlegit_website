import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Region } from "@prisma/client";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

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
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    const awsRegion = process.env.AWS_REGION;
    const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    if (!awsRegion || !awsAccessKeyId || !awsSecretAccessKey || !bucketName) {
      return NextResponse.json(
        { error: "AWS S3 configuration missing" },
        { status: 500 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = `uploads/${
      region?.toLowerCase() || "unknown"
    }/${Date.now()}-${safeName}`;

    const s3 = new S3Client({
      region: awsRegion,
      credentials: {
        accessKeyId: awsAccessKeyId,
        secretAccessKey: awsSecretAccessKey,
      },
    });

    await s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      })
    );

    const url = `https://${bucketName}.s3.${awsRegion}.amazonaws.com/${key}`;

    // Save to MediaAsset table
    const mediaAsset = await prisma.mediaAsset.create({
      data: {
        url,
        alt: file.name,
        mimeType: file.type,
        region: region === "US" ? Region.US : Region.INDIA,
        uploadedBy: session.user.id,
      },
    });

    return NextResponse.json({ url, id: mediaAsset.id });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed", details: String(error) },
      { status: 500 }
    );
  }
}
