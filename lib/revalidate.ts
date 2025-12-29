import "server-only";
import { revalidatePath, revalidateTag } from "next/cache";
import { Region } from "@prisma/client";

const normalizeSlug = (hrefOrSlug: string) => hrefOrSlug.replace(/^\/+/, "").trim();

export function revalidateContentPage(
  hrefOrSlug: string | null | undefined,
  region: Region
) {
  if (!hrefOrSlug) return;
  const slug = normalizeSlug(hrefOrSlug);
  if (!slug) return;
  const path = region === Region.US ? `/us/${slug}` : `/${slug}`;
  revalidatePath(path);
}

export function revalidateBlogPage(
  slugOrId: string | null | undefined,
  region: Region
) {
  if (!slugOrId) return;
  const slug = normalizeSlug(slugOrId);
  if (!slug) return;
  const path = region === Region.US ? `/us/blog/${slug}` : `/blog/${slug}`;
  revalidatePath(path);
}

export function revalidateBlogListing(region: Region) {
  const path = region === Region.US ? "/us/blog" : "/blog";
  revalidatePath(path);
}

export function revalidateNavbarItems(region: Region) {
  revalidateTag(`navbar-items-${region}`, "max");
}
