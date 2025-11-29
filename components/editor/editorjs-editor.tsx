"use client";

import { useCallback, useRef, useEffect, useState } from "react";
import type { OutputData } from "@editorjs/editorjs";
import EditorJS from "@editorjs/editorjs";

// Core tools
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Table from "@editorjs/table";
import ImageTool from "@editorjs/image";
import Paragraph from "@editorjs/paragraph";

// Custom blocks
// import ColumnsBlock from "./editorjs-blocks/columns-block";
import YouTubeVideoBlock from "./editorjs-blocks/youtube-video-block";
import ColumnBlock from "./editorjs-blocks/column-block";
import ImageLinkTune from "./editorjs-blocks/image-link-tune";

// Custom inline tools
import FontSizeInlineTool from "./editorjs-blocks/font-size-inline-tool";
import TextColorInlineTool from "./editorjs-blocks/text-color-inline-tool";

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
  region = "INDIA",
}: EditorJsEditorProps) {
  const editorRef = useRef<EditorJS | null>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [editorId] = useState(() => `editorjs-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleImageUpload = useCallback(
    async (file: File): Promise<string> => {
      if (!onImageUpload) {
        throw new Error("Image upload handler not provided");
      }
      return onImageUpload(file);
    },
    [onImageUpload]
  );

  useEffect(() => {
    if (!isMounted || !holderRef.current || editorRef.current) {
      return;
    }

    // Initialize Editor.js
    const editor = new EditorJS({
      holder: holderRef.current,
      placeholder: placeholder,
      data: value && typeof value === 'object' && 'blocks' in value ? value : undefined,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tools: {
        paragraph: {
          class: Paragraph as any,
          inlineToolbar: ["bold", "italic", "link", "fontSize", "textColor"],
        },
        header: {
          class: Header as any,
          inlineToolbar: ["bold", "italic", "link", "fontSize", "textColor"],
          config: {
            placeholder: "Section title",
            levels: [2, 3, 4],
            defaultLevel: 2,
          },
        },
        list: {
          class: List as any,
          inlineToolbar: ["bold", "italic", "link", "fontSize", "textColor"],
        },
        table: {
          class: Table as any,
          inlineToolbar: ["bold", "italic", "link", "fontSize", "textColor"],
          config: {
            rows: 2,
            cols: 3,
          },
        },
        fontSize: {
          class: FontSizeInlineTool as any,
        },
        textColor: {
          class: TextColorInlineTool as any,
        },
        image: {
          class: ImageTool as any,
          tunes: ["imageLink"],
          config: onImageUpload
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
          class: ImageLinkTune as any,
        },
        youtube: {
          class: YouTubeVideoBlock as any,
        },
        column: {
          class: ColumnBlock as any,
          config: onImageUpload
            ? {
                imageUploadHandler: handleImageUpload,
              }
            : undefined,
        },
      } as any,
      onChange: async () => {
        if (editor) {
          try {
            // Wait for editor to be ready
            await editor.isReady;
            const outputData = await editor.save();
            onChange(outputData);
          } catch (error) {
            console.error("Error saving editor data:", error);
          }
        }
      },
    });

    // Wait for editor to be ready
    editor.isReady.then(() => {
      editorRef.current = editor;
    }).catch((error) => {
      console.error("Editor initialization error:", error);
    });

    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [isMounted, placeholder, onChange, handleImageUpload, onImageUpload]);

  // Update editor content when value changes externally
  useEffect(() => {
    if (!editorRef.current || !value || typeof value !== 'object' || !('blocks' in value)) {
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
        if (typeof editor.save !== 'function') {
          console.warn("Editor save method not available yet");
          return;
        }

        const currentData = await editor.save();
        const currentJson = JSON.stringify(currentData);
        const newJson = JSON.stringify(value);
        
        if (currentJson !== newJson) {
          editor.render(value);
        }
      } catch (error) {
        // If save fails, try to render the new value directly
        try {
          if (editorRef.current && typeof editorRef.current.render === 'function') {
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
        .ce-paragraph {
          line-height: 1.6;
          font-size: 16px;
          color: #374151;
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
