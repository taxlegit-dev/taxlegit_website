import { prisma } from "@/lib/prisma";
import { MetaPageType } from "@prisma/client";
import { MetaDataInjector } from "./meta-data-injector";
import {
  extractJsonLdFromMetaBlock,
  extractCustomMetaTagsForSSR,
  removeSSRTagsFromMetaBlock,
} from "@/lib/seo-utils";

type MetaDataRendererProps = {
  pageType: "SERVICE" | "BLOG" | "HERO";
  pageId: string;
};

export async function MetaDataRenderer({
  pageType,
  pageId,
}: MetaDataRendererProps) {
  let metaData = null;
  let error = null;

  // Fetch data outside of try/catch for rendering
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
    error = err;
  }

  // If there's an error or no data, return null
  if (error || !metaData || !metaData.metaBlock) {
    return null;
  }

  // Extract JSON-LD scripts
  const jsonLdScripts = extractJsonLdFromMetaBlock(metaData.metaBlock);

  // Extract custom meta tags for SSR (keywords, googlebot, etc.)
  const customMetaTags = extractCustomMetaTagsForSSR(metaData.metaBlock);

  // Remove SSR'd tags from metaBlock to avoid duplication in window.__META_BLOCK__
  // This prevents meta tags from appearing as strings in JavaScript
  const cleanedMetaBlock = removeSSRTagsFromMetaBlock(metaData.metaBlock);

  return (
    <>
      {/* Render JSON-LD scripts server-side - these appear in page source */}
      {jsonLdScripts.map((jsonLd, index) => (
        <script
          key={`jsonld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      ))}
      {/* Render custom meta tags server-side (keywords, googlebot, etc.) */}
      {/* These appear directly in HTML source, not as JavaScript strings */}
      {customMetaTags.map((tag, index) => (
        <meta
          key={`meta-${tag.name}-${index}`}
          name={tag.name}
          content={tag.content}
        />
      ))}
      {/* Store cleaned meta block in window object for client-side injection */}
      {/* SSR'd tags are removed to prevent duplication */}
      {cleanedMetaBlock && (
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__META_BLOCK__ = ${JSON.stringify(
              cleanedMetaBlock
            )};`,
          }}
        />
      )}
      {/* Client-side injector for remaining meta tags */}
      <MetaDataInjector />
    </>
  );
}
