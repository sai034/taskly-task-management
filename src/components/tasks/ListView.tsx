"use client";

import { DatePicker } from "@/components/pickers/DatePicker";
import { MemberPicker } from "@/components/pickers/MemberPicker";
import { PriorityPicker } from "@/components/pickers/PriorityPicker";
import { AvatarGroup } from "@/components/ui/Avatar";
import { PriorityTag } from "@/components/ui/Priority";
import { DateBadge, LabelPill, StatusDot } from "@/components/ui/Tags";
import { useTaskStore } from "@/lib/store";
import { GROUPS, type GroupKey, type Task } from "@/lib/types";
import { useUiStore } from "@/lib/ui-store";
import { cn, formatDate, getMember } from "@/lib/utils";
import { ChevronRight, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
} from "@/components/ui/Menu";

function Row({ task }: { task: Task }) {
  const router = useRouter();
  const { fields } = useUiStore();
  const { updateTask, deleteTask } = useTaskStore();
  const reporter = getMember(task.reporterId);

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      onClick={() => router.push(`/tasks/${task.id}`)}
      className="group grid cursor-pointer grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 border-t border-border-default px-3 py-2.5 transition-colors hover:bg-hover sm:px-4 md:grid-cols-[minmax(0,1fr)_repeat(var(--cols),minmax(0,auto))_2rem]"
      style={
        {
          ["--cols" as string]: [
            fields.priority,
            fields.members,
            fields.dueDate,
            fields.status,
            fields.labels,
            fields.reporter,
          ].filter(Boolean).length,
        } as React.CSSProperties
      }
    >
      {/* Title */}
      <div className="min-w-0">
        <div className="truncate text-[13.5px] font-medium">{task.title}</div>
        {/* Mobile meta row */}
        <div className="mt-1 flex flex-wrap items-center gap-1.5 md:hidden">
          {fields.priority && <PriorityTag priority={task.priority} />}
          {fields.dueDate && <DateBadge iso={task.dueDate} />}
        </div>
      </div>

      {/* Desktop cells */}
      {fields.priority && (
        <div className="hidden md:block" onClick={stop}>
          <PriorityPicker
            value={task.priority}
            onChange={(p) => updateTask(task.id, { priority: p })}
          />
        </div>
      )}
      {fields.members && (
        <div className="hidden md:block" onClick={stop}>
          <MemberPicker
            value={task.memberIds}
            onChange={(ids) => updateTask(task.id, { memberIds: ids })}
          />
        </div>
      )}
      {fields.dueDate && (
        <div className="hidden text-[13px] text-muted md:block" onClick={stop}>
          <DatePicker
            value={task.dueDate}
            onChange={(d) => updateTask(task.id, { dueDate: d })}
          >
            <button className="rounded-md px-1.5 py-1 hover:bg-active focus-accent">
              {task.dueDate ? formatDate(task.dueDate) : <span className="text-faint">—</span>}
            </button>
          </DatePicker>
        </div>
      )}
      {fields.status && (
        <div className="hidden md:block" onClick={stop}>
          <StatusDot status={task.status} />
        </div>
      )}
      {fields.labels && (
        <div className="hidden max-w-[220px] flex-wrap gap-1 md:flex">
          {task.labels.slice(0, 2).map((l) => (
            <LabelPill key={l} label={l} />
          ))}
        </div>
      )}
      {fields.reporter && (
        <div className="hidden text-[13px] text-muted md:block">
          {reporter ? (
            <AvatarGroup ids={[reporter.id]} />
          ) : (
            <span className="text-faint">—</span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end md:col-auto" onClick={stop}>
        <Menu>
          <MenuTrigger asChild>
            <button className="grid h-7 w-7 place-items-center rounded-md text-faint opacity-0 transition-opacity hover:bg-active hover:text-text group-hover:opacity-100 data-[state=open]:opacity-100">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </MenuTrigger>
          <MenuContent align="end">
            <MenuItem onSelect={() => router.push(`/tasks/${task.id}`)}>
              Open task
            </MenuItem>
            <MenuItem
              className="text-p-urgent data-[highlighted]:bg-p-urgent/10"
              onSelect={() => deleteTask(task.id)}
            >
              <Trash2 className="h-4 w-4" /> Delete
            </MenuItem>
          </MenuContent>
        </Menu>
      </div>
    </div>
  );
}

function Group({
  group,
  tasks,
}: {
  group: GroupKey;
  tasks: Task[];
}) {
  const [open, setOpen] = useState(true);
  const { addTask } = useTaskStore();
  const meta = GROUPS.find((g) => g.key === group)!;

  return (
    <div className="overflow-hidden rounded-xl border border-border-default bg-surface">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 bg-surface-2 px-3 py-2 text-left sm:px-4"
      >
        <ChevronRight
          className={cn(
            "h-4 w-4 text-muted transition-transform",
            open && "rotate-90",
          )}
        />
        <span
          className="h-2 w-2 rounded-full"
          style={{ background: meta.dot }}
        />
        <span className="text-[13px] font-semibold">{meta.label}</span>
        <span className="rounded-md bg-surface px-1.5 py-0.5 text-[11px] font-medium text-muted">
          {tasks.length}
        </span>
      </button>

      {open && (
        <div>
          {tasks.map((t) => (
            <Row key={t.id} task={t} />
          ))}
          <button
            onClick={() => addTask(group)}
            className="flex w-full items-center gap-1.5 border-t border-border-default px-3 py-2.5 text-[13px] text-faint hover:bg-hover hover:text-muted sm:px-4"
          >
            <Plus className="h-4 w-4" /> Add Task
          </button>
        </div>
      )}
    </div>
  );
}

export function ListView({ tasks }: { tasks: Task[] }) {
  return (
    <div className="space-y-3 px-3 pb-6 pt-3 sm:px-4">
      {GROUPS.map((g) => (
        <Group
          key={g.key}
          group={g.key}
          tasks={tasks
            .filter((t) => t.group === g.key)
            .sort((a, b) => a.order - b.order)}
        />
      ))}
    </div>
  );
}
