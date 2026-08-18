"use client";

import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Header toolbar (Tasks & Projects).
 *
 * The search is the original expandable pill: a search icon that grows into a
 * field with the magnifier + clear inside it.
 *  - closed:            [ Title ......... ] [🔍][Fields][Filter][Add]   → one line
 *  - open (small):      [ 🔍  search field ................. ✕ ]
 *                                                [Fields][Filter][Add]   → wraps below
 *  - open (sm and up):  [ Title ] [🔍 search ✕] [Fields][Filter][Add]   → one line
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
    <div className="flex w-full flex-wrap items-center gap-2">
      <h1
        className={cn(
          "min-w-0 flex-1 truncate text-[15px] font-semibold",
          open && "hidden sm:block",
        )}
      >
        {title}
      </h1>

      {open && (
        <div className="order-first flex h-8 w-full items-center gap-2 rounded-lg border border-border-strong bg-surface px-2.5 focus-within:border-accent sm:order-none sm:w-64 sm:flex-none">
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

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
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
