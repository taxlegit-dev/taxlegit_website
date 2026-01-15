export default class CustomLinkInlineTool {
  static get isInline() {
    return true;
  }

  static get title() {
    return "Link";
  }

  static get sanitize() {
    return {
      a: {
        href: true,
        target: true,
        rel: true,
      },
    };
  }

  private api: any;
  private button!: HTMLButtonElement;

  private actionsWrapper!: HTMLDivElement;
  private input!: HTMLInputElement;
  private checkboxWrapper!: HTMLLabelElement;
  private checkbox!: HTMLInputElement;

  private range: Range | null = null;

  constructor({ api }: any) {
    this.api = api;
  }

  render() {
    this.button = document.createElement("button");
    this.button.type = "button";
    this.button.innerHTML = "Link";
    this.button.classList.add(this.api.styles.inlineToolButton);
    return this.button;
  }

  // ✅ This creates the UI panel under toolbar
  renderActions() {
    this.actionsWrapper = document.createElement("div");
    this.actionsWrapper.style.display = "flex";
    this.actionsWrapper.style.flexDirection = "column";
    this.actionsWrapper.style.gap = "10px";
    this.actionsWrapper.style.padding = "10px";
    this.actionsWrapper.style.width = "260px";

    // input
    this.input = document.createElement("input");
    this.input.type = "text";
    this.input.placeholder = "Add a link";
    this.input.className = "cdx-input";

    // checkbox wrapper
    this.checkboxWrapper = document.createElement("label");
    this.checkboxWrapper.style.display = "none"; // hidden until url entered
    this.checkboxWrapper.style.gap = "8px";
    this.checkboxWrapper.style.alignItems = "center";

    this.checkbox = document.createElement("input");
    this.checkbox.type = "checkbox";

    const checkboxText = document.createElement("span");
    checkboxText.innerText = "Open in new tab";

    this.checkboxWrapper.appendChild(this.checkbox);
    this.checkboxWrapper.appendChild(checkboxText);

    // show checkbox only when url exists
    this.input.addEventListener("input", () => {
      if (this.input.value.trim()) {
        this.checkboxWrapper.style.display = "flex";
      } else {
        this.checkboxWrapper.style.display = "none";
        this.checkbox.checked = false;
      }
    });

    // apply link on enter
    this.input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.applyLink();
      }
    });

    this.actionsWrapper.appendChild(this.input);
    this.actionsWrapper.appendChild(this.checkboxWrapper);

    return this.actionsWrapper;
  }

  surround(range: Range) {
    if (!range || range.collapsed) return;
    this.range = range;

    const existing = this.api.selection.findParentTag("A");
    if (existing) {
      this.unwrap(existing);
      return;
    }
  }

  showActions() {
    setTimeout(() => {
      this.input?.focus();
    }, 50);
  }

  hideActions() {
    this.input.value = "";
    this.checkbox.checked = false;
    this.checkboxWrapper.style.display = "none";
  }

  private applyLink() {
    const url = this.input.value.trim();
    if (!url || !this.range) return;

    const a = document.createElement("a");
    a.href = url;

    if (this.checkbox.checked) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
    // Note: Link behavior is handled by the document-level event listener in the editor

    a.appendChild(this.range.extractContents());
    this.range.insertNode(a);

    this.api.inlineToolbar.close();
  }

  private unwrap(link: HTMLElement) {
    const range = document.createRange();
    range.selectNodeContents(link);
    const content = range.extractContents();
    link.parentNode?.replaceChild(content, link);
  }

  checkState() {
    const link = this.api.selection.findParentTag("A");
    this.button.classList.toggle(
      this.api.styles.inlineToolButtonActive,
      !!link
    );
  }
}
