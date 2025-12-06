"use client";

import React from "react";
import type { OutputData } from "@editorjs/editorjs";
import Image from "next/image";
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

  const baseClass =
    theme === "dark"
      ? "prose prose-invert prose-emerald max-w-none"
      : "prose prose-indigo max-w-none";

  return (
    <div className={baseClass}>
      {data.blocks.map((block, index) => (
        <React.Fragment key={block.id || index}>
          {renderBlock(block, theme)}
        </React.Fragment>
      ))}
    </div>
  );
}

function renderBlock(
  block: OutputData["blocks"][0],
  theme: "light" | "dark"
): React.ReactNode {
  const textColor = theme === "dark" ? "text-slate-200" : "text-zinc-600";
  const headingColor = theme === "dark" ? "text-white" : "text-zinc-900";

  switch (block.type) {
    case "paragraph":
      return (
        <div
          key={block.id}
          className={`mb-4 ${textColor}`}
          dangerouslySetInnerHTML={{ __html: block.data.text || "" }}
        />
      );

    case "header":
      const level = block.data.level || 2;
      const headerProps = {
        key: block.id,
        className: `mb-4 font-semibold ${headingColor}`,
        dangerouslySetInnerHTML: { __html: block.data.text || "" },
      };
      switch (level) {
        case 1:
          return <h1 {...headerProps} />;
        case 2:
          return <h2 {...headerProps} />;
        case 3:
          return <h3 {...headerProps} />;
        case 4:
          return <h4 {...headerProps} />;
        case 5:
          return <h5 {...headerProps} />;
        case 6:
          return <h6 {...headerProps} />;
        default:
          return <h2 {...headerProps} />;
      }

    case "list":
      const ListTag = block.data.style === "ordered" ? "ol" : "ul";
      const listClass =
        block.data.style === "ordered" ? "list-decimal" : "list-disc";
      return (
        <ListTag
          key={block.id}
          className={`mb-4 pl-6 ${listClass} ${textColor}`}
        >
          {block.data.items?.map((item: string, idx: number) => (
            <li
              key={idx}
              className="mb-1"
              dangerouslySetInnerHTML={{ __html: item }}
            />
          ))}
        </ListTag>
      );

    case "table":
      return (
        <div key={block.id} className="mb-4 overflow-x-auto">
          <table className="min-w-full border-collapse border border-slate-300">
            <tbody>
              {block.data.content?.map((row: string[], rowIdx: number) => (
                <tr key={rowIdx}>
                  {row.map((cell: string, cellIdx: number) => (
                    <td
                      key={cellIdx}
                      className={`border border-slate-300 px-4 py-2 ${textColor}`}
                      dangerouslySetInnerHTML={{ __html: cell }}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
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

      // Get link from tune data
      const tuneData = block.tunes?.imageLink as { url?: string } | undefined;
      const linkUrl = tuneData?.url;

      const imageUrl = imageData.file?.url || imageData.url || "";
      if (!imageUrl) return null;

      // Determine image alignment and styling
      const alignmentClass = imageData.alignment === "left" 
        ? "float-left mr-4" 
        : imageData.alignment === "right" 
        ? "float-right ml-4" 
        : "mx-auto";
      
      const containerClass = imageData.stretched 
        ? "w-full" 
        : imageData.alignment === "center" || !imageData.alignment
        ? "flex justify-center"
        : "";

      const imageElement = (
        <div className={`relative ${containerClass} ${imageData.stretched ? '' : 'max-w-4xl'} mb-4`}>
          <Image
            src={imageUrl}
            alt={imageData.caption || ""}
            width={1200}
            height={800}
            className={`rounded-lg ${imageData.stretched ? 'w-full' : 'w-full max-w-full'} ${imageData.withBorder ? 'border-2 border-slate-300' : ''} ${imageData.withBackground ? 'bg-slate-100 p-2' : ''}`}
            style={{
              objectFit: 'cover',
            }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
        </div>
      );

      return (
        <figure key={block.id} className={`mb-6 ${alignmentClass} ${imageData.stretched ? 'w-full' : ''}`}>
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
            <figcaption className={`text-sm text-center mt-2 ${textColor}`}>
              {imageData.caption}
            </figcaption>
          )}
        </figure>
      );

    case "columns":
      const columnsData = block.data as {
        leftContent?: string;
        rightContent?: string;
        layout?: "50-50" | "33-67" | "67-33";
      };

      const gridCols =
        columnsData.layout === "33-67"
          ? "grid-cols-[1fr_2fr]"
          : columnsData.layout === "67-33"
          ? "grid-cols-[2fr_1fr]"
          : "grid-cols-2";

      return (
        <div key={block.id} className={`mb-4 grid ${gridCols} gap-4`}>
          <div
            className={`p-4 ${textColor}`}
            dangerouslySetInnerHTML={{ __html: columnsData.leftContent || "" }}
          />
          <div
            className={`p-4 ${textColor}`}
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

      // Extract video ID from URL
      const extractVideoId = (url: string): string | null => {
        const patterns = [
          /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
          /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
        ];
        for (const pattern of patterns) {
          const match = url.match(pattern);
          if (match && match[1]) return match[1];
        }
        return null;
      };

      const videoId = extractVideoId(youtubeData.url);
      if (!videoId) return null;

      const embedUrl = `https://www.youtube.com/embed/${videoId}`;

      return (
        <figure key={block.id} className="mb-4">
          <div
            className="relative w-full"
            style={{ paddingBottom: "56.25%", height: 0, overflow: "hidden" }}
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
            <figcaption className={`text-sm text-center mt-2 ${textColor}`}>
              {youtubeData.caption}
            </figcaption>
          )}
        </figure>
      );

    case "column":
      const columnData = block.data as {
        imageUrl?: string;
        imagePosition?: "left" | "right";
        heading?: string;
        description?: string;
        points?: string[];
      };

      const flexDirection =
        columnData.imagePosition === "right" ? "flex-row-reverse" : "flex-row";

      return (
        <div
          key={block.id}
          className={`mb-6 flex gap-6 items-start ${flexDirection} flex-wrap`}
        >
          {/* Image Column */}
          <div className="flex-1 min-w-[250px]">
            {columnData.imageUrl && (
              <Image
                src={columnData.imageUrl}
                alt={columnData.heading || "Column image"}
                width={800} // required by Next.js (actual number)
                height={600} // required by Next.js
                className="w-full h-auto rounded-lg object-cover"
              />
            )}
          </div>

          {/* Text Column */}
          <div className="flex-1 min-w-[250px]">
            {columnData.heading && (
              <h3 className={`text-xl font-semibold mb-3 ${headingColor}`}>
                {columnData.heading}
              </h3>
            )}
            {columnData.description && (
              <p className={`mb-4 ${textColor}`}>{columnData.description}</p>
            )}
            {columnData.points && columnData.points.length > 0 && (
              <ul className={`list-disc pl-6 space-y-2 ${textColor}`}>
                {columnData.points.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      );

    default:
      return null;
  }
}
