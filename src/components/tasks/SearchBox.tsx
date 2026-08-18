"use client";

import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function SearchBox({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const close = () => {
    onChange("");
    setOpen(false);
  };

  return (
    <div
      className={cn(
        "flex items-center rounded-lg border transition-all duration-200",
        open || value
          ? "w-40 border-border-strong bg-surface px-2 sm:w-56"
          : "w-8 border-transparent",
      )}
    >
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted",
          !(open || value) && "hover:bg-hover",
        )}
        aria-label="Search"
      >
        <Search className="h-3.5 w-3.5" />
      </button>
      {(open || value) && (
        <>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && close()}
            placeholder="Search tasks..."
            className="h-8 min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-faint"
          />
          <button
            onClick={close}
            className="grid h-6 w-6 shrink-0 place-items-center rounded text-faint hover:text-text"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </>
      )}
    </div>
  );
}
