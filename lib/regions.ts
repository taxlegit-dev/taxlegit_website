// lib/region.ts
import { Region } from "@prisma/client";

export const REGION_COOKIE_NAME = "taxlegit-region";

export type SupportedRegion = "INDIA" | "US";

export const supportedRegions: {
  value: SupportedRegion;
  label: string;
  localeLabel: string;
  flag: string;
}[] = [
  {
    value: "INDIA",
    label: "India",
    localeLabel: "India 🇮🇳",
    flag: "🇮🇳",
  },
  {
    value: "US",
    label: "United States",
    localeLabel: "United States 🇺🇸",
    flag: "🇺🇸",
  },
];

export const regionPathMap: Record<SupportedRegion, string> = {
  INDIA: "/",
  US: "/us",
};

export function getFallbackRegion(pathname?: string): SupportedRegion {
  if (pathname?.startsWith("/us")) return "US";
  return "INDIA";
}

export function toSupportedRegion(region: Region): SupportedRegion {
  return region === Region.US ? "US" : "INDIA";
}
