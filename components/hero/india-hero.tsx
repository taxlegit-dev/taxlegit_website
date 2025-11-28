import Link from "next/link";
import type { PageHero } from "@prisma/client";

type IndiaHeroProps = {
  hero: PageHero;
};

export function IndiaHero({ hero }: IndiaHeroProps) {
  const content = hero.content as any;
  const benefits = content?.benefits || [];
  const partnerLogos = content?.partnerLogos || [];

  return (
    <section className="bg-gradient-to-br from-indigo-50 via-white to-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6">
                {hero.title}
              </h1>
            </div>

            {/* Benefits List */}
            {benefits.length > 0 && (
              <div className="space-y-4">
                {benefits.map((benefit: string, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <p className="text-lg text-zinc-700">{benefit}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Partner Logos */}
            {partnerLogos.length > 0 && (
              <div className="flex items-center gap-6 pt-6 border-t border-zinc-200">
                {partnerLogos.map((logo: string, index: number) => (
                  <div key={index} className="text-sm font-semibold text-zinc-600">
                    {logo}
                  </div>
                ))}
              </div>
            )}

            {/* Floating Action Button */}
            <div className="fixed bottom-8 right-8 z-50">
              <Link
                href="tel:+911234567890"
                className="flex items-center justify-center w-16 h-16 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right Contact Form - Static */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-zinc-900 mb-2 relative pb-3">
              Start Your Business with free consultation
              <span className="absolute bottom-0 left-0 w-16 h-0.5 bg-red-600"></span>
            </h2>
            <form className="space-y-4 mt-6">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-zinc-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full rounded-lg border border-zinc-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Phone</label>
                <input
                  type="tel"
                  className="w-full rounded-lg border border-zinc-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your phone"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Service</label>
                <select className="w-full rounded-lg border border-zinc-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>---Select Service---</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-zinc-900 text-white rounded-lg px-4 py-3 font-semibold hover:bg-zinc-800 transition"
              >
                Book Free Consultation
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

