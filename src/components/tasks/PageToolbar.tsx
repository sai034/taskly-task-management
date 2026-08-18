"use client";

import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Header toolbar (Tasks & Projects). The heading is always visible.
 *
 *  - closed:            [ Tasks ............... ] [🔍][Fields][Filter][Add]     → one line
 *  - sm and up, open:   [ Tasks ....... ] [🔍 search ✕][Fields][Filter][Add]   → one line,
 *                                            search grouped with the filters (right)
 *  - small, open:       [ Tasks  🔍 search ✕ ]
 *                                          [Fields][Filter][Add]                → actions wrap below
 */
export function PageToolbar({
  title,
  query,
  onQuery,
  placeholder = "Search tasks...",
  children,
}: {
  title: string;
  query: string;
  onQuery: (v: string) => void;
  placeholder?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const close = () => {
    onQuery("");
    setOpen(false);
  };

  return (
    <div className="flex w-full items-center gap-2 max-sm:flex-wrap">
      {/* Heading grows so, on larger screens, the search is pushed to the
          right next to the filters. On small screens it stays compact. */}
      <h1 className="order-1 shrink-0 truncate text-[15px] font-semibold sm:min-w-0 sm:flex-1">
        {title}
      </h1>

      {open && (
        <div className="order-2 flex h-8 min-w-0 flex-1 items-center gap-2 rounded-lg border border-border-strong bg-surface px-2.5 focus-within:border-accent sm:order-3 sm:w-60 sm:max-w-xs sm:flex-none">
          <Search className="h-3.5 w-3.5 shrink-0 text-faint" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && close()}
            placeholder={placeholder}
            className="h-full min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-faint"
          />
          <button
            onClick={close}
            aria-label="Close search"
            className="grid h-5 w-5 shrink-0 place-items-center rounded text-faint hover:text-text"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Actions — wrap to their own row on small screens when search is open */}
      <div
        className={cn(
          "order-3 ml-auto flex items-center justify-end gap-1.5 sm:order-4 sm:gap-2",
          open && "max-sm:w-full",
        )}
      >
        {!open && (
          <button
            onClick={() => setOpen(true)}
            aria-label="Search"
            className="grid h-8 w-8 place-items-center rounded-lg border border-border-strong bg-surface text-muted hover:bg-hover focus-accent"
          >
            <Search className="h-3.5 w-3.5" />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
