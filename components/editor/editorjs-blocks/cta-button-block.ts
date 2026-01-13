type CTAData = {
  text: string;
  type: "url" | "whatsapp";
  url?: string;
  phone?: string;
  message?: string;
  align?: "left" | "center" | "right";
  target?: "_self" | "_blank";
};

export default class CTAButtonBlock {
  private block: import("@editorjs/editorjs").BlockAPI;
  private data: CTAData;
  private wrapper: HTMLElement;

  static get toolbox() {
    return {
      title: "CTA Button",
      icon: `<svg width="18" height="18" viewBox="0 0 24 24">
        <path d="M4 12h16M14 6l6 6-6 6"/>
      </svg>`,
    };
  }

  constructor({
    data,
    block,
  }: {
    data: CTAData;
    block: import("@editorjs/editorjs").BlockAPI;
  }) {
    this.block = block;
    this.data = {
      text: data?.text || "Click Here",
      type: data?.type || "url",
      url: data?.url || "",
      phone: data?.phone || "",
      message: data?.message || "",
      align: data?.align || "center",
      target: data?.target || "_blank",
    };

    this.wrapper = document.createElement("div");
  }

  render() {
    this.wrapper.className = "cta-block";

    this.wrapper.innerHTML = `
      <div class="cta-header">
        <div class="cta-title">CTA Button</div>
        <div class="cta-subtitle">Set label, destination and alignment</div>
      </div>

      <div class="cta-field">
        <input
          class="cta-input"
          placeholder="Button Text"
          value="${this.data.text}"
        />
      </div>

      <div class="cta-field">
        <select class="cta-select">
          <option value="url" ${
            this.data.type === "url" ? "selected" : ""
          }>Redirect URL</option>
          <option value="whatsapp" ${
            this.data.type === "whatsapp" ? "selected" : ""
          }>WhatsApp</option>
        </select>
      </div>

      <div class="cta-field">
        <select class="cta-align">
          <option value="left" ${
            this.data.align === "left" ? "selected" : ""
          }>Left</option>
          <option value="center" ${
            this.data.align === "center" ? "selected" : ""
          }>Center</option>
          <option value="right" ${
            this.data.align === "right" ? "selected" : ""
          }>Right</option>
        </select>
      </div>

      <div class="cta-field">
        <select class="cta-target">
          <option value="_self" ${
            this.data.target === "_self" ? "selected" : ""
          }>Same Tab</option>
          <option value="_blank" ${
            this.data.target === "_blank" ? "selected" : ""
          }>New Tab</option>
        </select>
      </div>

      <div class="cta-url-wrapper">
        <input
          class="cta-url"
          placeholder="https://example.com"
          value="${this.data.url || ""}"
        />
      </div>

      <div class="cta-whatsapp-wrapper">
        <input
          class="cta-phone"
          placeholder="WhatsApp Number (e.g. 919999999999)"
          value="${this.data.phone || ""}"
        />
        <input
          class="cta-message"
          placeholder="WhatsApp Message"
          value="${this.data.message || ""}"
        />
      </div>
    `;

    this.applyStyles();
    this.toggleFields();

    const typeSelect = this.wrapper.querySelector(
      ".cta-select"
    ) as HTMLSelectElement;

    typeSelect.addEventListener("change", (e) => {
      this.data.type = (e.target as HTMLSelectElement).value as
        | "url"
        | "whatsapp";
      this.toggleFields();
      this.notifyChange();
    });

    const alignSelect = this.wrapper.querySelector(
      ".cta-align"
    ) as HTMLSelectElement;
    alignSelect.addEventListener("change", (e) => {
      this.data.align = (e.target as HTMLSelectElement).value as
        | "left"
        | "center"
        | "right";
      this.notifyChange();
    });

    const targetSelect = this.wrapper.querySelector(
      ".cta-target"
    ) as HTMLSelectElement;
    targetSelect.addEventListener("change", (e) => {
      this.data.target = (e.target as HTMLSelectElement).value as
        | "_self"
        | "_blank";
      this.notifyChange();
    });

    const textInput = this.wrapper.querySelector(
      ".cta-input"
    ) as HTMLInputElement;
    textInput.addEventListener("input", (e) => {
      this.data.text = (e.target as HTMLInputElement).value;
      this.notifyChange();
    });

    const urlInput = this.wrapper.querySelector(
      ".cta-url"
    ) as HTMLInputElement;
    urlInput.addEventListener("input", (e) => {
      this.data.url = (e.target as HTMLInputElement).value;
      this.notifyChange();
    });

    const phoneInput = this.wrapper.querySelector(
      ".cta-phone"
    ) as HTMLInputElement;
    phoneInput.addEventListener("input", (e) => {
      this.data.phone = (e.target as HTMLInputElement).value;
      this.notifyChange();
    });

    const messageInput = this.wrapper.querySelector(
      ".cta-message"
    ) as HTMLInputElement;
    messageInput.addEventListener("input", (e) => {
      this.data.message = (e.target as HTMLInputElement).value;
      this.notifyChange();
    });

    return this.wrapper;
  }

  toggleFields() {
    const urlWrapper = this.wrapper.querySelector(
      ".cta-url-wrapper"
    ) as HTMLElement;

    const whatsappWrapper = this.wrapper.querySelector(
      ".cta-whatsapp-wrapper"
    ) as HTMLElement;

    if (this.data.type === "url") {
      urlWrapper.style.display = "block";
      whatsappWrapper.style.display = "none";
    } else {
      urlWrapper.style.display = "none";
      whatsappWrapper.style.display = "block";
    }
  }

  save(blockContent: HTMLElement): CTAData {
    const text = (blockContent.querySelector(".cta-input") as HTMLInputElement)
      ?.value;

    const type = (
      blockContent.querySelector(".cta-select") as HTMLSelectElement
    )?.value as "url" | "whatsapp";

    const align = (
      blockContent.querySelector(".cta-align") as HTMLSelectElement
    )?.value as "left" | "center" | "right";

    const target = (
      blockContent.querySelector(".cta-target") as HTMLSelectElement
    )?.value as "_self" | "_blank";

    const url = (blockContent.querySelector(".cta-url") as HTMLInputElement)
      ?.value;

    const phone = (blockContent.querySelector(".cta-phone") as HTMLInputElement)
      ?.value;

    const message = (
      blockContent.querySelector(".cta-message") as HTMLInputElement
    )?.value;

    return {
      text,
      type,
      url,
      phone,
      message,
      align,
      target,
    };
  }

  private notifyChange() {
    if (this.block && typeof this.block.dispatchChange === "function") {
      this.block.dispatchChange();
    }
  }

  private applyStyles() {
    this.wrapper.style.cssText = `
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 16px;
      background: #f8fafc;
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 580px;
    `;

    const header = this.wrapper.querySelector(".cta-header") as HTMLElement;
    if (header) {
      header.style.cssText =
        "display:flex; flex-direction:column; gap:4px; padding-bottom:4px; border-bottom:1px solid #e5e7eb;";
    }

    const title = this.wrapper.querySelector(".cta-title") as HTMLElement;
    if (title) {
      title.style.cssText =
        "font-size: 16px; font-weight: 700; color: #0f172a;";
    }

    const subtitle = this.wrapper.querySelector(".cta-subtitle") as HTMLElement;
    if (subtitle) {
      subtitle.style.cssText =
        "font-size: 13px; color: #475569; line-height: 1.4;";
    }

    const fieldBlocks = this.wrapper.querySelectorAll(
      ".cta-field, .cta-url-wrapper, .cta-whatsapp-wrapper"
    );
    fieldBlocks.forEach((el) => {
      (el as HTMLElement).style.cssText =
        "display:flex; flex-direction:column; gap:6px; width:100%;";
    });

    const inputs = this.wrapper.querySelectorAll<HTMLInputElement>(
      ".cta-input, .cta-url, .cta-phone, .cta-message"
    );
    inputs.forEach((input) => {
      input.style.cssText = `
        width: 100%;
        border: 1px solid #e5e7eb;
        border-radius: 10px;
        padding: 10px 12px;
        font-size: 14px;
        background: #ffffff;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
      `;
      input.addEventListener("focus", () => {
        input.style.borderColor = "#6366f1";
        input.style.boxShadow = "0 0 0 3px rgba(99, 102, 241, 0.15)";
      });
      input.addEventListener("blur", () => {
        input.style.borderColor = "#e5e7eb";
        input.style.boxShadow = "none";
      });
    });

    const selects = this.wrapper.querySelectorAll<HTMLSelectElement>(
      ".cta-select, .cta-align, .cta-target"
    );
    selects.forEach((select) => {
      select.style.cssText = `
        width: 100%;
        border: 1px solid #e5e7eb;
        border-radius: 10px;
        padding: 10px 12px;
        font-size: 14px;
        background: #ffffff;
        cursor: pointer;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
      `;
      select.addEventListener("focus", () => {
        select.style.borderColor = "#6366f1";
        select.style.boxShadow = "0 0 0 3px rgba(99, 102, 241, 0.15)";
      });
      select.addEventListener("blur", () => {
        select.style.borderColor = "#e5e7eb";
        select.style.boxShadow = "none";
      });
    });
  }
}
