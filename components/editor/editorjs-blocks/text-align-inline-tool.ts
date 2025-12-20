// editorjs-blocks/text-align-inline-tool.ts
import type { InlineTool } from "@editorjs/editorjs";

export default class TextAlignInlineTool implements InlineTool {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private api: any;
  private button: HTMLButtonElement | null = null;
  private dropdown: HTMLDivElement | null = null;
  private iconClasses: { base: string; active: string };
  private savedRange: Range | null = null;

  static get isInline() {
    return true;
  }

  static get title() {
    return "Text Align";
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor({ api }: { api: any }) {
    this.api = api;
    this.iconClasses = {
      base: this.api.styles.inlineToolButton,
      active: "ce-inline-tool--active",
    };
  }

  render() {
    this.button = document.createElement("button");
    this.button.type = "button";
    this.button.classList.add(this.iconClasses.base);
    this.button.style.position = "relative";

    // Simple align icon
    this.button.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 6H21M3 12H15M3 18H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `;

    // Create dropdown
    this.dropdown = document.createElement("div");
    this.dropdown.className = "text-align-dropdown";
    this.dropdown.style.cssText = `
      display: none;
      position: absolute;
      top: calc(100% + 5px);
      left: 50%;
      transform: translateX(-50%);
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.15);
      z-index: 10000;
      min-width: 140px;
      padding: 4px;
    `;

    const alignments = [
      {
        name: "Left",
        value: "left",
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 6H21M3 12H15M3 18H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
      },
      {
        name: "Center",
        value: "center",
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 6H21M7 12H17M3 18H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
      },
      {
        name: "Right",
        value: "right",
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 6H21M9 12H21M3 18H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
      },
      {
        name: "Justify",
        value: "justify",
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 6H21M3 12H21M3 18H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
      },
    ];

    if (!this.dropdown) {
      return this.button;
    }

    const dropdown = this.dropdown;
    if (!dropdown) {
      return this.button;
    }

    alignments.forEach((align) => {
      const option = document.createElement("button");
      option.type = "button";
      option.className = "text-align-option";
      option.style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        padding: 8px 12px;
        border: none;
        background: white;
        cursor: pointer;
        font-size: 14px;
        text-align: left;
        border-radius: 4px;
        transition: background 0.15s ease;
      `;

      option.innerHTML = `
        ${align.icon}
        <span style="color: #374151;">${align.name}</span>
      `;

      option.addEventListener("mouseenter", () => {
        option.style.background = "#f3f4f6";
      });

      option.addEventListener("mouseleave", () => {
        option.style.background = "white";
      });

      option.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const selection = window.getSelection();
        if (selection && this.savedRange) {
          selection.removeAllRanges();
          selection.addRange(this.savedRange);
        }
        this.applyAlignment(align.value);
        if (this.dropdown) {
          this.dropdown.style.display = "none";
        }
      });

      dropdown.appendChild(option);
    });

    // Append dropdown to body instead of button
    document.body.appendChild(dropdown);

    this.button.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!this.dropdown || !this.button) return;

      const selection = window.getSelection();
      this.savedRange =
        selection && selection.rangeCount > 0
          ? selection.getRangeAt(0).cloneRange()
          : null;

      const isVisible = this.dropdown.style.display === "block";

      if (isVisible) {
        this.dropdown.style.display = "none";
      } else {
        // Position dropdown relative to button
        const buttonRect = this.button.getBoundingClientRect();
        this.dropdown.style.display = "block";
        this.dropdown.style.position = "fixed";
        this.dropdown.style.top = `${buttonRect.bottom + 5}px`;
        this.dropdown.style.left = `${
          buttonRect.left + buttonRect.width / 2
        }px`;
        this.dropdown.style.transform = "translateX(-50%)";
      }
    });

    // Close dropdown when clicking outside
    const closeDropdown = (e: MouseEvent) => {
      if (
        this.dropdown &&
        this.button &&
        !this.button.contains(e.target as Node) &&
        !this.dropdown.contains(e.target as Node)
      ) {
        this.dropdown.style.display = "none";
      }
    };

    document.addEventListener("click", closeDropdown);

    return this.button;
  }

  applyAlignment(alignment: string) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    // Find the closest block element
    let node: Node | null = selection.getRangeAt(0).commonAncestorContainer;

    // Traverse up to find the content wrapper
    while (node && node.nodeType !== Node.ELEMENT_NODE) {
      node = node.parentNode;
    }

    if (!node) return;

    const element = node as HTMLElement;
    const blockElement = element.closest(
      ".ce-block__content, .ce-paragraph, .ce-header, .cdx-list, .tc-table"
    ) as HTMLElement | null;

    const contentElement =
      blockElement?.classList.contains("ce-block__content")
        ? blockElement
        : (blockElement?.closest(".ce-block__content") as HTMLElement | null);

    const targetElement = contentElement || blockElement;
    if (targetElement) {
      targetElement.style.textAlign = alignment;
    }

    const blockWrapper = (targetElement || element).closest(
      ".ce-block"
    ) as HTMLElement | null;
    let blockApi = blockWrapper
      ? this.api.blocks.getBlockByElement(blockWrapper)
      : undefined;
    if (!blockApi) {
      const index = this.api.blocks.getCurrentBlockIndex();
      blockApi = this.api.blocks.getBlockByIndex(index);
    }

    if (blockApi) {
      void this.api.blocks.update(blockApi.id, undefined, {
        textAlignTune: { alignment },
      });
    }
  }

  surround() {
    // Not used
  }

  checkState() {
    return false;
  }

  static get sanitize() {
    return {
      div: { style: true },
      p: { style: true },
      h2: { style: true },
      h3: { style: true },
      h4: { style: true },
    };
  }
}
