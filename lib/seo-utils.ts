import { Metadata } from "next";

type OpenGraphType =
  | "website"
  | "article"
  | "book"
  | "profile"
  | "music.song"
  | "music.album"
  | "music.playlist"
  | "music.radio_station"
  | "video.movie"
  | "video.episode"
  | "video.tv_show"
  | "video.other";
type TwitterCardType = "summary" | "summary_large_image" | "app" | "player";

type MutableMetadata = Omit<Partial<Metadata>, "openGraph" | "twitter"> & {
  openGraph?: Record<string, unknown>;
  twitter?: Record<string, unknown>;
};

const OPEN_GRAPH_TYPES: OpenGraphType[] = [
  "website",
  "article",
  "book",
  "profile",
  "music.song",
  "music.album",
  "music.playlist",
  "music.radio_station",
  "video.movie",
  "video.episode",
  "video.tv_show",
  "video.other",
];

const TWITTER_CARD_TYPES: TwitterCardType[] = [
  "summary",
  "summary_large_image",
  "app",
  "player",
];

function ensureOpenGraphType(value: string): OpenGraphType {
  const normalized = value.toLowerCase() as OpenGraphType;
  return OPEN_GRAPH_TYPES.includes(normalized) ? normalized : "website";
}

function ensureTwitterCard(value: string): TwitterCardType {
  const normalized = value.toLowerCase().replace(/-/g, "_") as TwitterCardType;
  return TWITTER_CARD_TYPES.includes(normalized) ? normalized : "summary";
}

export function parseMetaBlockForMetadata(
  metaBlock: string
): Partial<Metadata> {
  if (!metaBlock) return {};

  const metadata: MutableMetadata = {};
  // Extract title
  const titleMatch = metaBlock.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) {
    metadata.title = titleMatch[1];
  }

  // Extract description
  const descMatch = metaBlock.match(
    /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i
  );
  if (descMatch) {
    metadata.description = descMatch[1];
  }

  // Extract robots
  const robotsMatch = metaBlock.match(
    /<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i
  );
  if (robotsMatch) {
    metadata.robots = robotsMatch[1];
  }

  // Extract canonical URL
  const canonicalMatch = metaBlock.match(
    /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i
  );
  if (canonicalMatch) {
    metadata.alternates = {
      ...metadata.alternates,
      canonical: canonicalMatch[1],
    };
  }

  // Extract Open Graph title
  const ogTitleMatch = metaBlock.match(
    /<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i
  );
  if (ogTitleMatch) {
    metadata.openGraph = {
      ...metadata.openGraph,
      title: ogTitleMatch[1],
    };
  }

  // Extract Open Graph description
  const ogDescMatch = metaBlock.match(
    /<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i
  );
  if (ogDescMatch) {
    metadata.openGraph = {
      ...metadata.openGraph,
      description: ogDescMatch[1],
    };
  }

  // Extract Open Graph image
  const ogImageMatch = metaBlock.match(
    /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i
  );
  if (ogImageMatch) {
    metadata.openGraph = {
      ...metadata.openGraph,
      images: [{ url: ogImageMatch[1] }],
    };
  }

  // Extract Open Graph URL
  const ogUrlMatch = metaBlock.match(
    /<meta\s+property=["']og:url["']\s+content=["']([^"']+)["']/i
  );
  if (ogUrlMatch) {
    metadata.openGraph = {
      ...metadata.openGraph,
      url: ogUrlMatch[1],
    };
  }

  // Extract Open Graph type
  const ogTypeMatch = metaBlock.match(
    /<meta\s+property=["']og:type["']\s+content=["']([^"']+)["']/i
  );
  if (ogTypeMatch) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: ensureOpenGraphType(ogTypeMatch[1]),
    };
  }

  // Extract Twitter Card
  const twitterCardMatch = metaBlock.match(
    /<meta\s+name=["']twitter:card["']\s+content=["']([^"']+)["']/i
  );
  if (twitterCardMatch) {
    metadata.twitter = {
      ...metadata.twitter,
      card: ensureTwitterCard(twitterCardMatch[1]),
    };
  }

  // Extract Twitter title
  const twitterTitleMatch = metaBlock.match(
    /<meta\s+name=["']twitter:title["']\s+content=["']([^"']+)["']/i
  );
  if (twitterTitleMatch) {
    metadata.twitter = {
      ...metadata.twitter,
      title: twitterTitleMatch[1],
    };
  }

  // Extract Twitter description
  const twitterDescMatch = metaBlock.match(
    /<meta\s+name=["']twitter:description["']\s+content=["']([^"']+)["']/i
  );
  if (twitterDescMatch) {
    metadata.twitter = {
      ...metadata.twitter,
      description: twitterDescMatch[1],
    };
  }

  // Extract Twitter image
  const twitterImageMatch = metaBlock.match(
    /<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i
  );
  if (twitterImageMatch) {
    metadata.twitter = {
      ...metadata.twitter,
      images: [{ url: twitterImageMatch[1] }],
    };
  }

  // Extract keywords meta tag
  const keywordsMatch = metaBlock.match(
    /<meta\s+name=["']keywords["']\s+content=["']([^"']+)["']/i
  );
  if (keywordsMatch) {
    // Use 'other' property for keywords (not directly supported in Metadata API)
    if (!metadata.other) {
      metadata.other = {};
    }
    (metadata.other as Record<string, string>)["keywords"] = keywordsMatch[1];
  }

  // Extract googlebot meta tag
  const googlebotMatch = metaBlock.match(
    /<meta\s+name=["']googlebot["']\s+content=["']([^"']+)["']/i
  );
  if (googlebotMatch) {
    // Use 'other' property for custom meta tags
    if (!metadata.other) {
      metadata.other = {};
    }
    (metadata.other as Record<string, string>)["googlebot"] = googlebotMatch[1];
  }

  // Extract all other custom meta tags for SSR
  // Use 'other' property for Next.js Metadata API
  const metaTagRegex = /<meta\s+([^>]+)>/gi;
  let metaMatch;

  while ((metaMatch = metaTagRegex.exec(metaBlock)) !== null) {
    const metaContent = metaMatch[1];
    const nameMatch = metaContent.match(/name=["']([^"']+)["']/i);
    const propertyMatch = metaContent.match(/property=["']([^"']+)["']/i);
    const contentMatch = metaContent.match(/content=["']([^"']+)["']/i);

    if (contentMatch) {
      const name = nameMatch?.[1];
      const property = propertyMatch?.[1];

      // Skip already processed tags
      const skipTags = ["description", "robots", "keywords", "googlebot"];
      if (
        name &&
        !skipTags.includes(name.toLowerCase()) &&
        !property?.match(/^(og:|twitter:)/i)
      ) {
        // Add to 'other' property for SSR
        if (!metadata.other) {
          metadata.other = {};
        }
        const otherMeta = metadata.other as Record<string, string | string[]>;
        if (name) {
          otherMeta[name] = contentMatch[1];
        }
      }
    }
  }

  return metadata as Partial<Metadata>;
}

/**
 * Extracts JSON-LD script tags from meta block
 */
export function extractJsonLdFromMetaBlock(metaBlock: string): string[] {
  if (!metaBlock) return [];

  const jsonLdScripts: string[] = [];
  const scriptRegex =
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let scriptMatch;

  while ((scriptMatch = scriptRegex.exec(metaBlock)) !== null) {
    jsonLdScripts.push(scriptMatch[1].trim());
  }
  return jsonLdScripts;
}

/**
 * Extracts custom meta tags (keywords, googlebot, etc.) from meta block for SSR
 * Returns array of meta tag objects with name and content
 */
export function extractCustomMetaTagsForSSR(
  metaBlock: string
): Array<{ name: string; content: string }> {
  if (!metaBlock) return [];

  const customMetaTags: Array<{ name: string; content: string }> = [];
  const metaTagRegex =
    /<meta\s+(?:name|property)=["']([^"']+)["']\s+content=["']([^"']+)["']/gi;
  let metaMatch;

  // Tags that should be rendered server-side
  const ssrTags = [
    "keywords",
    "googlebot",
    "description",
    "og:title",
    "og:description",
    "og:image",
    "og:url",
    "og:type",
    "twitter:card",
    "twitter:title",
    "twitter:description",
    "twitter:image",
  ];

  while ((metaMatch = metaTagRegex.exec(metaBlock)) !== null) {
    const nameOrProperty = metaMatch[1];
    const content = metaMatch[2];

    // Only extract tags that should be SSR'd
    if (ssrTags.includes(nameOrProperty.toLowerCase())) {
      customMetaTags.push({ name: nameOrProperty, content });
    }
  }

  return customMetaTags;
}

/**
 * Removes SSR'd meta tags from metaBlock to avoid duplication in window.__META_BLOCK__
 * This ensures tags rendered server-side don't appear as strings in JavaScript
 */
export function removeSSRTagsFromMetaBlock(metaBlock: string): string {
  if (!metaBlock) return metaBlock;

  let cleanedMetaBlock = metaBlock;

  // Tags that are already SSR'd - remove them from metaBlock string
  const ssrTags = [
    "keywords",
    "googlebot",
    "description",
    "og:title",
    "og:description",
    "og:image",
    "og:url",
    "og:type",
    "twitter:card",
    "twitter:title",
    "twitter:description",
    "twitter:image",
  ];

  ssrTags.forEach((tagName) => {
    // Remove meta tags with this name or property (case insensitive)
    const regex = new RegExp(
      `<meta\\s+(?:name|property)=["']${tagName}["']\\s+content=["'][^"']+["']\\s*/?>`,
      "gi"
    );
    cleanedMetaBlock = cleanedMetaBlock.replace(regex, "");
  });

  // Clean up extra newlines/spaces
  cleanedMetaBlock = cleanedMetaBlock.replace(/\n\s*\n/g, "\n").trim();

  return cleanedMetaBlock;
}
