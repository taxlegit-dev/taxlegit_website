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

  console.log("🚀 Starting navbar migration...\n");

  // Step 1: Clear existing data (in correct order due to foreign keys)
  console.log("🗑️  Clearing existing data...");
  await prisma.servicePageFAQItem.deleteMany({});
  await prisma.servicePageFAQ.deleteMany({});
  await prisma.servicePageSection.deleteMany({});
  await prisma.servicePage.deleteMany({});
  await prisma.pageHero.deleteMany({});
  await prisma.metaData.deleteMany({ where: { pageType: "SERVICE" } });
  await prisma.navbarItem.deleteMany({});
  console.log("✅ Cleared all existing service data\n");

  // Step 2: Create Categories (Top Level - DROPDOWN)
  console.log("📁 Creating categories (Level 1)...");
  const [categories]: any[] = await maria.query(
    "SELECT * FROM categories WHERE deleted_at IS NULL ORDER BY id"
  );

  const categoryMap: Record<number, string> = {};

  for (const cat of categories) {
    const navItem = await prisma.navbarItem.create({
      data: {
        label: cat.title,
        href: `/${cat.slug}`,
        type: "DROPDOWN",
        pageType: "GENERIC",
        region: "INDIA",
        isActive: cat.status === 1,
        order: cat.id,
      },
    });

    categoryMap[cat.id] = navItem.id;
    console.log(`  ✅ ${cat.title}`);
  }

  console.log(`\n📊 Created ${Object.keys(categoryMap).length} categories\n`);

  // Step 3: Create Nav Headers (Level 2 - Sub-groups with groupLabel)
  console.log("📂 Creating nav headers (Level 2)...");
  const [headers]: any[] = await maria.query(
    "SELECT * FROM nav_header WHERE deleted_at IS NULL AND status = 1 ORDER BY category_id, id"
  );

  const headerMap: Record<number, string> = {};

  for (const header of headers) {
    const parentId = categoryMap[header.category_id];

    if (!parentId) {
      console.warn(
        `  ⚠️  Skipping ${header.heading} - no parent category found`
      );
      continue;
    }

    // Create header as groupLabel (not a clickable item)
    // We'll use it later to group services
    headerMap[header.id] = header.heading;
    console.log(
      `  ✅ ${header.heading} → under ${getCategoryName(
        header.category_id,
        categories
      )}`
    );
  }

  console.log(`\n📊 Mapped ${Object.keys(headerMap).length} headers\n`);

  // Step 4: Create Services (Level 3 - Actual links with groupLabel)
  console.log("🔗 Creating service links (Level 3)...");
  const [services]: any[] = await maria.query(
    "SELECT s.*, h.heading, h.category_id FROM services s LEFT JOIN nav_header h ON s.heading_id = h.id WHERE s.deleted_at IS NULL AND s.status = 1 ORDER BY h.category_id, s.heading_id, s.level"
  );

  let serviceCount = 0;

  for (const svc of services) {
    const parentId = categoryMap[svc.category_id];
    const groupLabel = headerMap[svc.heading_id];

    if (!parentId) {
      console.warn(`  ⚠️  Skipping ${svc.title} - no parent category`);
      continue;
    }

    await prisma.navbarItem.create({
      data: {
        label: svc.title,
        href: `/${svc.slug || svc.id}`,
        type: "LINK",
        pageType: "SERVICE",
        region: "INDIA",
        isActive: true,
        order: svc.level || 0,
        parentId: parentId,
        groupLabel: groupLabel || null,
      },
    });

    serviceCount++;
    console.log(
      `  ✅ ${svc.title} → under ${getCategoryName(
        svc.category_id,
        categories
      )} / ${groupLabel || "No Group"}`
    );
  }

  console.log(`\n📊 Created ${serviceCount} service links\n`);

  await maria.end();
  await prisma.$disconnect();

  console.log("\n🎉 Navbar migration complete!");
  console.log(`   Categories: ${Object.keys(categoryMap).length}`);
  console.log(`   Headers: ${Object.keys(headerMap).length}`);
  console.log(`   Services: ${serviceCount}`);
}

// Helper function
function getCategoryName(catId: number, categories: any[]): string {
  const cat = categories.find((c) => c.id === catId);
  return cat ? cat.title : "Unknown";
}

main().catch(console.error);
