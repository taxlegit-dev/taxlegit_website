import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://taxlegit.com";

  return {
    rules: [
      // ✅ All bots
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/*?*",
          "/*utm*",
          "/admin",
          "/adminuploads",
          "/tlconsult",
          "/us",
          "/term-and-conditions",
          "/no-objection-certificate",
        ],
      },

      // ✅ AI Bots (explicitly allowed)
      {
        userAgent: "GPTBot",
        allow: "/",
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
      },
    ],

    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
