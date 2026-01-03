"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  supportedRegions,
  SupportedRegion,
  regionPathMap,
} from "@/lib/regions";

export function RegionSwitcher({
  currentRegion,
}: {
  currentRegion: SupportedRegion;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const current = supportedRegions.find(
    (r) => r.value === currentRegion
  );

  const handleSelect = (value: SupportedRegion) => {
    setOpen(false);

    // 🚀 Pure client-side navigation (CDN safe)
    router.push(regionPathMap[value]);
  };

  return (
    <div className="relative inline-block w-42">
      <button
        onClick={() => setOpen(!open)}
        className="
          flex w-full items-center justify-between
          rounded-lg bg-white px-3 py-2 text-sm
          shadow-sm hover:shadow-md transition-shadow
          border border-zinc-300
        "
      >
        <span className="flex items-center gap-2 text-zinc-700">
          {current?.flag} {current?.label}
        </span>
        <span className="text-zinc-500">▾</span>
      </button>

      {open && (
        <div
          className="
            absolute left-0 mt-2 w-full rounded-lg 
            bg-white shadow-lg ring-1 ring-black/5
            overflow-hidden z-50
          "
        >
          <div className="max-h-64 overflow-y-auto">
            {supportedRegions.map((region) => (
              <button
                key={region.value}
                onClick={() => handleSelect(region.value)}
                className="
                  flex w-full items-center gap-2 px-3 py-2 text-left text-sm
                  hover:bg-zinc-100 transition-colors
                "
              >
                <span>{region.flag}</span>
                <span className="text-zinc-700">
                  {region.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
