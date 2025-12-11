"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type {
  NavbarItem,
  ServicePage,
  ServicePageSection,
} from "@prisma/client";
import dynamic from "next/dynamic";
import type { OutputData } from "@editorjs/editorjs";
import { SEOMetaEditor } from "@/components/admin/seo-meta-editor";

const EditorJsEditor = dynamic(
  () =>
    import("@/components/editor/editorjs-editor").then((mod) => ({
      default: mod.EditorJsEditor,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-xl border border-slate-200 bg-white p-8 min-h-[300px] flex items-center justify-center text-slate-400">
        Loading editor...
      </div>
    ),
  }
);

function tryParseEditorJson(content: string): OutputData | null {
  try {
    const parsed = JSON.parse(content);
    if (parsed && typeof parsed === "object" && "blocks" in parsed) {
      return parsed as OutputData;
    }
    return null;
  } catch {
    return null;
  }
}

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
  allServicePages = [],
}: ServicePageManagerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(
    new Set([0])
  );
  const [savingSection, setSavingSection] = useState<number | null>(null);

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

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleNavbarItemSelect = (itemId: string) => {
    const next = new URLSearchParams(searchParams?.toString() ?? "");
    next.set("navbarItemId", itemId);
    const regionParam =
      searchParams?.get("region") || (region === "US" ? "US" : "INDIA");
    next.set("region", regionParam);
    router.push(`/admin/service-pages?${next.toString()}`);
  };

  const handleBackToNavbar = () => {
    const next = new URLSearchParams(searchParams?.toString() ?? "");
    next.delete("navbarItemId");
    router.push(`/admin/service-pages?${next.toString()}`);
  };

  const handleSectionUpdate = async (index: number) => {
    const section = form.getValues(`sections.${index}`);

    if (!section.title.trim() || !section.content.trim()) {
      setMessage("Please fill in both title and content");
      return;
    }

    const finalNavbarItemId =
      form.getValues("navbarItemId") || selectedItemId || selectedNavbarItemId;

    if (!finalNavbarItemId) {
      setMessage("Please select a service page first");
      return;
    }

    setSavingSection(index);
    setMessage(null);

    try {
      // Check if this is an existing section (has id) or new section
      const isNewSection = !section.id;

      let payload;
      let url;
      let method;

      if (isNewSection) {
        // New section - use service-page-sections endpoint
        if (existingServicePage?.id) {
          // Service page exists, provide servicePageId
          payload = {
            servicePageId: existingServicePage.id,
            title: section.title,
            content: section.content,
            order: section.order || index + 1,
          };
        } else {
          // Service page doesn't exist, provide navbarItemId and region
          // API will create service page automatically
          payload = {
            navbarItemId: finalNavbarItemId,
            region,
            title: section.title,
            content: section.content,
            order: section.order || index + 1,
          };
        }
        url = "/api/admin/service-page-sections";
        method = "POST";
      } else {
        // Existing section - update it
        payload = {
          id: section.id,
          title: section.title,
          content: section.content,
          order: section.order || index + 1,
        };
        url = "/api/admin/service-page-sections";
        method = "PUT";
      }

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
          "Failed to save section";
        setMessage(errorMsg);
        return;
      }

      // Update the form with the returned section id if it was a new section
      if (isNewSection && result.section?.id) {
        form.setValue(`sections.${index}.id`, result.section.id);
      }

      setMessage(`Section ${index + 1} saved successfully!`);
      setTimeout(() => setMessage(null), 3000);

      // Optionally refresh the page data
      router.refresh();
    } catch (error) {
      setMessage("Network error. Please try again.");
      console.error("Error saving section:", error);
    } finally {
      setSavingSection(null);
    }
  };

  if (!selectedItemId && !selectedNavbarItemId) {
    return (
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Select a Service Page
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            Choose a navbar item to create or edit its service page with
            sections
          </p>
          <div className="space-y-2">
            {navItems.map((item) => {
              const hasServicePage = allServicePages.some(
                (sp) => sp.navbarItemId === item.id
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
                {existingServicePage
                  ? "Edit Service Page"
                  : "Create Service Page"}
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

        <div className="space-y-8">
          <input
            type="hidden"
            {...form.register("navbarItemId")}
            value={selectedItemId || selectedNavbarItemId || ""}
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Sections</h3>
              <button
                type="button"
                onClick={() => {
                  const currentSections = form.getValues("sections");
                  const maxOrder = Math.max(
                    ...currentSections.map((s, i) => s.order || i + 1),
                    0
                  );
                  const newIndex = fields.length;
                  append({
                    title: "",
                    content: "",
                    order: Math.min(maxOrder + 1, 10),
                  });
                  setExpandedSections((prev) => new Set([...prev, newIndex]));
                }}
                className="px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                disabled={fields.length >= 10}
              >
                + Add Section
              </button>
            </div>

            {fields.map((field, index) => {
              const isExpanded = expandedSections.has(index);
              const section = form.watch(`sections.${index}`);

              return (
                <div
                  key={field.id}
                  className="rounded-lg border border-slate-200 overflow-hidden"
                >
                  {/* Section Header - Collapsible */}
                  <button
                    type="button"
                    onClick={() => toggleSection(index)}
                    className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-semibold text-sm">
                        {index + 1}
                      </span>
                      <div className="text-left">
                        <h4 className="text-md font-semibold text-slate-900">
                          {section?.title || `Section ${index + 1}`}
                        </h4>
                        {!isExpanded && section?.title && (
                          <p className="text-xs text-slate-500 mt-0.5">
                            Order: {section.order || index + 1}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            remove(index);
                            setExpandedSections((prev) => {
                              const newSet = new Set(prev);
                              newSet.delete(index);
                              return newSet;
                            });
                          }}
                          className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          Remove
                        </button>
                      )}
                      <svg
                        className={`w-5 h-5 text-slate-400 transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </button>

                  {/* Section Content - Expandable */}
                  {isExpanded && (
                    <div className="p-6 pt-0 space-y-4 border-t border-slate-100">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-900 mb-2">
                            Section Title{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            {...form.register(`sections.${index}.title`)}
                            className="w-full rounded-lg border border-slate-200 px-4 py-2"
                            placeholder="e.g., Overview, Features, Benefits"
                          />
                          {form.formState.errors.sections?.[index]?.title && (
                            <p className="text-xs text-red-600 mt-1">
                              {
                                form.formState.errors.sections[index]?.title
                                  ?.message
                              }
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-900 mb-2">
                            Order (1-10)
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            {...form.register(`sections.${index}.order`, {
                              valueAsNumber: true,
                            })}
                            className="w-full rounded-lg border border-slate-200 px-4 py-2"
                          />
                          {form.formState.errors.sections?.[index]?.order && (
                            <p className="text-xs text-red-600 mt-1">
                              {
                                form.formState.errors.sections[index]?.order
                                  ?.message
                              }
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">
                          Content <span className="text-red-500">*</span>
                        </label>
                        <EditorJsEditor
                          key={`section-${field.id}-${index}`}
                          value={
                            field.content
                              ? typeof field.content === "string"
                                ? tryParseEditorJson(field.content)
                                : field.content
                              : undefined
                          }
                          onChange={(value) => {
                            form.setValue(
                              `sections.${index}.content`,
                              JSON.stringify(value),
                              {
                                shouldDirty: true,
                                shouldValidate: false,
                              }
                            );
                          }}
                          placeholder=""
                          onImageUpload={async (file) => {
                            const formData = new FormData();
                            formData.append("file", file);
                            formData.append("region", region);
                            const response = await fetch("/api/admin/upload", {
                              method: "POST",
                              body: formData,
                            });
                            const result = await response.json();
                            if (!response.ok) {
                              throw new Error(result.error || "Upload failed");
                            }
                            return result.url;
                          }}
                          region={region}
                        />
                        {form.formState.errors.sections?.[index]?.content && (
                          <p className="text-xs text-red-600 mt-1">
                            {
                              form.formState.errors.sections[index]?.content
                                ?.message
                            }
                          </p>
                        )}
                      </div>

                      {/* Individual Section Update Button */}
                      <button
                        type="button"
                        onClick={() => handleSectionUpdate(index)}
                        disabled={savingSection === index}
                        className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        {savingSection === index
                          ? "Saving..."
                          : section?.id
                          ? `Update Section ${index + 1}`
                          : `Save Section ${index + 1}`}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* SEO Meta Tags Section */}
          {existingServicePage?.id && (
            <div className="border-t border-slate-200 pt-8">
              <SEOMetaEditor
                pageType="SERVICE"
                pageId={existingServicePage.id}
                pageName={selectedItem?.label}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
