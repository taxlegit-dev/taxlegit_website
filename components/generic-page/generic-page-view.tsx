"use client";

import type { GenericPage } from "@prisma/client";
import { EditorJsRenderer } from "@/components/rich-text/editorjs-renderer";
import type { OutputData } from "@editorjs/editorjs";

type GenericPageViewProps = {
  genericPage: Pick<GenericPage, "title" | "content">;
};

export function GenericPageView({ genericPage }: GenericPageViewProps) {
  // Try to parse as Editor.js JSON, fallback to HTML
  let editorData: OutputData | null = null;
  try {
    const parsed = JSON.parse(genericPage.content as string);
    if (
      parsed &&
      typeof parsed === "object" &&
      "blocks" in parsed
    ) {
      editorData = parsed as OutputData;
    }
  } catch {
    // Not JSON, treat as HTML
  }

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-12">
      <div className="rounded-3xl border border-zinc-100 bg-gradient-to-br from-indigo-50 via-white to-slate-50 p-10 shadow-sm">
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-indigo-600">
            Generic Page
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-zinc-900">
            {genericPage.title}
          </h1>
          <div className="max-w-none">
            {editorData ? (
              <EditorJsRenderer data={editorData} theme="light" />
            ) : (
              <div
                className="prose prose-lg max-w-none prose-slate prose-headings:text-slate-900 prose-p:text-slate-700"
                dangerouslySetInnerHTML={{ __html: genericPage.content as string }}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
