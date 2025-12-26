import mysql from "mysql2/promise";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ HTML को Editor.js format में convert करो
function convertHtmlToEditorJs(html: string) {
  if (!html || html.trim() === "") {
    return {
      time: Date.now(),
      blocks: [
        {
          id: generateId(),
          type: "paragraph",
          data: { text: "" },
        },
      ],
    };
  }

  const blocks: any[] = [];

  // Clean HTML
  const cleanText = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");

  // Extract headers and content
  const elements: Array<{ type: string; content: string; level?: number }> = [];

  // Find all headers
  const headerRegex = /<h([1-6])[^>]*>(.*?)<\/h\1>/gi;
  let match;
  let lastIndex = 0;

  while ((match = headerRegex.exec(cleanText)) !== null) {
    const [fullMatch, level, content] = match;
    const index = match.index;

    // Add previous content as paragraph
    if (index > lastIndex) {
      const prevContent = cleanText.substring(lastIndex, index);
      const cleaned = cleanAndSplitParagraphs(prevContent);
      elements.push(...cleaned.map((c) => ({ type: "paragraph", content: c })));
    }

    // Add header
    elements.push({
      type: "header",
      content: stripTags(content).trim(),
      level: parseInt(level),
    });

    lastIndex = index + fullMatch.length;
  }

  // Add remaining content
  if (lastIndex < cleanText.length) {
    const remaining = cleanText.substring(lastIndex);
    const cleaned = cleanAndSplitParagraphs(remaining);
    elements.push(...cleaned.map((c) => ({ type: "paragraph", content: c })));
  }

  // If no structured content found, just split by paragraphs
  if (elements.length === 0) {
    const paragraphs = cleanAndSplitParagraphs(cleanText);
    elements.push(
      ...paragraphs.map((p) => ({ type: "paragraph", content: p }))
    );
  }

  // Convert to Editor.js blocks
  elements.forEach((el) => {
    if (el.type === "header") {
      blocks.push({
        id: generateId(),
        type: "header",
        data: {
          text: el.content,
          level: el.level || 2,
        },
      });
    } else if (el.content.trim()) {
      blocks.push({
        id: generateId(),
        type: "paragraph",
        data: {
          text: el.content,
        },
      });
    }
  });

  // Ensure at least one block
  if (blocks.length === 0) {
    blocks.push({
      id: generateId(),
      type: "paragraph",
      data: { text: "" },
    });
  }

  return {
    time: Date.now(),
    blocks,
    version: "2.29.0",
  };
}

// Helper: Clean and split into paragraphs
function cleanAndSplitParagraphs(html: string): string[] {
  return html
    .split(/<\/p>|<br\s*\/?>|<\/div>/gi)
    .map((p) => stripTags(p).trim())
    .filter((p) => p.length > 0);
}

function generateId() {
  return Math.random().toString(36).substring(2, 12);
}

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

        navbarItem = await prisma.navbarItem.create({
          data: {
            label: svc.title,
            region: "INDIA",
            pageType: "SERVICE",
            order: svc.id || 0,
          },
        });

        createdNavItems++;
        console.log(`✨ Created NavbarItem: ${svc.title}`);
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

      // ✅ Create Sections with Editor.js format
      const sections = [
        {
          title: svc.overview_sidebar_name || "Overview",
          content: svc.overview || "",
          order: 1,
        },
        {
          title: svc.documents_sidebar_name || "Documents Required",
          content: svc.doc_required || "",
          order: 2,
        },
        {
          title: svc.process_sidebar_name || "Process",
          content: svc.process || "",
          order: 3,
        },
        {
          title: svc.fees_sidebar_name || "Fees",
          content: svc.procedure || "",
          order: 4,
        },
        {
          title: svc.benefit_sidebar_name || "Benefits",
          content: svc.Benefit || "",
          order: 5,
        },
        {
          title: svc.why_sidebar_name || "Why Choose Us",
          content: svc.why_us || "",
          order: 6,
        },
      ].filter((s) => s.content && s.content.trim() !== "");

      for (const section of sections) {
        console.log(`  📝 Creating section: ${section.title}`);

        // ✅ Convert HTML to Editor.js
        const editorContent = convertHtmlToEditorJs(section.content);

        await prisma.servicePageSection.create({
          data: {
            servicePageId: servicePage.id,
            title: section.title,
            content: JSON.stringify(editorContent), // ✅ Store as JSON string
            order: section.order,
          },
        });
      }

      // ✅ Create FAQ Section
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
            // ✅ Convert FAQ answers to Editor.js
            const answerContent = convertHtmlToEditorJs(faqData[i].answer);

            await prisma.servicePageFAQItem.create({
              data: {
                faqId: faqSection.id,
                question: faqData[i].question,
                answer: JSON.stringify(answerContent), // ✅ Store as JSON
                order: i,
              },
            });
          }
        }
      }

      // Meta tags
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
          question: stripTags(item.question || item.q || ""),
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
          question: stripTags(lines[i]),
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

function stripTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

main().catch(console.error);
