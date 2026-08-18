"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { FIELD_OPTIONS, useUiStore, type ViewMode } from "@/lib/ui-store";
import { cn } from "@/lib/utils";
import { Check, LayoutGrid, List, SlidersHorizontal } from "lucide-react";

export function FieldsMenu() {
  const { view, setView, fields, toggleField } = useUiStore();

  const segments: { key: ViewMode; label: string; icon: typeof List }[] = [
    { key: "list", label: "List", icon: List },
    { key: "board", label: "Board", icon: LayoutGrid },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border-strong bg-surface px-2.5 text-[13px] font-medium text-muted hover:bg-hover focus-accent">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Fields</span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[220px] p-1.5">
        {/* View switcher */}
        <div className="mb-1 grid grid-cols-2 gap-1 rounded-lg bg-surface-2 p-1">
          {segments.map((s) => (
            <button
              key={s.key}
              onClick={() => setView(s.key)}
              className={cn(
                "inline-flex items-center justify-center gap-1.5 rounded-md py-1.5 text-[13px] font-medium transition-colors",
                view === s.key
                  ? "bg-surface text-text shadow-sm"
                  : "text-muted hover:text-text",
              )}
            >
              <s.icon className="h-3.5 w-3.5" />
              {s.label}
            </button>
          ))}
        </div>

        <div className="px-2 pb-1 pt-2 text-[11px] font-medium uppercase tracking-wide text-faint">
          Show fields
        </div>
        {FIELD_OPTIONS.map((f) => (
          <button
            key={f.key}
            onClick={() => toggleField(f.key)}
            className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-[13px] hover:bg-hover"
          >
            {f.label}
            <span
              className={cn(
                "grid h-4 w-4 place-items-center rounded border transition-colors",
                fields[f.key]
                  ? "border-accent bg-accent text-accent-fg"
                  : "border-border-strong",
              )}
            >
              {fields[f.key] && <Check className="h-3 w-3" />}
            </span>
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
