import { prisma } from "@/lib/prisma";
import { MetaPageType } from "@prisma/client";

type ServerMetaTagsProps = {
  pageType: "SERVICE" | "BLOG" | "HERO";
  pageId: string;
};

/**
 * Server component that parses raw HTML meta tags and injects them into <head>
 * This allows custom meta tags to appear in page source (Ctrl+U)
 */
export async function ServerMetaTags({
  pageType,
  pageId,
}: ServerMetaTagsProps) {
  try {
    const metaData = await prisma.metaData.findUnique({
      where: {
        pageType_pageId: {
          pageType: pageType as MetaPageType,
          pageId,
        },
      },
    });

    if (!metaData || !metaData.metaBlock) {
      return null;
    }

    // Parse raw HTML meta tags
    const metaBlock = metaData.metaBlock;
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = metaBlock;

    // Extract all meta tags, link tags, script tags
    const elements = Array.from(tempDiv.querySelectorAll("meta, link, script"));

    // Filter out title tags (handled by Next.js Metadata API)
    const metaTags = elements.filter((el) => {
      const tagName = el.tagName;
      
      // Skip title tags
      if (tagName === "TITLE") {
        continue;
      }

      // For meta tags
      if (tagName === "META") {
        const name = el.getAttribute("name");
        const property = el.getAttribute("property");
        const rel = el.getAttribute("rel");
        const href = el.getAttribute("href");
        const type = el.getAttribute("type");
        const content = el.getAttribute("content");

        // Return structured meta tags for Next.js Metadata API
        if (name === "description" || name === "robots") {
          return {
            name,
            content,
          };
        }
        
        if (property && property.startsWith("og:")) {
          return {
            property,
            content,
          };
        }
        
        if (rel === "canonical") {
          return {
            rel,
            href,
          };
        }
        
        if (type === "application/ld+json") {
          const jsonLd = el.textContent;
          return {
            type,
            jsonLd,
          };
        }
        
        // Return raw HTML for other custom meta tags
        return {
          tagName,
          name,
          property,
          rel,
          href,
          type,
          content,
          jsonLd: type === "application/ld+json" ? jsonLd : undefined,
        };
      }
    });

    // Return array of parsed meta tags
    return metaTags;
  } catch (error) {
    console.error("Error parsing meta tags:", error);
    return null;
  }
}


