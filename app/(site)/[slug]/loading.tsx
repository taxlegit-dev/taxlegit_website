export default function Loading() {
  return (
    <div className="min-h-screen bg-white text-black">
      <main className="pt-[89px]">
        <section className="mx-auto max-w-6xl px-6 py-12 animate-pulse space-y-6">
          <div className="h-10 w-2/3 rounded bg-slate-200" />
          <div className="h-5 w-1/2 rounded bg-slate-200" />
          <div className="h-40 w-full rounded bg-slate-200" />
          <div className="h-6 w-3/4 rounded bg-slate-200" />
          <div className="h-6 w-2/3 rounded bg-slate-200" />
        </section>
      </main>
    </div>
  );
}
