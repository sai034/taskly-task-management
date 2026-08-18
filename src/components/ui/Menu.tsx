"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const Menu = DropdownMenu.Root;
export const MenuTrigger = DropdownMenu.Trigger;
export const MenuSub = DropdownMenu.Sub;

const contentClass =
  "z-50 min-w-[180px] rounded-xl border border-border-default bg-surface p-1 shadow-lg shadow-black/[0.08] animate-content";

export function MenuContent({
  children,
  align = "start",
  sideOffset = 6,
  className,
}: {
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  sideOffset?: number;
  className?: string;
}) {
  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        align={align}
        sideOffset={sideOffset}
        className={cn(contentClass, className)}
      >
        {children}
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  );
}

export function MenuSubContent({ children }: { children: React.ReactNode }) {
  return (
    <DropdownMenu.Portal>
      <DropdownMenu.SubContent
        sideOffset={4}
        alignOffset={-4}
        className={contentClass}
      >
        {children}
      </DropdownMenu.SubContent>
    </DropdownMenu.Portal>
  );
}

const itemClass =
  "flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13px] text-text outline-none data-[highlighted]:bg-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50";

export function MenuItem({
  children,
  onSelect,
  className,
  disabled,
}: {
  children: React.ReactNode;
  onSelect?: (e: Event) => void;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <DropdownMenu.Item
      onSelect={onSelect}
      disabled={disabled}
      className={cn(itemClass, className)}
    >
      {children}
    </DropdownMenu.Item>
  );
}

export function MenuCheckItem({
  children,
  checked,
  onSelect,
}: {
  children: React.ReactNode;
  checked: boolean;
  onSelect?: (e: Event) => void;
}) {
  return (
    <DropdownMenu.Item
      onSelect={(e) => {
        e.preventDefault();
        onSelect?.(e);
      }}
      className={cn(itemClass, "justify-between")}
    >
      <span className="flex items-center gap-2.5">{children}</span>
      <Check
        className={cn(
          "h-4 w-4 text-accent transition-opacity",
          checked ? "opacity-100" : "opacity-0",
        )}
      />
    </DropdownMenu.Item>
  );
}

export function MenuSubTrigger({ children }: { children: React.ReactNode }) {
  return (
    <DropdownMenu.SubTrigger
      className={cn(itemClass, "justify-between data-[state=open]:bg-hover")}
    >
      <span className="flex items-center gap-2.5">{children}</span>
      <ChevronRight className="h-4 w-4 text-faint" />
    </DropdownMenu.SubTrigger>
  );
}

export function MenuLabel({ children }: { children: React.ReactNode }) {
  return (
    <DropdownMenu.Label className="px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-wide text-faint">
      {children}
    </DropdownMenu.Label>
  );
}

export function MenuSeparator() {
  return <DropdownMenu.Separator className="my-1 h-px bg-border-default" />;
}
