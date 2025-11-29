/**
 * Column Block for Editor.js
 * Displays image on one side and text content (heading, description, points) on the other
 */

import type { BlockTool, BlockToolConstructorOptions, BlockToolData } from "@editorjs/editorjs";

export interface ColumnBlockData extends BlockToolData {
  imageUrl: string;
  imagePosition: "left" | "right";
  heading: string;
  description: string;
  points: string[];
}

export default class ColumnBlock implements BlockTool {
  private data: ColumnBlockData;
  private wrapper: HTMLElement | null = null;
  private imageUrlInput: HTMLInputElement | null = null;
  private imageFileInput: HTMLInputElement | null = null;
  private imagePreview: HTMLElement | null = null;
  private headingInput: HTMLInputElement | null = null;
  private descriptionTextarea: HTMLTextAreaElement | null = null;
  private pointsContainer: HTMLElement | null = null;
  private imageUploadHandler?: (file: File) => Promise<string>;

  static get toolbox() {
    return {
      title: "Column Block",
      icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="7" height="16" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/><rect x="11" y="2" width="7" height="16" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>',
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  private api: any;

  constructor({ data, api, config }: BlockToolConstructorOptions<ColumnBlockData> & { config?: { imageUploadHandler?: (file: File) => Promise<string> } }) {
    this.data = {
      imageUrl: data?.imageUrl || "",
      imagePosition: data?.imagePosition || "left",
      heading: data?.heading || "",
      description: data?.description || "",
      points: data?.points || [],
    };

    this.api = api;

    // Access image upload handler from config
    const blockConfig = config as { imageUploadHandler?: (file: File) => Promise<string> } | undefined;
    if (blockConfig?.imageUploadHandler) {
      this.imageUploadHandler = blockConfig.imageUploadHandler;
    }
  }

  render(): HTMLElement {
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("column-block");
    this.wrapper.style.cssText = "padding: 15px; border: 1px solid #e0e0e0; border-radius: 8px; margin: 10px 0;";

    // Image section
    const imageSection = this.createImageSection();
    
    // Text section
    const textSection = this.createTextSection();

    // Position toggle
    const positionToggle = this.createPositionToggle();

    // Layout container
    const layoutContainer = document.createElement("div");
    layoutContainer.className = "column-layout";
    layoutContainer.style.cssText = `
      display: flex;
      gap: 20px;
      align-items: flex-start;
      margin-top: 15px;
      flex-direction: ${this.data.imagePosition === "left" ? "row" : "row-reverse"};
    `;

    const imageColumn = document.createElement("div");
    imageColumn.className = "image-column";
    imageColumn.style.cssText = "flex: 1; min-width: 0;";
    imageColumn.appendChild(imageSection);

    const textColumn = document.createElement("div");
    textColumn.className = "text-column";
    textColumn.style.cssText = "flex: 1; min-width: 0;";
    textColumn.appendChild(textSection);

    layoutContainer.appendChild(imageColumn);
    layoutContainer.appendChild(textColumn);

    this.wrapper.appendChild(positionToggle);
    this.wrapper.appendChild(layoutContainer);

    return this.wrapper;
  }

  private createImageSection(): HTMLElement {
    const imageSection = document.createElement("div");
    imageSection.style.cssText = "margin-bottom: 10px;";

    const imageLabel = document.createElement("label");
    imageLabel.textContent = "Image:";
    imageLabel.style.cssText = "display: block; font-size: 12px; font-weight: 500; margin-bottom: 4px;";

    // Image URL input
    this.imageUrlInput = document.createElement("input");
    this.imageUrlInput.type = "text";
    this.imageUrlInput.value = this.data.imageUrl;
    this.imageUrlInput.placeholder = "Image URL or upload file below";
    this.imageUrlInput.style.cssText = "width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; margin-bottom: 8px;";
    this.imageUrlInput.addEventListener("input", () => {
      this.data.imageUrl = this.imageUrlInput?.value || "";
      this.updateImagePreview();
    });

    // File upload input
    const fileInputContainer = document.createElement("div");
    fileInputContainer.style.cssText = "margin-bottom: 8px;";

    this.imageFileInput = document.createElement("input");
    this.imageFileInput.type = "file";
    this.imageFileInput.accept = "image/*";
    this.imageFileInput.style.cssText = "width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;";
    this.imageFileInput.addEventListener("change", async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && this.imageUploadHandler) {
        try {
          const url = await this.imageUploadHandler(file);
          this.data.imageUrl = url;
          if (this.imageUrlInput) {
            this.imageUrlInput.value = url;
          }
          this.updateImagePreview();
        } catch (error) {
          console.error("Image upload failed:", error);
          alert("Image upload failed. Please try again or use a URL.");
        }
      } else if (file) {
        // Fallback: create object URL for preview
        const url = URL.createObjectURL(file);
        this.data.imageUrl = url;
        if (this.imageUrlInput) {
          this.imageUrlInput.value = url;
        }
        this.updateImagePreview();
      }
    });

    // Image preview
    this.imagePreview = document.createElement("div");
    this.imagePreview.className = "image-preview";
    this.imagePreview.style.cssText = "margin-top: 10px; border-radius: 4px; overflow: hidden;";

    imageSection.appendChild(imageLabel);
    imageSection.appendChild(this.imageUrlInput);
    fileInputContainer.appendChild(this.imageFileInput);
    imageSection.appendChild(fileInputContainer);
    imageSection.appendChild(this.imagePreview);

    this.updateImagePreview();

    return imageSection;
  }

  private createTextSection(): HTMLElement {
    const textSection = document.createElement("div");
    textSection.style.cssText = "display: flex; flex-direction: column; gap: 10px;";

    // Heading
    const headingLabel = document.createElement("label");
    headingLabel.textContent = "Heading:";
    headingLabel.style.cssText = "display: block; font-size: 12px; font-weight: 500;";

    this.headingInput = document.createElement("input");
    this.headingInput.type = "text";
    this.headingInput.value = this.data.heading;
    this.headingInput.placeholder = "Enter heading";
    this.headingInput.style.cssText = "width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px; font-weight: 600;";

    // Description
    const descriptionLabel = document.createElement("label");
    descriptionLabel.textContent = "Description:";
    descriptionLabel.style.cssText = "display: block; font-size: 12px; font-weight: 500; margin-top: 8px;";

    this.descriptionTextarea = document.createElement("textarea");
    this.descriptionTextarea.value = this.data.description;
    this.descriptionTextarea.placeholder = "Enter description";
    this.descriptionTextarea.rows = 4;
    this.descriptionTextarea.style.cssText = "width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; resize: vertical; font-family: inherit;";

    // Points
    const pointsLabel = document.createElement("label");
    pointsLabel.textContent = "Points:";
    pointsLabel.style.cssText = "display: block; font-size: 12px; font-weight: 500; margin-top: 8px;";

    this.pointsContainer = document.createElement("div");
    this.pointsContainer.className = "points-container";
    this.pointsContainer.style.cssText = "display: flex; flex-direction: column; gap: 6px;";

    const addPointButton = document.createElement("button");
    addPointButton.textContent = "+ Add Point";
    addPointButton.type = "button";
    addPointButton.style.cssText = "padding: 6px 12px; background: #4f46e5; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer; margin-top: 8px;";
    addPointButton.addEventListener("click", () => {
      this.addPoint();
    });

    textSection.appendChild(headingLabel);
    textSection.appendChild(this.headingInput);
    textSection.appendChild(descriptionLabel);
    textSection.appendChild(this.descriptionTextarea);
    textSection.appendChild(pointsLabel);
    textSection.appendChild(this.pointsContainer);
    textSection.appendChild(addPointButton);

    this.renderPoints();

    return textSection;
  }

  private createPositionToggle(): HTMLElement {
    const toggleContainer = document.createElement("div");
    toggleContainer.style.cssText = "display: flex; gap: 8px; align-items: center; margin-bottom: 10px; padding: 8px; background: #f5f5f5; border-radius: 4px;";

    const label = document.createElement("label");
    label.textContent = "Image Position:";
    label.style.cssText = "font-size: 12px; font-weight: 500;";

    const leftButton = document.createElement("button");
    leftButton.textContent = "Left";
    leftButton.type = "button";
    leftButton.style.cssText = `
      padding: 4px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;
      background: ${this.data.imagePosition === "left" ? "#4f46e5" : "white"};
      color: ${this.data.imagePosition === "left" ? "white" : "#333"};
    `;
    leftButton.addEventListener("click", () => {
      this.data.imagePosition = "left";
      this.updateLayout();
      leftButton.style.background = "#4f46e5";
      leftButton.style.color = "white";
      rightButton.style.background = "white";
      rightButton.style.color = "#333";
    });

    const rightButton = document.createElement("button");
    rightButton.textContent = "Right";
    rightButton.type = "button";
    rightButton.style.cssText = `
      padding: 4px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;
      background: ${this.data.imagePosition === "right" ? "#4f46e5" : "white"};
      color: ${this.data.imagePosition === "right" ? "white" : "#333"};
    `;
    rightButton.addEventListener("click", () => {
      this.data.imagePosition = "right";
      this.updateLayout();
      rightButton.style.background = "#4f46e5";
      rightButton.style.color = "white";
      leftButton.style.background = "white";
      leftButton.style.color = "#333";
    });

    toggleContainer.appendChild(label);
    toggleContainer.appendChild(leftButton);
    toggleContainer.appendChild(rightButton);

    return toggleContainer;
  }

  private updateLayout() {
    const layoutContainer = this.wrapper?.querySelector(".column-layout") as HTMLElement | null;
    if (layoutContainer) {
      layoutContainer.style.flexDirection = this.data.imagePosition === "left" ? "row" : "row-reverse";
    }
  }

  private updateImagePreview() {
    if (!this.imagePreview) return;

    const url = this.data.imageUrl;
    if (!url) {
      this.imagePreview.innerHTML = "";
      return;
    }

    this.imagePreview.innerHTML = `
      <img 
        src="${url}" 
        alt="Preview" 
        style="width: 100%; height: auto; display: block; max-height: 300px; object-fit: contain;"
        onerror="this.style.display='none'; this.parentElement.innerHTML='<p style=\\'color: red; font-size: 12px; padding: 10px;\\'>Invalid image URL</p>';"
      />
    `;
  }

  private renderPoints() {
    if (!this.pointsContainer) return;

    const container = this.pointsContainer;
    container.innerHTML = "";

    this.data.points.forEach((point, index) => {
      const pointItem = document.createElement("div");
      pointItem.style.cssText = "display: flex; gap: 8px; align-items: flex-start;";

      const pointInput = document.createElement("input");
      pointInput.type = "text";
      pointInput.value = point;
      pointInput.placeholder = "Enter point";
      pointInput.style.cssText = "flex: 1; padding: 6px 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;";
      pointInput.addEventListener("input", () => {
        this.data.points[index] = pointInput.value;
      });

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "×";
      deleteButton.type = "button";
      deleteButton.style.cssText = "padding: 6px 10px; background: #ef4444; color: white; border: none; border-radius: 4px; font-size: 16px; cursor: pointer; line-height: 1;";
      deleteButton.addEventListener("click", () => {
        this.data.points.splice(index, 1);
        this.renderPoints();
      });

      pointItem.appendChild(pointInput);
      pointItem.appendChild(deleteButton);
      container.appendChild(pointItem);
    });

    if (this.data.points.length === 0) {
      const emptyMessage = document.createElement("p");
      emptyMessage.textContent = "No points added yet";
      emptyMessage.style.cssText = "color: #999; font-size: 12px; font-style: italic; padding: 8px;";
      container.appendChild(emptyMessage);
    }
  }

  private addPoint() {
    this.data.points.push("");
    this.renderPoints();
    // Focus on the new input
    const lastInput = this.pointsContainer?.querySelector("input:last-of-type") as HTMLInputElement;
    if (lastInput) {
      setTimeout(() => lastInput.focus(), 0);
    }
  }

  save(): ColumnBlockData {
    return {
      imageUrl: this.imageUrlInput?.value || "",
      imagePosition: this.data.imagePosition,
      heading: this.headingInput?.value || "",
      description: this.descriptionTextarea?.value || "",
      points: this.data.points.filter((p) => p.trim() !== ""),
    };
  }

  static get sanitize() {
    return {
      imageUrl: {},
      imagePosition: {},
      heading: {},
      description: {},
      points: {},
    };
  }
}

