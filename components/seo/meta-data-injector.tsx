"use client";

import { useEffect, useRef } from "react";

type MetaDataInjectorProps = {
  metaBlock?: string;
};

/**
 * Component that injects raw HTML meta tags and JSON-LD into the document head.
 * This allows complete freedom for SEO customization without code changes.
 * 
 * Note: For better SEO, basic meta tags should be in generateMetadata.
 * This component handles JSON-LD and custom meta tags that can't be set via Metadata API.
 */
export function MetaDataInjector({ metaBlock }: MetaDataInjectorProps) {
  const injectedRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    // Try to get meta block from window object (set by ServerMetaTags)
    const metaBlockToUse = metaBlock || (typeof window !== "undefined" ? (window as any).__META_BLOCK__ : null);
    
    if (!metaBlockToUse || typeof window === "undefined") return;

    // Clean up previously injected elements
    injectedRef.current.forEach((el) => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
    injectedRef.current = [];

    // Create a temporary container to parse the HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = metaBlockToUse;

    // Extract all elements (meta tags, script tags, etc.)
    const elements = Array.from(tempDiv.children);

    // Tags that are already SSR'd - skip these to avoid duplication
    const ssrTags = ['keywords', 'googlebot', 'description', 'robots'];
    
    // Inject each element into the head
    elements.forEach((element) => {
      // Skip title tags as they're handled by Next.js Metadata API
      if (element.tagName === "TITLE") {
        return;
      }

      // Skip meta tags that are already SSR'd
      if (element.tagName === "META") {
        const name = element.getAttribute("name");
        if (name && ssrTags.includes(name.toLowerCase())) {
          return; // Skip - already SSR'd
        }
      }

      // Clone the element to avoid issues
      const clonedElement = element.cloneNode(true) as HTMLElement;

      // For script tags with JSON-LD, we need special handling
      if (clonedElement.tagName === "SCRIPT") {
        const script = document.createElement("script");
        script.type = clonedElement.getAttribute("type") || "application/ld+json";
        script.textContent = clonedElement.textContent;
        script.setAttribute("data-meta-injected", "true");
        document.head.appendChild(script);
        injectedRef.current.push(script);
      } else if (clonedElement.tagName === "META" || clonedElement.tagName === "LINK") {
        // For meta and link tags, check if they already exist
        const existing = document.head.querySelector(
          `[data-meta-injected="true"][name="${clonedElement.getAttribute("name") || clonedElement.getAttribute("property") || ""}"]`
        );
        if (existing) {
          existing.remove();
        }
        clonedElement.setAttribute("data-meta-injected", "true");
        document.head.appendChild(clonedElement);
        injectedRef.current.push(clonedElement);
      } else {
        // For other elements, append directly
        clonedElement.setAttribute("data-meta-injected", "true");
        document.head.appendChild(clonedElement);
        injectedRef.current.push(clonedElement);
      }
    });

    // Cleanup function to remove injected elements when component unmounts
    return () => {
      injectedRef.current.forEach((el) => {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
      injectedRef.current = [];
    };
  }, [metaBlock]);

  return null; // This component doesn't render anything
}

