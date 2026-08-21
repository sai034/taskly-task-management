"use client";

import { Menu, MenuContent, MenuLabel, MenuTrigger } from "@/components/ui/Menu";
import { TEAMS, type TeamKey } from "@/lib/types";
import { cn } from "@/lib/utils";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check } from "lucide-react";

export function TeamPicker({
  value,
  onChange,
  children,
}: {
  value: TeamKey[];
  onChange: (teams: TeamKey[]) => void;
  children: React.ReactNode;
}) {
  const toggle = (key: TeamKey) =>
    onChange(value.includes(key) ? value.filter((x) => x !== key) : [...value, key]);

  return (
    <Menu>
      <MenuTrigger asChild>{children}</MenuTrigger>
      <MenuContent align="start">
        <MenuLabel>Teams</MenuLabel>
        {TEAMS.map((tm) => (
          <DropdownMenu.Item
            key={tm.key}
            onSelect={(e) => {
              e.preventDefault();
              toggle(tm.key);
            }}
            className="flex cursor-pointer select-none items-center justify-between gap-3 rounded-lg px-2.5 py-1.5 text-[13px] outline-none data-[highlighted]:bg-hover"
          >
            <span className="flex items-center gap-2.5">
              <span
                className="h-2.5 w-2.5 rounded-[4px]"
                style={{ background: tm.color }}
              />
              {tm.label}
            </span>
            <Check
              className={cn(
                "h-4 w-4 text-accent",
                value.includes(tm.key) ? "opacity-100" : "opacity-0",
              )}
            />
          </DropdownMenu.Item>
        ))}
      </MenuContent>
    </Menu>
  );
}

/** Small pill used to display a selected team. */
export function TeamPill({ team }: { team: TeamKey }) {
  const meta = TEAMS.find((t) => t.key === team)!;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-border-default bg-surface px-1.5 py-0.5 text-[11px] font-medium text-muted">
      <span className="h-2 w-2 rounded-[3px]" style={{ background: meta.color }} />
      {meta.label}
    </span>
  );
}
