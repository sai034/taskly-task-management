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

export function WorkspaceMenu() {
  const { user, logout } = useAuth();
  const { mode, setMode, accent, setAccent } = useTheme();
  const router = useRouter();

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

      <MenuContent align="start" className="min-w-[220px]">
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

        {/* Change Theme -> Light / Dark */}
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

        {/* Color Mode -> accent swatches */}
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
