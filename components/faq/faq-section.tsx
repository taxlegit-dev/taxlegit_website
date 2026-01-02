"use client";

import { useState } from "react";

import type { ServicePageFAQItem } from "@prisma/client";

type FAQSectionProps = {
  questions: ServicePageFAQItem[];
  region: "INDIA" | "US";
};

export function FAQSection({ questions, region }: FAQSectionProps) {
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set([0]));
  const isIndia = region === "INDIA";

  if (!questions || questions.length === 0) return null;

  // Distribute FAQs: fewer on left (due to header), more on right to balance height
  // The header takes up space equivalent to ~2 FAQs, so we put 2 fewer FAQs on the left
  const LEFT_FAQ_COUNT = Math.max(1, Math.floor(questions.length / 2) - 2);
  const leftFaqs = questions.slice(0, LEFT_FAQ_COUNT);
  const rightFaqs = questions.slice(LEFT_FAQ_COUNT);

  const toggleQuestion = (index: number) => {
    setOpenIndices((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const renderFaq = (item: ServicePageFAQItem, index: number) => {
    const isOpen = openIndices.has(index);

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
        <button
          onClick={() => toggleQuestion(index)}
          className="w-full flex justify-between items-center py-3 px-6 text-left"
        >
          <span
            className={`text-lg font-semibold ${
              isIndia ? "text-slate-900" : "text-white"
            }`}
          >
            {item.question}
          </span>

          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 ml-4
              ${
                isIndia
                  ? "bg-purple-100 text-purple-600"
                  : "bg-purple-400/20 text-purple-300"
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
  };

  return (
    <section
      className={`py-12 ${
        isIndia
          ? "bg-gradient-to-br from-purple-50 via-white to-purple-100"
          : "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-6 md:items-start">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Header Section */}
            <div className="space-y-4">
              <span
                className={`text-sm font-medium px-3 py-1 rounded-full inline-block
                  ${
                    isIndia
                      ? "bg-purple-100 text-purple-700"
                      : "bg-slate-700 text-purple-300"
                  }`}
              >
                Frequently asked questions
              </span>

              <h2
                className={`text-4xl font-extrabold leading-snug ${
                  isIndia ? "text-slate-900" : "text-white"
                }`}
              >
                Frequently asked <br />
                <span className="text-purple-600">questions</span>
              </h2>

              <p
                className={`text-md ${
                  isIndia ? "text-slate-600" : "text-slate-300"
                } max-w-lg`}
              >
                Choose a plan that fits your business needs and budget. No hidden
                fees—just straightforward answers to common questions.
              </p>
            </div>

            {/* Left FAQs */}
            <div className="space-y-4">
              {leftFaqs.map((item, idx) => renderFaq(item, idx))}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {rightFaqs.map((item, idx) => renderFaq(item, LEFT_FAQ_COUNT + idx))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p
            className={`text-sm ${
              isIndia ? "text-slate-500" : "text-slate-400"
            }`}
          >
            Still have questions?{" "}
            <a
              href="tel:+918929218091"
              className={`font-semibold hover:underline transition ${
                isIndia
                  ? "text-purple-600 hover:text-purple-700"
                  : "text-purple-400 hover:text-purple-300"
              }`}
            >
              Contact us
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}