import type {
  BlockTool,
  BlockToolConstructorOptions,
  BlockToolData,
  API,
  BlockAPI,
} from "@editorjs/editorjs";

export interface ContentCardsBlockData extends BlockToolData {
  cards: Array<{
    icon: string;
    iconAltText?: string;
    heading: string;
    description: string;
  }>;
  cardsPerRow: number; // 2 to 5
}

export default class ContentCardsBlock implements BlockTool {
  private data: ContentCardsBlockData;
  private wrapper: HTMLElement | null = null;
  private cardsContainer: HTMLElement | null = null;
  private cardsPerRowInput: HTMLInputElement | null = null;
  private imageUploadHandler?: (file: File) => Promise<string>;
  private api: API;
  private block?: BlockAPI;

  private decodeHtmlEntities(value: string) {
    if (!value || !value.includes("&")) {
      return value;
    }
    const textarea = document.createElement("textarea");
    textarea.innerHTML = value;
    return textarea.value;
  }

  static get toolbox() {
    return {
      title: "Content Cards",
      icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="5" height="7" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/><rect x="8.5" y="2" width="5" height="7" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/><rect x="15" y="2" width="3" height="7" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/><rect x="2" y="11" width="5" height="7" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/><rect x="8.5" y="11" width="5" height="7" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>',
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  constructor({
    data,
    api,
    block,
    config,
  }: BlockToolConstructorOptions<ContentCardsBlockData> & {
    config?: { imageUploadHandler?: (file: File) => Promise<string> };
  }) {
    this.data = {
      cards: data?.cards || [
        { icon: "", iconAltText: "", heading: "", description: "" },
        { icon: "", iconAltText: "", heading: "", description: "" },
      ],
      cardsPerRow: data?.cardsPerRow || 3,
    };

    this.api = api;
    this.block = block;

    const blockConfig = config as
      | { imageUploadHandler?: (file: File) => Promise<string> }
      | undefined;
    if (blockConfig?.imageUploadHandler) {
      this.imageUploadHandler = blockConfig.imageUploadHandler;
    }
  }

  private notifyChange() {
    if (this.block && typeof this.block.dispatchChange === "function") {
      this.block.dispatchChange();
      return;
    }
    if (!this.wrapper) return;
    const blockApi = this.api.blocks.getBlockByElement(this.wrapper);
    if (blockApi) {
      void this.api.blocks.update(blockApi.id, this.data);
    }
  }

  render(): HTMLElement {
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("content-cards-block");
    this.wrapper.style.cssText = "padding: 15px; margin: 10px 0;";

    // Settings section
    const settingsSection = this.createSettingsSection();

    // Cards container
    this.cardsContainer = document.createElement("div");
    this.cardsContainer.className = "cards-container";
    this.cardsContainer.style.cssText = "margin-top: 20px;";

    // Add card button
    const addCardButton = document.createElement("button");
    addCardButton.textContent = "+ Add Card";
    addCardButton.type = "button";
    addCardButton.style.cssText =
      "padding: 8px 16px; background: #262277ff; color: white; border: none; border-radius: 4px; font-size: 14px; cursor: pointer; margin-top: 15px;";
    addCardButton.addEventListener("click", () => {
      this.addCard();
    });

    this.wrapper.appendChild(settingsSection);
    this.wrapper.appendChild(this.cardsContainer);
    this.wrapper.appendChild(addCardButton);

    this.renderCards();

    return this.wrapper;
  }

  private createSettingsSection(): HTMLElement {
    const settingsSection = document.createElement("div");
    settingsSection.style.cssText =
      "padding: 12px; background: #f5f5f5; border-radius: 4px; margin-bottom: 15px;";

    const label = document.createElement("label");
    label.textContent = "Cards per row:";
    label.style.cssText =
      "display: inline-block; font-size: 13px; font-weight: 500; margin-right: 10px;";

    this.cardsPerRowInput = document.createElement("input");
    this.cardsPerRowInput.type = "number";
    this.cardsPerRowInput.min = "2";
    this.cardsPerRowInput.max = "5";
    this.cardsPerRowInput.value = this.data.cardsPerRow.toString();
    this.cardsPerRowInput.style.cssText =
      "width: 60px; padding: 6px 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;";
    this.cardsPerRowInput.addEventListener("input", () => {
      let value = parseInt(this.cardsPerRowInput?.value || "3");
      if (value < 2) value = 2;
      if (value > 5) value = 5;
      this.data.cardsPerRow = value;
      if (this.cardsPerRowInput) {
        this.cardsPerRowInput.value = value.toString();
      }
      this.notifyChange();
    });

    const hint = document.createElement("span");
    hint.textContent = "(Min: 2, Max: 5)";
    hint.style.cssText =
      "font-size: 11px; color: #666; margin-left: 8px; font-style: italic;";

    settingsSection.appendChild(label);
    settingsSection.appendChild(this.cardsPerRowInput);
    settingsSection.appendChild(hint);

    return settingsSection;
  }

  private renderCards() {
    if (!this.cardsContainer) return;

    this.cardsContainer.innerHTML = "";

    this.data.cards.forEach((card, index) => {
      const cardElement = this.createCardElement(card, index);
      this.cardsContainer?.appendChild(cardElement);
    });

    if (this.data.cards.length === 0) {
      const emptyMessage = document.createElement("p");
      emptyMessage.textContent =
        "No cards added yet. Click 'Add Card' to start.";
      emptyMessage.style.cssText =
        "color: #999; font-size: 13px; font-style: italic; padding: 20px; text-align: center;";
      this.cardsContainer.appendChild(emptyMessage);
    }
  }

  private createCardElement(
    card: { icon: string; iconAltText?: string; heading: string; description: string },
    index: number
  ): HTMLElement {
    const decodedHeading = this.decodeHtmlEntities(card.heading);
    const decodedDescription = this.decodeHtmlEntities(card.description);
    if (decodedHeading !== card.heading) {
      this.data.cards[index].heading = decodedHeading;
      card.heading = decodedHeading;
    }
    if (decodedDescription !== card.description) {
      this.data.cards[index].description = decodedDescription;
      card.description = decodedDescription;
    }
    const cardWrapper = document.createElement("div");
    cardWrapper.className = "card-item";
    cardWrapper.style.cssText =
      "border: 2px solid #e5e7eb; border-radius: 8px; padding: 15px; margin-bottom: 15px; background: white;";

    // Card header with delete button
    const cardHeader = document.createElement("div");
    cardHeader.style.cssText =
      "display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;";

    const cardTitle = document.createElement("h4");
    cardTitle.textContent = `Card ${index + 1}`;
    cardTitle.style.cssText = "font-size: 14px; font-weight: 600; margin: 0;";

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.type = "button";
    deleteButton.style.cssText =
      "padding: 4px 10px; background: #ef4444; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer;";
    deleteButton.addEventListener("click", () => {
      this.deleteCard(index);
    });

    cardHeader.appendChild(cardTitle);
    cardHeader.appendChild(deleteButton);

    // Icon section
    const iconSection = this.createIconSection(card, index);

    // Heading input
    const headingLabel = document.createElement("label");
    headingLabel.textContent = "Heading:";
    headingLabel.style.cssText =
      "display: block; font-size: 12px; font-weight: 500; margin-top: 12px; margin-bottom: 4px;";

    const headingInput = document.createElement("input");
    headingInput.type = "text";
    headingInput.value = card.heading;
    headingInput.placeholder = "Enter card heading";
    headingInput.style.cssText =
      "width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;";
    headingInput.addEventListener("input", () => {
      this.data.cards[index].heading = headingInput.value;
      this.notifyChange();
    });

    // Description textarea
    const descriptionLabel = document.createElement("label");
    descriptionLabel.textContent = "Description:";
    descriptionLabel.style.cssText =
      "display: block; font-size: 12px; font-weight: 500; margin-top: 12px; margin-bottom: 4px;";

    const descriptionTextarea = document.createElement("textarea");
    descriptionTextarea.value = card.description;
    descriptionTextarea.placeholder = "Enter card description";
    descriptionTextarea.rows = 3;
    descriptionTextarea.style.cssText =
      "width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; resize: vertical; font-family: inherit;";
    descriptionTextarea.addEventListener("input", () => {
      this.data.cards[index].description = descriptionTextarea.value;
      this.notifyChange();
    });

    cardWrapper.appendChild(cardHeader);
    cardWrapper.appendChild(iconSection);
    cardWrapper.appendChild(headingLabel);
    cardWrapper.appendChild(headingInput);
    cardWrapper.appendChild(descriptionLabel);
    cardWrapper.appendChild(descriptionTextarea);

    return cardWrapper;
  }

  private createIconSection(
    card: { icon: string; iconAltText?: string; heading: string; description: string },
    index: number
  ): HTMLElement {
    const decodedIcon = this.decodeHtmlEntities(card.icon);
    if (decodedIcon !== card.icon) {
      this.data.cards[index].icon = decodedIcon;
      card.icon = decodedIcon;
    }
    const iconSection = document.createElement("div");
    iconSection.style.cssText = "margin-top: 10px;";

    const iconLabel = document.createElement("label");
    iconLabel.textContent = "Icon:";
    iconLabel.style.cssText =
      "display: block; font-size: 12px; font-weight: 500; margin-bottom: 6px;";

    // Icon URL input
    const iconUrlInput = document.createElement("input");
    iconUrlInput.type = "text";
    iconUrlInput.value = card.icon;
    iconUrlInput.placeholder = "Icon URL or upload file below";
    iconUrlInput.style.cssText =
      "width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; margin-bottom: 8px;";
    iconUrlInput.addEventListener("input", () => {
      this.data.cards[index].icon = iconUrlInput.value;
      this.updateIconPreview(iconPreview, this.data.cards[index].icon, this.data.cards[index].iconAltText);
      this.notifyChange();
    });

    const iconAltLabel = document.createElement("label");
    iconAltLabel.textContent = "Icon alt text:";
    iconAltLabel.style.cssText =
      "display: block; font-size: 12px; font-weight: 500; margin-top: 6px; margin-bottom: 4px;";

    const iconAltInput = document.createElement("input");
    iconAltInput.type = "text";
    iconAltInput.value = card.iconAltText || "";
    iconAltInput.placeholder = "Alt text for icon (optional)";
    iconAltInput.style.cssText =
      "width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; margin-bottom: 8px;";
    iconAltInput.addEventListener("input", () => {
      this.data.cards[index].iconAltText = iconAltInput.value;
      this.updateIconPreview(iconPreview, this.data.cards[index].icon, this.data.cards[index].iconAltText);
      this.notifyChange();
    });

    // File upload input
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.style.cssText =
      "width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px; font-size: 13px; margin-bottom: 10px;";
    fileInput.addEventListener("change", async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && this.imageUploadHandler) {
        try {
          const url = await this.imageUploadHandler(file);
          this.data.cards[index].icon = url;
          iconUrlInput.value = url;
          this.updateIconPreview(iconPreview, url, this.data.cards[index].iconAltText);
          this.notifyChange();
        } catch (error) {
          console.error("Icon upload failed:", error);
          alert("Icon upload failed. Please try again or use a URL.");
        }
      } else if (file) {
        const url = URL.createObjectURL(file);
        this.data.cards[index].icon = url;
        iconUrlInput.value = url;
        this.updateIconPreview(iconPreview, url, this.data.cards[index].iconAltText);
        this.notifyChange();
      }
    });

    // Icon preview
    const iconPreview = document.createElement("div");
    iconPreview.className = "icon-preview";
    iconPreview.style.cssText =
      "margin-top: 8px; padding: 10px; border: 1px dashed #ddd; border-radius: 4px; background: #fafafa; text-align: center;";

    iconSection.appendChild(iconLabel);
    iconSection.appendChild(iconUrlInput);
    iconSection.appendChild(iconAltLabel);
    iconSection.appendChild(iconAltInput);
    iconSection.appendChild(fileInput);
    iconSection.appendChild(iconPreview);

    this.updateIconPreview(iconPreview, card.icon, card.iconAltText);

    return iconSection;
  }

  private updateIconPreview(
    previewElement: HTMLElement,
    iconUrl: string,
    iconAltText?: string
  ) {
    if (!iconUrl) {
      previewElement.innerHTML =
        '<span style="color: #999; font-size: 12px;">No icon uploaded</span>';
      return;
    }

    previewElement.innerHTML = `
      <img 
        src="${iconUrl}" 
        alt="${iconAltText || "Icon preview"}" 
        style="width: 60px; height: 60px; object-fit: contain; display: inline-block;"
        onerror="this.parentElement.innerHTML='<span style=\\'color: red; font-size: 12px;\\'>Invalid icon URL</span>';"
      />
    `;
  }

  private addCard() {
    this.data.cards.push({
      icon: "",
      iconAltText: "",
      heading: "",
      description: "",
    });
    this.renderCards();
    this.notifyChange();

    // Scroll to the new card
    setTimeout(() => {
      const newCard = this.cardsContainer?.lastElementChild as HTMLElement;
      if (newCard) {
        newCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 100);
  }

  private deleteCard(index: number) {
    // Minimum 2 cards requirement check karna
    if (this.data.cards.length <= 2) {
      alert("Minimum 2 cards required!");
      return;
    }

    this.data.cards.splice(index, 1);
    this.renderCards();
    this.notifyChange();
  }

  save(): ContentCardsBlockData {
    return {
      cards: this.data.cards.map((card) => ({
        icon: card.icon,
        iconAltText: card.iconAltText || "",
        heading: card.heading,
        description: card.description,
      })),
      cardsPerRow: this.data.cardsPerRow,
    };
  }

  static get sanitize() {
    return {
      cards: {},
      cardsPerRow: {},
    };
  }
}
