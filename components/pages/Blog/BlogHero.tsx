export default function BlogHero() {
  return (
    <section className="relative overflow-hidden shadow-xl">
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center" />

      {/* Dark purple Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-800/85 to-slate-700/70" />

      {/* Content */}
      <div className="relative z-10 px-4 py-12 sm:px-6 sm:py-16 md:px-8 md:py-20 lg:px-12 lg:py-24 text-center text-white">
        <p className="mb-3 text-xs sm:text-sm uppercase tracking-[0.25em] text-slate-300">
          Blog Insights
        </p>

        <h1 className="mx-auto max-w-3xl text-2xl font-bold leading-tight sm:text-3xl md:text-4xl lg:text-5xl">
          Explore Our Latest Articles and Industry Insights
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-slate-200/90">
          Stay ahead with expert opinions, practical guides, and in-depth
          analysis from the Taxlegit team.
        </p>
      </div>
    </section>
  );
}
