"use client";

import React, { useState, useTransition, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import dynamic from "next/dynamic";
import type { OutputData } from "@editorjs/editorjs";
import { EditorJsRenderer } from "@/components/rich-text/editorjs-renderer";
import Image from "next/image";

// Types
type Blog = {
  id: string;
  title: string;
  image: string | null;
  content: string;
  blogGroupId: string;
  region: "INDIA" | "US";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  createdAt: Date;
  updatedAt: Date;
};

type BlogGroup = {
  id: string;
  name: string;
  region: "INDIA" | "US";
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

// Dynamically import EditorJsEditor to avoid SSR issues
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

// Helper function to parse Editor.js JSON from string
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

type BlogWithGroup = Blog & {
  blogGroup: BlogGroup;
};

type BlogGroupWithBlogs = BlogGroup & {
  blogs: Blog[];
};

type BlogManagerProps = {
  region: "INDIA" | "US";
  blogGroups: BlogGroupWithBlogs[];
};

const blogGroupSchema = z.object({
  name: z.string().min(1, "Group name is required"),
});

const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  image: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  blogGroupId: z.string().min(1, "Blog group is required"),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});

type BlogGroupForm = z.infer<typeof blogGroupSchema>;
type BlogForm = z.infer<typeof blogSchema>;

export function BlogManager({
  region,
  blogGroups: initialBlogGroups,
}: BlogManagerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [blogGroups, setBlogGroups] =
    useState<BlogGroupWithBlogs[]>(initialBlogGroups);
  const [selectedBlogGroupId] = useState<string | null>(
    searchParams?.get("blogGroupId") || null
  );
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(
    searchParams?.get("blogId") || null
  );
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState<BlogGroup | null>(null);
  const [editingBlog, setEditingBlog] = useState<BlogWithGroup | null>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);

  const groupForm = useForm<BlogGroupForm>({
    resolver: zodResolver(blogGroupSchema),
    defaultValues: {
      name: "",
    },
  });

  const blogForm = useForm<BlogForm>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      image: "",
      content: "",
      blogGroupId: selectedBlogGroupId || "",
      status: "DRAFT",
    },
  });

  // Fetch blog groups and blogs
  const fetchData = async () => {
    try {
      const response = await fetch(`/api/admin/blog-groups?region=${region}`);
      const result = await response.json();
      if (response.ok) {
        setBlogGroups(result.blogGroups || []);
      }
    } catch (error) {
      console.error("Error fetching blog groups:", error);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region]);

  // Memoize editor value - must be at top level (not conditional)
  const editorValue = useMemo(() => {
    if (!isEditorReady || !showBlogForm) return undefined;
    const content = blogForm.getValues("content");
    if (!content) return undefined;
    const parsed = tryParseEditorJson(content);
    return parsed || undefined;
  }, [isEditorReady, showBlogForm, blogForm]);

  // Update blog form when editing - WITH PROPER EDITOR INITIALIZATION
  useEffect(() => {
    if (editingBlog && showBlogForm) {
      // Reset editor ready state first
      setIsEditorReady(false);

      // Reset form with editing blog data
      blogForm.reset({
        title: editingBlog.title,
        image: (editingBlog.image as string | null) || "",
        content: editingBlog.content as string,
        blogGroupId: editingBlog.blogGroupId,
        status: editingBlog.status,
      });

      // Small delay to ensure clean editor mount
      const timer = setTimeout(() => setIsEditorReady(true), 50);
      return () => clearTimeout(timer);
    } else if (!editingBlog && showBlogForm) {
      // Reset editor ready state first
      setIsEditorReady(false);

      // Reset form for new blog
      blogForm.reset({
        title: "",
        image: "",
        content: "",
        blogGroupId: selectedBlogGroupId || "",
        status: "DRAFT",
      });

      // Small delay to ensure clean editor mount
      const timer = setTimeout(() => setIsEditorReady(true), 50);
      return () => clearTimeout(timer);
    } else {
      setIsEditorReady(false);
    }
  }, [editingBlog, showBlogForm, blogForm, selectedBlogGroupId]);

  // Update group form when editing
  useEffect(() => {
    if (editingGroup) {
      groupForm.reset({
        name: editingGroup.name,
      });
    }
  }, [editingGroup, groupForm]);

  const handleCreateGroup = groupForm.handleSubmit((data) => {
    startTransition(async () => {
      setMessage(null);
      try {
        const url = editingGroup
          ? "/api/admin/blog-groups"
          : "/api/admin/blog-groups";
        const method = editingGroup ? "PUT" : "POST";
        const payload = editingGroup
          ? { ...data, id: editingGroup.id, region }
          : { ...data, region };

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
          setMessage(result.error?.message || "Failed to save blog group");
          return;
        }

        setMessage("Blog group saved successfully!");
        setShowGroupForm(false);
        setEditingGroup(null);
        groupForm.reset();
        await fetchData();
      } catch (error) {
        setMessage("Network error. Please try again.");
        console.error("Error saving blog group:", error);
      }
    });
  });

  const handleCreateBlog = blogForm.handleSubmit((data) => {
    startTransition(async () => {
      setMessage(null);
      try {
        const url = editingBlog ? "/api/admin/blogs" : "/api/admin/blogs";
        const method = editingBlog ? "PUT" : "POST";
        const payload = editingBlog
          ? { ...data, id: editingBlog.id, region }
          : { ...data, region };

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
          setMessage(result.error?.message || "Failed to save blog");
          return;
        }

        setMessage("Blog saved successfully!");
        setShowBlogForm(false);
        setEditingBlog(null);
        setSelectedBlogId(null);
        setIsEditorReady(false);
        blogForm.reset();
        await fetchData();
      } catch (error) {
        setMessage("Network error. Please try again.");
        console.error("Error saving blog:", error);
      }
    });
  });

  const handleDeleteGroup = async (groupId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this blog group? All blogs in this group will also be deleted."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/blog-groups?id=${groupId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        setMessage("Failed to delete blog group");
        return;
      }

      setMessage("Blog group deleted successfully!");
      await fetchData();
    } catch (error) {
      setMessage("Network error. Please try again.");
      console.error("Error deleting blog group:", error);
    }
  };

  const handleDeleteBlog = async (blogId: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/blogs?id=${blogId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        setMessage("Failed to delete blog");
        return;
      }

      setMessage("Blog deleted successfully!");
      setSelectedBlogId(null);
      await fetchData();
    } catch (error) {
      setMessage("Network error. Please try again.");
      console.error("Error deleting blog:", error);
    }
  };

  const handleImageUpload = async (file: File): Promise<string> => {
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
  };

  // Find selected blog with its group
  let selectedBlog: (Blog & { blogGroup: BlogGroup }) | undefined;
  if (selectedBlogId) {
    for (const group of blogGroups) {
      const blog = group.blogs.find((b) => b.id === selectedBlogId);
      if (blog) {
        selectedBlog = { ...blog, blogGroup: group };
        break;
      }
    }
  }

  // If showing blog form, show form first (higher priority)
  if (showBlogForm) {
    // Will return form below
  }
  // If showing blog detail (and not showing form)
  else if (selectedBlogId && selectedBlog) {
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
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
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
            <button
              onClick={() => {
                setSelectedBlogId(null);
                const next = new URLSearchParams(
                  searchParams?.toString() ?? ""
                );
                next.delete("blogId");
                router.replace(`/admin/blog?${next.toString()}`, {
                  scroll: false,
                });
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition mb-4"
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
              Back to Blogs
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {selectedBlog.title}
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Group: {selectedBlog.blogGroup.name} |{" "}
                  {new Date(selectedBlog.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingBlog(selectedBlog);
                    setShowBlogForm(true);
                    // Clear selected blog ID so detail view doesn't show
                    setSelectedBlogId(null);
                    const next = new URLSearchParams(
                      searchParams?.toString() ?? ""
                    );
                    next.delete("blogId");
                    router.replace(`/admin/blog?${next.toString()}`, {
                      scroll: false,
                    });
                  }}
                  className="px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteBlog(selectedBlog.id)}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          {selectedBlog.image && (
            <div className="mb-6">
              <Image
                src={selectedBlog.image}
                alt={selectedBlog.title}
                width={800}
                height={500}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}

          <div className="prose max-w-none prose-slate prose-headings:text-slate-900 prose-p:text-slate-700">
            {(() => {
              const editorData = tryParseEditorJson(selectedBlog.content);
              if (editorData) {
                return <EditorJsRenderer data={editorData} theme="light" />;
              } else {
                return (
                  <div
                    className="text-slate-700"
                    dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
                  />
                );
              }
            })()}
          </div>
        </div>
      </div>
    );
  }

  // If showing blog form
  if (showBlogForm) {
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
              <span className="font-medium">{message}</span>
            </div>
          </div>
        )}

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6">
            <button
              onClick={() => {
                setShowBlogForm(false);
                setEditingBlog(null);
                setIsEditorReady(false);
                blogForm.reset();
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition mb-4"
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
              Back to Blogs
            </button>
            <h2 className="text-xl font-semibold text-slate-900">
              {editingBlog ? "Edit Blog" : "Create Blog"}
            </h2>
          </div>

          <form onSubmit={handleCreateBlog} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Blog Group <span className="text-red-500">*</span>
              </label>
              <select
                {...blogForm.register("blogGroupId")}
                className="w-full rounded-lg border border-slate-200 px-4 py-2"
              >
                <option value="">Select a group</option>
                {blogGroups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
              {blogForm.formState.errors.blogGroupId && (
                <p className="text-xs text-red-600 mt-1">
                  {blogForm.formState.errors.blogGroupId.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                {...blogForm.register("title")}
                className="w-full rounded-lg border border-slate-200 px-4 py-2"
                placeholder="Blog title"
              />
              {blogForm.formState.errors.title && (
                <p className="text-xs text-red-600 mt-1">
                  {blogForm.formState.errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Image URL
              </label>
              <input
                {...blogForm.register("image")}
                className="w-full rounded-lg border border-slate-200 px-4 py-2"
                placeholder="https://example.com/image.jpg"
              />
              {blogForm.formState.errors.image && (
                <p className="text-xs text-red-600 mt-1">
                  {blogForm.formState.errors.image.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Status
              </label>
              <select
                {...blogForm.register("status")}
                className="w-full rounded-lg border border-slate-200 px-4 py-2"
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
              {isEditorReady ? (
                <EditorJsEditor
                  key={editingBlog ? `blog-edit-${editingBlog.id}` : `blog-new`}
                  value={editorValue}
                  onChange={(value) => {
                    blogForm.setValue("content", JSON.stringify(value), {
                      shouldDirty: true,
                      shouldValidate: false,
                    });
                  }}
                  placeholder=""
                  onImageUpload={handleImageUpload}
                  region={region}
                />
              ) : (
                <div className="rounded-xl border border-slate-200 bg-white p-8 min-h-[300px] flex items-center justify-center text-slate-400">
                  Preparing editor...
                </div>
              )}
              {blogForm.formState.errors.content && (
                <p className="text-xs text-red-600 mt-1">
                  {blogForm.formState.errors.content.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending
                ? "Saving..."
                : editingBlog
                ? "Update Blog"
                : "Create Blog"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Main view - Blog groups and cards
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
            <span className="font-medium">{message}</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-900">
          Blog Management
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setShowGroupForm(true);
              setEditingGroup(null);
              groupForm.reset();
            }}
            className="px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
          >
            + Create Group
          </button>
          <button
            onClick={() => {
              setShowBlogForm(true);
              setEditingBlog(null);
              blogForm.reset({ blogGroupId: selectedBlogGroupId || "" });
            }}
            className="px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
          >
            + Create Blog
          </button>
        </div>
      </div>

      {showGroupForm && (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            {editingGroup ? "Edit Blog Group" : "Create Blog Group"}
          </h3>
          <form onSubmit={handleCreateGroup} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Group Name <span className="text-red-500">*</span>
              </label>
              <input
                {...groupForm.register("name")}
                className="w-full rounded-lg border border-slate-200 px-4 py-2"
                placeholder="e.g., Company Registration"
              />
              {groupForm.formState.errors.name && (
                <p className="text-xs text-red-600 mt-1">
                  {groupForm.formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isPending}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {isPending ? "Saving..." : editingGroup ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowGroupForm(false);
                  setEditingGroup(null);
                  groupForm.reset();
                }}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-8">
        {blogGroups.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-center">
            <p className="text-slate-600">
              No blog groups found. Create one to get started.
            </p>
          </div>
        ) : (
          blogGroups.map((group) => (
            <div
              key={group.id}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-slate-900">
                  {group.name}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingGroup(group);
                      setShowGroupForm(true);
                    }}
                    className="px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteGroup(group.id)}
                    className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {group.blogs.length === 0 ? (
                <p className="text-slate-500 text-sm">
                  No blogs in this group yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.blogs.map((blog) => (
                    <div
                      key={blog.id}
                      onClick={() => {
                        setSelectedBlogId(blog.id);
                        const next = new URLSearchParams(
                          searchParams?.toString() ?? ""
                        );
                        next.set("blogId", blog.id);
                        router.replace(`/admin/blog?${next.toString()}`, {
                          scroll: false,
                        });
                      }}
                      className="rounded-lg border border-slate-200 p-4 hover:shadow-md transition cursor-pointer"
                    >
                      {blog.image && (
                        <div className="w-full h-48 overflow-hidden">
                          <Image
                            src={blog.image}
                            alt={blog.title}
                            width={800}
                            height={500}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}

                      <h4 className="font-semibold text-slate-900 mb-2">
                        {blog.title}
                      </h4>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </span>
                        <span className="px-2 py-1 rounded-full bg-slate-100">
                          {blog.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-2">
                        {group.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
