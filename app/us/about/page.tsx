export default async function UsAboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto w-full max-w-3xl px-6 pt-[89px] pb-12 space-y-6">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">
          About
        </p>
        <h1 className="text-4xl font-semibold">
          About Taxlegit US
        </h1>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          We help US businesses with compliance-led registration, accounting,
          and advisory services so you can scale with confidence.
        </div>
      </main>
    </div>
  );
}
