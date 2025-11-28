"use client";

import React, { useState, useTransition, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { NavbarItem, ServicePage, ServicePageSection } from "@prisma/client";
import { QuillEditor } from "./quill-editor";

type ServicePageWithSections = ServicePage & {
  sections: ServicePageSection[];
};

type ServicePageWithNavItem = ServicePageWithSections & {
  navbarItem: NavbarItem | null;
};

type ServicePageManagerProps = {
  region: "INDIA" | "US";
  navItems: NavbarItem[];
  selectedNavbarItemId?: string;
  existingServicePage?: ServicePageWithSections | null;
  navbarItem?: NavbarItem | null;
  allServicePages?: ServicePageWithNavItem[];
};

const sectionSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  order: z.number().min(1).max(10),
});

const servicePageFormSchema = z.object({
  navbarItemId: z.string().min(1, "Navbar item is required"),
  sections: z.array(sectionSchema).min(1, "At least one section is required"),
});

type ServicePageForm = z.infer<typeof servicePageFormSchema>;

export function ServicePageManager({
  region,
  navItems,
  selectedNavbarItemId,
  existingServicePage,
  navbarItem,
  allServicePages = [],
}: ServicePageManagerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState<Record<number, boolean>>({});

  const selectedItemId = selectedNavbarItemId || "";

  const form = useForm<ServicePageForm>({
    resolver: zodResolver(servicePageFormSchema),
    defaultValues: existingServicePage
      ? {
          navbarItemId: existingServicePage.navbarItemId,
          sections: existingServicePage.sections.map((s) => ({
            id: s.id,
            title: s.title,
            content: s.content,
            order: s.order,
          })),
        }
      : {
          navbarItemId: selectedItemId || "",
          sections: [{ title: "", content: "", order: 1 }],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "sections",
  });

  useEffect(() => {
    if (selectedItemId || selectedNavbarItemId) {
      const finalNavbarItemId = selectedItemId || selectedNavbarItemId || "";
      form.setValue("navbarItemId", finalNavbarItemId);
    }

    if (existingServicePage) {
      form.reset({
        navbarItemId: existingServicePage.navbarItemId,
        sections: existingServicePage.sections.map((s) => ({
          id: s.id,
          title: s.title,
          content: s.content,
          order: s.order,
        })),
      });
    } else if (selectedItemId || selectedNavbarItemId) {
      form.reset({
        navbarItemId: selectedItemId || selectedNavbarItemId || "",
        sections: [{ title: "", content: "", order: 1 }],
      });
    }
  }, [existingServicePage, selectedItemId, selectedNavbarItemId, form]);

  const handleNavbarItemSelect = (itemId: string) => {
    const next = new URLSearchParams(searchParams?.toString() ?? "");
    next.set("navbarItemId", itemId);
    const regionParam = searchParams?.get("region") || (region === "US" ? "US" : "INDIA");
    next.set("region", regionParam);
    router.push(`/admin/service-pages?${next.toString()}`);
  };

  const handleBackToNavbar = () => {
    const next = new URLSearchParams(searchParams?.toString() ?? "");
    next.delete("navbarItemId");
    router.push(`/admin/service-pages?${next.toString()}`);
  };


  const handleSubmit = form.handleSubmit((data) => {
    startTransition(async () => {
      setMessage(null);

      // Validate sections
      const validSections = data.sections.filter((s) => s.title.trim() && s.content.trim());
      if (validSections.length === 0) {
        setMessage("Please add at least one section with title and content");
        return;
      }

      const finalNavbarItemId = data.navbarItemId || selectedItemId || selectedNavbarItemId;
      if (!finalNavbarItemId) {
        setMessage("Please select a service page first");
        return;
      }

      const payload = {
        ...(existingServicePage?.id && { id: existingServicePage.id }),
        navbarItemId: finalNavbarItemId,
        region,
        status: "PUBLISHED" as const,
        sections: validSections.map((s, index) => ({
          ...s,
          order: s.order || index + 1,
        })),
      };

      try {
        const url = "/api/admin/service-pages";
        const method = existingServicePage ? "PUT" : "POST";

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
          const errorMsg =
            result.error?.message ||
            (typeof result.error === "string" ? result.error : JSON.stringify(result.error)) ||
            "Failed to save service page";
          setMessage(errorMsg);
          return;
        }

        setMessage("Service page saved successfully!");
        setTimeout(() => {
          handleBackToNavbar();
        }, 1500);
      } catch (error) {
        setMessage("Network error. Please try again.");
        console.error("Error saving service page:", error);
      }
    });
  });

  if (!selectedItemId && !selectedNavbarItemId) {
    return (
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Select a Service Page</h2>
          <p className="text-sm text-slate-600 mb-6">
            Choose a navbar item to create or edit its service page with sections
          </p>
          <div className="space-y-2">
            {navItems.map((item) => {
              const hasServicePage = allServicePages.some((sp) => sp.navbarItemId === item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavbarItemSelect(item.id)}
                  className="w-full text-left rounded-lg border border-slate-200 p-4 hover:bg-slate-50 transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-900">{item.label}</div>
                      <div className="text-xs text-slate-500 mt-1">{item.href}</div>
                    </div>
                    {hasServicePage && (
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                        Has Service Page
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const selectedItem = navItems.find((item) => item.id === (selectedItemId || selectedNavbarItemId));

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
                {existingServicePage ? "Edit Service Page" : "Create Service Page"}
              </h2>
              {selectedItem && (
                <p className="text-sm text-slate-600 mt-1">
                  For: <span className="font-semibold">{selectedItem.label}</span> ({selectedItem.href})
                </p>
              )}
            </div>
            <button
              onClick={handleBackToNavbar}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to List
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <input type="hidden" {...form.register("navbarItemId")} value={selectedItemId || selectedNavbarItemId || ""} />

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Sections</h3>
              <button
                type="button"
                onClick={() => {
                  const maxOrder = Math.max(...fields.map((f, i) => form.watch(`sections.${i}.order`) || i + 1), 0);
                  append({
                    title: "",
                    content: "",
                    order: Math.min(maxOrder + 1, 10),
                  });
                }}
                className="px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                disabled={fields.length >= 10}
              >
                + Add Section
              </button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="rounded-lg border border-slate-200 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-md font-semibold text-slate-900">Section {index + 1}</h4>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Section Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...form.register(`sections.${index}.title`)}
                      className="w-full rounded-lg border border-slate-200 px-4 py-2"
                      placeholder="e.g., Overview, Features, Benefits"
                    />
                    {form.formState.errors.sections?.[index]?.title && (
                      <p className="text-xs text-red-600 mt-1">
                        {form.formState.errors.sections[index]?.title?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Order (1-10)</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      {...form.register(`sections.${index}.order`, { valueAsNumber: true })}
                      className="w-full rounded-lg border border-slate-200 px-4 py-2"
                    />
                    {form.formState.errors.sections?.[index]?.order && (
                      <p className="text-xs text-red-600 mt-1">
                        {form.formState.errors.sections[index]?.order?.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <QuillEditor
                    key={`section-${field.id}-${index}`}
                    value={field.content || ""}
                    onChange={(value) => {
                      form.setValue(`sections.${index}.content`, value, { shouldDirty: true, shouldValidate: false });
                    }}
                    placeholder="Enter section content..."
                  />
                  {form.formState.errors.sections?.[index]?.content && (
                    <p className="text-xs text-red-600 mt-1">
                      {form.formState.errors.sections[index]?.content?.message}
                    </p>
                  )}
                </div>

              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Saving..." : existingServicePage ? "Update Service Page" : "Create Service Page"}
          </button>
        </form>
      </div>
    </div>
  );
}

