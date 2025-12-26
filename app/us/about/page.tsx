import { Region, PageKey } from "@prisma/client";
import { getStaticPage } from "@/lib/queries";
import { RichContent } from "@/components/rich-text/rich-content";
import type { RichTextDocument } from "@/types/rich-text";

export default async function UsAboutPage() {
  const page = await getStaticPage(Region.US, PageKey.ABOUT);
  const content = page?.content as RichTextDocument | null;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto w-full max-w-3xl px-6 pt-[72px] pb-12 space-y-6">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">About</p>
        <h1 className="text-4xl font-semibold">{page?.title ?? "About Taxlegit US"}</h1>
        {content && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <RichContent document={content} theme="dark" />
          </div>
        )}
      </main>
    </div>
  );
}

