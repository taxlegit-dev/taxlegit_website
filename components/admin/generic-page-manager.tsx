"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { NavbarItem, GenericPage } from "@prisma/client";
import dynamic from "next/dynamic";
import type { OutputData } from "@editorjs/editorjs";
import { SEOMetaEditor } from "@/components/admin/seo-meta-editor";
import { useAdminSearch } from "@/components/admin/admin-search-context";
import toast from "react-hot-toast";
import { ContentStatus } from "@prisma/client";

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

type GenericPageManagerProps = {
  region: "INDIA" | "US";
  selectedNavbarItemId?: string;
  existingGenericPage?: GenericPage | null;
  genericNavbarItems: NavbarItem[];
  allGenericPages: {
    id: string;
    navbarItemId: string | null;
    title: string;
    status: ContentStatus;
    updatedAt: Date;
  }[];
};

const genericPageFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

type GenericPageForm = z.infer<typeof genericPageFormSchema>;

export function GenericPageManager({
  region,
  selectedNavbarItemId,
  existingGenericPage,
  genericNavbarItems,
  allGenericPages,
}: GenericPageManagerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [saving, setSaving] = useState(false);
  const [editorData, setEditorData] = useState<OutputData | null>(null);
  const [editorKey, setEditorKey] = useState(0);
  const { query } = useAdminSearch();
  const normalizedQuery = query.trim().toLowerCase();
  const pageByNavbarItemId = useMemo(() => {
    const map = new Map<string, (typeof allGenericPages)[number]>();
    allGenericPages.forEach((page) => {
      if (page.navbarItemId) {
        map.set(page.navbarItemId, page);
      }
    });
    return map;
  }, [allGenericPages]);
  const filteredNavbarItems = normalizedQuery
    ? genericNavbarItems.filter((item) => {
        const matchingPage = pageByNavbarItemId.get(item.id);
        const target = `${item.label ?? ""} ${item.href ?? ""} ${
          matchingPage?.title ?? ""
        }`.toLowerCase();
        return target.includes(normalizedQuery);
      })
    : genericNavbarItems;

  const form = useForm<GenericPageForm>({
    resolver: zodResolver(genericPageFormSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  useEffect(() => {
    if (existingGenericPage) {
      form.reset({
        id: existingGenericPage.id,
        title: existingGenericPage.title,
        content: existingGenericPage.content as string,
      });

      // Parse content for editor
      const content = existingGenericPage.content as string;
      if (content) {
        const parsed = tryParseEditorJson(content);
        setEditorData(parsed);
        setEditorKey((prev) => prev + 1);
      }
    } else if (selectedNavbarItemId) {
      form.reset({
        title: "",
        content: "",
      });
      setEditorData(null);
      setEditorKey((prev) => prev + 1);
    }
  }, [existingGenericPage, selectedNavbarItemId, form]);

  // Update editor data when content changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "content" && value.content) {
        const parsed = tryParseEditorJson(value.content);
        setEditorData(parsed);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleEditPage = (navbarItemId: string) => {
    const next = new URLSearchParams(searchParams?.toString() ?? "");
    next.set("navbarItemId", navbarItemId);
    router.push(`/admin/generic-pages?${next.toString()}`);
  };

  const handleBackToList = () => {
    const next = new URLSearchParams(searchParams?.toString() ?? "");
    next.delete("navbarItemId");
    router.push(`/admin/generic-pages?${next.toString()}`);
  };

  const handleSave = async () => {
    const data = form.getValues();
    if (!selectedNavbarItemId) {
      toast.error("Please select a generic page first");
      return;
    }

    if (!data.title.trim() || !data.content.trim()) {
      toast.error("Please fill in title and content");
      return;
    }

    setSaving(true);

    try {
      const isNewPage = !existingGenericPage?.id;

      let payload;
      let url;
      let method;

      if (isNewPage) {
        payload = {
          navbarItemId: selectedNavbarItemId,
          region,
          title: data.title,
          content: data.content,
          status: "PUBLISHED",
        };
        url = "/api/admin/generic-pages";
        method = "POST";
      } else {
        payload = {
          id: existingGenericPage.id,
          navbarItemId: selectedNavbarItemId,
          region,
          title: data.title,
          content: data.content,
          status: "PUBLISHED",
        };
        url = "/api/admin/generic-pages";
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
          "Failed to save page";
        toast.error(errorMsg);
        return;
      }

      toast.success(`Page ${isNewPage ? "created" : "updated"} successfully!`);

      // Refresh the page data
      router.refresh();
    } catch (error) {
      toast.error("Network error. Please try again.");
      console.error("Error saving page:", error);
    } finally {
      setSaving(false);
    }
  };

  if (!selectedNavbarItemId) {
    return (
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Select a Generic Page to Edit
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            Choose a generic navbar link to edit its page content.
          </p>
          <div className="space-y-2">
            {filteredNavbarItems.length === 0 ? (
              <p className="text-sm text-slate-500">No matches found.</p>
            ) : (
              filteredNavbarItems.map((item) => {
              const correspondingPage = pageByNavbarItemId.get(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleEditPage(item.id)}
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
                        {correspondingPage ? (
                          <div className="text-xs text-slate-400 mt-1">
                            Page: {correspondingPage.title}
                          </div>
                        ) : (
                          <div className="text-xs text-orange-500 mt-1">
                            No page content created yet
                          </div>
                        )}
                      </div>
                      {correspondingPage && (
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            correspondingPage.status === "PUBLISHED"
                              ? "bg-green-100 text-green-700"
                              : correspondingPage.status === "DRAFT"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {correspondingPage.status}
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
                {existingGenericPage
                  ? "Edit Generic Page"
                  : "Create Generic Page"}
              </h2>
            </div>
            <button
              onClick={handleBackToList}
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

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Page Title <span className="text-red-500">*</span>
              </label>
              <input
                {...form.register("title")}
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-lg"
                placeholder="Enter page title"
              />
              {form.formState.errors.title && (
                <p className="text-xs text-red-600 mt-1">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>
            <input type="hidden" {...form.register("id")} />


            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Content <span className="text-red-500">*</span>
              </label>
              {(!existingGenericPage || editorData) && (
                <EditorJsEditor
                  key={`${existingGenericPage?.id || "new"}-${selectedNavbarItemId}-${editorKey}`}
                  value={editorData}
                  onChange={(value) => {
                    form.setValue("content", JSON.stringify(value), {
                      shouldDirty: true,
                      shouldValidate: false,
                    });
                  }}
                  placeholder="Enter page content"
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
              )}
              {form.formState.errors.content && (
                <p className="text-xs text-red-600 mt-1">
                  {form.formState.errors.content.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {saving
              ? "Saving..."
              : existingGenericPage
              ? "Update Page"
              : "Create Page"}
          </button>

          {/* SEO Meta Tags Section */}
          {existingGenericPage?.id && (
            <div className="border-t border-slate-200 pt-6">
              <SEOMetaEditor
                pageType="GENERIC"
                pageId={existingGenericPage.id}
                pageName={existingGenericPage.title}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
