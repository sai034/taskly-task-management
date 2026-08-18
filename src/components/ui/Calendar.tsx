"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** Lightweight month calendar matching the Figma date picker. */
export function Calendar({
  value,
  onSelect,
}: {
  value: string | null;
  onSelect: (iso: string) => void;
}) {
  const initial = value ? new Date(value) : new Date();
  const [view, setView] = useState({
    y: initial.getFullYear(),
    m: initial.getMonth(),
  });

  const first = new Date(view.y, view.m, 1);
  const startPad = first.getDay();
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const selected = value ? new Date(value) : null;
  const today = new Date();

  const cells: (number | null)[] = [
    ...Array(startPad).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const shift = (delta: number) => {
    let m = view.m + delta;
    let y = view.y;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setView({ y, m });
  };

  const isSame = (a: Date | null, d: number) =>
    !!a && a.getFullYear() === view.y && a.getMonth() === view.m && a.getDate() === d;

  return (
    <div className="w-[248px] select-none px-1 pb-1">
      <div className="mb-2 flex items-center justify-between px-1">
        <button
          onClick={() => shift(-1)}
          className="grid h-7 w-7 place-items-center rounded-lg text-muted hover:bg-hover"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-[13px] font-medium">
          {MONTHS[view.m]} {view.y}
        </span>
        <button
          onClick={() => shift(1)}
          className="grid h-7 w-7 place-items-center rounded-lg text-muted hover:bg-hover"
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {DAYS.map((d) => (
          <div
            key={d}
            className="grid h-7 place-items-center text-[11px] font-medium text-faint"
          >
            {d}
          </div>
        ))}
        {cells.map((day, i) =>
          day === null ? (
            <div key={i} />
          ) : (
            <button
              key={i}
              onClick={() =>
                onSelect(new Date(view.y, view.m, day, 12).toISOString())
              }
              className={cn(
                "mx-auto grid h-7 w-7 place-items-center rounded-full text-[13px] transition-colors",
                isSame(selected, day)
                  ? "bg-accent text-accent-fg font-semibold"
                  : "text-text hover:bg-hover",
                !isSame(selected, day) && isSame(today, day) && "font-semibold text-accent",
              )}
            >
              {day}
            </button>
          ),
        )}
      </div>
    </div>
  );
}
