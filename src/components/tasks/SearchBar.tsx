"use client";

import { Search, X } from "lucide-react";
import { useEffect, useRef } from "react";

/** Full-width "search mode" bar shown in the header's title slot. */
export function SearchBar({
  value,
  onChange,
  onClose,
  placeholder = "Search tasks...",
}: {
  value: string;
  onChange: (v: string) => void;
  onClose: () => void;
  placeholder?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <div className="flex h-9 w-full max-w-xl items-center gap-2 rounded-xl border border-border-strong bg-surface-2 px-3 focus-within:border-accent focus-within:bg-surface">
      <Search className="h-4 w-4 shrink-0 text-faint" />
      <input
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        placeholder={placeholder}
        className="h-full min-w-0 flex-1 bg-transparent text-[13.5px] outline-none placeholder:text-faint"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="grid h-5 w-5 shrink-0 place-items-center rounded text-faint hover:text-text"
          aria-label="Clear"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
