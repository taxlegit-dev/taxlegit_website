import mysql from "mysql2/promise";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ HTML को Editor.js blocks में convert करने का function
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

  // Basic HTML को paragraphs में split करो
  const blocks: any[] = [];

  // Remove HTML tags और split by double line breaks
  const cleanText = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove scripts
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ""); // Remove styles

  // Headers detect करो
  const headerMatches = cleanText.matchAll(/<h([1-6])[^>]*>(.*?)<\/h\1>/gi);
  let lastIndex = 0;
  const elements: Array<{
    type: string;
    content: string;
    index: number;
    level?: number;
  }> = [];

  for (const match of headerMatches) {
    const [fullMatch, level, content] = match;
    const index = match.index!;

    // Previous content ko paragraph बनाओ
    if (index > lastIndex) {
      const prevContent = cleanText.substring(lastIndex, index);
      if (prevContent.trim()) {
        elements.push({
          type: "paragraph",
          content: prevContent,
          index: lastIndex,
        });
      }
    }

    elements.push({
      type: "header",
      content: content.replace(/<[^>]+>/g, "").trim(),
      index,
      level: parseInt(level),
    });

    lastIndex = index + fullMatch.length;
  }

  // Remaining content
  if (lastIndex < cleanText.length) {
    const remaining = cleanText.substring(lastIndex);
    if (remaining.trim()) {
      elements.push({
        type: "paragraph",
        content: remaining,
        index: lastIndex,
      });
    }
  }

  // If no elements found, split by paragraphs
  if (elements.length === 0) {
    const paragraphs = cleanText
      .split(/<\/p>|<br\s*\/?>/gi)
      .map((p) => p.replace(/<[^>]+>/g, "").trim())
      .filter((p) => p.length > 0);

    paragraphs.forEach((text) => {
      elements.push({ type: "paragraph", content: text, index: 0 });
    });
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
    } else {
      // Paragraph को clean करो लेकिन basic formatting रखो
      const cleanedText = el.content
        .replace(/<\/?(p|div|br)[^>]*>/gi, " ")
        .replace(/\s+/g, " ")
        .trim();

      if (cleanedText) {
        blocks.push({
          id: generateId(),
          type: "paragraph",
          data: {
            text: cleanedText,
          },
        });
      }
    }
  });

  // If still no blocks, create one empty paragraph
  if (blocks.length === 0) {
    blocks.push({
      id: generateId(),
      type: "paragraph",
      data: { text: cleanText.replace(/<[^>]+>/g, "").trim() || "" },
    });
  }

  return {
    time: Date.now(),
    blocks,
    version: "2.29.0",
  };
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

  // 1️⃣ Blog Categories → BlogGroup
  const [cats]: any[] = await maria.query("SELECT * FROM blog_categories");
  const groupMap: Record<number, string> = {};

  for (const c of cats) {
    const groupName =
      c.name || c.title || c.category_name || c.slug || `Category-${c.id}`;

    const group = await prisma.blogGroup.upsert({
      where: {
        name_region: {
          name: String(groupName),
          region: "INDIA",
        },
      },
      update: {},
      create: {
        name: String(groupName),
        region: "INDIA",
        order: c.order || 0,
      },
    });

    groupMap[c.id] = group.id;
  }

  console.log(`✅ Migrated ${Object.keys(groupMap).length} blog categories`);

  // 2️⃣ Fallback category
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

  // 3️⃣ Blogs → Blog (with HTML to Editor.js conversion)
  const [blogs]: any[] = await maria.query(
    "SELECT * FROM blogs WHERE deleted_at IS NULL"
  );

  let migratedCount = 0;
  let skippedCount = 0;

  for (const b of blogs) {
    const groupId = groupMap[b.blog_category_id] || fallbackGroup.id;

    try {
      // ✅ Convert HTML content to Editor.js format
      const editorContent = convertHtmlToEditorJs(b.blog_detail || "");

      await prisma.blog.create({
        data: {
          title: b.blog_title || "Untitled Blog",
          content: JSON.stringify(editorContent), // ✅ Editor.js JSON
          image: b.image || null,
          region: "INDIA",
          status: b.status === 1 ? "PUBLISHED" : "DRAFT",
          blogGroupId: groupId,
          viewCount: b.likes || 0,
          readTime: null,
          createdAt: b.created_at ? new Date(b.created_at) : undefined,
          updatedAt: b.updated_at ? new Date(b.updated_at) : undefined,
        },
      });
      migratedCount++;

      console.log(`✅ Migrated: ${b.blog_title}`);
    } catch (error: any) {
      console.error(`❌ Failed to migrate blog #${b.id}: ${b.blog_title}`);
      console.error(error.message);
      skippedCount++;
    }
  }

  await maria.end();
  await prisma.$disconnect();

  console.log(`\n✅ Migration complete!`);
  console.log(`   Blogs migrated: ${migratedCount}`);
  console.log(`   Blogs skipped: ${skippedCount}`);
}

main().catch(console.error);
