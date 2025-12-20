import type { API, BlockAPI, BlockTune } from "@editorjs/editorjs";

type Alignment = "left" | "center" | "right" | "justify";

type TextAlignTuneData = {
  alignment?: Alignment;
};

export default class TextAlignTune implements BlockTune {
  private block: BlockAPI;
  private data: TextAlignTuneData;

  static get isTune() {
    return true;
  }

  constructor({
    api,
    block,
    data,
  }: {
    api: API;
    block: BlockAPI;
    data?: TextAlignTuneData;
  }) {
    void api;
    this.block = block;
    this.data = data || {};

    if (this.data.alignment) {
      this.applyAlignment(this.data.alignment);
    }
  }

  render() {
    const alignments: { title: string; value: Alignment }[] = [
      { title: "Align left", value: "left" },
      { title: "Align center", value: "center" },
      { title: "Align right", value: "right" },
      { title: "Align justify", value: "justify" },
    ];

    return alignments.map((alignment) => ({
      title: alignment.title,
      onActivate: () => this.setAlignment(alignment.value),
    }));
  }

  save() {
    return this.data;
  }

  private setAlignment(alignment: Alignment) {
    this.data = { alignment };
    this.applyAlignment(alignment);
    this.block.dispatchChange();
  }

  private applyAlignment(alignment: Alignment) {
    if (!this.block.holder) {
      return;
    }

    const content =
      (this.block.holder.querySelector(".ce-block__content") as HTMLElement) ||
      this.block.holder;
    if (content) {
      content.style.textAlign = alignment;
    }
  }
}
