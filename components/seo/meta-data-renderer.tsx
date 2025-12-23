import { prisma } from "@/lib/prisma";
import { MetaPageType } from "@prisma/client";

type MetaDataRendererProps = {
  pageType?: "SERVICE" | "BLOG" | "GENERIC";
  pageId?: string;
  metaBlock?: string | null;
};

// Helper to parse HTML string and extract meta tags (server-side safe)
function parseMetaTags(htmlString: string) {
  const metaTags: Array<{ name?: string; property?: string; content: string }> =
    [];
  const jsonLdScripts: string[] = [];

  // Extract meta tags using regex
  const metaRegex = /<meta\s+([^>]*?)>/gi;
  let metaMatch;

  while ((metaMatch = metaRegex.exec(htmlString)) !== null) {
    const attrs = metaMatch[1];
    const nameMatch = /name=["']([^"']+)["']/i.exec(attrs);
    const propertyMatch = /property=["']([^"']+)["']/i.exec(attrs);
    const contentMatch = /content=["']([^"']+)["']/i.exec(attrs);

    if (contentMatch) {
      metaTags.push({
        ...(nameMatch && { name: nameMatch[1] }),
        ...(propertyMatch && { property: propertyMatch[1] }),
        content: contentMatch[1],
      });
    }
  }

  // Extract JSON-LD scripts using regex
  const jsonLdRegex =
    /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let scriptMatch;

  while ((scriptMatch = jsonLdRegex.exec(htmlString)) !== null) {
    if (scriptMatch[1]) {
      jsonLdScripts.push(scriptMatch[1].trim());
    }
  }

  return { metaTags, jsonLdScripts };
}

export async function MetaDataRenderer({
  pageType,
  pageId,
  metaBlock,
}: MetaDataRendererProps) {
  let resolvedMetaBlock = metaBlock ?? null;
  let metaData = null;

  if (!resolvedMetaBlock) {
    if (!pageType || !pageId) {
      return null;
    }

    try {
      metaData = await prisma.metaData.findUnique({
        where: {
          pageType_pageId: {
            pageType: pageType as MetaPageType,
            pageId,
          },
        },
      });
    } catch (err) {
      console.error("Error fetching meta data:", err);
      return null;
    }

    resolvedMetaBlock = metaData?.metaBlock ?? null;
  }

  if (!resolvedMetaBlock) {
    return null;
  }

  // Parse the meta block to extract tags
  const { metaTags, jsonLdScripts } = parseMetaTags(resolvedMetaBlock);

  return (
    <>
      {/* Render JSON-LD scripts - these appear in page source */}
      {jsonLdScripts.map((jsonLd, index) => (
        <script
          key={`jsonld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      ))}

      {/* Render meta tags directly as HTML elements */}
      {metaTags.map((tag, index) => (
        <meta
          key={`meta-${tag.name || tag.property}-${index}`}
          {...(tag.name && { name: tag.name })}
          {...(tag.property && { property: tag.property })}
          content={tag.content}
        />
      ))}
    </>
  );
}
