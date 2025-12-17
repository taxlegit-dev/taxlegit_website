import { Star } from "lucide-react";
import type { PageHero } from "@prisma/client";
import ContactForm from "@/components/pages/services/contactForm";
type IndiaHeroProps = {
  hero: PageHero;
};

interface HeroContent {
  benefits?: string[];
  partnerLogos?: string[];
}

export function IndiaHero({ hero }: IndiaHeroProps) {
  const content = hero.content as HeroContent;
  const benefits = content?.benefits || [];
  const partnerLogos = content?.partnerLogos || [];

  return (
    <section className="bg-gradient-to-br from-indigo-50 via-white to-slate-50 py-16 ">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 font-[Gilroy]">
                {hero.title}
              </h1>
            </div>

            {/* Benefits List */}
            {benefits.length > 0 && (
              <div className="space-y-3">
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
                  <div
                    key={index}
                    className="text-sm font-semibold text-zinc-600"
                  >
                    {logo}
                  </div>
                ))}
              </div>
            )}
            <div className="inline-flex items-center gap-2 mb-3 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
              <span className="text-xl font-bold text-yellow-500">4.9</span>
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />

              <span className="text-sm font-semibold text-gray-700">
                Customer Reviews
              </span>
            </div>
          </div>

          {/* Right Contact Form - Static */}
          <div className="flex justify-end">
            <div className="w-full max-w-lg">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
