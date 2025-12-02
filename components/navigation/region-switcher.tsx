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
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const current = supportedRegions.find((r) => r.value === currentRegion);

  const filtered = supportedRegions.filter((r) =>
    r.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = async (value: SupportedRegion) => {
    setLoading(true);

    await fetch("/api/region", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ region: value }),
    });

    router.push(regionPathMap[value]);
    router.refresh();

    setLoading(false);
    setOpen(false);
  };

  return (
    <div className="relative inline-block w-42">

      {/* CLEAN WHITE UI */}
      <button
        disabled={loading}
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
          {/* Search */}
          <div className="p-2 border-b border-zinc-100 bg-zinc-50">
            <input
              autoFocus
              placeholder="Search region..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full rounded-md border border-zinc-200 
                bg-white px-2 py-1 text-sm
                focus:outline-none focus:ring-2 focus:ring-indigo-400
              "
            />
          </div>

          {/* List */}
          <div className="max-h-64 overflow-y-auto">
            {filtered.map((region) => (
              <button
                key={region.value}
                onClick={() => handleSelect(region.value)}
                className="
                  flex w-full items-center gap-2 px-3 py-2 text-left text-sm
                  hover:bg-zinc-100 transition-colors
                "
              >
                <span>{region.flag}</span>
                <span className="text-zinc-700">{region.label}</span>
              </button>
            ))}

            {filtered.length === 0 && (
              <div className="p-3 text-center text-sm text-zinc-500">
                No regions found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
