import { z } from "zod";
import { supportedRegions, SupportedRegion } from "@/lib/regions";

const regionEnum = z.enum(supportedRegions.map((region) => region.value) as [SupportedRegion, ...SupportedRegion[]]);

export const createBlogSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  excerpt: z.string().min(10),
  tags: z.array(z.string()).default([]),
  content: z.any(),
  region: regionEnum,
});

export const createNavItemSchema = z.object({
  label: z.string().min(2),
  href: z.string().optional(),
  order: z.number().int().min(0).default(0),
  type: z.enum(["LINK", "DROPDOWN", "BUTTON"]).default("LINK"),
  region: regionEnum,
  isLoginLink: z.boolean().default(false),
  parentId: z.string().optional(),
  groupLabel: z.string().optional(), // For grouping submenu items in mega-menu
});

export const updateNavItemSchema = createNavItemSchema.extend({
  id: z.string().min(1),
  isActive: z.boolean().optional(),
});

export const reorderNavItemsSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().min(1),
      order: z.number().int().min(0),
    })
  ),
  region: regionEnum,
});

export const updateStaticPageSchema = z.object({
  key: z.enum(["HOME", "ABOUT"]),
  title: z.string().min(3),
  content: z.any(),
  region: regionEnum,
});

export const createPageHeroSchema = z.object({
  navbarItemId: z.string().min(1),
  region: regionEnum,
  title: z.string().min(3),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  content: z.any(), // JSON for flexible region-specific content
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
});

export const updatePageHeroSchema = createPageHeroSchema.extend({
  id: z.string().min(1),
});

