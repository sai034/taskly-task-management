"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { Calendar } from "@/components/ui/Calendar";
import { formatDate } from "@/lib/utils";
import { CalendarDays, X } from "lucide-react";
import { useState } from "react";

export function DatePicker({
  value,
  onChange,
  placeholder = "Set date",
  children,
}: {
  value: string | null;
  onChange: (iso: string | null) => void;
  placeholder?: string;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children ?? (
          <button className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-[13px] text-muted hover:bg-hover focus-accent">
            <CalendarDays className="h-3.5 w-3.5" />
            {value ? formatDate(value) : <span className="text-faint">{placeholder}</span>}
          </button>
        )}
      </PopoverTrigger>
      <PopoverContent align="start">
        <Calendar
          value={value}
          onSelect={(iso) => {
            onChange(iso);
            setOpen(false);
          }}
        />
        {value && (
          <button
            onClick={() => {
              onChange(null);
              setOpen(false);
            }}
            className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-lg py-1.5 text-[13px] text-muted hover:bg-hover"
          >
            <X className="h-3.5 w-3.5" /> Clear date
          </button>
        )}
      </PopoverContent>
    </Popover>
  );
}
