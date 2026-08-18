"use client";

import { Menu, MenuContent, MenuLabel, MenuTrigger } from "@/components/ui/Menu";
import { LABELS, type LabelKey } from "@/lib/types";
import { cn } from "@/lib/utils";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, Tag } from "lucide-react";

export function LabelPicker({
  value,
  onChange,
  children,
}: {
  value: LabelKey[];
  onChange: (labels: LabelKey[]) => void;
  children: React.ReactNode;
}) {
  const toggle = (key: LabelKey) =>
    onChange(value.includes(key) ? value.filter((x) => x !== key) : [...value, key]);

  return (
    <Menu>
      <MenuTrigger asChild>{children}</MenuTrigger>
      <MenuContent align="start">
        <MenuLabel>Labels</MenuLabel>
        {LABELS.map((l) => (
          <DropdownMenu.Item
            key={l.key}
            onSelect={(e) => {
              e.preventDefault();
              toggle(l.key);
            }}
            className="flex cursor-pointer select-none items-center justify-between gap-3 rounded-lg px-2.5 py-1.5 text-[13px] outline-none data-[highlighted]:bg-hover"
          >
            <span className="flex items-center gap-2.5">
              <Tag className="h-3.5 w-3.5 text-muted" />
              {l.label}
            </span>
            <Check
              className={cn(
                "h-4 w-4 text-accent",
                value.includes(l.key) ? "opacity-100" : "opacity-0",
              )}
            />
          </DropdownMenu.Item>
        ))}
      </MenuContent>
    </Menu>
  );
}
