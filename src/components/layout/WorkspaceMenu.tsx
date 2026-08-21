"use client";

import {
  Menu,
  MenuContent,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
} from "@/components/ui/Menu";
import { useAuth } from "@/lib/auth";
import { ACCENTS, useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronsUpDown,
  LogOut,
  Moon,
  Palette,
  Settings,
  Sun,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/** True on wide-enough screens where the flyout submenus have room. */
function useHasSubmenuRoom() {
  const [ok, setOk] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const update = () => setOk(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return ok;
}

export function WorkspaceMenu() {
  const { user, logout } = useAuth();
  const { mode, setMode, accent, setAccent } = useTheme();
  const router = useRouter();
  const useFlyout = useHasSubmenuRoom();

  return (
    <Menu>
      <MenuTrigger asChild>
        <button className="group flex w-full items-center gap-2.5 rounded-lg border border-transparent px-2 py-1.5 text-left hover:bg-hover hover:border-border-default focus-accent">
          <span
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-semibold text-white"
            style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)" }}
          >
            {(user?.name ?? "D").slice(0, 1).toUpperCase()}
          </span>
          <span className="min-w-0 flex-1 truncate text-[13px] font-semibold">
            {user?.name ?? "Workspace"}
          </span>
          <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-faint" />
        </button>
      </MenuTrigger>

      <MenuContent align="start" className="w-[248px] max-w-[calc(100vw-1.5rem)]">
        {/* Profile header */}
        <div className="flex flex-col items-center gap-1.5 px-2 py-3">
          <span
            className="grid h-11 w-11 place-items-center rounded-full text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)" }}
          >
            {(user?.name ?? "D").slice(0, 1).toUpperCase()}
          </span>
          <div className="text-center">
            <div className="text-[13px] font-semibold">{user?.name}</div>
            <div className="text-[12px] text-muted">{user?.email}</div>
          </div>
        </div>
        <MenuSeparator />

        {useFlyout ? (
          <>
            {/* Figma design — flyout submenus (medium & large screens) */}
            <MenuSub>
              <MenuSubTrigger>
                {mode === "dark" ? (
                  <Moon className="h-4 w-4 text-muted" />
                ) : (
                  <Sun className="h-4 w-4 text-muted" />
                )}
                Change Theme
              </MenuSubTrigger>
              <MenuSubContent>
                <MenuLabel>Theme</MenuLabel>
                {(["light", "dark"] as const).map((m) => (
                  <MenuItem
                    key={m}
                    className="justify-between"
                    onSelect={(e) => {
                      e.preventDefault();
                      setMode(m);
                    }}
                  >
                    <span className="flex items-center gap-2.5 capitalize">
                      {m === "light" ? (
                        <Sun className="h-4 w-4 text-muted" />
                      ) : (
                        <Moon className="h-4 w-4 text-muted" />
                      )}
                      {m}
                    </span>
                    <Check
                      className={cn(
                        "h-4 w-4 text-accent",
                        mode === m ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </MenuItem>
                ))}
              </MenuSubContent>
            </MenuSub>

            <MenuSub>
              <MenuSubTrigger>
                <Palette className="h-4 w-4 text-muted" />
                Color Mode
              </MenuSubTrigger>
              <MenuSubContent>
                <MenuLabel>Color Mode</MenuLabel>
                {ACCENTS.map((a) => (
                  <MenuItem
                    key={a.key}
                    className="justify-between"
                    onSelect={(e) => {
                      e.preventDefault();
                      setAccent(a.key);
                    }}
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        className="h-3.5 w-3.5 rounded-[5px]"
                        style={{ background: a.swatch }}
                      />
                      {a.label}
                    </span>
                    <Check
                      className={cn(
                        "h-4 w-4 text-accent",
                        accent === a.key ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </MenuItem>
                ))}
              </MenuSubContent>
            </MenuSub>
          </>
        ) : (
          <>
            {/* Small screens — inline controls (flyouts would overflow) */}
            <div className="px-2 py-1.5">
              <div className="mb-1.5 px-0.5 text-[11px] font-medium uppercase tracking-wide text-faint">
                Theme
              </div>
              <div className="grid grid-cols-2 gap-1 rounded-lg bg-surface-2 p-1">
                {(["light", "dark"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={cn(
                      "inline-flex items-center justify-center gap-1.5 rounded-md py-1.5 text-[13px] font-medium capitalize transition-colors",
                      mode === m
                        ? "bg-surface text-text shadow-sm"
                        : "text-muted hover:text-text",
                    )}
                  >
                    {m === "light" ? (
                      <Sun className="h-3.5 w-3.5" />
                    ) : (
                      <Moon className="h-3.5 w-3.5" />
                    )}
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-2 pb-2 pt-1">
              <div className="mb-1.5 px-0.5 text-[11px] font-medium uppercase tracking-wide text-faint">
                Color Mode
              </div>
              <div className="flex items-center gap-2">
                {ACCENTS.map((a) => (
                  <button
                    key={a.key}
                    onClick={() => setAccent(a.key)}
                    title={a.label}
                    aria-label={a.label}
                    className={cn(
                      "grid h-6 w-6 shrink-0 place-items-center rounded-full ring-2 ring-offset-2 ring-offset-surface transition-transform hover:scale-110",
                      accent === a.key ? "ring-border-strong" : "ring-transparent",
                    )}
                    style={{ background: a.swatch }}
                  >
                    {accent === a.key && (
                      <Check className="h-3.5 w-3.5 text-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <MenuItem onSelect={() => router.push("/profile")}>
          <Settings className="h-4 w-4 text-muted" />
          Settings
        </MenuItem>
        <MenuSeparator />
        <MenuItem onSelect={() => logout()}>
          <LogOut className="h-4 w-4 text-muted" />
          Log out
        </MenuItem>
      </MenuContent>
    </Menu>
  );
}
