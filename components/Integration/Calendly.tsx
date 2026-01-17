"use client";

import { PopupButton } from "react-calendly";
import { useCallback, useState } from "react";

export default function Calendly() {
  const [rootElement, setRootElement] = useState<HTMLElement | null>(null);

  // callback ref runs when the div mounts/unmounts
  const rootCallbackRef = useCallback((node: HTMLDivElement | null) => {
    setRootElement(node);
  }, []);

  return (
    <div ref={rootCallbackRef} className="hidden md:flex">
      {rootElement && (
        <PopupButton
          url="https://calendly.com/121-taxlegit/30min"
          rootElement={rootElement}
          text="Schedule a call"
          className="h-[44px] rounded-[6px] bg-purple-600 px-5 text-[15px] font-semibold text-white shadow-sm hover:bg-purple-700"
        />
      )}
    </div>
  );
}
