"use client";

import { cn } from "@/lib/utils";
import * as Dialog from "@radix-ui/react-dialog";
import { FolderKanban, LayoutGrid, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useShell } from "./ShellContext";
import { WorkspaceMenu } from "./WorkspaceMenu";

const NAV: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/tasks", label: "Tasks", icon: LayoutGrid },
  { href: "/projects", label: "Projects", icon: FolderKanban },
];

function NavItem({
  href,
  label,
  icon: Icon,
  active,
  index,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
  index: number;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      style={{ animationDelay: `${index * 55}ms` }}
      className={cn(
        "nav-item group relative flex items-center gap-3 rounded-xl px-2.5 py-2 transition-colors",
        active
          ? "bg-accent text-accent-fg shadow-sm shadow-[var(--accent-ring)]"
          : "text-muted hover:bg-hover hover:text-text",
      )}
    >
      <span
        className={cn(
          "grid h-8 w-8 shrink-0 place-items-center rounded-lg border transition-colors",
          active
            ? "border-white/25 bg-white/20 text-accent-fg"
            : "border-border-default bg-accent-soft text-accent-soft-fg",
        )}
      >
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <span className="flex-1 text-[13.5px] font-semibold">{label}</span>
      {active && (
        <span className="mr-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-fg/80" />
      )}
    </Link>
  );
}

function SidebarInner({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div className="flex items-center gap-1 p-2.5">
        <div className="min-w-0 flex-1">
          <WorkspaceMenu />
        </div>
        {onNavigate && (
          <button
            onClick={onNavigate}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-border-default text-muted hover:bg-hover active:scale-95 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-2.5">
        <div className="px-1.5 pb-2 pt-3 text-[10.5px] font-bold uppercase tracking-[0.12em] text-accent">
          Navigation
        </div>
        {NAV.map((item, i) => (
          <NavItem
            key={item.href}
            {...item}
            index={i}
            active={pathname.startsWith(item.href)}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <div className="p-3">
        <div className="rounded-xl border border-border-default bg-surface-2 px-3 py-2.5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-s-done opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-s-done" />
            </span>
            <span className="text-[12px] font-semibold text-text">Taskly</span>
            <span className="ml-auto text-[10px] font-medium text-faint">workspace</span>
          </div>
          <p className="mt-1 pl-4 text-[10.5px] text-faint">All changes saved locally</p>
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  const { collapsed, mobileOpen, setMobileOpen } = useShell();
  const pathname = usePathname();

  // Close the drawer whenever the route changes (e.g. via the workspace menu).
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, setMobileOpen]);

  return (
    <>
      {/* Desktop — persistent, collapsible */}
      <aside
        className={cn(
          "hidden shrink-0 border-r border-border-default transition-[width] duration-200 lg:block",
          collapsed ? "w-0 overflow-hidden" : "w-[236px]",
        )}
      >
        <SidebarInner />
      </aside>

      {/* Mobile — modal drawer (focus-trapped, scroll-locked, animated) */}
      <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="drawer-overlay fixed inset-0 z-50 bg-[var(--overlay)] backdrop-blur-[2px] lg:hidden" />
          <Dialog.Content
            className="drawer-panel fixed inset-y-0 left-0 z-50 w-[82vw] max-w-[300px] border-r border-border-default bg-sidebar shadow-2xl outline-none lg:hidden"
            aria-describedby={undefined}
          >
            <Dialog.Title className="sr-only">Navigation menu</Dialog.Title>
            <SidebarInner onNavigate={() => setMobileOpen(false)} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
