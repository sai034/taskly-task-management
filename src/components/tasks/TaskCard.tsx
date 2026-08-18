"use client";

import { AvatarGroup } from "@/components/ui/Avatar";
import { PriorityBars } from "@/components/ui/Priority";
import { DateBadge, LabelPill } from "@/components/ui/Tags";
import type { Task } from "@/lib/types";
import { useUiStore } from "@/lib/ui-store";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useRouter } from "next/navigation";

export function TaskCard({ task, overlay }: { task: Task; overlay?: boolean }) {
  const router = useRouter();
  const { fields } = useUiStore();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { group: task.group } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => router.push(`/tasks/${task.id}`)}
      className={cn(
        "group cursor-grab rounded-xl border border-border-default bg-surface p-3 shadow-sm transition-shadow active:cursor-grabbing",
        "hover:border-border-strong hover:shadow-md",
        isDragging && "opacity-40",
        overlay && "rotate-2 cursor-grabbing shadow-xl",
      )}
    >
      <div className="flex items-start gap-2">
        {fields.priority && (
          <span className="mt-0.5">
            <PriorityBars priority={task.priority} />
          </span>
        )}
        <h4 className="min-w-0 flex-1 text-[13.5px] font-medium leading-snug">
          {task.title}
        </h4>
      </div>

      {fields.labels && task.labels.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {task.labels.slice(0, 3).map((l) => (
            <LabelPill key={l} label={l} />
          ))}
          {task.labels.length > 3 && (
            <span className="text-[11px] text-faint">
              +{task.labels.length - 3}
            </span>
          )}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        {fields.members ? (
          <AvatarGroup ids={task.memberIds} size="sm" />
        ) : (
          <span />
        )}
        {fields.dueDate && <DateBadge iso={task.dueDate} />}
      </div>
    </div>
  );
}
