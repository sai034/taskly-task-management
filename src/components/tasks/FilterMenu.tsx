"use client";

import {
  Menu,
  MenuContent,
  MenuLabel,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/Menu";
import { PriorityBars } from "@/components/ui/Priority";
import { PRIORITIES } from "@/lib/types";
import { useUiStore } from "@/lib/ui-store";
import { cn } from "@/lib/utils";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, Filter, X } from "lucide-react";

export function FilterMenu() {
  const { priorityFilter, setPriorityFilter } = useUiStore();
  const active = priorityFilter !== null;

  return (
    <Menu>
      <MenuTrigger asChild>
        <button
          className={cn(
            "relative grid h-8 w-8 place-items-center rounded-lg border border-border-strong bg-surface text-muted hover:bg-hover focus-accent",
            active && "border-accent text-accent",
          )}
          aria-label="Filter"
        >
          <Filter className="h-3.5 w-3.5" />
          {active && (
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-surface" />
          )}
        </button>
      </MenuTrigger>
      <MenuContent align="end">
        <MenuLabel>Filter by priority</MenuLabel>
        {PRIORITIES.map((p) => (
          <DropdownMenu.Item
            key={p.key}
            onSelect={() =>
              setPriorityFilter(priorityFilter === p.key ? null : p.key)
            }
            className="flex cursor-pointer select-none items-center justify-between gap-3 rounded-lg px-2.5 py-1.5 text-[13px] outline-none data-[highlighted]:bg-hover"
          >
            <span className="flex items-center gap-2.5">
              <PriorityBars priority={p.key} />
              <span style={{ color: p.key === "none" ? "var(--text-faint)" : p.color }}>
                {p.label}
              </span>
            </span>
            <Check
              className={cn(
                "h-4 w-4 text-accent",
                priorityFilter === p.key ? "opacity-100" : "opacity-0",
              )}
            />
          </DropdownMenu.Item>
        ))}
        {active && (
          <>
            <MenuSeparator />
            <DropdownMenu.Item
              onSelect={() => setPriorityFilter(null)}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13px] text-muted outline-none data-[highlighted]:bg-hover"
            >
              <X className="h-3.5 w-3.5" /> Clear filter
            </DropdownMenu.Item>
          </>
        )}
      </MenuContent>
    </Menu>
  );
}
