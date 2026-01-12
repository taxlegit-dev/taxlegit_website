import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidateContentPage } from "@/lib/revalidate";

// DELETE - Delete a service page
export async function DELETE(request: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const servicePageId = searchParams.get("id");

    if (!servicePageId) {
      return NextResponse.json(
        { error: "Service page ID is required" },
        { status: 400 }
      );
    }

    // Verify service page exists
    const existingServicePage = await prisma.servicePage.findUnique({
      where: { id: servicePageId },
      include: {
        sections: true,
      },
    });

    if (!existingServicePage) {
      return NextResponse.json(
        { error: "Service page not found" },
        { status: 404 }
      );
    }

    // Delete the service page (sections will be cascade deleted due to Prisma schema)
    await prisma.servicePage.delete({
      where: { id: servicePageId },
    });

    const navbarItem = await prisma.navbarItem.findUnique({
      where: { id: existingServicePage.navbarItemId },
      select: { href: true, region: true },
    });

    if (navbarItem?.href) {
      revalidateContentPage(navbarItem.href, navbarItem.region);
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error deleting service page:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete service page";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
