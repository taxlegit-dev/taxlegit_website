"use client";
import { useEffect, useState, useRef } from "react";
import { Star, ArrowRight, Handshake, Scale, Building2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaYoutube } from "react-icons/fa";
import Link from "next/link";
import type { PageHero } from "@prisma/client";
import ContactForm from "@/components/pages/common/contactForm";
import RunningLogoCarousel from "../pages/common/RunningLogoCarousel";
type IndiaHeroProps = {
  hero: PageHero;
  breadcrumbParent?: string | null;
  breadcrumbCurrent?: string | null;
};

interface HeroContent {
  benefits?: string[];
  partnerLogos?: string[];
}

const stats = [
  {
    label: "Happy Customers",
    value: 5000,
    suffix: "+",
    Icon: Handshake,
  },
  {
    label: "Company Registered",
    value: 500,
    suffix: "+",
    Icon: Scale,
  },
  {
    label: " Gov Registation",
    value: 3499,
    suffix: "+",
    Icon: Building2,
  },
];

export function IndiaHero({
  hero,
  breadcrumbParent,
  breadcrumbCurrent,
}: IndiaHeroProps) {
  const content = hero.content as HeroContent;
  const benefits = content?.benefits || [];
  const partnerLogos = content?.partnerLogos || [];
  const [counts, setCounts] = useState(stats.map(() => 0));
  const statsRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);
  const trimmedParent = breadcrumbParent?.trim();
  const trimmedCurrent = breadcrumbCurrent?.trim();
  const showBreadcrumb = trimmedParent && trimmedCurrent;

  useEffect(() => {
    if (!statsRef.current || hasAnimatedRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;

          // Check for reduced motion preference
          const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches;

          if (prefersReducedMotion) {
            setCounts(stats.map((stat) => stat.value));
            return;
          }

          // Animate each stat separately with different durations
          stats.forEach((stat, index) => {
            const duration = 2000; // 2 seconds
            const startTime = Date.now();

            const animate = () => {
              const elapsed = Date.now() - startTime;
              const progress = Math.min(elapsed / duration, 1);

              // Smooth easing function
              const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
              const easedProgress = easeOutCubic(progress);

              const currentValue = Math.floor(stat.value * easedProgress);

              setCounts((prev) => {
                const newCounts = [...prev];
                newCounts[index] = currentValue;
                return newCounts;
              });

              if (progress < 1) {
                requestAnimationFrame(animate);
              }
            };

            // Stagger the animations
            setTimeout(animate, index * 200);
          });
        }
      },
      { threshold: 0.3 } // 30% visible होने पर trigger होगा
    );

    observer.observe(statsRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-gradient-to-br from-indigo-50 via-white to-slate-50 py-10 ">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* Left Content */}
          <div className="space-y-8 lg:col-span-3">
            <div>
              {showBreadcrumb && (
                <nav
                  aria-label="Breadcrumb"
                  className="mb-3 text-sm text-slate-500"
                >
                  <Link href="/" className="text-slate-700 underline">
                    Home
                  </Link>
                  <span className="mx-2">{">"}</span>
                  <span className="text-slate-700">{trimmedParent}</span>
                  <span className="mx-2">{">"}</span>
                  <span className=" text-slate-700">{trimmedCurrent}</span>
                </nav>
              )}
              <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
                {hero.title}
              </h1>
            </div>

            {/* Benefits List */}
            {benefits.length > 0 && (
              <div className="space-y-3">
                {benefits.map((benefit: string, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5"
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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold text-gray-700">
                Rated at 4.7/5, 1500+ Happy Reviews on
              </span>
              <FcGoogle className="w-5 h-5 " />
            </div>
            {/* CTAs + Rating */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="#contact-form"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-800 px-5 py-3 text-white font-semibold shadow-lg shadow-purple-200 hover:shadow-purple-300 transition"
              >
                Schedule a call
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#how-it-works-video"
                className="inline-flex items-center gap-2 text-black font-semibold hover:underline"
              >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full text-red-600 ">
                  <FaYoutube className="w-10 h-10" />
                </span>
                <span>Checkout Related Shorts/Video </span>
              </Link>
            </div>

            {/* Stats Section with ref for intersection observer */}
            <div ref={statsRef} className="mt-6 grid gap-6 sm:grid-cols-3">
              {stats.map((stat, index) => (
                <div key={stat.label} className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500 text-white shadow-sm">
                    <stat.Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">
                      {counts[index].toLocaleString("en-IN")} {stat.suffix}
                    </div>
                    <div className="text-sm text-slate-700">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Contact Form - Static */}
          <div className="flex justify-end lg:col-span-2" id="contact-form">
            <div className="w-full max-w-sm">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
      <div className="pt-16">
        <RunningLogoCarousel />
      </div>
    </section>
  );
}
