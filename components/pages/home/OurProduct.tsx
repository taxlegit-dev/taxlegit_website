"use client";
import { useEffect } from "react";
import AOS from "aos";
import Image from "next/image";
import Link from "next/link";
import { RiArrowRightLine } from "react-icons/ri";
const features = [
  {
    title: "Name check",
    description:
      "Generate Business Name Instantly from MCA Leverage trusted MCA data and Open AI.",
    image: "/product/namecheck.png",
    link: "https://aarambh.taxlegit.com/checkname",
  },
  {
    title: "Company Register in 2 Min",
    description:
      "From idea to official status, we make the journey effortless. ",
    image: "/product/airegister.png",
    link: "https://aarambh.taxlegit.com/",
  },
  {
    title: "Get your ICFR in sec",
    badge: "Coming Soon 🔊",
    description:
      "Automate your documentation with AI-powered SOPs and process simulation.",
    image: "/product/icfr.png",
    link: "/icfr",
    disabled: true,
  },
];

export default function OurProduct() {
  useEffect(() => {
    AOS.init({
      duration: 700,
      once: false,
      mirror: true,
    });
  }, []);
  return (
    <section className="relative overflow-hidden py-8">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="h-72 bg-gradient-to-b from-[#F7F2F7] via-[#EFE4EF] to-white rounded-b-[56px]" />
      </div>

      <div className="relative max-w-6xl mx-auto lg:px-0 px-5 ">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-24 text-BLACK">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Our Core <span className="text-purple-700">Product</span>
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 -mt-8 md:-mt-12">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group relative bg-white rounded-3xl p-4 shadow-md hover:shadow-xl transition-all border border-purple-100 flex flex-col"
            >
              {/* Badge */}
              {feature.badge && (
                <div className="absolute -top-3 left-6">
                  <span className="inline-flex items-center rounded-full bg-yellow-400 px-4 py-2 text-sm font-semibold text-white shadow-sm">
                    {feature.badge}
                  </span>
                </div>
              )}

              {/* Image */}
              <div className="mb-6 flex justify-center" data-aos="flip-up">
                <div className="relative w-full max-w-[420px] h-[240px] overflow-hidden">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-contain"
                    sizes="(min-width: 1024px) 240px, 60vw"
                  />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-gray-900 text-center">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm text-gray-600 text-center flex-grow">
                {feature.description}
              </p>

              {/* Button */}
              <div className="mt-6 text-center" data-aos="fade-left">
                {feature.disabled ? (
                  <button
                    disabled
                    className="inline-flex items-center gap-2 rounded-full bg-gray-200 px-6 py-3 text-sm font-semibold text-gray-500 cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                ) : feature.link.startsWith("http") ? (
                  <a
                    href={feature.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-purple-700 hover:gap-3"
                  >
                    Explore Now
                    <RiArrowRightLine className="text-lg" />
                  </a>
                ) : (
                  <Link
                    href={feature.link}
                    className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-purple-700 hover:gap-3"
                  >
                    Explore Now
                    <RiArrowRightLine className="text-lg" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
