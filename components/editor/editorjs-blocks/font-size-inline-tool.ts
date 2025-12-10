/**
 * Custom inline tool for Editor.js to change font size
 * Supports sizes: 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48
 */

import type { InlineTool } from "@editorjs/editorjs";

export default class FontSizeInlineTool implements InlineTool {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private api: any;
  private button: HTMLButtonElement | null = null;
  private currentSize: string | null = null;
  private sizes = [
    "10",
    "12",
    "14",
    "16",
    "18",
    "20",
    "24",
    "28",
    "32",
    "36",
    "40",
    "48",
  ];

  static get isInline() {
    return true;
  }

  static get title() {
    return "Font Size";
  }

  static get sanitize() {
    return {
      span: {
        style: true,
      },
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor({ api }: { api: any }) {
    this.api = api;
  }

  render(): HTMLElement {
    this.button = document.createElement("button");
    this.button.type = "button";
    this.button.classList.add(this.api.styles.inlineToolButton);
    this.button.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 3V17M5 3H3M5 3H7M5 17H3M5 17H7M13 3V17M13 3H11M13 3H15M13 17H11M13 17H15M3 6H17M3 14H17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    `;
    this.button.title = "Font Size";

    this.button.addEventListener("click", () => {
      this.showSizePicker();
    });

    return this.button;
  }

  private showSizePicker() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return;
    }

    const range = selection.getRangeAt(0);
    if (range.collapsed) {
      return;
    }

    // Store the range to preserve selection
    const savedRange = range.cloneRange();

    // Check if selection already has font-size
    const container = range.commonAncestorContainer;
    const span =
      container.nodeType === Node.TEXT_NODE
        ? (container.parentElement?.closest(
            'span[style*="font-size"]'
          ) as HTMLSpanElement)
        : ((container as HTMLElement).closest(
            'span[style*="font-size"]'
          ) as HTMLSpanElement);

    let currentSize = "16"; // default
    if (span && span.style.fontSize) {
      currentSize = span.style.fontSize.replace("px", "");
    }

    // Create dropdown
    const dropdown = document.createElement("div");
    dropdown.style.cssText = `
      position: absolute;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      padding: 8px;
      z-index: 10000;
      min-width: 120px;
    `;

    this.sizes.forEach((size) => {
      const option = document.createElement("div");
      option.style.cssText = `
        padding: 6px 12px;
        cursor: pointer;
        font-size: ${size}px;
        border-radius: 4px;
        ${currentSize === size ? "background: #f3f4f6; font-weight: 600;" : ""}
      `;
      option.textContent = `${size}px`;
      option.addEventListener("mouseenter", () => {
        option.style.background = "#f3f4f6";
      });
      option.addEventListener("mouseleave", () => {
        if (currentSize !== size) {
          option.style.background = "";
        }
      });
      option.addEventListener("click", () => {
        // Restore selection before applying
        const sel = window.getSelection();
        if (sel && savedRange) {
          sel.removeAllRanges();
          sel.addRange(savedRange);
        }
        this.applySize(size);
        document.body.removeChild(dropdown);
      });
      dropdown.appendChild(option);
    });

    // Position dropdown near button with viewport awareness
    if (this.button) {
      this.positionDropdown(dropdown, this.button);
    }

    document.body.appendChild(dropdown);

    // Close on outside click
    const closeHandler = (e: MouseEvent) => {
      if (!dropdown.contains(e.target as Node) && e.target !== this.button) {
        document.body.removeChild(dropdown);
        document.removeEventListener("click", closeHandler);
      }
    };
    setTimeout(() => {
      document.addEventListener("click", closeHandler);
    }, 0);
  }

  private positionDropdown(dropdown: HTMLElement, button: HTMLElement) {
    const buttonRect = button.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    // Estimate dropdown height (approximate)
    const dropdownHeight = 300; // Approximate height
    const dropdownWidth = 120; // Approximate width
    const spacing = 4;

    // Check if there's enough space below
    const spaceBelow = viewportHeight - buttonRect.bottom;
    const spaceAbove = buttonRect.top;

    let top: number;
    let left: number;

    // Position vertically
    if (spaceBelow >= dropdownHeight + spacing) {
      // Position below button
      top = buttonRect.bottom + spacing + scrollY;
    } else if (spaceAbove >= dropdownHeight + spacing) {
      // Position above button
      top = buttonRect.top - dropdownHeight - spacing + scrollY;
    } else {
      // Not enough space on either side, position in viewport center vertically
      top = scrollY + Math.max(10, buttonRect.top - dropdownHeight / 2);
    }

    // Position horizontally - ensure it stays within viewport
    left = buttonRect.left + scrollX;
    if (left + dropdownWidth > viewportWidth + scrollX) {
      // Adjust to fit within viewport
      left = viewportWidth + scrollX - dropdownWidth - 10;
    }
    if (left < scrollX + 10) {
      left = scrollX + 10;
    }

    dropdown.style.position = "absolute";
    dropdown.style.top = `${top}px`;
    dropdown.style.left = `${left}px`;
    dropdown.style.zIndex = "10000";
  }

  private applySize(size: string) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return;
    }

    const range = selection.getRangeAt(0);
    if (range.collapsed) {
      return;
    }

    // Check if selection is already wrapped in a span with font-size
    const span =
      range.commonAncestorContainer.nodeType === Node.TEXT_NODE
        ? (range.commonAncestorContainer.parentElement?.closest(
            'span[style*="font-size"]'
          ) as HTMLSpanElement)
        : ((range.commonAncestorContainer as HTMLElement).closest(
            'span[style*="font-size"]'
          ) as HTMLSpanElement);

    if (span && span.style.fontSize) {
      // Update existing span
      span.style.fontSize = `${size}px`;
      this.api.selection.expandToTag(span);
    } else {
      // Create new span
      const newSpan = document.createElement("span");
      newSpan.style.fontSize = `${size}px`;

      try {
        range.surroundContents(newSpan);
      } catch {
        // If surroundContents fails, manually wrap
        const contents = range.extractContents();
        newSpan.appendChild(contents);
        range.insertNode(newSpan);
      }

      this.api.selection.expandToTag(newSpan);
    }

    this.currentSize = size;
  }

  checkState(): boolean {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return false;
    }

    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;
    const span =
      container.nodeType === Node.TEXT_NODE
        ? (container.parentElement?.closest(
            'span[style*="font-size"]'
          ) as HTMLSpanElement)
        : ((container as HTMLElement).closest(
            'span[style*="font-size"]'
          ) as HTMLSpanElement);

    if (span && span.style.fontSize) {
      this.currentSize = span.style.fontSize.replace("px", "");
      return true;
    }

    this.currentSize = null;
    return false;
  }

  surround(range: Range): void {
    // This is called when the tool is activated via API
    // Show the picker instead of applying default
    if (!range.collapsed) {
      this.showSizePicker();
    }
  }

  renderActions(): HTMLElement {
    const wrapper = document.createElement("div");
    wrapper.style.cssText = "display: flex; gap: 4px; padding: 4px;";

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove Size";
    removeBtn.style.cssText = `
      padding: 4px 8px;
      font-size: 12px;
      background: #ef4444;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    `;
    removeBtn.addEventListener("click", () => {
      this.removeSize();
    });

    wrapper.appendChild(removeBtn);
    return wrapper;
  }

  private removeSize() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return;
    }

    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;
    const span =
      container.nodeType === Node.TEXT_NODE
        ? (container.parentElement?.closest(
            'span[style*="font-size"]'
          ) as HTMLSpanElement)
        : ((container as HTMLElement).closest(
            'span[style*="font-size"]'
          ) as HTMLSpanElement);

    if (span) {
      const parent = span.parentElement;
      if (parent) {
        while (span.firstChild) {
          parent.insertBefore(span.firstChild, span);
        }
        parent.removeChild(span);
        this.currentSize = null;
      }
    }
  }
}
