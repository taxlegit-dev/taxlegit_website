"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Region } from "@prisma/client";
import { RegionSwitcher } from "@/components/navigation/region-switcher";
import { toSupportedRegion } from "@/lib/regions";
import Image from "next/image";

type NavbarItem = {
  id: string;
  label: string;
  href: string | null;
  type: string;
  isLoginLink: boolean;
  order: number;
  groups: Array<{
    label: string | null;
    items: Array<{
      id: string;
      label: string;
      href: string | null;
      order: number;
    }>;
  }>;
};

type MegaNavbarProps = {
  region: Region;
  initialItems?: NavbarItem[];
};

export function MegaNavbar({ region, initialItems = [] }: MegaNavbarProps) {
  const [items, setItems] = useState<NavbarItem[]>(initialItems);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileItem, setOpenMobileItem] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    const fetchNavbar = async () => {
      try {
        // Only fetch on client-side, not during SSR
        if (typeof window === "undefined") return;

        const response = await fetch(`/api/navbar?region=${region}`);
        const data = await response.json();
        if (data.items) {
          setItems(data.items);
        }
      } catch (error) {
        console.error("Failed to fetch navbar:", error);
      }
    };

    if (initialItems.length === 0) {
      fetchNavbar();
    }
  }, [region, initialItems.length]);

  const mappedRegion = toSupportedRegion(region);
  const regionPrefix = region === Region.US ? "/us" : "";

  const toggleMobileItem = (itemId: string) => {
    setOpenMobileItem(openMobileItem === itemId ? null : itemId);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white shadow-sm">
      <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-6">
        {/* Logo */}
        <Link
          href={region === Region.US ? "/us" : "/"}
          className="flex items-center gap-2.5"
        >
          <Image
            src="/logo/taxlegitlogo.webp"
            alt="My Logo"
            width={80}
            height={80}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-[42px] lg:flex">
          {items.map((item) => {
            if (item.type === "DROPDOWN" && item.groups.length > 0) {
              return (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <button className="flex items-center gap-x-1.5 text-[18px] font-medium tracking-normal text-[#333333] transition-colors hover:text-black py-6 cursor-pointer">
                    {item.label}
                    <svg
                      className={`h-3.5 w-3.5 transition-transform ${
                        hoveredItem === item.id ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Mega Menu Dropdown */}
                  {hoveredItem === item.id && (
                    <div
                      className="
      absolute left-1/2 top-full w-[650px]
      z-[100]
      -translate-x-1/2 
      rounded-xl 
      border border-zinc-100
      bg-white/95 
      backdrop-blur-sm
      shadow-[0_8px_30px_rgba(0,0,0,0.08)]
      p-8 
      animate-fadeIn
      transition-all
    "
                    >
                      <div className="grid grid-cols-2 gap-10">
                        {item.groups.map((group, groupIndex) => (
                          <div key={groupIndex} className="space-y-4">
                            {/* Group Label */}
                            {group.label && (
                              <h3 className="border-b border-zinc-100 pb-2 text-[13px] font-semibold uppercase tracking-wider text-zinc-500">
                                {group.label}
                              </h3>
                            )}

                            <ul className="space-y-1.5">
                              {group.items.map((subItem) => (
                                <li key={subItem.id}>
                                  <Link
                                    href={
                                      subItem.href
                                        ? `${regionPrefix}${subItem.href}`
                                        : "#"
                                    }
                                    className="
                    group 
                    block rounded-lg px-3 py-1
                    text-[14px] font-medium text-zinc-700
                    hover:bg-zinc-100 
                    hover:text-black
                    transition-all duration-150
                    flex items-center justify-between
                  "
                                  >
                                    {/* Left: Name */}
                                    <span className="group-hover:translate-x-1 transition-transform">
                                      {subItem.label}
                                    </span>

                                    {/* Right: Chevron Indicator */}
                                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 group-hover:text-zinc-600 text-xl">
                                      →
                                    </span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.id}
                href={item.href ? `${regionPrefix}${item.href}` : "#"}
                className="text-[18px] font-medium tracking-normal text-[#333333] transition-colors hover:text-black"
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Section - Country Selector & Phone */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:block">
            <RegionSwitcher currentRegion={mappedRegion} />
          </div>

          <Link
            href="tel:+918929218091"
            className="hidden h-[44px] items-center gap-2.5 rounded-[6px] bg-purple-600 px-5 text-[15px] font-semibold text-white shadow-sm transition-all hover:bg-[#DC2626] lg:flex"
          >
            <svg
              className="h-[18px] w-[18px]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            <span className="whitespace-nowrap">+91-8929218091</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-md p-2 text-gray-700 hover:bg-gray-100 lg:hidden"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white lg:hidden">
          <div className="mx-auto max-w-[1400px] space-y-2 px-6 py-4">
            {items.map((item) => {
              if (item.type === "DROPDOWN" && item.groups.length > 0) {
                return (
                  <div
                    key={item.id}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <button
                      onClick={() => toggleMobileItem(item.id)}
                      className="flex w-full items-center justify-between px-4 py-3 text-[15px] font-medium text-[#333333] transition hover:text-black"
                    >
                      <span>{item.label}</span>
                      <svg
                        className={`h-4 w-4 transition-transform ${
                          openMobileItem === item.id ? "rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {openMobileItem === item.id && (
                      <div className="space-y-4 px-4 pb-4">
                        {item.groups.map((group, groupIndex) => (
                          <div key={groupIndex} className="space-y-2">
                            {group.label && (
                              <h3 className="border-b border-gray-100 pb-2 pt-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                {group.label}
                              </h3>
                            )}
                            <ul className="space-y-1">
                              {group.items.map((subItem) => (
                                <li key={subItem.id}>
                                  <Link
                                    href={
                                      subItem.href
                                        ? `${regionPrefix}${subItem.href}`
                                        : "#"
                                    }
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block rounded-md px-3 py-2.5 text-[14px] text-[#333333] transition hover:bg-gray-50 hover:text-black"
                                  >
                                    {subItem.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.id}
                  href={item.href ? `${regionPrefix}${item.href}` : "#"}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-md px-4 py-3 text-[15px] font-medium text-[#333333] transition hover:bg-gray-50 hover:text-black"
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Mobile Region Switcher & Phone */}
            <div className="space-y-3 border-t border-gray-100 pt-4">
              <RegionSwitcher currentRegion={mappedRegion} />
              <Link
                href="tel:+918929218091"
                className="flex h-[44px] w-full items-center justify-center gap-2.5 rounded-[6px] bg-purple-600 px-5 text-[15px] font-semibold text-white shadow-sm transition-all hover:bg-[#DC2626]"
              >
                <svg
                  className="h-[18px] w-[18px]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="whitespace-nowrap">+91-8929218091</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
