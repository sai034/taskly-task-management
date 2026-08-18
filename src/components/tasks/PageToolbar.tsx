"use client";

import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Header toolbar (Tasks & Projects). The heading is always visible.
 *
 *  - closed:            [ Tasks ......... ] [🔍][Fields][Filter][Add]     → one line
 *  - open (small):      [ Tasks  🔍 search ✕ ]
 *                                             [Fields][Filter][Add]       → wraps below
 *  - open (sm and up):  [ Tasks  🔍 search ✕ ] ....... [Fields][Filter][Add]  → one line
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
    <div
      className={cn(
        "flex w-full items-center gap-2",
        open && "max-sm:flex-col max-sm:items-stretch",
      )}
    >
      {/* Row 1: heading + expanded search */}
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        <h1 className="shrink-0 truncate text-[15px] font-semibold">{title}</h1>
        {open && (
          <div className="flex h-8 min-w-0 flex-1 items-center gap-2 rounded-lg border border-border-strong bg-surface px-2.5 focus-within:border-accent sm:w-64 sm:max-w-xs sm:flex-none">
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
      </div>

      {/* Actions — drop to their own row on small screens when search is open */}
      <div className="flex shrink-0 items-center justify-end gap-1.5 sm:gap-2">
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
