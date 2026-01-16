"use client";

import { useRef, useEffect, useState } from "react";
import type { OutputData } from "@editorjs/editorjs";
import EditorJS from "@editorjs/editorjs";

import Header from "@editorjs/header";
import List from "@editorjs/list";
import Table from "@editorjs/table";
import ImageTool from "@editorjs/image";
import Paragraph from "@editorjs/paragraph";

// Custom blocks
import YouTubeVideoBlock from "./editorjs-blocks/youtube-video-block";
import ColumnBlock from "./editorjs-blocks/column-block";
import ImageLinkTune from "./editorjs-blocks/image-link-tune";
import ContentCardsBlock from "./editorjs-blocks/card-block";

// Custom inline tools
import FontSizeInlineTool from "./editorjs-blocks/font-size-inline-tool";
import TextColorInlineTool from "./editorjs-blocks/text-color-inline-tool";
import TextAlignTune from "./editorjs-blocks/text-align-tune";
import CTAButtonBlock from "./editorjs-blocks/cta-button-block";

import CustomLinkInlineTool from "./editorjs-blocks/custom-link-inline-tool";

const sanitizeHtml = (html: string) => {
  if (!html) {
    return html;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const { body } = doc;

  body.querySelectorAll("*").forEach((element) => {
    if (!(element instanceof HTMLElement)) {
      return;
    }
    if (!element.hasAttribute("style")) {
      return;
    }

    const style = element.style;
    if (style.fontFamily) {
      style.removeProperty("font-family");
    }
    if (style.backgroundColor) {
      style.removeProperty("background-color");
    }
    const fontSize = style.getPropertyValue("font-size");
    if (fontSize && fontSize.toLowerCase().includes("pt")) {
      style.removeProperty("font-size");
    }

    if (style.length === 0) {
      element.removeAttribute("style");
    }
  });

  const mergeConsecutiveSpans = (container: ParentNode) => {
    const signature = (span: HTMLSpanElement) => {
      if (span.attributes.length === 0) {
        return "";
      }
      return Array.from(span.attributes)
        .map((attr) => `${attr.name}=${attr.value}`)
        .sort()
        .join(";");
    };

    const children = Array.from(container.childNodes);
    for (let i = 0; i < children.length - 1; i += 1) {
      const current = children[i];
      const next = children[i + 1];
      if (
        current.nodeType === Node.ELEMENT_NODE &&
        next.nodeType === Node.ELEMENT_NODE &&
        (current as Element).tagName === "SPAN" &&
        (next as Element).tagName === "SPAN"
      ) {
        const currentSpan = current as HTMLSpanElement;
        const nextSpan = next as HTMLSpanElement;
        if (signature(currentSpan) === signature(nextSpan)) {
          while (nextSpan.firstChild) {
            currentSpan.appendChild(nextSpan.firstChild);
          }
          nextSpan.remove();
          children.splice(i + 1, 1);
          i -= 1;
        }
      }
    }
  };

  const unwrapSpan = (span: HTMLSpanElement) => {
    const parent = span.parentNode;
    if (!parent) {
      return;
    }
    while (span.firstChild) {
      parent.insertBefore(span.firstChild, span);
    }
    parent.removeChild(span);
  };

  const normalizeSpans = () => {
    let didWork = false;

    body.querySelectorAll("span").forEach((span) => {
      const hasAttributes = span.attributes.length > 0;
      const isEmpty =
        span.textContent?.trim() === "" && span.children.length === 0;

      if (!hasAttributes && isEmpty) {
        span.remove();
        didWork = true;
        return;
      }

      if (!hasAttributes && span.parentElement?.tagName === "SPAN") {
        unwrapSpan(span);
        didWork = true;
      }
    });

    body.querySelectorAll("*").forEach((element) => {
      mergeConsecutiveSpans(element);
    });

    return didWork;
  };

  while (normalizeSpans()) {
    // Keep normalizing until no changes are required.
  }

  return body.innerHTML;
};

const sanitizeBlockData = (block: OutputData["blocks"][number]) => {
  if (!block?.data) {
    return block;
  }

  if (block.type === "paragraph" || block.type === "header") {
    return {
      ...block,
      data: {
        ...block.data,
        text:
          typeof block.data.text === "string"
            ? sanitizeHtml(block.data.text)
            : block.data.text,
      },
    };
  }

  return block;
};

type EditorJsEditorProps = {
  value?: OutputData | null;
  onChange: (value: OutputData) => void;
  placeholder?: string;
  onImageUpload?: (file: File) => Promise<string>;
  region?: "INDIA" | "US";
};

export function EditorJsEditor({
  value,
  onChange,
  placeholder = "Start writing...",
  onImageUpload,
}: EditorJsEditorProps) {
  const editorRef = useRef<EditorJS | null>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  const [isMounted] = useState(true);
  const [editorId] = useState(
    () => `editorjs-${Math.random().toString(36).substr(2, 9)}`
  );

  // ✅ Store initial value - set once, never update
  const initialValueRef = useRef<OutputData | null | undefined>(value);
  const hasInitializedRef = useRef(false);
  const isInitializingRef = useRef(false);

  // ✅ Store callbacks in refs to prevent re-initialization
  const onChangeRef = useRef(onChange);
  const onImageUploadRef = useRef(onImageUpload);

  // Update callback refs when props change (doesn't cause re-init)
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onImageUploadRef.current = onImageUpload;
  }, [onImageUpload]);

  // ✅ Initialize editor ONCE - empty dependency array
  useEffect(() => {
    // Skip if already initialized or initializing
    if (
      !isMounted ||
      !holderRef.current ||
      editorRef.current ||
      isInitializingRef.current ||
      hasInitializedRef.current
    ) {
      return;
    }

    isInitializingRef.current = true;
    hasInitializedRef.current = true;

    // Initialize Editor.js
    const editor = new EditorJS({
      holder: holderRef.current,
      placeholder: placeholder,
      data:
        initialValueRef.current &&
          typeof initialValueRef.current === "object" &&
          "blocks" in initialValueRef.current
          ? initialValueRef.current
          : undefined,
      tools: {
        paragraph: {
          class: Paragraph as unknown as never,
          inlineToolbar: ["bold", "italic", "customLink", "fontSize", "textColor"],
          tunes: ["textAlignTune"],
        },
        header: {
          class: Header as unknown as never,
          inlineToolbar: ["bold", "italic", "customLink", "fontSize", "textColor"],
          tunes: ["textAlignTune"],
          config: {
            placeholder: "Section title",
            levels: [1, 2, 3, 4, 5, 6],
            defaultLevel: 2,
          },
        },
        list: {
          class: List as unknown as never,
          inlineToolbar: ["bold", "italic", "customLink", "fontSize", "textColor"],
          tunes: ["textAlignTune"],
        },
        table: {
          class: Table as unknown as never,
          inlineToolbar: ["bold", "italic", "customLink", "fontSize", "textColor"],
          tunes: ["textAlignTune"],
          config: {
            rows: 2,
            cols: 3,
          },
        },
        fontSize: {
          class: FontSizeInlineTool as unknown as never,
        },
        textColor: {
          class: TextColorInlineTool as unknown as never,
        },
        textAlignTune: {
          class: TextAlignTune as unknown as never,
        },
        image: {
          class: ImageTool as unknown as never,
          tunes: ["imageLink"],
          config: onImageUploadRef.current
            ? {
              uploader: {
                async uploadByFile(file: File) {
                  // Use ref to get latest upload handler
                  if (!onImageUploadRef.current) {
                    throw new Error("Image upload handler not provided");
                  }
                  const url = await onImageUploadRef.current(file);
                  return {
                    success: 1,
                    file: { url },
                  };
                },
              },
              captionPlaceholder: "Optional caption",
              withBorder: true,
              withBackground: false,
              stretched: false,
            }
            : {
              captionPlaceholder: "Optional caption",
              withBorder: true,
              withBackground: false,
              stretched: false,
            },
        },
        imageLink: {
          class: ImageLinkTune as unknown as never,
        },
        youtube: {
          class: YouTubeVideoBlock as unknown as never,
        },
        column: {
          class: ColumnBlock as unknown as never,
          config: onImageUploadRef.current
            ? {
              imageUploadHandler: async (file: File) => {
                if (!onImageUploadRef.current) {
                  throw new Error("Image upload handler not provided");
                }
                return onImageUploadRef.current(file);
              },
            }
            : undefined,
        },
        contentCards: {
          class: ContentCardsBlock as unknown as never,
          config: onImageUploadRef.current
            ? {
              imageUploadHandler: async (file: File) => {
                if (!onImageUploadRef.current) {
                  throw new Error("Image upload handler not provided");
                }
                return onImageUploadRef.current(file);
              },
            }
            : undefined,
        },
        cta: {
          class: CTAButtonBlock as unknown as never,
        },
        customLink: {
          class: CustomLinkInlineTool as unknown as never,
        },

      },
      onChange: async () => {
        if (editor) {
          try {
            await editor.isReady;
            const outputData = await editor.save();
            // Use ref to call latest onChange
            const sanitizedOutputData = {
              ...outputData,
              blocks: outputData.blocks.map(sanitizeBlockData),
            };
            onChangeRef.current(sanitizedOutputData);
          } catch (error) {
            console.error("Error saving editor data:", error);
          }
        }
      },
    });

    // Wait for editor to be ready
    editor.isReady
      .then(() => {
        editorRef.current = editor;
        isInitializingRef.current = false;
      })
      .catch((error) => {
        console.error("Editor initialization error:", error);
        isInitializingRef.current = false;
      });

    // ✅ Cleanup only on unmount
    return () => {
      isInitializingRef.current = false;
      hasInitializedRef.current = false;
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
    // ✅ CRITICAL: Empty dependency array - initialize ONCE only
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isMounted) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 min-h-[300px] flex items-center justify-center text-slate-400">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="rounded-xl border border-slate-200 bg-white p-3 min-h-[300px]">
        <div ref={holderRef} id={editorId} />
      </div>
      <style jsx global>{`
      .ce-header {
  font-weight: 700;
  color: #111827;
  margin: 12px 0;
}

h1.ce-header { font-size: 32px; }
h2.ce-header { font-size: 26px; }
h3.ce-header { font-size: 22px; }
h4.ce-header { font-size: 18px; }
h5.ce-header { font-size: 16px; }
h6.ce-header { font-size: 14px; }
        .codex-editor {
          min-height: 300px;
        }
        .codex-editor__redactor {
          padding: 20px;
          min-height: 300px;
        }
        .ce-block__content {
          max-width: 100%;
          margin: 0;
        }
        .ce-toolbar__content {
          max-width: 100%;
        }
        .ce-toolbar__plus {
          color: #4a5568;
        }
        .ce-toolbar__settings-btn {
          color: #4a5568;
        }
        .ce-block {
          margin: 10px 0;
        }
        .ce-paragraph {
          line-height: 1.6;
          color: #374151;
        }
        .ce-paragraph span[style*="font-size"] {
          line-height: 1.4 !important;
        }
        .ce-paragraph[data-placeholder]:empty::before {
          content: attr(data-placeholder);
          color: #9ca3af;
          font-style: italic;
        }
        .image-controls {
          margin-top: 10px;
        }
        .cdx-image {
          position: relative;
        }
        .cdx-image__picture img {
          max-width: 100%;
          height: auto;
          cursor: pointer;
        }
        .cdx-image__picture img:hover {
          opacity: 0.9;
        }
        .cdx-image__picture {
          display: inline-block;
          max-width: 100%;
        }
        .tc-table {
          border-collapse: collapse;
          width: 100%;
        }
        .tc-table td {
          border: 1px solid #e5e7eb;
          padding: 8px;
          min-width: 100px;
        }
        .column-block {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 15px;
          margin: 10px 0;
        }
        .column-layout {
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }
        .column-layout .image-column,
        .column-layout .text-column {
          flex: 1;
          min-width: 0;
        }
        @media (max-width: 768px) {
          .column-layout {
            flex-direction: column !important;
          }
        }
      `}</style>
    </div>
  );
}
