import mysql from "mysql2/promise";
import {
  PrismaClient,
  NavbarItemType,
  NavbarPageType,
  Region,
  ContentStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

/**
 * ======================================================
 * CONFIG
 * ======================================================
 */

const REGION: Region = Region.INDIA;

// ✅ OLD DB (MySQL / MariaDB)
const OLD_DB = {
  host: "localhost",
  user: "root",
  password: "123456",
  database: "taxlegit_old",
};

// ✅ Base path for services
const SERVICE_BASE_PATH = "/services";

// ✅ ONLY THESE SERVICES WILL BE MIGRATED
const ALLOWED_SERVICES = new Set(
  [
    "MSME Registration",
    "Startup India Registration",
    "ISO Certification",
    "FSSAI License Registration",
    "GST Registration",
    "GEM Registration",
    "DSC Registration",
    "Import Export Code Registration",
    "PF Registration",
    "LEI Registration",
    "Legal Metrology Registration",
    "TDS Return Filing Online",
    "GST Returns Filing Online",
    "Income Tax Returns",
    "Trademark Renewal",
    "Trademark Registration",
    "Vendor Reconciliation",
    "Due Diligence",
    "Shop and Establishment Registration",
  ].map((s) => s.toLowerCase().trim()),
);

/**
 * ======================================================
 * HELPERS
 * ======================================================
 */

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * ======================================================
 * MAIN
 * ======================================================
 */

async function main() {
  const maria = await mysql.createConnection(OLD_DB);

  console.log("\n🚀 Fetching services meta tags from OLD DB...\n");

  // ✅ Fetch services from old DB
  const [services]: any[] = await maria.query(`
    SELECT id, title, slug, meta_tags
    FROM services
    WHERE deleted_at IS NULL
      AND status = 1
    ORDER BY id
  `);

  console.log(`📦 Found ${services.length} services in OLD DB\n`);

  let metaTransferred = 0;
  let skipped = 0;

  for (const svc of services) {
    const title = String(svc.title || "").trim();
    const normalizedTitle = title.toLowerCase().trim();

    // ❌ Skip if title empty
    if (!title) {
      skipped++;
      continue;
    }

    // ❌ Skip if not in whitelist
    if (!ALLOWED_SERVICES.has(normalizedTitle)) {
      console.log(`⏭️  Skipped (not whitelisted): ${title}`);
      skipped++;
      continue;
    }

    const slug = String(svc.slug || "").trim();
    const meta_tags = svc.meta_tags ? String(svc.meta_tags).trim() : "";

    // ❌ Skip if no meta_tags
    if (!meta_tags) {
      console.log(`⚠️  No meta_tags found for: ${title}`);
      skipped++;
      continue;
    }

    // ✅ Build href
    const finalSlug = slug || slugify(title);
    const href = `${SERVICE_BASE_PATH}/${finalSlug}`;

    // =====================================================
    // NAVBAR ITEM
    // =====================================================
    let navbarItem = await prisma.navbarItem.findFirst({
      where: {
        region: REGION,
        pageType: NavbarPageType.SERVICE,
        OR: [{ label: title }, { href }],
      },
    });

    if (!navbarItem) {
      navbarItem = await prisma.navbarItem.create({
        data: {
          label: title,
          href,
          region: REGION,
          pageType: NavbarPageType.SERVICE,
          type: NavbarItemType.LINK,
          isActive: true,
          order: svc.id || 0,
        },
      });

      console.log(`✨ Created NavbarItem: ${title}`);
    }

    // =====================================================
    // SERVICE PAGE (ENSURE EXISTS)
    // =====================================================
    await prisma.servicePage.upsert({
      where: {
        navbarItemId_region: {
          navbarItemId: navbarItem.id,
          region: REGION,
        },
      },
      update: {
        status: ContentStatus.PUBLISHED,
      },
      create: {
        navbarItemId: navbarItem.id,
        region: REGION,
        status: ContentStatus.PUBLISHED,
      },
    });

    // =====================================================
    // META DATA (TRANSFER meta_tags)
    // =====================================================
    await prisma.metaData.upsert({
      where: {
        pageType_pageId: {
          pageType: "SERVICE",
          pageId: navbarItem.id,
        },
      },
      update: {
        metaBlock: meta_tags,
      },
      create: {
        pageType: "SERVICE",
        pageId: navbarItem.id,
        metaBlock: meta_tags,
      },
    });

    metaTransferred++;
    console.log(`✅ Meta transferred: ${title}`);
  }

  await maria.end();
  await prisma.$disconnect();

  console.log("\n🎉 MIGRATION COMPLETE");
  console.log(`✅ Meta transferred: ${metaTransferred}`);
  console.log(`⏭️ Skipped: ${skipped}\n`);
}

/**
 * ======================================================
 * EXEC
 * ======================================================
 */

main().catch((error) => {
  console.error("\n❌ Migration failed:\n", error);
  process.exit(1);
});
