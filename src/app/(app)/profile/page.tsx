"use client";

import { Topbar } from "@/components/layout/Topbar";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";

function Field({
  label,
  hint,
  value,
  placeholder,
  onChange,
  readOnly,
}: {
  label: string;
  hint?: string;
  value: string;
  placeholder?: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2 border-t border-border-default px-4 py-4 sm:grid sm:grid-cols-[220px_1fr] sm:items-center sm:gap-4 sm:px-6">
      <div>
        <div className="text-[13px] font-medium">{label}</div>
        {hint && <div className="text-[12px] text-faint">{hint}</div>}
      </div>
      {readOnly ? (
        <div className="flex items-center justify-between gap-2 text-[13px] text-muted">
          <span>{value}</span>
          <Pencil className="h-3.5 w-3.5 text-faint" />
        </div>
      ) : (
        <input
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          className={cn(
            "h-9 rounded-lg border border-border-default bg-surface-2 px-3 text-[13px] outline-none transition-colors",
            "focus:border-accent focus:bg-surface focus-accent",
          )}
        />
      )}
    </div>
  );
}

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  if (!user) return null;

  return (
    <>
      <Topbar title="Profile" />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
          <div className="mb-6 flex items-center gap-3">
            <span
              className="grid h-12 w-12 place-items-center rounded-full text-base font-semibold text-white"
              style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)" }}
            >
              {user.name.slice(0, 1).toUpperCase()}
            </span>
            <h1 className="text-xl font-semibold tracking-tight">Profile</h1>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border-default bg-surface">
            <div className="flex items-center justify-between px-4 py-4 sm:px-6">
              <div className="text-[13px] font-medium">Profile picture</div>
              <span
                className="grid h-10 w-10 place-items-center rounded-full text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)" }}
              >
                {user.name.slice(0, 1).toUpperCase()}
              </span>
            </div>

            <Field label="Email" value={user.email} readOnly />
            <Field
              label="Full name"
              value={user.name}
              placeholder="Your name"
              onChange={(v) => updateUser({ name: v })}
            />
            <Field
              label="Title"
              hint="Your job title or role"
              value={user.title}
              placeholder="Designer"
              onChange={(v) => updateUser({ title: v })}
            />
            <Field
              label="Username"
              hint="One word, like a nickname or first name"
              value={user.username}
              placeholder="username"
              onChange={(v) => updateUser({ username: v })}
            />
          </div>

          <h2 className="mb-3 mt-8 text-[15px] font-semibold">Workspace access</h2>
          <div className="flex flex-col gap-3 rounded-2xl border border-border-default bg-surface px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <span className="text-[13px] text-muted">
              Remove yourself from the workspace
            </span>
            <Button variant="danger" size="sm" onClick={logout}>
              Leave Workspace
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
