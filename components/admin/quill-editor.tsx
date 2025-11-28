"use client";

import { useMemo, useRef, useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

// Polyfill for findDOMNode to support react-quill with React 19
if (typeof window !== "undefined" && typeof document !== "undefined") {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const ReactDOM = require("react-dom");
    if (ReactDOM && !ReactDOM.findDOMNode) {
      // Simple polyfill for findDOMNode
      ReactDOM.findDOMNode = function (componentOrElement: unknown) {
        if (componentOrElement == null) return null;
        if ((componentOrElement as { nodeType?: number }).nodeType === 1) {
          return componentOrElement;
        }
        // Try to get from React internals (this is a simplified version)
        const internalFiber = (componentOrElement as { _reactInternalFiber?: unknown })._reactInternalFiber as {
          stateNode?: { nodeType?: number };
          return?: unknown;
        } | undefined;
        if (internalFiber) {
          let fiber = internalFiber;
          while (fiber) {
            if (fiber.stateNode && fiber.stateNode.nodeType === 1) {
              return fiber.stateNode;
            }
            fiber = (fiber.return as typeof fiber) || undefined;
          }
        }
        return null;
      };
    }
  } catch {
    // Ignore if react-dom is not available
  }
}

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(
  async () => {
    const ReactQuillModule = await import("react-quill");
    const Component = ReactQuillModule.default;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Component as React.ComponentType<any>;
  },
  { ssr: false }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) as any;

type QuillEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onImageUpload?: (file: File) => Promise<string>;
};

type QuillInstance = {
  getSelection: (focus?: boolean) => { index: number; length: number } | null;
  getLength: () => number;
  insertText: (index: number, text: string, source?: string) => void;
  deleteText: (index: number, length: number) => void;
  insertEmbed: (index: number, type: string, value: string) => void;
  setSelection: (index: number, length?: number) => void;
  selection?: {
    setNativeRange: (range: Range | null, force?: boolean) => void;
  };
};

export function QuillEditor({ value, onChange, placeholder = "Start typing...", onImageUpload }: QuillEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<QuillInstance | null>(null);
  const [isMounted] = useState(() => {
    // Initialize mounted state immediately
    if (typeof window !== "undefined") {
      return true;
    }
    return false;
  });
  const [internalValue, setInternalValue] = useState(value);
  const isUpdatingRef = useRef(false);
  const prevValueRef = useRef(value);

  // Sync external value changes (but don't override if user is typing)
  // Use useLayoutEffect to sync immediately without causing render issues
  useEffect(() => {
    // Only update if value changed externally and user is not typing
    if (isUpdatingRef.current) {
      return;
    }
    
    if (value !== prevValueRef.current) {
      prevValueRef.current = value;
      // Use requestAnimationFrame to avoid setState in effect warning
      requestAnimationFrame(() => {
        if (!isUpdatingRef.current) {
          setInternalValue(value);
        }
      });
    }
  }, [value]);

  // Access Quill instance and suppress range warnings
  useEffect(() => {
    if (!isMounted) return;

    const timer = setTimeout(() => {
      if (editorRef.current) {
        const editorElement = editorRef.current.querySelector(".ql-editor") as HTMLElement;
        if (editorElement) {
          // Get Quill instance - try multiple methods
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const quill = (editorElement as any).__quill || 
                       // eslint-disable-next-line @typescript-eslint/no-explicit-any
                       (window as any).Quill?.find(editorElement) ||
                       // eslint-disable-next-line @typescript-eslint/no-explicit-any
                       (editorElement.closest(".ql-container") as any)?.__quill;
          if (quill) {
            quillRef.current = quill as QuillInstance;
            
            // Suppress range warnings by patching setNativeRange
            if (quill.selection && quill.selection.setNativeRange) {
              const originalSetNativeRange = quill.selection.setNativeRange.bind(quill.selection);
              quill.selection.setNativeRange = function(range: Range | null, force?: boolean) {
                try {
                  // Check if range is valid before setting
                  if (range && range.startContainer) {
                    if (document.contains(range.startContainer)) {
                      return originalSetNativeRange(range, force);
                    }
                  }
                } catch {
                  // Silently ignore range errors
                }
              };
            }
          }
        }
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [isMounted]);

  const handleImageUpload = useCallback(() => {
    if (!onImageUpload) return;
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      // Try to get Quill instance
      let quill = quillRef.current;
      if (!quill && editorRef.current) {
        const editorElement = editorRef.current.querySelector(".ql-editor") as HTMLElement;
        if (editorElement) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          quill = (editorElement as any).__quill || 
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (window as any).Quill?.find(editorElement) ||
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (editorElement.closest(".ql-container") as any)?.__quill;
        }
      }

      if (!quill) {
        console.error("Quill instance not found");
        return;
      }

      // Get current selection or end of document
      let range = quill.getSelection();
      if (!range) {
        const length = quill.getLength();
        range = { index: length - 1, length: 0 };
      }

      const insertIndex = range.index;

      quill.insertText(insertIndex, "Uploading image...", "user");

      try {
        const imageUrl = await onImageUpload(file);
        quill.deleteText(insertIndex, insertIndex + "Uploading image...".length);
        quill.insertEmbed(insertIndex, "image", imageUrl);
        // Set selection after image
        setTimeout(() => {
          try {
            quill.setSelection(insertIndex + 1);
          } catch {
            // Ignore selection errors
          }
        }, 100);
      } catch (error) {
        quill.deleteText(insertIndex, insertIndex + "Uploading image...".length);
        quill.insertText(insertIndex, "Image upload failed", "user");
        console.error("Image upload error:", error);
      }
    };
  }, [onImageUpload]);

  const handleChange = useCallback((content: string) => {
    isUpdatingRef.current = true;
    setInternalValue(content);
    onChange(content);
    // Reset flag after a short delay
    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 100);
  }, [onChange]);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ align: [] }],
          ["link", "image", "video"],
          ["clean"],
        ],
        handlers: {
          image: handleImageUpload,
        },
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    [handleImageUpload]
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "align",
    "link",
    "image",
    "video",
  ];

  if (!isMounted) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-4 min-h-[300px] flex items-center justify-center text-slate-400">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div ref={editorRef} className="rounded-lg border border-slate-200 bg-white">
        <ReactQuill
          theme="snow"
          value={internalValue}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          className="quill-editor"
          preserveWhitespace
        />
      </div>
      <style jsx global>{`
        .quill-editor .ql-container {
          min-height: 300px;
          font-size: 14px;
        }
        .quill-editor .ql-editor {
          min-height: 300px;
        }
        .quill-editor .ql-editor:focus {
          outline: none;
        }
        .quill-editor .ql-editor p,
        .quill-editor .ql-editor div {
          min-height: 1.5em;
        }
        .quill-editor .ql-toolbar {
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        }
        .quill-editor .ql-container {
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
        }
        /* Prevent editor from collapsing */
        .quill-editor .ql-editor.ql-blank::before {
          content: attr(data-placeholder);
          position: absolute;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
