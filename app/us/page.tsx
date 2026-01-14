import Link from "next/link";

export default async function UsHomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="pt-[89px] mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-12">
        <section className="rounded-3xl border border-white/10 bg-slate-900 p-10 shadow-2xl">
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">
              United States
            </p>
            <h1 className="text-4xl font-semibold leading-tight">
              Taxlegit US
            </h1>
            <div className="max-w-2xl text-slate-200">
              Expert-led registration, accounting, valuation, and compliance
              services tailored for US businesses.
            </div>
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
          <p>Static content</p>
        </div>
      </footer>
    </div>
  );
}
