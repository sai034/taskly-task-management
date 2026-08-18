"use client";

import { cn } from "@/lib/utils";
import * as Dialog from "@radix-ui/react-dialog";
import { FolderKanban, LayoutGrid, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useShell } from "./ShellContext";
import { WorkspaceMenu } from "./WorkspaceMenu";

const NAV = [
  { href: "/tasks", label: "Tasks", icon: LayoutGrid },
  { href: "/projects", label: "Projects", icon: FolderKanban },
];

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
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted hover:bg-hover lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-0.5 px-2.5">
        <div className="px-2 pb-1.5 pt-3 text-[11px] font-semibold uppercase tracking-wide text-faint">
          Workspace
        </div>
        {NAV.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-2 py-2 text-[13px] font-medium transition-colors",
                active
                  ? "bg-active text-text"
                  : "text-muted hover:bg-hover hover:text-text",
              )}
            >
              <item.icon className={cn("h-4 w-4", active && "text-accent")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 text-[11px] text-faint">
        <span className="font-semibold text-muted">Taskly</span> · workspace
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
