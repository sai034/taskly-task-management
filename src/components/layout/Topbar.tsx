"use client";

import { cn } from "@/lib/utils";
import { Menu as MenuIcon, PanelLeft } from "lucide-react";
import { useShell } from "./ShellContext";

export function Topbar({
  title,
  breadcrumb,
  actions,
}: {
  title?: string;
  breadcrumb?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  const { toggleCollapsed, setMobileOpen } = useShell();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border-default bg-surface/80 px-3 backdrop-blur-md sm:px-4">
      <button
        onClick={() => setMobileOpen(true)}
        className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-hover lg:hidden"
        aria-label="Open menu"
      >
        <MenuIcon className="h-4.5 w-4.5" />
      </button>
      <button
        onClick={toggleCollapsed}
        className="hidden h-8 w-8 shrink-0 place-items-center rounded-lg text-muted hover:bg-hover lg:grid"
        aria-label="Toggle sidebar"
      >
        <PanelLeft className="h-4.5 w-4.5" />
      </button>

      <div className="min-w-0 flex-1">
        {breadcrumb ?? (
          <h1 className="truncate text-[15px] font-semibold">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">{actions}</div>
    </header>
  );
}

export function IconButton({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "grid h-8 w-8 place-items-center rounded-lg text-muted transition-colors hover:bg-hover hover:text-text focus-accent",
        className,
      )}
      {...props}
    />
  );
}
