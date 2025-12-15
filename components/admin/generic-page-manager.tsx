"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type {
  NavbarItem,
  GenericPage,
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

type GenericPageWithNavItem = GenericPage & {
  navbarItem: NavbarItem | null;
};

type GenericPageManagerProps = {
  region: "INDIA" | "US";
  selectedSlug?: string;
  existingGenericPage?: GenericPage | null;
  allGenericPages: GenericPage[];
};

const genericPageFormSchema = z.object({
  navbarItemId: z.string().min(1, "Navbar item is required"),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});

type GenericPageForm = z.infer<typeof genericPageFormSchema>;

export function GenericPageManager({
  region,
  selectedSlug,
  existingGenericPage,
  allGenericPages,
}: GenericPageManagerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const form = useForm<GenericPageForm>({
    resolver: zodResolver(genericPageFormSchema),
    defaultValues: existingGenericPage
      ? {
          slug: existingGenericPage.slug,
          title: existingGenericPage.title,
          content: existingGenericPage.content as string,
          status: existingGenericPage.status,
        }
      : {
          slug: selectedSlug || "",
          title: "",
          content: "",
          status: "DRAFT",
        },
  });

  useEffect(() => {
    if (existingGenericPage) {
      form.reset({
        slug: existingGenericPage.slug,
        title: existingGenericPage.title,
        content: existingGenericPage.content as string,
        status: existingGenericPage.status,
      });
    } else if (selectedSlug) {
      form.reset({
        slug: selectedSlug,
        title: "",
        content: "",
        status: "DRAFT",
      });
    }
  }, [existingGenericPage, selectedSlug, form]);

  const handleNavbarItemSelect = (itemId: string) => {
    const next = new URLSearchParams(searchParams?.toString() ?? "");
    next.set("navbarItemId", itemId);
    const regionParam =
      searchParams?.get("region") || (region === "US" ? "US" : "INDIA");
    next.set("region", regionParam);
    router.push(`/admin/generic-pages?${next.toString()}`);
  };

  const handleBackToNavbar = () => {
    const next = new URLSearchParams(searchParams?.toString() ?? "");
    next.delete("navbarItemId");
    router.push(`/admin/generic-pages?${next.toString()}`);
  };

  const handleSave = async () => {
    const data = form.getValues();

    if (!data.slug.trim() || !data.title.trim() || !data.content.trim()) {
      setMessage("Please fill in slug, title and content");
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const isNewPage = !existingGenericPage?.id;

      let payload;
      let url;
      let method;

      if (isNewPage) {
        payload = {
          slug: data.slug,
          region,
          title: data.title,
          content: data.content,
          status: data.status || "DRAFT",
        };
        url = "/api/admin/generic-pages";
        method = "POST";
      } else {
        payload = {
          id: existingGenericPage.id,
          slug: data.slug,
          region,
          title: data.title,
          content: data.content,
          status: data.status,
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
        setMessage(errorMsg);
        return;
      }

      setMessage(`Page ${isNewPage ? "created" : "updated"} successfully!`);
      setTimeout(() => setMessage(null), 3000);

      // Refresh the page data
      router.refresh();
    } catch (error) {
      setMessage("Network error. Please try again.");
      console.error("Error saving page:", error);
    } finally {
      setSaving(false);
    }
  };

  if (!selectedSlug) {
    return (
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Select a Generic Page to Edit
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            Choose an existing generic page to edit or create a new one.
          </p>
          <div className="space-y-2">
            {allGenericPages.map((page) => (
              <button
                key={page.id}
                onClick={() => handleEditPage(page.slug)}
                className="w-full text-left rounded-lg border border-slate-200 p-4 hover:bg-slate-50 transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-900">
                      {page.title}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      /{page.slug}
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    page.status === "PUBLISHED"
                      ? "bg-green-100 text-green-700"
                      : page.status === "DRAFT"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {page.status}
                  </span>
                </div>
              </button>
            ))}
            <button
              onClick={() => handleEditPage("")}
              className="w-full text-left rounded-lg border border-dashed border-slate-300 p-4 hover:bg-slate-50 transition text-slate-600"
            >
              <div className="font-semibold">+ Create New Generic Page</div>
            </button>
          </div>
        </div>
      </div>
    );
  }

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
                {existingGenericPage
                  ? "Edit Generic Page"
                  : "Create Generic Page"}
              </h2>
              {selectedSlug && (
                <p className="text-sm text-slate-600 mt-1">
                  Slug: <span className="font-semibold">/{selectedSlug}</span>
                </p>
              )}
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
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                {...form.register("slug")}
                className="w-full rounded-lg border border-slate-200 px-4 py-3"
                placeholder="Enter page slug (e.g., about-us)"
              />
              {form.formState.errors.slug && (
                <p className="text-xs text-red-600 mt-1">
                  {form.formState.errors.slug.message}
                </p>
              )}
            </div>

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

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Status
              </label>
              <select
                {...form.register("status")}
                className="w-full rounded-lg border border-slate-200 px-4 py-3"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Content <span className="text-red-500">*</span>
              </label>
              <EditorJsEditor
                value={
                  tryParseEditorJson(form.watch("content") || "")
                }
                onChange={(value) => {
                  form.setValue(
                    "content",
                    JSON.stringify(value),
                    {
                      shouldDirty: true,
                      shouldValidate: false,
                    }
                  );
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