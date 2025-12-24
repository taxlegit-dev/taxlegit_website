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

  console.log("🚀 Starting services content migration...\n");

  const [services]: any[] = await maria.query(
    "SELECT * FROM services WHERE deleted_at IS NULL AND status = 1 ORDER BY id"
  );

  console.log(`📦 Found ${services.length} services to migrate\n`);

  let successCount = 0;
  let errorCount = 0;
  let createdNavItems = 0;

  for (const svc of services) {
    try {
      console.log(`⏳ Migrating content for: ${svc.title}...`);

      let navbarItem = await prisma.navbarItem.findFirst({
        where: {
          label: svc.title,
          region: "INDIA",
          pageType: "SERVICE",
        },
      });

      if (!navbarItem) {
        console.log(
          `⚠️  NavbarItem not found, creating new one for: ${svc.title}`
        );

        const slug = svc.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

        navbarItem = await prisma.navbarItem.create({
          data: {
            label: svc.title,
            slug: slug,
            region: "INDIA",
            pageType: "SERVICE",
            status: "PUBLISHED",
            order: svc.id || 0,
          },
        });

        createdNavItems++;
        console.log(`✨ Created NavbarItem: ${svc.title} (slug: ${slug})`);
      }

      const servicePage = await prisma.servicePage.upsert({
        where: {
          navbarItemId_region: {
            navbarItemId: navbarItem.id,
            region: "INDIA",
          },
        },
        update: {
          status: "PUBLISHED",
        },
        create: {
          navbarItemId: navbarItem.id,
          region: "INDIA",
          status: "PUBLISHED",
        },
      });

      await prisma.servicePageSection.deleteMany({
        where: { servicePageId: servicePage.id },
      });

      // Create Sections with PROPERLY CLEANED HTML
      const sections = [
        {
          title: svc.overview_sidebar_name || "Overview",
          content: cleanHTML(svc.overview) || "",
          order: 1,
        },
        {
          title: svc.documents_sidebar_name || "Documents Required",
          content: cleanHTML(svc.doc_required) || "",
          order: 2,
        },
        {
          title: svc.process_sidebar_name || "Process",
          content: cleanHTML(svc.process) || "",
          order: 3,
        },
        {
          title: svc.fees_sidebar_name || "Fees",
          content: cleanHTML(svc.procedure) || "",
          order: 4,
        },
        {
          title: svc.benefit_sidebar_name || "Benefits",
          content: cleanHTML(svc.Benefit) || "",
          order: 5,
        },
        {
          title: svc.why_sidebar_name || "Why Choose Us",
          content: cleanHTML(svc.why_us) || "",
          order: 6,
        },
      ].filter((s) => s.content && s.content.trim() !== "");

      for (const section of sections) {
        console.log(`  📝 Creating section: ${section.title}`);
        await prisma.servicePageSection.create({
          data: {
            servicePageId: servicePage.id,
            title: section.title,
            content: section.content,
            order: section.order,
          },
        });
      }

      // Create FAQ Section
      if (svc.faqs) {
        const faqData = parseFAQs(svc.faqs);
        if (faqData.length > 0) {
          const faqSection = await prisma.servicePageFAQ.upsert({
            where: {
              navbarItemId_region: {
                navbarItemId: navbarItem.id,
                region: "INDIA",
              },
            },
            update: {
              status: "PUBLISHED",
            },
            create: {
              navbarItemId: navbarItem.id,
              region: "INDIA",
              status: "PUBLISHED",
            },
          });

          await prisma.servicePageFAQItem.deleteMany({
            where: { faqId: faqSection.id },
          });

          for (let i = 0; i < faqData.length; i++) {
            await prisma.servicePageFAQItem.create({
              data: {
                faqId: faqSection.id,
                question: faqData[i].question,
                answer: cleanHTML(faqData[i].answer),
                order: i,
              },
            });
          }
        }
      }

      if (svc.meta_tags) {
        await prisma.metaData.upsert({
          where: {
            pageType_pageId: {
              pageType: "SERVICE",
              pageId: navbarItem.id,
            },
          },
          update: {
            metaBlock: svc.meta_tags,
          },
          create: {
            pageType: "SERVICE",
            pageId: navbarItem.id,
            metaBlock: svc.meta_tags,
          },
        });
      }

      successCount++;
      console.log(`✅ Migrated: ${svc.title}\n`);
    } catch (error: any) {
      errorCount++;
      console.error(`❌ Failed: ${svc.title}`);
      console.error(` Error: ${error.message}\n`);
    }
  }

  await maria.end();
  await prisma.$disconnect();

  console.log("\n🎉 Content Migration Complete!");
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed: ${errorCount}`);
  console.log(`✨ Created NavbarItems: ${createdNavItems}`);
}

// IMPROVED: Clean HTML properly
function cleanHTML(html: string | null): string {
  if (!html) return "";

  let cleaned = html;

  // Step 1: Remove ALL attributes from ALL tags (except href and src)
  cleaned = cleaned.replace(/<(\w+)([^>]*)>/g, (match, tagName, attributes) => {
    // Keep only href for <a> tags and src for <img> tags
    if (tagName.toLowerCase() === "a") {
      const hrefMatch = attributes.match(/href="([^"]*)"/);
      return hrefMatch ? `<${tagName} href="${hrefMatch[1]}">` : `<${tagName}>`;
    }
    if (tagName.toLowerCase() === "img") {
      const srcMatch = attributes.match(/src="([^"]*)"/);
      const altMatch = attributes.match(/alt="([^"]*)"/);
      let result = `<${tagName}`;
      if (srcMatch) result += ` src="${srcMatch[1]}"`;
      if (altMatch) result += ` alt="${altMatch[1]}"`;
      return result + ">";
    }
    // All other tags: remove all attributes
    return `<${tagName}>`;
  });

  // Step 2: Remove unwanted tags completely (span, font, etc)
  cleaned = cleaned.replace(/<\/?span[^>]*>/gi, "");
  cleaned = cleaned.replace(/<\/?font[^>]*>/gi, "");

  // Step 3: Normalize whitespace
  cleaned = cleaned.replace(/\s+/g, " ");
  cleaned = cleaned.replace(/>\s+</g, "><");

  // Step 4: Remove empty tags
  cleaned = cleaned.replace(/<(\w+)>\s*<\/\1>/gi, "");

  // Step 5: Trim
  cleaned = cleaned.trim();

  return cleaned;
}

// Helper: Strip ALL HTML tags (for plain text)
function stripHTML(html: string | null): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Helper: Parse FAQ blob
function parseFAQs(
  faqBlob: Buffer | string
): Array<{ question: string; answer: string }> {
  try {
    let faqText = "";
    if (Buffer.isBuffer(faqBlob)) {
      faqText = faqBlob.toString("utf-8");
    } else {
      faqText = String(faqBlob);
    }

    try {
      const parsed = JSON.parse(faqText);
      if (Array.isArray(parsed)) {
        return parsed.map((item: any) => ({
          question: stripHTML(item.question || item.q || ""),
          answer: item.answer || item.a || "",
        }));
      }
    } catch {
      // Not JSON
    }

    const faqs: Array<{ question: string; answer: string }> = [];
    const lines = faqText.split("\n").filter((l) => l.trim());

    for (let i = 0; i < lines.length; i += 2) {
      if (lines[i] && lines[i + 1]) {
        faqs.push({
          question: stripHTML(lines[i]),
          answer: lines[i + 1].trim(),
        });
      }
    }

    return faqs;
  } catch (error) {
    console.warn("Failed to parse FAQs:", error);
    return [];
  }
}

main().catch(console.error);
