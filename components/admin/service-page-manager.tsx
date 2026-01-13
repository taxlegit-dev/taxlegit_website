"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { NavbarItem } from "@prisma/client";
import dynamic from "next/dynamic";
import type { OutputData } from "@editorjs/editorjs";
import { SEOMetaEditor } from "@/components/admin/seo-meta-editor";
import { useAdminSearch } from "@/components/admin/admin-search-context";
import toast from "react-hot-toast";

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
type ServicePageManagerProps = {
  pageType: "SERVICE";
  region: "INDIA" | "US";
  navItems: NavbarItem[];
  selectedNavbarItemId?: string;

  // 🔥 LIGHT INDICATOR ONLY
  existingServicePage?: {
    id: string;
    navbarItemId: string;
    updatedAt: Date;
  } | null;

  navbarItem?: NavbarItem | null;

  // 🔥 NEW PROP (LIST PURPOSE ONLY)
  servicePageLinks: {
    id: string;
    navbarItemId: string;
    updatedAt: Date;
  }[];
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
  pageType,
  region,
  navItems,
  selectedNavbarItemId,
  existingServicePage,
  servicePageLinks = [],
}: ServicePageManagerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [expandedSections, setExpandedSections] = useState<Set<number>>(
    new Set([0])
  );
  const [savingSection, setSavingSection] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showSectionDeleteDialog, setShowSectionDeleteDialog] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<number | null>(null);
  const [deletingSection, setDeletingSection] = useState(false);
  const { query } = useAdminSearch();

  // ✅ OPTIMIZATION 1: Memoize service page lookup map
  const servicePagesMap = useMemo(() => {
    const map = new Map<string, boolean>();
    servicePageLinks.forEach((sp) => {
      map.set(sp.navbarItemId, true);
    });
    return map;
  }, [servicePageLinks]);

  // ✅ OPTIMIZATION 2: Memoize filtered items
  const filteredNavItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return navItems;

    return navItems.filter((item) => {
      const target = `${item.label ?? ""} ${item.href ?? ""}`.toLowerCase();
      return target.includes(normalizedQuery);
    });
  }, [query, navItems]);

  const selectedItemId = selectedNavbarItemId || "";
  const pageLabel = pageType === "SERVICE" ? "Service Page" : "Generic Page";

  const baseAdminPath =
    pageType === "SERVICE" ? "/admin/service-pages" : "/admin/generic-pages";

  const selectedItem = navItems.find(
    (item) => item.id === (selectedItemId || selectedNavbarItemId)
  );

  const form = useForm<ServicePageForm>({
    resolver: zodResolver(servicePageFormSchema),
    defaultValues: {
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

    if (selectedItemId || selectedNavbarItemId) {
      form.reset({
        navbarItemId: selectedItemId || selectedNavbarItemId || "",
        sections: [{ title: "", content: "", order: 1 }],
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
    router.push(`${baseAdminPath}?${next.toString()}`);
  };

  const handleBackToNavbar = () => {
    const next = new URLSearchParams(searchParams?.toString() ?? "");
    next.delete("navbarItemId");
    router.push(`${baseAdminPath}?${next.toString()}`);
  };

  const handleDeleteServicePage = async () => {
    if (!existingServicePage?.id) {
      toast.error("No service page to delete");
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch(
        `/api/admin/service-pages?id=${existingServicePage.id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        const errorMsg =
          result.error?.message ||
          (typeof result.error === "string"
            ? result.error
            : JSON.stringify(result.error)) ||
          "Failed to delete service page";
        toast.error(errorMsg);
        return;
      }
      toast.success("Service page deleted successfully!");

      handleBackToNavbar();
    } catch (error) {
      toast.error("Network error. Please try again.");
      console.error("Error deleting service page:", error);
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleSectionUpdate = async (index: number) => {
    const section = form.getValues(`sections.${index}`);

    if (!section.title.trim() || !section.content.trim()) {
      toast.error("Please fill in both title and content");
      return;
    }

    const finalNavbarItemId =
      form.getValues("navbarItemId") || selectedItemId || selectedNavbarItemId;

    if (!finalNavbarItemId) {
      toast.error("Please select a service page first");
      return;
    }

    setSavingSection(index);

    try {
      const isNewSection = !section.id;

      let payload;
      let url;
      let method;

      if (isNewSection) {
        if (existingServicePage?.id) {
          payload = {
            servicePageId: existingServicePage.id,
            title: section.title,
            content: section.content,
            order: section.order || index + 1,
          };
        } else {
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
        toast.error(errorMsg);
        return;
      }

      if (isNewSection && result.section?.id) {
        form.setValue(`sections.${index}.id`, result.section.id);
      }

      toast.success(`Section ${index + 1} saved successfully!`);
    } catch (error) {
      toast.error("Network error. Please try again.");
      console.error("Error saving section:", error);
    } finally {
      setSavingSection(null);
    }
  };

  const removeSectionAtIndex = (index: number) => {
    remove(index);
    setExpandedSections((prev) => {
      const next = new Set<number>();
      prev.forEach((value) => {
        if (value === index) {
          return;
        }
        next.add(value > index ? value - 1 : value);
      });
      return next;
    });
  };

  const handleDeleteSection = async () => {
    if (sectionToDelete === null) {
      return;
    }

    const section = form.getValues(`sections.${sectionToDelete}`);
    if (!section) {
      setShowSectionDeleteDialog(false);
      setSectionToDelete(null);
      return;
    }

    setDeletingSection(true);

    try {
      if (!section.id) {
        removeSectionAtIndex(sectionToDelete);
        toast.success("Section removed successfully!");
        return;
      }

      const response = await fetch(
        `/api/admin/service-page-sections?id=${section.id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        const errorMsg =
          result.error?.message ||
          (typeof result.error === "string"
            ? result.error
            : JSON.stringify(result.error)) ||
          "Failed to delete section";
        toast.error(errorMsg);
        return;
      }

      removeSectionAtIndex(sectionToDelete);
      toast.success("Section removed successfully!");
    } catch (error) {
      toast.error("Network error. Please try again.");
      console.error("Error deleting section:", error);
    } finally {
      setDeletingSection(false);
      setShowSectionDeleteDialog(false);
      setSectionToDelete(null);
    }
  };

  // ✅ LIST VIEW - Optimized with memoization
  if (!selectedItemId && !selectedNavbarItemId) {
    return (
      <div className="space-y-6">
        <div className="rounded-3xl border border-purple-600 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Select a {pageLabel}
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            Choose a navbar item to create or edit its service page with
            sections
          </p>
          <div className="space-y-2">
            {filteredNavItems.length === 0 ? (
              <p className="text-sm text-slate-500">No matches found.</p>
            ) : (
              filteredNavItems.map((item) => {
                // ✅ O(1) lookup instead of O(n)
                const hasServicePage = servicePagesMap.has(item.id);

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
                          {pageLabel} Created
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

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                {existingServicePage
                  ? `Edit ${pageLabel}`
                  : `Create ${pageLabel}`}
              </h2>
              {selectedItem && (
                <p className="text-sm text-slate-600 mt-1">
                  For:{" "}
                  <span className="font-semibold">{selectedItem.label}</span> (
                  {selectedItem.href})
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {existingServicePage && (
                <button
                  onClick={() => setShowDeleteDialog(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete Page
                </button>
              )}
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
              // const section = form.watch(`sections.${index}`);

              return (
                <div key={field.id} className="rounded-lg">
                  {/* Section Header - Collapsible */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleSection(index)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        toggleSection(index);
                      }
                    }}
                    className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-semibold text-sm">
                        {index + 1}
                      </span>
                      <div className="text-left">
                        <h4 className="text-md font-semibold text-slate-900">
                          {field.title || `Section ${index + 1}`}
                        </h4>
                        {!isExpanded && field?.title && (
                          <p className="text-xs text-slate-500 mt-0.5">
                            Order: {field.order || index + 1}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedSections((prev) => {
                            const next = new Set(prev);
                            if (next.has(index)) {
                              next.delete(index);
                            } else {
                              next.add(index);
                            }
                            return next;
                          });
                        }}
                        className="px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                      >
                        {isExpanded ? "Close" : "Edit"}
                      </button>
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSectionToDelete(index);
                            setShowSectionDeleteDialog(true);
                          }}
                          className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          Remove
                        </button>
                      )}

                      <svg
                        className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
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
                  </div>

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
                          key={`section-editor-${field.id || index}`}
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
                                shouldTouch: false,
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
                          : field?.id
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
                pageType={pageType}
                pageId={existingServicePage.id}
                pageName={selectedItem?.label}
              />
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100">
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Delete Service Page
                </h3>
                <p className="text-sm text-slate-600">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-700 mb-6">
              Are you sure you want to delete the service page for{" "}
              <span className="font-semibold">{selectedItem?.label}</span>? This
              will permanently delete the page and all its sections.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteServicePage}
                disabled={deleting}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition"
              >
                {deleting ? "Deleting..." : "Delete Page"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSectionDeleteDialog && sectionToDelete !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100">
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Remove Section
                </h3>
                <p className="text-sm text-slate-600">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-700 mb-6">
              Are you sure you want to remove{" "}
              <span className="font-semibold">
                {form.getValues(`sections.${sectionToDelete}.title`) ||
                  `Section ${sectionToDelete + 1}`}
              </span>
              ? This will permanently delete it from the database.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setShowSectionDeleteDialog(false);
                  setSectionToDelete(null);
                }}
                className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                disabled={deletingSection}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSection}
                disabled={deletingSection}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition"
              >
                {deletingSection ? "Removing..." : "Remove Section"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
