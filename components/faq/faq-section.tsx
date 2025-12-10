"use client";

import { useState } from "react";
import type { ServicePageFAQItem } from "@prisma/client";

type FAQSectionProps = {
  questions: ServicePageFAQItem[];
  region: "INDIA" | "US";
};

export function FAQSection({ questions, region }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const isIndia = region === "INDIA";

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!questions || questions.length === 0) return null;

  return (
    <section
      className={`${
        isIndia
          ? "bg-gradient-to-br from-indigo-50 via-white to-indigo-100"
          : "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      } py-20`}
    >
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* LEFT STATIC SECTION */}
        <div className="space-y-4">
          {/* Small Badge */}
          <span
            className={`text-sm font-medium px-3 py-1 rounded-full inline-block
            ${
              isIndia
                ? "bg-blue-100 text-blue-700"
                : "bg-slate-700 text-blue-300"
            }`}
          >
            Frequently asked questions
          </span>

          {/* Big Heading */}
          <h2
            className={`text-4xl font-extrabold leading-snug ${
              isIndia ? "text-slate-900" : "text-white"
            }`}
          >
            Frequently asked <br />
            <span className="text-blue-600">questions</span>
          </h2>

          {/* Small Description */}
          <p
            className={`text-md ${
              isIndia ? "text-slate-600" : "text-slate-300"
            } max-w-sm`}
          >
            Choose a plan that fits your business needs and budget. No hidden
            fees—just straightforward answers to common questions.
          </p>
        </div>

        {/* RIGHT SIDE FAQ ACCORDIONS */}
        <div className="space-y-4">
          {questions.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={item.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden shadow-lg
                  ${
                    isIndia
                      ? "bg-white border-slate-200"
                      : "bg-white/5 backdrop-blur-xl border-slate-700"
                  }
                  ${isOpen ? "shadow-xl scale-[1.01]" : "opacity-90"}
                `}
              >
                {/* Question row */}
                <button
                  onClick={() => toggleQuestion(index)}
                  className="w-full flex justify-between items-center py-5 px-6 text-left"
                >
                  <span
                    className={`text-lg font-semibold ${
                      isIndia ? "text-slate-900" : "text-white"
                    }`}
                  >
                    {item.question}
                  </span>

                  {/* Toggle Icon */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                      ${
                        isIndia
                          ? "bg-indigo-100 text-indigo-600"
                          : "bg-indigo-400/20 text-indigo-300"
                      }
                      ${isOpen ? "rotate-180" : ""}
                    `}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>

                {/* ANSWER SECTION */}
                <div
                  className={`transition-all duration-300 ${
                    isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div
                    className={`px-6 pb-5 prose max-w-none ${
                      isIndia
                        ? "prose-slate text-slate-700"
                        : "prose-invert prose-slate text-slate-300"
                    }`}
                    dangerouslySetInnerHTML={{ __html: item.answer }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Line */}
      <div className="mt-12 text-center">
        <p
          className={`text-sm ${isIndia ? "text-slate-500" : "text-slate-400"}`}
        >
          Still have questions?{" "}
          <a
            href="tel:+918929218091"
            className={`font-semibold  hover:underline transition ${
              isIndia
                ? "text-blue-600 hover:text-blue-700"
                : "text-blue-400 hover:text-blue-300"
            }`}
          >
            Contact us
          </a>
        </p>
      </div>
    </section>
  );
}
