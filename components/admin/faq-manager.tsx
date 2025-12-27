"use client";

import React, { useState, useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { NavbarItem, ServicePageFAQ, ServicePageFAQItem } from "@prisma/client";
import { useAdminSearch } from "@/components/admin/admin-search-context";

type FAQWithNavItem = ServicePageFAQ & {
  navbarItem: NavbarItem | null;
  questions: ServicePageFAQItem[];
};

type FAQManagerProps = {
  region: "INDIA" | "US";
  navItems: NavbarItem[];
  selectedNavbarItemId?: string;
  existingFAQ?: (ServicePageFAQ & { questions: ServicePageFAQItem[] }) | null;
  navbarItem?: NavbarItem | null;
  allFAQs?: FAQWithNavItem[];
};

const faqSchema = z.object({
  navbarItemId: z.string().min(1),
  questions: z.array(
    z.object({
      question: z.string().min(3, "Question must be at least 3 characters"),
      answer: z.string().min(10, "Answer must be at least 10 characters"),
      order: z.number().int().min(0).default(0),
    })
  ).min(1, "At least one FAQ item is required"),
});

type FAQForm = z.infer<typeof faqSchema>;

export function FAQManager({
  region,
  navItems,
  selectedNavbarItemId,
  existingFAQ,
  allFAQs = [],
}: FAQManagerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const selectedItemId = selectedNavbarItemId || "";
  const { query } = useAdminSearch();
  const normalizedQuery = query.trim().toLowerCase();
  const filteredNavItems = normalizedQuery
    ? navItems.filter((item) => {
        const target = `${item.label ?? ""} ${item.href ?? ""}`.toLowerCase();
        return target.includes(normalizedQuery);
      })
    : navItems;

  const form = useForm<FAQForm>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      navbarItemId: selectedItemId || "",
      questions: [{ question: "", answer: "", order: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  // Update form values when existingFAQ or selectedItemId changes
  useEffect(() => {
    if (selectedItemId || selectedNavbarItemId) {
      const finalNavbarItemId = selectedItemId || selectedNavbarItemId || "";
      form.setValue("navbarItemId", finalNavbarItemId);
    }

    if (existingFAQ) {
      form.reset({
        navbarItemId: existingFAQ.navbarItemId,
        questions: existingFAQ.questions.length > 0
          ? existingFAQ.questions.map((q) => ({
              question: q.question,
              answer: q.answer,
              order: q.order,
            }))
          : [{ question: "", answer: "", order: 0 }],
      });
    } else if (selectedItemId || selectedNavbarItemId) {
      form.reset({
        navbarItemId: selectedItemId || selectedNavbarItemId || "",
        questions: [{ question: "", answer: "", order: 0 }],
      });
    }
  }, [existingFAQ, selectedItemId, selectedNavbarItemId, form]);

  const handleNavbarItemSelect = (itemId: string) => {
    const next = new URLSearchParams(searchParams?.toString() ?? "");
    next.set("navbarItemId", itemId);
    const regionParam =
      searchParams?.get("region") || (region === "US" ? "US" : "INDIA");
    next.set("region", regionParam);
    router.push(`/admin/faq?${next.toString()}`);
  };

  const handleBackToNavbar = () => {
    const next = new URLSearchParams(searchParams?.toString() ?? "");
    next.delete("navbarItemId");
    router.push(`/admin/faq?${next.toString()}`);
  };

  const handleSubmit = form.handleSubmit((data) => {
    startTransition(async () => {
      setMessage(null);

      // Validate questions have at least one non-empty item
      const filteredQuestions = data.questions.filter(
        (q) => q.question.trim() && q.answer.trim()
      );
      if (filteredQuestions.length === 0) {
        setMessage("Please add at least one FAQ question and answer");
        return;
      }

      // Validate navbarItemId
      const finalNavbarItemId =
        data.navbarItemId || selectedItemId || selectedNavbarItemId;
      if (!finalNavbarItemId) {
        setMessage("Please select a service page first");
        return;
      }

      const payload = {
        ...(existingFAQ?.id && { id: existingFAQ.id }),
        navbarItemId: finalNavbarItemId,
        region,
        status: "PUBLISHED" as const,
        questions: filteredQuestions.map((q, index) => ({
          question: q.question.trim(),
          answer: q.answer.trim(),
          order: index,
        })),
      };

      const url = "/api/admin/faq";
      const method = existingFAQ ? "PUT" : "POST";

      try {
        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
          const errorMsg =
            result.error?.message ||
            (typeof result.error === "string"
              ? result.error
              : JSON.stringify(result.error)) ||
            "Failed to save FAQ section";
          setMessage(errorMsg);
          return;
        }

        setMessage("FAQ section saved successfully!");
        setTimeout(() => {
          handleBackToNavbar();
        }, 1500);
      } catch (error) {
        setMessage("Network error. Please try again.");
        console.error("Error saving FAQ:", error);
      }
    });
  });

  if (!selectedItemId && !selectedNavbarItemId) {
    return (
      <div className="space-y-6">
        {/* Select Service Page */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Select a Service Page
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            Choose a navbar item to create or edit its FAQ section
          </p>
          <div className="space-y-2">
            {filteredNavItems.length === 0 ? (
              <p className="text-sm text-slate-500">No matches found.</p>
            ) : (
              filteredNavItems.map((item) => {
              const hasFAQ = allFAQs.some((f) => f.navbarItemId === item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavbarItemSelect(item.id)}
                  className="w-full text-left rounded-lg border border-slate-200 p-4 hover:bg-slate-50 transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-900">
                        {item.label}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {item.href}
                      </div>
                    </div>
                    {hasFAQ && (
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                        Has FAQ
                      </span>
                    )}
                  </div>
                </button>
              );
              })
            )}
          </div>
        </div>
      </div>
    );
  }

  const selectedItem = navItems.find(
    (item) => item.id === (selectedItemId || selectedNavbarItemId)
  );

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`rounded-lg p-4 border ${
            message.includes("success")
              ? "bg-green-50 text-green-800 border-green-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.includes("success") ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span className="font-medium">{message}</span>
          </div>
        </div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                {existingFAQ ? "Edit FAQ Section" : "Create FAQ Section"}
              </h2>
              {selectedItem && (
                <p className="text-sm text-slate-600 mt-1">
                  For:{" "}
                  <span className="font-semibold">{selectedItem.label}</span> (
                  {selectedItem.href})
                </p>
              )}
            </div>
            <button
              onClick={handleBackToNavbar}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to List
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="hidden"
            {...form.register("navbarItemId")}
            value={selectedItemId || selectedNavbarItemId || ""}
          />

          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-900 mb-4">
              FAQ Questions & Answers
            </label>
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="rounded-lg border border-slate-200 p-6 bg-slate-50"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-slate-700">
                    FAQ #{index + 1}
                  </span>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-lg transition"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Question
                    </label>
                    <input
                      {...form.register(`questions.${index}.question`)}
                      className="w-full rounded-lg border border-slate-200 px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., What documents are required for registration?"
                    />
                    {form.formState.errors.questions?.[index]?.question && (
                      <p className="text-xs text-red-600 mt-1">
                        {form.formState.errors.questions[index]?.question?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Answer
                    </label>
                    <textarea
                      {...form.register(`questions.${index}.answer`)}
                      rows={4}
                      className="w-full rounded-lg border border-slate-200 px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Provide a detailed answer..."
                    />
                    {form.formState.errors.questions?.[index]?.answer && (
                      <p className="text-xs text-red-600 mt-1">
                        {form.formState.errors.questions[index]?.answer?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => append({ question: "", answer: "", order: fields.length })}
              className="w-full rounded-lg border-2 border-dashed border-slate-300 px-4 py-3 text-sm font-medium text-slate-600 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
            >
              + Add Another FAQ
            </button>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isPending
              ? "Saving..."
              : existingFAQ
              ? "Update FAQ Section"
              : "Create FAQ Section"}
          </button>
        </form>
      </div>
    </div>
  );
}

