"use client";

import React, { useState } from "react";
import type { OutputData } from "@editorjs/editorjs";
import Image from "next/image";

function normalizeUrl(url?: string): string {
  if (!url) return "";
  if (url.startsWith("/")) {
    return url;
  }
  if (url.startsWith("#")) {
    return url;
  }
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `https://${url}`;
}

// ✅ Helper function to extract text-align from HTML
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
      return { textAlign: textAlignMatch[1].trim() as any };
    }
  }
  return {};
}

const WORD_LIMIT1 = 60;
const WORD_LIMIT2 = 20;

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
}: {
  html: string;
  className?: string;
  style?: React.CSSProperties;
  wordLimit?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const text = stripHtml(html || "");
  const words = text.length > 0 ? text.split(" ") : [];
  const isLong = words.length > wordLimit;
  const preview = isLong ? `${words.slice(0, wordLimit).join(" ")}...` : text;

  return (
    <div className={className} style={style}>
      {expanded || !isLong ? (
        <span dangerouslySetInnerHTML={{ __html: html || "" }} />
      ) : (
        <span>{preview}</span>
      )}
      {isLong && (
        <button
          type="button"
          className="ml-2 text-sm text-purple-600 hover:text-purple-700"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
}

function ReadMoreText({
  text,
  className,
  style,
  wordLimit = WORD_LIMIT1,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  wordLimit?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const words = text ? text.split(/\s+/) : [];
  const isLong = words.length > wordLimit;
  const preview = isLong ? `${words.slice(0, wordLimit).join(" ")}...` : text;

  return (
    <div className={className} style={style}>
      <span>{expanded || !isLong ? text : preview}</span>
      {isLong && (
        <button
          type="button"
          className="ml-2 text-sm text-purple-600 hover:text-purple-700"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Read less" : "Read more"}
        </button>
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
}

export function EditorJsRenderer({
  data,
  theme = "light",
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
    <div className={containerClass}>
      <div className="max-w-6xl mx-auto p-4">
        <article className={contentClass}>
          {data.blocks.map((block, index) => (
            <React.Fragment key={block.id || index}>
              {renderBlock(block, theme)}
            </React.Fragment>
          ))}
        </article>
      </div>
    </div>
  );
}

function renderBlock(
  block: OutputData["blocks"][0],
  theme: "light" | "dark"
): React.ReactNode {
  const textColor = theme === "dark" ? "text-slate-300" : "text-slate-700";
  const headingColor = theme === "dark" ? "text-slate-50" : "text-slate-900";
  const cardBg = theme === "dark" ? "bg-slate-900" : "bg-white";
  const borderColor =
    theme === "dark" ? "border-slate-800" : "border-slate-200";

  switch (block.type) {
    case "paragraph":
      const paragraphAlign = getBlockAlignment(block, block.data.text);

      return (
        <ReadMoreHtml
          key={block.id}
          className={`mb-5 text-base leading-relaxed ${textColor}`}
          style={paragraphAlign} // ✅ Apply alignment
          html={block.data.text || ""}
        />
      );

    case "header":
      const level = block.data.level || 2;
      const headerAlign = getBlockAlignment(block, block.data.text);

      const headerSizes = {
        1: "text-4xl md:text-5xl mb-6 mt-12 leading-tight",
        2: "text-3xl md:text-4xl mb-5 mt-10 leading-tight",
        3: "text-2xl md:text-3xl mb-4 mt-8 leading-snug",
        4: "text-xl md:text-2xl mb-4 mt-7 leading-snug",
        5: "text-lg md:text-xl mb-3 mt-6 leading-snug",
        6: "text-base md:text-lg mb-3 mt-5 leading-snug",
      };

      const headerProps = {
        className: `font-semibold ${headingColor} ${
          headerSizes[level as keyof typeof headerSizes] || headerSizes[2]
        } tracking-tight`,
        style: headerAlign, // ✅ Apply alignment
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

      // ✅ Extract alignment from tune or first list item (if any)
      const firstItem = block.data.items?.[0] || "";
      const listAlign = getBlockAlignment(block, firstItem);

      return (
        <ListTag
          key={block.id}
          className={`mb-5 pl-6 space-y-2 ${listClass} ${textColor} text-base marker:text-slate-400`}
          style={listAlign} // ✅ Apply alignment
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
                      // ✅ Extract alignment for each cell
                      const cellAlign = extractTextAlign(cell);

                      return (
                        <td
                          key={cellIdx}
                          className={`px-4 py-3 text-sm ${
                            rowIdx === 0 ? "font-medium" : ""
                          } ${textColor}`}
                          style={cellAlign} // ✅ Apply alignment
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

      const columnsData = block.data as {
        leftContent?: string;
        rightContent?: string;
        layout?: "50-50" | "33-67" | "67-33";
      };

      const gridCols =
        columnsData.layout === "33-67"
          ? "grid-cols-1 md:grid-cols-[1fr_2fr]"
          : columnsData.layout === "67-33"
          ? "grid-cols-1 md:grid-cols-[2fr_1fr]"
          : "grid-cols-1 md:grid-cols-2";

      return (
        <div
          key={block.id}
          className={`mb-8 grid ${gridCols} gap-6 rounded-lg ${cardBg} border ${borderColor} p-6`}
        >
          <div
            className={`${textColor} text-2xl leading-relaxed`}
            dangerouslySetInnerHTML={{ __html: columnsData.leftContent || "" }}
          />
          <div
            className={`${textColor} text-base leading-relaxed`}
            dangerouslySetInnerHTML={{ __html: columnsData.rightContent || "" }}
          />
        </div>
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
      const columnBgClass =
        columnData.imagePosition === "left"
          ? "bg-gradient-to-b from-[#F7F2F7] via-[#EFE4EF] to-white"
          : "bg-white";
      const isLeftAligned = columnData.imagePosition === "left";
      const youtubeId = columnData.youtubeUrl
        ? extractVideoId(columnData.youtubeUrl)
        : null;

      const columnContent = (
        <div
          className={`mb-8 flex flex-col ${flexDirection} gap-8 items-center ${columnBgClass} rounded-lg py-8`}
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
        return <div key={block.id}>{columnContent}</div>;
      }

      return (
        <div
          key={block.id}
          className="relative left-1/2 right-1/2 w-screen -ml-[50vw] -mr-[50vw] bg-gradient-to-b from-[#F7F2F7] via-[#EFE4EF] to-white"
        >
          <div className="max-w-6xl mx-auto px-6">{columnContent}</div>
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

    default:
      return null;
  }
}
