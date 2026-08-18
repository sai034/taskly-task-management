import { cn, getMembers } from "@/lib/utils";
import type { Member } from "@/lib/types";

const sizeMap = {
  xs: "h-5 w-5 text-[9px]",
  sm: "h-6 w-6 text-[10px]",
  md: "h-7 w-7 text-[11px]",
  lg: "h-9 w-9 text-[13px]",
};

export function Avatar({
  member,
  size = "sm",
  className,
  ring,
}: {
  member: Member;
  size?: keyof typeof sizeMap;
  className?: string;
  ring?: boolean;
}) {
  return (
    <span
      title={member.name}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white",
        sizeMap[size],
        ring && "ring-2 ring-surface",
        className,
      )}
      style={{ background: member.color }}
    >
      {member.initials}
    </span>
  );
}

export function AvatarGroup({
  ids,
  size = "sm",
  max = 3,
  className,
}: {
  ids: string[];
  size?: keyof typeof sizeMap;
  max?: number;
  className?: string;
}) {
  const members = getMembers(ids);
  const shown = members.slice(0, max);
  const extra = members.length - shown.length;

  if (members.length === 0) {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-full border border-dashed border-border-strong text-faint",
          sizeMap[size],
          className,
        )}
      >
        +
      </span>
    );
  }

  return (
    <div className={cn("flex items-center -space-x-1.5", className)}>
      {shown.map((m) => (
        <Avatar key={m.id} member={m} size={size} ring />
      ))}
      {extra > 0 && (
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-full bg-active font-semibold text-muted ring-2 ring-surface",
            sizeMap[size],
          )}
        >
          +{extra}
        </span>
      )}
    </div>
  );
}
