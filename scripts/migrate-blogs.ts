import mysql from "mysql2/promise";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const maria = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "taxlegit_old",
  });

  // 1️⃣ Blog Categories → BlogGroup (with upsert to handle duplicates)
  const [cats]: any[] = await maria.query("SELECT * FROM blog_categories");
  const groupMap: Record<number, string> = {};

  for (const c of cats) {
    const groupName =
      c.name || c.title || c.category_name || c.slug || `Category-${c.id}`;

    // Use upsert instead of create to handle duplicates
    const group = await prisma.blogGroup.upsert({
      where: {
        name_region: {
          name: String(groupName),
          region: "INDIA",
        },
      },
      update: {}, // Don't update if exists
      create: {
        name: String(groupName),
        region: "INDIA",
        order: c.order || 0,
      },
    });

    groupMap[c.id] = group.id;
  }

  console.log(`✅ Migrated ${Object.keys(groupMap).length} blog categories`);

  // 2️⃣ Ensure fallback category
  const fallbackGroup = await prisma.blogGroup.upsert({
    where: {
      name_region: {
        name: "Uncategorized",
        region: "INDIA",
      },
    },
    update: {},
    create: {
      name: "Uncategorized",
      region: "INDIA",
    },
  });

  // 3️⃣ Blogs → Blog
  const [blogs]: any[] = await maria.query(
    "SELECT * FROM blogs WHERE deleted_at IS NULL"
  );

  let migratedCount = 0;
  let skippedCount = 0;

  for (const b of blogs) {
    const groupId = groupMap[b.blog_category_id] || fallbackGroup.id;

    try {
      await prisma.blog.create({
        data: {
          title: b.blog_title || "Untitled Blog",
          content: b.blog_detail || "",
          image: b.image || null,
          region: "INDIA",
          status: b.status === 1 ? "PUBLISHED" : "DRAFT",
          blogGroupId: groupId,
          viewCount: b.likes || 0,
          readTime: null, // You can calculate this if needed
          createdAt: b.created_at ? new Date(b.created_at) : undefined,
          updatedAt: b.updated_at ? new Date(b.updated_at) : undefined,
        },
      });
      migratedCount++;
    } catch (error: any) {
      console.error(`❌ Failed to migrate blog #${b.id}: ${b.blog_title}`);
      console.error(error.message);
      skippedCount++;
    }
  }

  await maria.end();
  await prisma.$disconnect();

  console.log(`✅ Migration complete!`);
  console.log(`   Blogs migrated: ${migratedCount}`);
  console.log(`   Blogs skipped: ${skippedCount}`);
}

main().catch(console.error);
