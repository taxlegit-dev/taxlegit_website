
import type { InlineTool } from "@editorjs/editorjs";

export default class TextColorInlineTool implements InlineTool {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private api: any;
  private button: HTMLButtonElement | null = null;
  private currentColor: string | null = null;
  private presetColors = [
    "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF",
    "#FFFF00", "#FF00FF", "#00FFFF", "#808080", "#800000",
    "#008000", "#000080", "#808000", "#800080", "#008080",
    "#C0C0C0", "#FFA500", "#FFC0CB", "#A52A2A", "#FFD700"
  ];

  static get isInline() {
    return true;
  }

  static get title() {
    return "Text Color";
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
        <path d="M10 2L3 17H7L8.5 14H11.5L13 17H17L10 2ZM10.5 5.5L13.5 12H6.5L10.5 5.5Z" fill="currentColor"/>
      </svg>
    `;
    this.button.title = "Text Color";

    this.button.addEventListener("click", () => {
      this.showColorPicker();
    });

    return this.button;
  }

  private showColorPicker() {
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

    // Check if selection already has color
    const container = range.commonAncestorContainer;
    const span = container.nodeType === Node.TEXT_NODE 
      ? container.parentElement?.closest('span[style*="color"]') as HTMLSpanElement
      : (container as HTMLElement).closest('span[style*="color"]') as HTMLSpanElement;

    let currentColor = "#000000"; // default
    if (span && span.style.color) {
      currentColor = this.rgbToHex(span.style.color) || span.style.color;
    }

    // Create color picker panel
    const panel = document.createElement("div");
    panel.style.cssText = `
      position: absolute;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      padding: 12px;
      z-index: 10000;
      min-width: 280px;
    `;

    // Preset colors grid
    const presetLabel = document.createElement("div");
    presetLabel.textContent = "Preset Colors:";
    presetLabel.style.cssText = "font-size: 12px; font-weight: 600; margin-bottom: 8px; color: #374151;";
    panel.appendChild(presetLabel);

    const presetGrid = document.createElement("div");
    presetGrid.style.cssText = "display: grid; grid-template-columns: repeat(10, 1fr); gap: 4px; margin-bottom: 12px;";
    
    this.presetColors.forEach((color) => {
      const colorBtn = document.createElement("button");
      colorBtn.type = "button";
      colorBtn.style.cssText = `
        width: 24px;
        height: 24px;
        border: 2px solid ${currentColor === color ? "#3b82f6" : "#e5e7eb"};
        border-radius: 4px;
        background: ${color};
        cursor: pointer;
        padding: 0;
      `;
      colorBtn.title = color;
      colorBtn.addEventListener("click", () => {
        // Restore selection before applying
        const sel = window.getSelection();
        if (sel && savedRange) {
          sel.removeAllRanges();
          sel.addRange(savedRange);
        }
        this.applyColor(color);
        document.body.removeChild(panel);
      });
      presetGrid.appendChild(colorBtn);
    });
    panel.appendChild(presetGrid);

    // Custom hex color input
    const customLabel = document.createElement("div");
    customLabel.textContent = "Custom Hex Color:";
    customLabel.style.cssText = "font-size: 12px; font-weight: 600; margin-bottom: 8px; color: #374151;";
    panel.appendChild(customLabel);

    const customContainer = document.createElement("div");
    customContainer.style.cssText = "display: flex; gap: 8px; align-items: center;";

    const hexInput = document.createElement("input");
    hexInput.type = "text";
    hexInput.placeholder = "#000000";
    hexInput.value = currentColor.startsWith("#") ? currentColor : `#${currentColor}`;
    hexInput.style.cssText = `
      flex: 1;
      padding: 6px 8px;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      font-size: 13px;
      font-family: monospace;
    `;

    const colorPreview = document.createElement("div");
    colorPreview.style.cssText = `
      width: 32px;
      height: 32px;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      background: ${hexInput.value};
    `;

    hexInput.addEventListener("input", (e) => {
      const value = (e.target as HTMLInputElement).value;
      if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
        colorPreview.style.background = value.length === 7 ? value : "#000000";
      }
    });

    const applyBtn = document.createElement("button");
    applyBtn.textContent = "Apply";
    applyBtn.type = "button";
    applyBtn.style.cssText = `
      padding: 6px 12px;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
    `;
    applyBtn.addEventListener("click", () => {
      const hexValue = hexInput.value.trim();
      if (/^#[0-9A-Fa-f]{6}$/i.test(hexValue)) {
        // Restore selection before applying
        const sel = window.getSelection();
        if (sel && savedRange) {
          sel.removeAllRanges();
          sel.addRange(savedRange);
        }
        this.applyColor(hexValue);
        document.body.removeChild(panel);
      } else {
        alert("Please enter a valid hex color (e.g., #FF0000)");
      }
    });

    customContainer.appendChild(hexInput);
    customContainer.appendChild(colorPreview);
    customContainer.appendChild(applyBtn);
    panel.appendChild(customContainer);

    // Remove color button
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove Color";
    removeBtn.type = "button";
    removeBtn.style.cssText = `
      margin-top: 8px;
      padding: 6px 12px;
      background: #ef4444;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
      width: 100%;
    `;
    removeBtn.addEventListener("click", () => {
      this.removeColor();
      document.body.removeChild(panel);
    });
    panel.appendChild(removeBtn);

    // Position panel near button with viewport awareness
    if (this.button) {
      this.positionPanel(panel, this.button);
    }

    document.body.appendChild(panel);

    // Close on outside click
    const closeHandler = (e: MouseEvent) => {
      if (!panel.contains(e.target as Node) && e.target !== this.button) {
        document.body.removeChild(panel);
        document.removeEventListener("click", closeHandler);
      }
    };
    setTimeout(() => {
      document.addEventListener("click", closeHandler);
    }, 0);
  }

  private positionPanel(panel: HTMLElement, button: HTMLElement) {
    const buttonRect = button.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    
    // Estimate panel height (approximate)
    const panelHeight = 350; // Approximate height
    const panelWidth = 280; // Approximate width
    const spacing = 4;
    
    // Check if there's enough space below
    const spaceBelow = viewportHeight - buttonRect.bottom;
    const spaceAbove = buttonRect.top;
    
    let top: number;
    let left: number;
    
    // Position vertically
    if (spaceBelow >= panelHeight + spacing) {
      // Position below button
      top = buttonRect.bottom + spacing + scrollY;
    } else if (spaceAbove >= panelHeight + spacing) {
      // Position above button
      top = buttonRect.top - panelHeight - spacing + scrollY;
    } else {
      // Not enough space on either side, position in viewport center vertically
      top = scrollY + Math.max(10, buttonRect.top - panelHeight / 2);
    }
    
    // Position horizontally - ensure it stays within viewport
    left = buttonRect.left + scrollX;
    if (left + panelWidth > viewportWidth + scrollX) {
      // Adjust to fit within viewport
      left = viewportWidth + scrollX - panelWidth - 10;
    }
    if (left < scrollX + 10) {
      left = scrollX + 10;
    }
    
    panel.style.position = "absolute";
    panel.style.top = `${top}px`;
    panel.style.left = `${left}px`;
    panel.style.zIndex = "10000";
  }

  private rgbToHex(rgb: string): string | null {
    if (rgb.startsWith("#")) {
      return rgb;
    }
    
    const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (match) {
      const r = parseInt(match[1], 10).toString(16).padStart(2, "0");
      const g = parseInt(match[2], 10).toString(16).padStart(2, "0");
      const b = parseInt(match[3], 10).toString(16).padStart(2, "0");
      return `#${r}${g}${b}`;
    }
    
    return null;
  }

  private applyColor(color: string) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return;
    }

    const range = selection.getRangeAt(0);
    if (range.collapsed) {
      return;
    }

    // Check if selection is already wrapped in a span with color
    const span = range.commonAncestorContainer.nodeType === Node.TEXT_NODE
      ? range.commonAncestorContainer.parentElement?.closest('span[style*="color"]') as HTMLSpanElement
      : (range.commonAncestorContainer as HTMLElement).closest('span[style*="color"]') as HTMLSpanElement;

    if (span && span.style.color) {
      // Update existing span
      span.style.color = color;
      this.api.selection.expandToTag(span);
    } else {
      // Create new span
      const newSpan = document.createElement("span");
      newSpan.style.color = color;
      
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

    this.currentColor = color;
  }

  checkState(): boolean {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return false;
    }

    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;
    const span = container.nodeType === Node.TEXT_NODE
      ? container.parentElement?.closest('span[style*="color"]') as HTMLSpanElement
      : (container as HTMLElement).closest('span[style*="color"]') as HTMLSpanElement;

    if (span && span.style.color) {
      this.currentColor = this.rgbToHex(span.style.color) || span.style.color;
      return true;
    }

    this.currentColor = null;
    return false;
  }

  surround(range: Range): void {
    // This is called when the tool is activated via API
    // Show the picker instead of applying default
    if (!range.collapsed) {
      this.showColorPicker();
    }
  }

  renderActions(): HTMLElement {
    const wrapper = document.createElement("div");
    wrapper.style.cssText = "display: flex; gap: 4px; padding: 4px;";
    
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove Color";
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
      this.removeColor();
    });
    
    wrapper.appendChild(removeBtn);
    return wrapper;
  }

  private removeColor() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return;
    }

    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;
    const span = container.nodeType === Node.TEXT_NODE
      ? container.parentElement?.closest('span[style*="color"]') as HTMLSpanElement
      : (container as HTMLElement).closest('span[style*="color"]') as HTMLSpanElement;

    if (span) {
      const parent = span.parentElement;
      if (parent) {
        while (span.firstChild) {
          parent.insertBefore(span.firstChild, span);
        }
        parent.removeChild(span);
        this.currentColor = null;
      }
    }
  }
}

