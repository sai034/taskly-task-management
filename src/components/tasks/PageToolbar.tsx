"use client";

import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Header toolbar used on Tasks & Projects.
 *
 * Layout is a single wrapping flex row:
 *  - closed:            [ Title .......... ] [🔍][actions]      → one line
 *  - open (small):      [ 🔍 Search input full width         ]
 *                                              [X][actions]      → wraps below
 *  - open (sm and up):  [ 🔍 Search (fixed) ] ....... [X][actions] → one line
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

  const toggle = () => {
    if (open) onQuery("");
    setOpen((o) => !o);
  };

  return (
    <div className="flex w-full flex-wrap items-center gap-2">
      {open ? (
        <div className="order-first w-full sm:order-none sm:w-64 sm:flex-none">
          <div className="flex h-8 items-center gap-2 rounded-lg border border-border-strong bg-surface px-2.5 focus-within:border-accent">
            <Search className="h-3.5 w-3.5 shrink-0 text-faint" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && toggle()}
              placeholder={placeholder}
              className="h-full min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-faint"
            />
          </div>
        </div>
      ) : (
        <h1 className="min-w-0 flex-1 truncate text-[15px] font-semibold">
          {title}
        </h1>
      )}

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={toggle}
          aria-label={open ? "Close search" : "Search"}
          className={cn(
            "grid h-8 w-8 place-items-center rounded-lg border border-border-strong bg-surface text-muted hover:bg-hover focus-accent",
            open && "border-accent text-accent",
          )}
        >
          {open ? <X className="h-3.5 w-3.5" /> : <Search className="h-3.5 w-3.5" />}
        </button>
        {children}
      </div>
    </div>
  );
}
