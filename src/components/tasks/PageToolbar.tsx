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
 *
 * The search field and its trigger are both always mounted and animate their
 * width/opacity, so opening and closing are smooth in both directions.
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
      <h1 className="order-1 shrink-0 truncate text-[15px] font-semibold sm:min-w-0 sm:flex-1">
        {title}
      </h1>

      {/* Search field — always mounted, width/opacity animate for a smooth
          open + close. Collapsed to zero width when closed. */}
      <div
        aria-hidden={!open}
        className={cn(
          "order-2 flex h-8 items-center gap-2 overflow-hidden rounded-lg border bg-surface transition-all duration-200 ease-out sm:order-3",
          open
            ? "flex-1 border-border-strong px-2.5 opacity-100 sm:w-60 sm:max-w-[15rem] sm:flex-none"
            : "pointer-events-none w-0 max-w-0 flex-none border-transparent px-0 opacity-0",
        )}
      >
        <Search className="h-3.5 w-3.5 shrink-0 text-faint" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && close()}
          placeholder={placeholder}
          tabIndex={open ? 0 : -1}
          className="h-full min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-faint"
        />
        <button
          onClick={close}
          aria-label="Close search"
          tabIndex={open ? 0 : -1}
          className="grid h-5 w-5 shrink-0 place-items-center rounded text-faint hover:text-text"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Actions — wrap to their own row on small screens when search is open */}
      <div
        className={cn(
          "order-3 ml-auto flex items-center justify-end gap-1.5 sm:order-4 sm:gap-2",
          open && "max-sm:w-full",
        )}
      >
        <button
          onClick={() => setOpen(true)}
          aria-label="Search"
          tabIndex={open ? -1 : 0}
          className={cn(
            "grid h-8 shrink-0 place-items-center overflow-hidden rounded-lg border bg-surface text-muted transition-all duration-200 ease-out hover:bg-hover focus-accent",
            open
              ? "pointer-events-none w-0 border-transparent opacity-0"
              : "w-8 border-border-strong opacity-100",
          )}
        >
          <Search className="h-3.5 w-3.5" />
        </button>
        {children}
      </div>
    </div>
  );
}
