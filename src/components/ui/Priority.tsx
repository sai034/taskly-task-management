import { cn } from "@/lib/utils";
import { priorityMeta, type Priority } from "@/lib/types";

/** Ascending signal-bars indicator (matches the Figma priority glyph). */
export function PriorityBars({
  priority,
  className,
}: {
  priority: Priority;
  className?: string;
}) {
  const meta = priorityMeta(priority);
  const heights = [6, 9, 12];
  return (
    <span
      className={cn("inline-flex items-end gap-[2px]", className)}
      aria-hidden
    >
      {heights.map((h, i) => {
        const filled = i < meta.bars;
        return (
          <span
            key={i}
            className="w-[3px] rounded-[1px]"
            style={{
              height: h,
              background: filled ? meta.color : "var(--border-strong)",
            }}
          />
        );
      })}
    </span>
  );
}

export function PriorityTag({
  priority,
  className,
}: {
  priority: Priority;
  className?: string;
}) {
  const meta = priorityMeta(priority);
  if (priority === "none") {
    return (
      <span className={cn("inline-flex items-center gap-1.5 text-faint", className)}>
        <PriorityBars priority={priority} />
        <span className="text-[13px]">No Priority</span>
      </span>
    );
  }
  return (
    <span
      className={cn("inline-flex items-center gap-1.5", className)}
      style={{ color: meta.color }}
    >
      <PriorityBars priority={priority} />
      <span className="text-[13px] font-medium">{meta.label}</span>
    </span>
  );
}
