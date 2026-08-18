"use client";

import { STATUSES, type Status } from "@/lib/types";
import { Menu, MenuContent, MenuLabel, MenuTrigger } from "@/components/ui/Menu";
import { StatusDot } from "@/components/ui/Tags";
import { Check } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

export function StatusPicker({
  value,
  onChange,
  children,
}: {
  value: Status;
  onChange: (s: Status) => void;
  children?: React.ReactNode;
}) {
  return (
    <Menu>
      <MenuTrigger asChild>
        {children ?? (
          <button className="inline-flex items-center rounded-md px-1.5 py-1 hover:bg-hover focus-accent">
            <StatusDot status={value} />
          </button>
        )}
      </MenuTrigger>
      <MenuContent align="start">
        <MenuLabel>Status</MenuLabel>
        {STATUSES.map((s) => (
          <DropdownMenu.Item
            key={s.key}
            onSelect={() => onChange(s.key)}
            className="flex cursor-pointer select-none items-center justify-between gap-3 rounded-lg px-2.5 py-1.5 text-[13px] outline-none data-[highlighted]:bg-hover"
          >
            <StatusDot status={s.key} />
            <Check
              className={cn(
                "h-4 w-4 text-accent",
                value === s.key ? "opacity-100" : "opacity-0",
              )}
            />
          </DropdownMenu.Item>
        ))}
      </MenuContent>
    </Menu>
  );
}
