"use client";

import { useState, useEffect } from "react";
import { useTransition } from "react";

type MetaPageType = "SERVICE" | "BLOG" | "GENERIC";

type SEOMetaEditorProps = {
  pageType: MetaPageType;
  pageId: string;
  pageName?: string;
};

export function SEOMetaEditor({
  pageType,
  pageId,
  pageName,
}: SEOMetaEditorProps) {
  const [metaBlock, setMetaBlock] = useState("");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch existing meta data on mount
  useEffect(() => {
    const fetchMetaData = async () => {
      try {
        const response = await fetch(
          `/api/admin/meta-data?pageType=${pageType}&pageId=${pageId}`
        );
        const result = await response.json();

        if (response.ok && result.metaData) {
          setMetaBlock(result.metaData.metaBlock || "");
        } else {
          setMetaBlock("");
        }
      } catch (error) {
        console.error("Error fetching meta data:", error);
        setMetaBlock("");
      } finally {
        setIsLoading(false);
      }
    };

    if (pageId) {
      fetchMetaData();
    }
  }, [pageType, pageId]);

  const handleSave = () => {
    if (!pageId) {
      setMessage("Page ID is required");
      return;
    }

    startTransition(async () => {
      setMessage(null);

      try {
        const response = await fetch("/api/admin/meta-data", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pageType,
            pageId,
            metaBlock: metaBlock.trim(),
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          const errorMsg =
            result.error?.message ||
            (typeof result.error === "string"
              ? result.error
              : JSON.stringify(result.error)) ||
            "Failed to save meta tags";
          setMessage(errorMsg);
          return;
        }

        setMessage("Meta tags saved successfully!");
        setTimeout(() => setMessage(null), 3000);
      } catch (error) {
        setMessage("Network error. Please try again.");
        console.error("Error saving meta data:", error);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="text-sm text-slate-500">Loading SEO editor...</div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-1">
          SEO / Meta Tags
        </h3>
        {pageName && (
          <p className="text-sm text-slate-600">
            Edit SEO meta tags for: <strong>{pageName}</strong>
          </p>
        )}
        <p className="text-xs text-slate-500 mt-2">
          Paste all meta tags, Open Graph tags, Twitter cards, and JSON-LD
          schema in the box below. This will be inserted directly into the page{" "}
          <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">
            &lt;head&gt;
          </code>{" "}
          section.
        </p>
      </div>

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

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">
          Meta Tags & JSON-LD Block
        </label>
        <textarea
          value={metaBlock}
          onChange={(e) => setMetaBlock(e.target.value)}
          placeholder={`<!-- Example: -->
<title>Page Title | Taxlegit</title>
<meta name="description" content="Page description here" />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="https://taxlegit.com/page-url" />
`}
          rows={20}
          className="w-full rounded-lg border border-slate-200 px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <p className="text-xs text-slate-500 mt-2">
          Enter all HTML meta tags and JSON-LD schema. The content will be
          inserted exactly as entered into the page head section.
        </p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isPending ? "Saving..." : "Save Meta Tags"}
        </button>
      </div>
    </div>
  );
}
