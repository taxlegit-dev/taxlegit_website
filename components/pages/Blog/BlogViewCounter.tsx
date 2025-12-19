"use client";

import { useEffect, useState } from "react";

type BlogViewCounterProps = {
  blogId: string;
  initialCount: number;
};

export function BlogViewCounter({
  blogId,
  initialCount,
}: BlogViewCounterProps) {
  const [viewCount, setViewCount] = useState(initialCount);

  useEffect(() => {
    // Increment view count when component mounts
    const incrementViewCount = async () => {
      try {
        const response = await fetch(`/api/blogs/${blogId}/view-count`, {
          method: "POST",
        });

        if (response.ok) {
          const data = await response.json();
          setViewCount(data.viewCount);
        }
      } catch (error) {
        console.error("Error incrementing view count:", error);
      }
    };

    incrementViewCount();
  }, [blogId]);

  return (
    <span className="flex items-center gap-1 text-slate-500">
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
      {viewCount} {viewCount === 1 ? "view" : "views"}
    </span>
  );
}

