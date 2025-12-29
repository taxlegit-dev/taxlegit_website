"use client";

import React, { useId } from "react";
import type { OutputData } from "@editorjs/editorjs";
import Image from "next/image";

type ClampStyle = React.CSSProperties & { ["--clamp-lines"]?: number };

function normalizeUrl(url?: string): string {
  if (!url) return "";
  if (url.startsWith("/")) {
    return url;
  }
  if (url.startsWith("#")) {
    return url;
  }
  if (url.startsWith("data:") || url.startsWith("blob:")) {
    return url;
  }
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `https://${url}`;
}

// Helper function to extract text-align from HTML
function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }
  return null;
}

function extractTextAlign(html?: string): React.CSSProperties {
  if (!html) return {};

  const styleMatch = html.match(/style="([^"]*)"/);
  if (styleMatch) {
    const textAlignMatch = styleMatch[1].match(/text-align:\s*([^;]+)/);
    if (textAlignMatch) {
      return {
        textAlign: textAlignMatch[1].trim() as React.CSSProperties["textAlign"],
      };
    }
  }
  return {};
}

const WORD_LIMIT1 = 90;
const WORD_LIMIT2 = 20;
const DEFAULT_CLAMP_LINES = 4;
const SHORT_CLAMP_LINES = 2;

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function ReadMoreHtml({
  html,
  className,
  style,
  wordLimit = WORD_LIMIT1,
  clampLines,
}: {
  html: string;
  className?: string;
  style?: React.CSSProperties;
  wordLimit?: number;
  clampLines?: number;
}) {
  const contentId = useId();
  const contentSpanId = `${contentId}-content`;
  const text = stripHtml(html || "");
  const words = text.length > 0 ? text.split(" ") : [];
  const isLong = words.length > wordLimit;
  const resolvedClampLines =
    clampLines ??
    (wordLimit <= WORD_LIMIT2 ? SHORT_CLAMP_LINES : DEFAULT_CLAMP_LINES);
  const wrapperStyle: ClampStyle = {
    ...style,
    ["--clamp-lines"]: resolvedClampLines,
  };

  return (
    <div className={className} style={wrapperStyle}>
      {isLong && (
        <input
          id={contentId}
          type="checkbox"
          className="read-more-toggle sr-only"
          aria-controls={contentSpanId}
        />
      )}
      <span
        id={contentSpanId}
        className={isLong ? "read-more-content" : undefined}
        dangerouslySetInnerHTML={{ __html: html || "" }}
      />
      {isLong && (
        <label
          htmlFor={contentId}
          className="read-more-button block mx-auto  text-lg text-purple-600 hover:text-purple-700 cursor-pointer underline text-center"
        >
          <span className="read-more-label-collapsed">Read more</span>
          <span className="read-more-label-expanded">Read less</span>
        </label>
      )}
    </div>
  );
}

function ReadMoreText({
  text,
  className,
  style,
  wordLimit = WORD_LIMIT1,
  clampLines,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  wordLimit?: number;
  clampLines?: number;
}) {
  const contentId = useId();
  const contentSpanId = `${contentId}-content`;
  const words = text ? text.split(/\s+/) : [];
  const isLong = words.length > wordLimit;
  const resolvedClampLines =
    clampLines ??
    (wordLimit <= WORD_LIMIT2 ? SHORT_CLAMP_LINES : DEFAULT_CLAMP_LINES);
  const wrapperStyle: ClampStyle = {
    ...style,
    ["--clamp-lines"]: resolvedClampLines,
  };

  return (
    <div className={className} style={wrapperStyle}>
      {isLong && (
        <input
          id={contentId}
          type="checkbox"
          className="read-more-toggle sr-only"
          aria-controls={contentSpanId}
        />
      )}
      <span
        id={contentSpanId}
        className={isLong ? "read-more-content" : undefined}
      >
        {text}
      </span>
      {isLong && (
        <label
          htmlFor={contentId}
          className="read-more-button ml-2 text-sm text-purple-600 hover:text-purple-700 cursor-pointer"
        >
          <span className="read-more-label-collapsed">Read more</span>
          <span className="read-more-label-expanded">Read less</span>
        </label>
      )}
    </div>
  );
}

function getBlockAlignment(
  block: OutputData["blocks"][0],
  html?: string
): React.CSSProperties {
  const tunes = (
    block as { tunes?: { textAlignTune?: { alignment?: string } } }
  ).tunes;
  const tuneAlignment = tunes?.textAlignTune?.alignment;
  if (tuneAlignment) {
    return { textAlign: tuneAlignment as React.CSSProperties["textAlign"] };
  }
  return extractTextAlign(html);
}

interface EditorJsRendererProps {
  data: OutputData;
  theme?: "light" | "dark";
  fullBleedColumns?: boolean;
}

export function EditorJsRenderer({
  data,
  theme = "light",
  fullBleedColumns = true,
}: EditorJsRendererProps) {
  if (!data?.blocks || data.blocks.length === 0) {
    return null;
  }

  const containerClass =
    theme === "dark" ? "bg-slate-950 min-h-screen" : "bg-white min-h-screen";

  const contentClass =
    theme === "dark"
      ? "prose prose-invert prose-slate max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-purple-400 prose-a:no-underline hover:prose-a:text-purple-300 prose-a:transition-colors prose-strong:text-slate-100 prose-strong:font-semibold prose-code:text-purple-400 prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded"
      : "prose prose-slate max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-purple-600 prose-a:no-underline hover:prose-a:text-purple-700 prose-a:transition-colors prose-strong:text-slate-900 prose-strong:font-semibold prose-code:text-purple-600 prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded";

  return (
    <>
      <div className={containerClass}>
        <div className="max-w-6xl mx-auto p-4">
          <article className={contentClass}>
            {data.blocks.map((block, index) => (
              <React.Fragment key={block.id || index}>
                {renderBlock(block, theme, fullBleedColumns)}
              </React.Fragment>
            ))}
          </article>
        </div>
      </div>
      <style jsx global>{`
        .read-more-content {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: var(--clamp-lines, 4);
          overflow: hidden;
        }
        .read-more-toggle:checked ~ .read-more-content {
          display: block;
          -webkit-line-clamp: unset;
          overflow: visible;
        }
        .read-more-label-expanded {
          display: none;
        }
        .read-more-toggle:focus-visible ~ .read-more-button {
          outline: 2px solid #a855f7;
          outline-offset: 2px;
          border-radius: 0.375rem;
        }
        .read-more-toggle:checked
          ~ .read-more-button
          .read-more-label-collapsed {
          display: none;
        }
        .read-more-toggle:checked
          ~ .read-more-button
          .read-more-label-expanded {
          display: inline;
        }
      `}</style>
    </>
  );
}

function renderBlock(
  block: OutputData["blocks"][0],
  theme: "light" | "dark",
  fullBleedColumns: boolean
): React.ReactNode {
  const textColor = theme === "dark" ? "text-slate-300" : "text-slate-700";
  const headingColor = theme === "dark" ? "text-slate-50" : "text-slate-800";
  const cardBg = theme === "dark" ? "bg-slate-900" : "bg-white";
  const borderColor =
    theme === "dark" ? "border-slate-800" : "border-slate-200";

  switch (block.type) {
    case "paragraph":
      const paragraphAlign = getBlockAlignment(block, block.data.text);

      return (
        <ReadMoreHtml
          key={block.id}
          className={`mb-5 text-[18px] font-[Calibri]  ${textColor}`}
          style={paragraphAlign} // Apply alignment
          html={block.data.text || ""}
        />
      );

    case "header":
      const level = block.data.level || 2;
      const headerAlign = getBlockAlignment(block, block.data.text);

      const headerSizes = {
        1: "text-3xl md:text-[42px] py-3  ",
        2: "text-2xl md:text-[34px] py-3 ",
        3: "text-xl md:text-[28px] py-3 ",
        4: "text-lg md:text-[24px] py-3 ",
        5: "text-base md:text-[20px] py-3 ",
        6: "text-sm md:text-[16px] py-3 ",
      };

      const headerProps = {
        className: `font-[PTSerif] font-semibold ${headingColor} ${
          headerSizes[level as keyof typeof headerSizes] || headerSizes[2]
        } `,
        style: headerAlign, // Apply alignment
        dangerouslySetInnerHTML: { __html: block.data.text || "" },
      };

      switch (level) {
        case 1:
          return <h1 key={block.id} {...headerProps} />;
        case 2:
          return <h2 key={block.id} {...headerProps} />;
        case 3:
          return <h3 key={block.id} {...headerProps} />;
        case 4:
          return <h4 key={block.id} {...headerProps} />;
        case 5:
          return <h5 key={block.id} {...headerProps} />;
        case 6:
          return <h6 key={block.id} {...headerProps} />;
        default:
          return <h2 key={block.id} {...headerProps} />;
      }

    case "list":
      const ListTag = block.data.style === "ordered" ? "ol" : "ul";
      const listClass =
        block.data.style === "ordered" ? "list-decimal" : "list-disc";

      // Extract alignment from tune or first list item (if any)
      const firstItem = block.data.items?.[0] || "";
      const listAlign = getBlockAlignment(block, firstItem);

      return (
        <ListTag
          key={block.id}
          className={`mb-5 pl-6 space-y-2 ${listClass} ${textColor} text-base marker:text-slate-400`}
          style={listAlign} // Apply alignment
        >
          {block.data.items?.map((item: string, idx: number) => (
            <li
              key={idx}
              className="leading-relaxed pl-1"
              dangerouslySetInnerHTML={{ __html: item }}
            />
          ))}
        </ListTag>
      );

    case "table":
      const tableAlign = getBlockAlignment(block);
      return (
        <div
          key={block.id}
          className="mb-8 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800"
        >
          <div className="overflow-x-auto">
            <table
              className={`min-w-full divide-y ${
                theme === "dark" ? "divide-slate-800" : "divide-slate-200"
              }`}
              style={tableAlign}
            >
              <tbody
                className={
                  theme === "dark"
                    ? "divide-y divide-slate-800"
                    : "divide-y divide-slate-200"
                }
              >
                {block.data.content?.map((row: string[], rowIdx: number) => (
                  <tr
                    key={rowIdx}
                    className={`${
                      rowIdx === 0
                        ? theme === "dark"
                          ? "bg-slate-900"
                          : "bg-slate-50"
                        : theme === "dark"
                        ? "bg-slate-950"
                        : "bg-white"
                    }`}
                  >
                    {row.map((cell: string, cellIdx: number) => {
                      // Extract alignment for each cell
                      const cellAlign = extractTextAlign(cell);

                      return (
                        <td
                          key={cellIdx}
                          className={`px-4 py-3 text-sm ${
                            rowIdx === 0 ? "font-medium" : ""
                          } ${textColor}`}
                          style={cellAlign} // Apply alignment
                          dangerouslySetInnerHTML={{ __html: cell }}
                        />
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

    case "image":
      const imageData = block.data as {
        file?: { url?: string };
        url?: string;
        caption?: string;
        width?: number;
        alignment?: "left" | "center" | "right";
        withBorder?: boolean;
        withBackground?: boolean;
        stretched?: boolean;
      };

      const tuneData = block.tunes?.imageLink as { url?: string } | undefined;
      const linkUrl = tuneData?.url;

      const imageUrl = imageData.file?.url || imageData.url || "";
      if (!imageUrl) return null;

      const alignmentClass =
        imageData.alignment === "left"
          ? "float-left mr-6 mb-4"
          : imageData.alignment === "right"
          ? "float-right ml-6 mb-4"
          : "mx-auto";

      const containerClass = imageData.stretched
        ? "w-full"
        : imageData.alignment === "center" || !imageData.alignment
        ? "flex justify-center"
        : "";

      const imageElement = (
        <div
          className={`relative ${containerClass} ${
            imageData.stretched ? "" : "max-w-3xl"
          } mb-8 overflow-hidden rounded-lg`}
        >
          <Image
            src={imageUrl}
            alt={imageData.caption || ""}
            width={1200}
            height={800}
            unoptimized
            className={`${
              imageData.stretched ? "w-full" : "w-full max-w-full"
            } ${imageData.withBorder ? `border ${borderColor}` : ""} ${
              imageData.withBackground
                ? theme === "dark"
                  ? "bg-slate-900 p-3"
                  : "bg-slate-100 p-3"
                : ""
            }`}
            style={{
              objectFit: "cover",
            }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
        </div>
      );

      return (
        <figure
          key={block.id}
          className={`mb-8 ${alignmentClass} ${
            imageData.stretched ? "w-full" : ""
          }`}
        >
          {linkUrl ? (
            <a
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              {imageElement}
            </a>
          ) : (
            imageElement
          )}
          {imageData.caption && (
            <figcaption
              className={`text-sm text-center mt-3 ${
                theme === "dark" ? "text-slate-400" : "text-slate-600"
              }`}
            >
              {imageData.caption}
            </figcaption>
          )}
        </figure>
      );

    case "youtube":
      const youtubeData = block.data as {
        url?: string;
        caption?: string;
      };

      if (!youtubeData.url) return null;

      const videoId = extractVideoId(youtubeData.url);
      if (!videoId) return null;

      const embedUrl = `https://www.youtube.com/embed/${videoId}`;

      return (
        <figure key={block.id} className="mb-8">
          <div
            className="relative w-full overflow-hidden rounded-lg"
            style={{ paddingBottom: "56.25%", height: 0 }}
          >
            <iframe
              src={embedUrl}
              className="absolute top-0 left-0 w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          {youtubeData.caption && (
            <figcaption
              className={`text-sm text-center mt-3 ${
                theme === "dark" ? "text-slate-400" : "text-slate-600"
              }`}
            >
              {youtubeData.caption}
            </figcaption>
          )}
        </figure>
      );

    /////
    case "column":
      const columnData = block.data as {
        imageUrl?: string;
        youtubeUrl?: string;
        imagePosition?: "left" | "right";
        heading?: string;
        description?: string;
        points?: string[];
        ctaText?: string;
        ctaUrl?: string;
      };

      const flexDirection =
        columnData.imagePosition === "right"
          ? "md:flex-row-reverse"
          : "md:flex-row";
      const isLeftAligned = columnData.imagePosition === "left";
      const columnBgClass = isLeftAligned ? "" : "bg-white";
      const youtubeId = columnData.youtubeUrl
        ? extractVideoId(columnData.youtubeUrl)
        : null;

      const columnContent = (
        <div
          className={`flex flex-col ${flexDirection} gap-8 items-center rounded-lg py-8`}
        >
          <div className="flex-1 min-w-0">
            {columnData.imageUrl && (
              <div className="overflow-hidden rounded-lg flex items-center justify-center">
                <Image
                  src={columnData.imageUrl}
                  alt={columnData.heading || "Column image"}
                  width={700}
                  height={600}
                  className="w-full max-h-full object-contain"
                  unoptimized
                />
              </div>
            )}
            {youtubeId && (
              <div className="mt-4 overflow-hidden rounded-lg">
                <div
                  className="relative w-full"
                  style={{ paddingBottom: "56.25%" }}
                >
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}`}
                    className="absolute inset-0 h-full w-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            {columnData.heading && (
              <h3 className={`text-3xl  mb-3 ${headingColor}`}>
                {columnData.heading}
              </h3>
            )}
            {columnData.description && (
              <ReadMoreText
                text={columnData.description}
                className={`mb-4 text-lg ${textColor}`}
                wordLimit={WORD_LIMIT2}
              />
            )}
            {columnData.points && columnData.points.length > 0 && (
              <ul className={`space-y-2 ${textColor}`}>
                {columnData.points.map((point, idx) => (
                  <li key={idx} className="flex items-start">
                    <span
                      className={`mr-2 mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full ${
                        theme === "dark" ? "bg-purple-400" : "bg-purple-600"
                      }`}
                    />
                    <span className="text-base leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            )}
            {columnData.ctaText && columnData.ctaUrl && (
              <div className="mt-5">
                <a
                  href={normalizeUrl(columnData.ctaUrl)}
                  className="inline-flex items-center justify-center rounded-lg px-8 lg:px-24 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#4b1b66] to-[#8b2bbd] hover:from-[#3f1655] hover:to-[#7a27a6]"
                >
                  {columnData.ctaText}
                </a>
              </div>
            )}
          </div>
        </div>
      );

      if (!isLeftAligned) {
        return (
          <div key={block.id} className={`mb-8 ${columnBgClass} rounded-lg`}>
            {columnContent}
          </div>
        );
      }

      if (!fullBleedColumns) {
        return (
          <div key={block.id} className={`mb-8 ${columnBgClass} rounded-lg`}>
            {columnContent}
          </div>
        );
      }

      return (
        <div
          key={block.id}
          className="relative left-1/2 right-1/2 w-screen -ml-[50vw] -mr-[50vw] bg-gradient-to-b from-[#F7F2F7] via-[#EFE4EF] to-white"
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-8">{columnContent}</div>
          </div>
        </div>
      );
    /////

    case "cta": {
      const {
        text,
        type,
        url,
        phone,
        message,
        align = "center",
      } = block.data as {
        text?: string;
        type?: "url" | "whatsapp";
        url?: string;
        phone?: string;
        message?: string;
        align?: "left" | "center" | "right";
      };

      if (!text) return null;

      const href =
        type === "whatsapp" && phone
          ? `https://wa.me/${phone}?text=${encodeURIComponent(message || "")}`
          : normalizeUrl(url);

      if (!href) return null;

      const alignmentClass =
        align === "left"
          ? "justify-start"
          : align === "right"
          ? "justify-end"
          : "justify-center";

      return (
        <div key={block.id} className={`my-8 flex ${alignmentClass}`}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-[#4b1b66] to-[#8b2bbd] hover:from-[#3f1655] hover:to-[#7a27a6] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-white"
          >
            {text}
          </a>
        </div>
      );
    }

    case "contentCards": {
      const cardsData = block.data as {
        cards?: Array<{
          icon?: string;
          heading?: string;
          description?: string;
        }>;
        cardsPerRow?: number;
      };

      const cards = cardsData.cards ?? [];
      if (cards.length === 0) return null;

      const perRow = Math.min(Math.max(cardsData.cardsPerRow ?? 3, 2), 5);
      const gridColsClass =
        perRow === 2
          ? "grid-cols-1 sm:grid-cols-2"
          : perRow === 3
          ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
          : perRow === 4
          ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5";

      return (
        <section key={block.id} className="py-5">
          <div className={`grid grid-cols-1 ${gridColsClass} gap-6`}>
            {cards.map((card, idx) => (
              <div
                key={idx}
                className={`rounded-xl border ${borderColor} ${cardBg} p-5 shadow-sm`}
                role="button"
                tabIndex={0}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
              >
                {card.icon && (
                  <div className="mb-4 flex justify-center">
                    <Image
                      src={normalizeUrl(card.icon)}
                      alt={card.heading || "Card icon"}
                      width={64}
                      height={64}
                      unoptimized
                      className="h-16 w-16 object-contain"
                    />
                  </div>
                )}
                {card.heading && (
                  <h3
                    className={`text-lg font-semibold text-center ${headingColor}`}
                  >
                    {card.heading}
                  </h3>
                )}
                {card.description && (
                  <p className={`mt-2 text-sm leading-relaxed  ${textColor}`}>
                    {card.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      );
    }

    default:
      return null;
  }
}
