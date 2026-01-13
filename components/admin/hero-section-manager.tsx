"use client";

import React, { useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { NavbarItem, PageHero } from "@prisma/client";
import { useAdminSearch } from "@/components/admin/admin-search-context";
import toast from "react-hot-toast";

type HeroWithNavItem = PageHero & {
  navbarItem: NavbarItem | null;
};

type IndiaHeroContent = {
  benefits: string[];
  partnerLogos?: string[];
};

type UsHeroContent = {
  announcement?: string;
};

type HeroSectionManagerProps = {
  region: "INDIA" | "US";
  navItems: NavbarItem[];
  selectedNavbarItemId?: string;
  existingHero?: PageHero | null;
  navbarItem?: NavbarItem | null;
  allHeroes?: HeroWithNavItem[];
};

// India template schema
const indiaHeroSchema = z.object({
  navbarItemId: z.string().min(1),
  title: z.string().min(3),
  benefits: z.array(z.string()).min(1),
  partnerLogos: z.array(z.string()).optional(),
});

// US template schema
const usHeroSchema = z.object({
  navbarItemId: z.string().min(1),
  announcement: z.string().optional(),
  headline: z.string().min(3),
  description: z.string().min(10),
});

type IndiaHeroForm = z.infer<typeof indiaHeroSchema>;
type UsHeroForm = z.infer<typeof usHeroSchema>;

export function HeroSectionManager({
  region,
  navItems,
  selectedNavbarItemId,
  existingHero,
  allHeroes = [],
}: HeroSectionManagerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const selectedItemId = selectedNavbarItemId || "";
  const { query } = useAdminSearch();
  const normalizedQuery = query.trim().toLowerCase();
  const filteredNavItems = normalizedQuery
    ? navItems.filter((item) => {
        const target = `${item.label ?? ""} ${item.href ?? ""}`.toLowerCase();
        return target.includes(normalizedQuery);
      })
    : navItems;

  // India form
  const indiaForm = useForm<IndiaHeroForm>({
    resolver: zodResolver(indiaHeroSchema),
    defaultValues: {
      navbarItemId: selectedItemId || selectedNavbarItemId || "",
      title: "",
      benefits: [""],
      partnerLogos: [],
    },
  });

  // US form
  const usForm = useForm<UsHeroForm>({
    resolver: zodResolver(usHeroSchema),
    defaultValues: {
      navbarItemId: selectedItemId || "",
      headline: "",
      description: "",
      announcement: "",
    },
  });

  // Use useWatch for benefits field to avoid React Compiler issues
  const indiaBenefits = useWatch({
    control: indiaForm.control,
    name: "benefits",
  });

  // Update form values when existingHero or selectedItemId changes
  useEffect(() => {
    if (selectedItemId || selectedNavbarItemId) {
      const finalNavbarItemId = selectedItemId || selectedNavbarItemId || "";
      indiaForm.setValue("navbarItemId", finalNavbarItemId);
      usForm.setValue("navbarItemId", finalNavbarItemId);
    }

    // Update form when existingHero changes (for edit mode)
    if (existingHero) {
      if (region === "INDIA") {
        const content = existingHero.content as IndiaHeroContent;
        indiaForm.reset({
          navbarItemId: existingHero.navbarItemId,
          title: existingHero.title,
          benefits: content?.benefits?.length > 0 ? content.benefits : [""],
          partnerLogos: content?.partnerLogos || [],
        });
      } else {
        const content = existingHero.content as UsHeroContent;
        usForm.reset({
          navbarItemId: existingHero.navbarItemId,
          headline: existingHero.title,
          description: existingHero.description || "",
          announcement: content?.announcement || "",
        });
      }
    } else if (selectedItemId || selectedNavbarItemId) {
      // Reset form for new hero
      if (region === "INDIA") {
        indiaForm.reset({
          navbarItemId: selectedItemId || selectedNavbarItemId || "",
          title: "",
          benefits: [""],
          partnerLogos: [],
        });
      } else {
        usForm.reset({
          navbarItemId: selectedItemId || selectedNavbarItemId || "",
          headline: "",
          description: "",
          announcement: "",
        });
      }
    }
  }, [
    existingHero,
    selectedItemId,
    selectedNavbarItemId,
    region,
    indiaForm,
    usForm,
  ]);

  const handleNavbarItemSelect = (itemId: string) => {
    const next = new URLSearchParams(searchParams?.toString() ?? "");
    next.set("navbarItemId", itemId);
    const regionParam =
      searchParams?.get("region") || (region === "US" ? "US" : "INDIA");
    next.set("region", regionParam);
    router.push(`/admin/hero?${next.toString()}`);
  };

  const handleBackToNavbar = () => {
    const next = new URLSearchParams(searchParams?.toString() ?? "");
    next.delete("navbarItemId");
    router.push(`/admin/hero?${next.toString()}`);
  };

  const handleIndiaSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    indiaForm.handleSubmit(
      (data) => {
        // Validate benefits have at least one non-empty item
        const filteredBenefits = data.benefits.filter((b) => b.trim());
        if (filteredBenefits.length === 0) {
          toast.error("Please add at least one benefit");
          return;
        }

        // Validate navbarItemId
        const finalNavbarItemId =
          data.navbarItemId || selectedItemId || selectedNavbarItemId;
        if (!finalNavbarItemId) {
          toast.error("Please select a service page first");
          return;
        }

        startTransition(async () => {
          const payload = {
            ...(existingHero?.id && { id: existingHero.id }),
            navbarItemId: finalNavbarItemId,
            region,
            title: data.title.trim(),
            content: {
              benefits: filteredBenefits,
              partnerLogos: data.partnerLogos || [],
            },
            status: "PUBLISHED" as const,
          };

          console.log("Submitting payload:", payload);

          const url = "/api/admin/hero";
          const method = existingHero ? "PUT" : "POST";

          try {
            const response = await fetch(url, {
              method,
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });

            const result = await response.json();
            console.log("Response:", result);

            if (!response.ok) {
              const errorMsg =
                result.error?.message ||
                (typeof result.error === "string"
                  ? result.error
                  : JSON.stringify(result.error)) ||
                "Failed to save hero section";
              toast.error(errorMsg);
              return;
            }

            toast.success("Hero section saved successfully!");
            setTimeout(() => {
              // Go back to list view after successful save
              handleBackToNavbar();
            }, 1500);
          } catch (error) {
            toast.error("Network error. Please try again.");
            console.error("Error saving hero:", error);
          }
        });
      },
      (errors) => {
        // Handle validation errors
        console.error("Form validation errors:", errors);
        const firstError = Object.values(errors)[0];
        toast.error(
          firstError?.message?.toString() ||
            "Please fill in all required fields correctly."
        );
      }
    )();
  };

  const handleUsSubmit = usForm.handleSubmit((data) => {
    startTransition(async () => {
      const payload = {
        id: existingHero?.id,
        navbarItemId: data.navbarItemId,
        region,
        title: data.headline,
        description: data.description,
        content: {
          announcement: data.announcement,
        },
        status: "PUBLISHED" as const,
      };

      const url = existingHero ? "/api/admin/hero" : "/api/admin/hero";
      const method = existingHero ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || "Failed to save hero section");
        return;
      }

      toast.success("Hero section saved successfully!");
      setTimeout(() => {
        // Go back to list view after successful save
        handleBackToNavbar();
      }, 1500);
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
            Choose a navbar item to create or edit its hero section
          </p>
          <div className="space-y-2">
            {filteredNavItems.length === 0 ? (
              <p className="text-sm text-slate-500">No matches found.</p>
            ) : (
              filteredNavItems.map((item) => {
                const hasHero = allHeroes.some(
                  (h) => h.navbarItemId === item.id
                );
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
                      {hasHero && (
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                          Has Hero
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
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                {existingHero ? "Edit Hero Section" : "Create Hero Section"}
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

        {region === "INDIA" ? (
          <div>
            <form onSubmit={handleIndiaSubmit} className="space-y-6">
              <input
                type="hidden"
                {...indiaForm.register("navbarItemId")}
                value={selectedItemId || selectedNavbarItemId || ""}
              />

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Title
                </label>
                <input
                  {...indiaForm.register("title")}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2"
                  placeholder="e.g., Limited Liability Partnership Registration"
                />
                {indiaForm.formState.errors.title && (
                  <p className="text-xs text-red-600 mt-1">
                    {indiaForm.formState.errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Benefits
                </label>
                {indiaBenefits.map((_, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      {...indiaForm.register(`benefits.${index}`)}
                      className="flex-1 rounded-lg border border-slate-200 px-4 py-2"
                      placeholder="e.g., 750+ LLPs Registered"
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          const benefits = indiaForm.getValues("benefits");
                          indiaForm.setValue(
                            "benefits",
                            benefits.filter((_, i) => i !== index)
                          );
                        }}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const benefits = indiaForm.getValues("benefits");
                    indiaForm.setValue("benefits", [...benefits, ""]);
                  }}
                  className="mt-2 text-sm text-indigo-600 hover:text-indigo-700"
                >
                  + Add Benefit
                </button>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending
                  ? "Saving..."
                  : existingHero
                  ? "Update Hero Section"
                  : "Create Hero Section"}
              </button>
            </form>
          </div>
        ) : (
          <div>
            <form onSubmit={handleUsSubmit} className="space-y-6">
              <input
                type="hidden"
                {...usForm.register("navbarItemId")}
                value={selectedItemId || selectedNavbarItemId}
              />

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Announcement Banner (Optional)
                </label>
                <input
                  {...usForm.register("announcement")}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2"
                  placeholder="e.g., New We've just released a new feature →"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Headline
                </label>
                <input
                  {...usForm.register("headline")}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2"
                  placeholder="e.g., Boost Your Productivity, Simplify Your Life"
                />
                {usForm.formState.errors.headline && (
                  <p className="text-xs text-red-600 mt-1">
                    {usForm.formState.errors.headline.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Description
                </label>
                <textarea
                  {...usForm.register("description")}
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2"
                  placeholder="Describe the service..."
                />
                {usForm.formState.errors.description && (
                  <p className="text-xs text-red-600 mt-1">
                    {usForm.formState.errors.description.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50"
              >
                {isPending
                  ? "Saving..."
                  : existingHero
                  ? "Update Hero Section"
                  : "Create Hero Section"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
