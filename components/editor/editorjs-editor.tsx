"use client";

import { useCallback, useRef, useEffect, useState } from "react";
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

// Custom inline tools
import FontSizeInlineTool from "./editorjs-blocks/font-size-inline-tool";
import TextColorInlineTool from "./editorjs-blocks/text-color-inline-tool";
import CTAButtonBlock from "./editorjs-blocks/cta-button-block";

type EditorJsEditorProps = {
  value?: OutputData | null;
  onChange: (value: OutputData) => void;
  placeholder?: string;
  /**
   * Optional image upload handler.
   * Should return a URL that will be saved in the Image block.
   */
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

  // Store initial value in a ref to avoid re-initialization
  // Only set once on first mount, ignore subsequent value changes
  const initialValueRef = useRef<OutputData | null | undefined>(value);
  const hasInitializedRef = useRef(false);

  // Update initial value only before first initialization (in useEffect, not during render)
  useEffect(() => {
    if (!hasInitializedRef.current && value !== undefined) {
      initialValueRef.current = value;
    }
  }, [value]);

  // Store callbacks in refs to prevent re-initialization
  const onChangeRef = useRef(onChange);
  const onImageUploadRef = useRef(onImageUpload);

  // Update refs when props change
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onImageUploadRef.current = onImageUpload;
  }, [onImageUpload]);

  const handleImageUpload = useCallback(async (file: File): Promise<string> => {
    if (!onImageUploadRef.current) {
      throw new Error("Image upload handler not provided");
    }
    return onImageUploadRef.current(file);
  }, []);

  // Track if we're initializing to prevent double initialization
  const isInitializingRef = useRef(false);

  // Initialize editor only once
  useEffect(() => {
    console.log("🔵 Editor useEffect triggered", {
      isMounted,
      hasHolder: !!holderRef.current,
      hasEditor: !!editorRef.current,
      isInitializing: isInitializingRef.current,
    });

    if (
      !isMounted ||
      !holderRef.current ||
      editorRef.current ||
      isInitializingRef.current ||
      hasInitializedRef.current
    ) {
      console.log("🔴 Skipping editor initialization", {
        isMounted,
        hasHolder: !!holderRef.current,
        hasEditor: !!editorRef.current,
        isInitializing: isInitializingRef.current,
        hasInitialized: hasInitializedRef.current,
      });
      return;
    }

    isInitializingRef.current = true;
    hasInitializedRef.current = true;
    console.log("🟢 Initializing editor with value:", initialValueRef.current);

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
          inlineToolbar: ["bold", "italic", "link", "fontSize", "textColor"],
        },

        header: {
          class: Header as unknown as never,
          inlineToolbar: ["bold", "italic", "link", "fontSize", "textColor"],
          config: {
            placeholder: "Section title",
            levels: [2, 3, 4],
            defaultLevel: 2,
          },
        },
        list: {
          class: List as unknown as never,
          inlineToolbar: ["bold", "italic", "link", "fontSize", "textColor"],
        },
        table: {
          class: Table as unknown as never,
          inlineToolbar: ["bold", "italic", "link", "fontSize", "textColor"],
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
        image: {
          class: ImageTool as unknown as never,
          tunes: ["imageLink"],
          config: onImageUploadRef.current
            ? {
                uploader: {
                  async uploadByFile(file: File) {
                    const url = await handleImageUpload(file);
                    return {
                      success: 1,
                      file: {
                        url,
                      },
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
                imageUploadHandler: handleImageUpload,
              }
            : undefined,
        },
        cta: {
          class: CTAButtonBlock as unknown as never,
        },
      },

      onChange: async () => {
        if (editor) {
          try {
            // Wait for editor to be ready
            await editor.isReady;
            const outputData = await editor.save();
            onChangeRef.current(outputData);
          } catch (error) {
            console.error("Error saving editor data:", error);
          }
        }
      },
    });

    // Wait for editor to be ready
    editor.isReady
      .then(() => {
        console.log("✅ Editor ready!");
        editorRef.current = editor;
        isInitializingRef.current = false;
      })
      .catch((error) => {
        console.error("❌ Editor initialization error:", error);
        isInitializingRef.current = false;
      });

    return () => {
      console.log("🧹 Cleaning up editor");
      isInitializingRef.current = false;
      hasInitializedRef.current = false;
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
    // FIXED: Only depend on stable values - callbacks stored in refs
  }, [isMounted, placeholder, handleImageUpload]);

  // Update editor content when value changes externally
  useEffect(() => {
    if (
      !editorRef.current ||
      !value ||
      typeof value !== "object" ||
      !("blocks" in value)
    ) {
      return;
    }

    // Wait for editor to be ready before trying to update
    const updateContent = async () => {
      const editor = editorRef.current;
      if (!editor) return;

      try {
        // Wait for editor to be ready
        await editor.isReady;

        // Check if save method exists
        if (typeof editor.save !== "function") {
          console.warn("Editor save method not available yet");
          return;
        }

        const currentData = await editor.save();
        const currentJson = JSON.stringify(currentData);
        const newJson = JSON.stringify(value);

        // Only update if content is different
        if (currentJson !== newJson) {
          editor.render(value);
        }
      } catch {
        // If save fails, try to render the new value directly
        try {
          if (
            editorRef.current &&
            typeof editorRef.current.render === "function"
          ) {
            editorRef.current.render(value);
          }
        } catch (renderError) {
          console.error("Error rendering editor content:", renderError);
        }
      }
    };

    // Use a small delay to ensure editor is initialized
    const timeoutId = setTimeout(updateContent, 200);
    return () => clearTimeout(timeoutId);
  }, [value]);

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
        /* Editor.js base styles */
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

        /* FIXED: Remove fixed font-size, only set line-height and color */
        .ce-paragraph {
          line-height: 1.6;
          color: #374151;
          /* font-size removed - now respects inline styles */
        }

        /* Ensure inline font-size styles have priority */
        .ce-paragraph span[style*="font-size"] {
          line-height: 1.4 !important; /* Adjust line-height proportionally */
        }

        .ce-paragraph[data-placeholder]:empty::before {
          content: attr(data-placeholder);
          color: #9ca3af;
          font-style: italic;
        }
        .image-controls {
          margin-top: 10px;
        }
        /* Image resize and alignment styles */
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
        /* Table styles */
        .tc-table {
          border-collapse: collapse;
          width: 100%;
        }
        .tc-table td {
          border: 1px solid #e5e7eb;
          padding: 8px;
          min-width: 100px;
        }
        /* Column block styles */
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
