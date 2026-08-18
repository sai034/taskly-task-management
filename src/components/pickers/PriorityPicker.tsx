"use client";

import { PRIORITIES, type Priority } from "@/lib/types";
import { Menu, MenuContent, MenuLabel, MenuTrigger } from "@/components/ui/Menu";
import { PriorityBars, PriorityTag } from "@/components/ui/Priority";
import { Check } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

export function PriorityPicker({
  value,
  onChange,
  children,
}: {
  value: Priority;
  onChange: (p: Priority) => void;
  children?: React.ReactNode;
}) {
  return (
    <Menu>
      <MenuTrigger asChild>
        {children ?? (
          <button className="inline-flex items-center rounded-md px-1.5 py-1 hover:bg-hover focus-accent">
            <PriorityTag priority={value} />
          </button>
        )}
      </MenuTrigger>
      <MenuContent align="start">
        <MenuLabel>Priority</MenuLabel>
        {PRIORITIES.map((p) => (
          <DropdownMenu.Item
            key={p.key}
            onSelect={() => onChange(p.key)}
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
                value === p.key ? "opacity-100" : "opacity-0",
              )}
            />
          </DropdownMenu.Item>
        ))}
      </MenuContent>
    </Menu>
  );
}
