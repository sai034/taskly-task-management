import { cn, formatShort, isOverdue } from "@/lib/utils";
import { labelMeta, statusMeta, type LabelKey, type Status } from "@/lib/types";
import { CalendarDays, Tag } from "lucide-react";

export function LabelPill({ label }: { label: LabelKey }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-border-default bg-surface-2 px-1.5 py-0.5 text-[11px] font-medium text-muted">
      <Tag className="h-3 w-3" />
      {labelMeta(label).label}
    </span>
  );
}

export function StatusDot({
  status,
  withLabel = true,
}: {
  status: Status;
  withLabel?: boolean;
}) {
  const meta = statusMeta(status);
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="h-2 w-2 shrink-0 rounded-full"
        style={{ background: meta.color }}
      />
      {withLabel && <span className="text-[13px]">{meta.label}</span>}
    </span>
  );
}

export function DateBadge({
  iso,
  className,
}: {
  iso: string | null;
  className?: string;
}) {
  if (!iso) return null;
  const overdue = isOverdue(iso);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium",
        overdue
          ? "bg-p-urgent/10 text-p-urgent"
          : "bg-surface-2 text-muted border border-border-default",
        className,
      )}
    >
      <CalendarDays className="h-3 w-3" />
      {formatShort(iso)}
    </span>
  );
}
