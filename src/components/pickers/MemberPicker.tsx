"use client";

import { MEMBERS } from "@/lib/seed";
import { Menu, MenuContent, MenuLabel, MenuTrigger } from "@/components/ui/Menu";
import { Avatar, AvatarGroup } from "@/components/ui/Avatar";
import { Check } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

export function MemberPicker({
  value,
  onChange,
  children,
}: {
  value: string[];
  onChange: (ids: string[]) => void;
  children?: React.ReactNode;
}) {
  const toggle = (id: string) =>
    onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id]);

  return (
    <Menu>
      <MenuTrigger asChild>
        {children ?? (
          <button className="inline-flex items-center rounded-md px-1 py-1 hover:bg-hover focus-accent">
            <AvatarGroup ids={value} />
          </button>
        )}
      </MenuTrigger>
      <MenuContent align="start" className="min-w-[200px]">
        <MenuLabel>Members</MenuLabel>
        {MEMBERS.map((m) => (
          <DropdownMenu.Item
            key={m.id}
            onSelect={(e) => {
              e.preventDefault();
              toggle(m.id);
            }}
            className="flex cursor-pointer select-none items-center justify-between gap-3 rounded-lg px-2.5 py-1.5 text-[13px] outline-none data-[highlighted]:bg-hover"
          >
            <span className="flex items-center gap-2.5">
              <Avatar member={m} size="sm" />
              {m.name}
            </span>
            <Check
              className={cn(
                "h-4 w-4 text-accent",
                value.includes(m.id) ? "opacity-100" : "opacity-0",
              )}
            />
          </DropdownMenu.Item>
        ))}
      </MenuContent>
    </Menu>
  );
}
