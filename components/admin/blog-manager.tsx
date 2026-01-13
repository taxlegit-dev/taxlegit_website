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
import { SEOMetaEditor } from "@/components/admin/seo-meta-editor";
import { useAdminSearch } from "@/components/admin/admin-search-context";
import toast from "react-hot-toast";
import { ContentStatus } from "@prisma/client";

type BlogWithGroup = BlogFull & {
  blogGroup: BlogGroupLite;
};

export type BlogFull = {
  id: string;
  slug?: string | null;
  title: string;
  image: string | null;
  content: string;
  blogGroupId: string;
  authorId: string | null;
  readTime: string | null;
  viewCount: number;
  region: "INDIA" | "US";
  status: ContentStatus;
  createdAt: Date;
  updatedAt: Date;
};

type BlogGroupLite = {
  id: string;
  name: string;
  region: "INDIA" | "US";
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

type BlogAuthor = {
  id: string;
  name: string;
  image: string | null;
  description: string | null;
  region: "INDIA" | "US";
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

function isSafeImageSrc(src?: string | null): src is string {
  if (!src) return false;
  const trimmed = src.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith("/") || trimmed.startsWith("data:")) return true;
  if (trimmed.startsWith("blob:")) return true;
  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export type BlogListItem = {
  id: string;
  title: string;
  image?: string | null;
  status: ContentStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type BlogGroupWithBlogs = BlogGroupLite & {
  blogs: BlogListItem[];
};

type BlogManagerProps = {
  region: "INDIA" | "US";
  blogGroups: BlogGroupWithBlogs[];
};

const blogGroupSchema = z.object({
  name: z.string().min(1, "Group name is required"),
});

const blogAuthorSchema = z.object({
  name: z.string().min(1, "Author name is required"),
  image: z.string().optional(),
  description: z.string().optional(),
});

const blogSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  title: z.string().min(1, "Title is required"),
  image: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  blogGroupId: z.string().min(1, "Blog group is required"),
  authorId: z.string().optional(),
  readTime: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});

type BlogGroupForm = z.infer<typeof blogGroupSchema>;
type BlogAuthorForm = z.infer<typeof blogAuthorSchema>;
type BlogForm = z.infer<typeof blogSchema>;

export function BlogManager({
  region,
  blogGroups: initialBlogGroups,
}: BlogManagerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [blogGroups, setBlogGroups] =
    useState<BlogGroupWithBlogs[]>(initialBlogGroups);
  const [selectedBlogGroupId] = useState<string | null>(
    searchParams?.get("blogGroupId") || null
  );
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(
    searchParams?.get("blogId") || null
  );
  const [selectedBlog, setSelectedBlog] = useState<BlogWithGroup | null>(null);
  const [isSelectedBlogLoading, setIsSelectedBlogLoading] = useState(false);
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [showAuthorForm, setShowAuthorForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState<BlogGroupLite | null>(null);
  const [editingBlog, setEditingBlog] = useState<BlogWithGroup | null>(null);
  const [editingAuthor, setEditingAuthor] = useState<BlogAuthor | null>(null);
  const [blogAuthors, setBlogAuthors] = useState<BlogAuthor[]>([]);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [authorImageFile, setAuthorImageFile] = useState<File | null>(null);
  const [authorImagePreview, setAuthorImagePreview] = useState<string | null>(
    null
  );
  const [blogImageFile, setBlogImageFile] = useState<File | null>(null);
  const [blogImagePreview, setBlogImagePreview] = useState<string | null>(null);
  const { query } = useAdminSearch();
  const normalizedQuery = query.trim().toLowerCase();
  const filteredBlogAuthors = useMemo(() => {
    if (!normalizedQuery) {
      return blogAuthors;
    }
    return blogAuthors.filter((author) => {
      const target = `${author.name ?? ""} ${
        author.description ?? ""
      }`.toLowerCase();
      return target.includes(normalizedQuery);
    });
  }, [blogAuthors, normalizedQuery]);
  const filteredBlogGroups = useMemo(() => {
    if (!normalizedQuery) {
      return blogGroups;
    }
    return blogGroups.reduce<BlogGroupWithBlogs[]>((acc, group) => {
      const groupTarget = `${group.name ?? ""}`.toLowerCase();
      const groupMatches = groupTarget.includes(normalizedQuery);
      if (groupMatches) {
        acc.push(group);
        return acc;
      }
      const matchingBlogs = group.blogs.filter((blog) => {
        const blogTarget = `${blog.title ?? ""} ${
          blog.status ?? ""
        }`.toLowerCase();
        return blogTarget.includes(normalizedQuery);
      });
      if (matchingBlogs.length > 0) {
        acc.push({ ...group, blogs: matchingBlogs });
      }
      return acc;
    }, []);
  }, [blogGroups, normalizedQuery]);
  const [confirmModal, setConfirmModal] = useState<{
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
  } | null>(null);

  const groupForm = useForm<BlogGroupForm>({
    resolver: zodResolver(blogGroupSchema),
    defaultValues: {
      name: "",
    },
  });

  const blogForm = useForm<BlogForm>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      slug: "",
      title: "",
      image: "",
      content: "",
      blogGroupId: selectedBlogGroupId || "",
      authorId: "",
      readTime: "",
      status: "DRAFT",
    },
  });

  const authorForm = useForm<BlogAuthorForm>({
    resolver: zodResolver(blogAuthorSchema),
    defaultValues: {
      name: "",
      image: "",
      description: "",
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

  // Fetch blog authors
  const fetchAuthors = async () => {
    try {
      const response = await fetch(`/api/admin/blog-authors?region=${region}`);
      const result = await response.json();
      if (response.ok) {
        setBlogAuthors(result.blogAuthors || []);
      }
    } catch (error) {
      console.error("Error fetching blog authors:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchAuthors();
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
        slug: editingBlog.slug ?? "",
        title: editingBlog.title,
        image: (editingBlog.image as string | null) || "",
        content: editingBlog.content as string,
        blogGroupId: editingBlog.blogGroupId,
        authorId: editingBlog.authorId ?? "",
        readTime: editingBlog.readTime ?? "",
        status: editingBlog.status,
      });
      setBlogImagePreview(editingBlog.image || null);
      setBlogImageFile(null);

      // Small delay to ensure clean editor mount
      const timer = setTimeout(() => setIsEditorReady(true), 50);
      return () => clearTimeout(timer);
    } else if (!editingBlog && showBlogForm) {
      // Reset editor ready state first
      setIsEditorReady(false);

      // Reset form for new blog
      blogForm.reset({
        slug: "",
        title: "",
        image: "",
        content: "",
        blogGroupId: selectedBlogGroupId || "",
        authorId: "",
        readTime: "",
        status: "DRAFT",
      });
      setBlogImagePreview(null);
      setBlogImageFile(null);

      // Small delay to ensure clean editor mount
      const timer = setTimeout(() => setIsEditorReady(true), 50);
      return () => clearTimeout(timer);
    } else {
      setIsEditorReady(false);
    }
  }, [editingBlog, showBlogForm, blogForm, selectedBlogGroupId]);

  useEffect(() => {
    let isActive = true;
    if (!selectedBlogId) {
      setSelectedBlog(null);
      setIsSelectedBlogLoading(false);
      return;
    }

    setSelectedBlog(null);
    setIsSelectedBlogLoading(true);
    (async () => {
      try {
        const response = await fetch(`/api/admin/blogs?id=${selectedBlogId}`);
        const result = await response.json();
        if (!isActive) return;
        if (response.ok) {
          const blog = result.blogs?.[0] ?? null;
          setSelectedBlog(blog);
        } else {
          setSelectedBlog(null);
        }
      } catch (error) {
        if (!isActive) return;
        console.error("Error fetching blog:", error);
        setSelectedBlog(null);
      } finally {
        if (!isActive) return;
        setIsSelectedBlogLoading(false);
      }
    })();

    return () => {
      isActive = false;
    };
  }, [selectedBlogId]);

  // Update group form when editing
  useEffect(() => {
    if (editingGroup) {
      groupForm.reset({
        name: editingGroup.name,
      });
    }
  }, [editingGroup, groupForm]);

  // Update author form when editing
  useEffect(() => {
    if (editingAuthor) {
      authorForm.reset({
        name: editingAuthor.name,
        image: editingAuthor.image || "",
        description: editingAuthor.description || "",
      });
      setAuthorImagePreview(editingAuthor.image || null);
      setAuthorImageFile(null);
    } else {
      setAuthorImagePreview(null);
      setAuthorImageFile(null);
    }
  }, [editingAuthor, authorForm]);

  const handleCreateGroup = groupForm.handleSubmit((data) => {
    startTransition(async () => {
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
          toast.error(result.error?.message || "Failed to save blog group");
          return;
        }

        toast.success("Blog group saved successfully!");
        setShowGroupForm(false);
        setEditingGroup(null);
        groupForm.reset();
        await fetchData();
      } catch (error) {
        toast.error("Network error. Please try again.");
        console.error("Error saving blog group:", error);
      }
    });
  });

  const handleCreateAuthor = authorForm.handleSubmit(async (data) => {
    startTransition(async () => {
      try {
        let imageUrl = data.image;

        // Upload image if a new file was selected
        if (authorImageFile) {
          try {
            imageUrl = await handleImageUpload(authorImageFile);
          } catch (error) {
            toast.error("Failed to upload image. Please try again.");
            console.error("Error uploading image:", error);
            return;
          }
        }

        const url = editingAuthor
          ? "/api/admin/blog-authors"
          : "/api/admin/blog-authors";
        const method = editingAuthor ? "PUT" : "POST";
        const payload = editingAuthor
          ? { ...data, image: imageUrl, id: editingAuthor.id, region }
          : { ...data, image: imageUrl, region };

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
          toast.error(result.error?.message || "Failed to save blog author");
          return;
        }

        toast.success("Blog author saved successfully!");
        setShowAuthorForm(false);
        setEditingAuthor(null);
        setAuthorImageFile(null);
        setAuthorImagePreview(null);
        authorForm.reset();
        await fetchAuthors();
      } catch (error) {
        toast.error("Network error. Please try again.");
        console.error("Error saving blog author:", error);
      }
    });
  });

  const handleAuthorImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAuthorImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAuthorImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBlogImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBlogImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBlogImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateBlog = blogForm.handleSubmit((data) => {
    startTransition(async () => {
      try {
        let imageUrl = data.image;

        if (blogImageFile) {
          try {
            imageUrl = await handleImageUpload(blogImageFile);
          } catch (error) {
            toast.error("Failed to upload image. Please try again.");
            console.error("Error uploading image:", error);
            return;
          }
        }

        const url = editingBlog ? "/api/admin/blogs" : "/api/admin/blogs";
        const method = editingBlog ? "PUT" : "POST";
        const payload = editingBlog
          ? { ...data, image: imageUrl, id: editingBlog.id, region }
          : { ...data, image: imageUrl, region };

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
          toast.error(result.error?.message || "Failed to save blog");
          return;
        }

        toast.success("Blog saved successfully!");
        setShowBlogForm(false);
        setEditingBlog(null);
        setSelectedBlogId(null);
        setIsEditorReady(false);
        setBlogImageFile(null);
        setBlogImagePreview(null);
        blogForm.reset();
        await fetchData();
      } catch (error) {
        toast.error("Network error. Please try again.");
        console.error("Error saving blog:", error);
      }
    });
  });

  const handleDeleteGroup = async (groupId: string) => {
    setConfirmModal({
      title: "Delete Blog Group",
      message:
        "Are you sure you want to delete this blog group? All blogs in this group will also be deleted.",
      confirmLabel: "Delete Group",
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/admin/blog-groups?id=${groupId}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            toast.error("Failed to delete blog group");
            return;
          }

          toast.success("Blog group deleted successfully!");
          await fetchData();
        } catch (error) {
          toast.error("Network error. Please try again.");
          console.error("Error deleting blog group:", error);
        }
      },
    });
  };

  const handleDeleteBlog = async (blogId: string) => {
    setConfirmModal({
      title: "Delete Blog",
      message: "Are you sure you want to delete this blog?",
      confirmLabel: "Delete Blog",
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/admin/blogs?id=${blogId}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            toast.error("Failed to delete blog");
            return;
          }

          toast.success("Blog deleted successfully!");
          setSelectedBlogId(null);
          await fetchData();
        } catch (error) {
          toast.error("Network error. Please try again.");
          console.error("Error deleting blog:", error);
        }
      },
    });
  };

  const handleDeleteAuthor = async (authorId: string) => {
    setConfirmModal({
      title: "Delete Author",
      message: "Are you sure you want to delete this author?",
      confirmLabel: "Delete Author",
      onConfirm: async () => {
        try {
          const response = await fetch(
            `/api/admin/blog-authors?id=${authorId}`,
            {
              method: "DELETE",
            }
          );

          if (!response.ok) {
            const result = await response.json();
            toast.error(result.error || "Failed to delete author");
            return;
          }

          toast.success("Author deleted successfully!");
          await fetchAuthors();
        } catch (error) {
          toast.error("Network error. Please try again.");
          console.error("Error deleting author:", error);
        }
      },
    });
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

  const renderConfirmModal = () => {
    if (!confirmModal) {
      return null;
    }

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-sm"
        onClick={() => setConfirmModal(null)}
      >
        <div
          className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          onClick={(event) => event.stopPropagation()}
        >
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
                {confirmModal.title}
              </h3>
              <p className="text-sm text-slate-600">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-700 mb-6">{confirmModal.message}</p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setConfirmModal(null)}
              className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              {confirmModal.cancelLabel || "Cancel"}
            </button>
            <button
              type="button"
              onClick={() => {
                const action = confirmModal.onConfirm;
                setConfirmModal(null);
                action();
              }}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
            >
              {confirmModal.confirmLabel || "Confirm"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // If showing blog form, show form first (higher priority)
  if (showBlogForm) {
    // Will return form below
  }
  // If showing blog detail (and not showing form)
  else if (selectedBlogId && selectedBlog) {
    return (
      <div className="space-y-6">
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

          {isSafeImageSrc(selectedBlog.image) && (
            <div className="mb-6">
              <Image
                src={selectedBlog.image}
                alt={selectedBlog.title}
                width={800}
                height={500}
                unoptimized
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

          {/* SEO Meta Tags Section */}
          <div className="border-t border-slate-200 pt-8 mt-8">
            <SEOMetaEditor
              pageType="BLOG"
              pageId={selectedBlog.id}
              pageName={selectedBlog.title}
            />
          </div>
        </div>
        {renderConfirmModal()}
      </div>
    );
  }

  if (selectedBlogId && !selectedBlog && isSelectedBlogLoading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-center">
        <p className="text-slate-600">Loading blog...</p>
      </div>
    );
  }

  if (selectedBlogId && !selectedBlog && !isSelectedBlogLoading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-center">
        <p className="text-slate-600">Blog not found.</p>
        <button
          onClick={() => {
            setSelectedBlogId(null);
            const next = new URLSearchParams(searchParams?.toString() ?? "");
            next.delete("blogId");
            router.replace(`/admin/blog?${next.toString()}`, { scroll: false });
          }}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
        >
          Back to Blogs
        </button>
      </div>
    );
  }

  // If showing blog form
  if (showBlogForm) {
    return (
      <div className="space-y-6">
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
                Author
              </label>
              <select
                {...blogForm.register("authorId")}
                className="w-full rounded-lg border border-slate-200 px-4 py-2"
              >
                <option value="">Select an author (optional)</option>
                {blogAuthors.map((author) => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
              </select>
              {blogForm.formState.errors.authorId && (
                <p className="text-xs text-red-600 mt-1">
                  {blogForm.formState.errors.authorId.message}
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
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                {...blogForm.register("slug")}
                className="w-full rounded-lg border border-slate-200 px-4 py-2"
                placeholder="e.g., why-company-registration-matters"
              />
              {blogForm.formState.errors.slug && (
                <p className="text-xs text-red-600 mt-1">
                  {blogForm.formState.errors.slug.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Blog Image
              </label>
              <input type="hidden" {...blogForm.register("image")} />
              <input
                type="file"
                accept="image/*"
                onChange={handleBlogImageChange}
                className="w-full rounded-lg border border-slate-200 px-4 py-2"
              />
              {isSafeImageSrc(blogImagePreview) && (
                <div className="mt-3">
                  <Image
                    src={blogImagePreview}
                    alt="Preview"
                    width={200}
                    height={120}
                    className="rounded-lg object-cover"
                    unoptimized
                  />
                </div>
              )}
              {isSafeImageSrc(editingBlog?.image) && !blogImagePreview && (
                <div className="mt-3">
                  <p className="text-xs text-slate-500 mb-2">Current image:</p>
                  <Image
                    src={editingBlog.image}
                    alt="Current"
                    width={200}
                    height={120}
                    className="rounded-lg object-cover"
                    unoptimized
                  />
                </div>
              )}
              {blogForm.formState.errors.image && (
                <p className="text-xs text-red-600 mt-1">
                  {blogForm.formState.errors.image.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Read Time
              </label>
              <input
                {...blogForm.register("readTime")}
                className="w-full rounded-lg border border-slate-200 px-4 py-2"
                placeholder="e.g., 3 min"
              />
              {blogForm.formState.errors.readTime && (
                <p className="text-xs text-red-600 mt-1">
                  {blogForm.formState.errors.readTime.message}
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

          {/* SEO Meta Tags Section - Only show when editing existing blog */}
          {editingBlog?.id && (
            <div className="border-t border-slate-200 pt-8 mt-8">
              <SEOMetaEditor
                pageType="BLOG"
                pageId={editingBlog.id}
                pageName={editingBlog.title}
              />
            </div>
          )}
        </div>
        {renderConfirmModal()}
      </div>
    );
  }

  // Main view - Blog groups and cards
  return (
    <div className="space-y-6">
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
          <button
            onClick={() => {
              setShowAuthorForm(true);
              setEditingAuthor(null);
              authorForm.reset();
            }}
            className="px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
          >
            + Add Author
          </button>
        </div>
      </div>

      {showAuthorForm && (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            {editingAuthor ? "Edit Blog Author" : "Create Blog Author"}
          </h3>
          <form onSubmit={handleCreateAuthor} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Author Name <span className="text-red-500">*</span>
              </label>
              <input
                {...authorForm.register("name")}
                className="w-full rounded-lg border border-slate-200 px-4 py-2"
                placeholder="e.g., John Doe"
              />
              {authorForm.formState.errors.name && (
                <p className="text-xs text-red-600 mt-1">
                  {authorForm.formState.errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Author Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAuthorImageChange}
                className="w-full rounded-lg border border-slate-200 px-4 py-2"
              />
              {isSafeImageSrc(authorImagePreview) && (
                <div className="mt-3">
                  <Image
                    src={authorImagePreview}
                    alt="Preview"
                    width={100}
                    height={100}
                    className="rounded-lg object-cover"
                    unoptimized
                  />
                </div>
              )}
              {isSafeImageSrc(editingAuthor?.image) && !authorImagePreview && (
                <div className="mt-3">
                  <p className="text-xs text-slate-500 mb-2">Current image:</p>
                  <Image
                    src={editingAuthor.image}
                    alt="Current"
                    width={100}
                    height={100}
                    className="rounded-lg object-cover"
                    unoptimized
                  />
                </div>
              )}
              {authorForm.formState.errors.image && (
                <p className="text-xs text-red-600 mt-1">
                  {authorForm.formState.errors.image.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Description
              </label>
              <textarea
                {...authorForm.register("description")}
                className="w-full rounded-lg border border-slate-200 px-4 py-2"
                placeholder="Author bio/description"
                rows={4}
              />
              {authorForm.formState.errors.description && (
                <p className="text-xs text-red-600 mt-1">
                  {authorForm.formState.errors.description.message}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isPending}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {isPending ? "Saving..." : editingAuthor ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAuthorForm(false);
                  setEditingAuthor(null);
                  setAuthorImageFile(null);
                  setAuthorImagePreview(null);
                  authorForm.reset();
                }}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showGroupForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-sm"
          onClick={() => {
            setShowGroupForm(false);
            setEditingGroup(null);
            groupForm.reset();
          }}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            onClick={(event) => event.stopPropagation()}
          >
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
        </div>
      )}

      {/* Authors List Section */}
      {filteredBlogAuthors.length > 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            Blog Authors
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBlogAuthors.map((author) => (
              <div
                key={author.id}
                className="rounded-lg border border-slate-200 p-4"
              >
                {isSafeImageSrc(author.image) && (
                  <div className="w-full h-32 overflow-hidden mb-3 rounded-lg">
                    <Image
                      src={author.image}
                      alt={author.name}
                      width={200}
                      height={200}
                      unoptimized
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <h4 className="font-semibold text-slate-900 mb-2">
                  {author.name}
                </h4>
                {author.description && (
                  <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                    {author.description}
                  </p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingAuthor(author);
                      setShowAuthorForm(true);
                    }}
                    className="px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAuthor(author.id)}
                    className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-8">
        {blogGroups.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-center">
            <p className="text-slate-600">
              No blog groups found. Create one to get started.
            </p>
          </div>
        ) : filteredBlogGroups.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-center">
            <p className="text-slate-600">No matches found.</p>
          </div>
        ) : (
          filteredBlogGroups.map((group) => (
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
                    Edit Group
                  </button>
                  <button
                    onClick={() => handleDeleteGroup(group.id)}
                    className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Delete Group
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
                      {isSafeImageSrc(blog.image) && (
                        <div className="w-full h-48 overflow-hidden">
                          <Image
                            src={blog.image}
                            alt={blog.title}
                            width={800}
                            height={500}
                            unoptimized
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
      {renderConfirmModal()}
    </div>
  );
}
