import Link from "next/link";
import { Region, PageKey } from "@prisma/client";
import { NavbarServer } from "@/components/navigation/navbar-server";
import { RichContent } from "@/components/rich-text/rich-content";
import { getStaticPage } from "@/lib/queries";
import type { RichTextDocument } from "@/types/rich-text";

export default async function UsHomePage() {
  const region = Region.US;
  const [page] = await Promise.all([getStaticPage(region, PageKey.HOME)]);
  const heroContent = page?.content as RichTextDocument | null;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <NavbarServer region={region} />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-12">
        <section className="rounded-3xl border border-white/10 bg-slate-900 p-10 shadow-2xl">
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">
              United States
            </p>
            <h1 className="text-4xl font-semibold leading-tight">
              {page?.title ?? "Taxlegit US"}
            </h1>
            {heroContent && (
              <div className="max-w-2xl text-slate-200">
                <RichContent document={heroContent} theme="dark" />
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/us/about"
                className="rounded-full bg-emerald-400 px-5 py-2 text-sm font-semibold text-slate-900"
              >
                About region
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-8 text-sm text-slate-400">
          <p>© {new Date().getFullYear()} Taxlegit. US Region</p>
          <p>Admin controlled content</p>
        </div>
      </footer>
    </div>
  );
}
