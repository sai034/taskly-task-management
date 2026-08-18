"use client";

import { DatePicker } from "@/components/pickers/DatePicker";
import { MemberPicker } from "@/components/pickers/MemberPicker";
import { PriorityPicker } from "@/components/pickers/PriorityPicker";
import { AvatarGroup } from "@/components/ui/Avatar";
import { PriorityTag } from "@/components/ui/Priority";
import { useTaskStore } from "@/lib/store";
import type { Task } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Check, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export function SubtaskTable({ task }: { task: Task }) {
  const { updateSubtask, deleteSubtask, addSubtask } = useTaskStore();
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");

  const commit = () => {
    if (title.trim()) addSubtask(task.id, title.trim());
    setTitle("");
    setAdding(false);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border-default">
      {/* Header */}
      <div className="hidden grid-cols-[1fr_120px_90px_130px_40px] gap-3 bg-surface-2 px-3 py-2 text-[11px] font-medium uppercase tracking-wide text-faint sm:grid">
        <span>Task</span>
        <span>Priority</span>
        <span>Members</span>
        <span>Due Date</span>
        <span />
      </div>

      {task.subtasks.map((st) => (
        <div
          key={st.id}
          className="group grid grid-cols-[1fr_auto] items-center gap-3 border-t border-border-default px-3 py-2.5 sm:grid-cols-[1fr_120px_90px_130px_40px]"
        >
          <div className="flex min-w-0 items-center gap-2.5">
            <button
              onClick={() =>
                updateSubtask(task.id, st.id, { done: !st.done })
              }
              className={`grid h-4 w-4 shrink-0 place-items-center rounded-[5px] border transition-colors ${
                st.done
                  ? "border-accent bg-accent text-accent-fg"
                  : "border-border-strong hover:border-accent"
              }`}
            >
              {st.done && <Check className="h-3 w-3" />}
            </button>
            <span
              className={`truncate text-[13px] ${
                st.done ? "text-faint line-through" : ""
              }`}
            >
              {st.title}
            </span>
          </div>

          <div className="hidden sm:block">
            <PriorityPicker
              value={st.priority}
              onChange={(p) => updateSubtask(task.id, st.id, { priority: p })}
            />
          </div>
          <div className="hidden sm:block">
            <MemberPicker
              value={st.memberIds}
              onChange={(ids) => updateSubtask(task.id, st.id, { memberIds: ids })}
            />
          </div>
          <div className="hidden text-[13px] text-muted sm:block">
            <DatePicker
              value={st.dueDate}
              onChange={(d) => updateSubtask(task.id, st.id, { dueDate: d })}
            >
              <button className="rounded-md px-1.5 py-1 hover:bg-hover">
                {st.dueDate ? formatDate(st.dueDate) : <span className="text-faint">—</span>}
              </button>
            </DatePicker>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => deleteSubtask(task.id, st.id)}
              className="grid h-7 w-7 place-items-center rounded-md text-faint opacity-0 hover:bg-hover hover:text-p-urgent group-hover:opacity-100"
              aria-label="Delete subtask"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Mobile meta */}
          <div className="col-span-2 -mt-1 flex items-center gap-2 pl-7 sm:hidden">
            <PriorityTag priority={st.priority} />
            {st.dueDate && (
              <span className="text-[12px] text-muted">{formatDate(st.dueDate)}</span>
            )}
            <AvatarGroup ids={st.memberIds} size="xs" />
          </div>
        </div>
      ))}

      {/* Add row */}
      {adding ? (
        <div className="flex items-center gap-2 border-t border-border-default px-3 py-2.5">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") {
                setTitle("");
                setAdding(false);
              }
            }}
            onBlur={commit}
            placeholder="Subtask title..."
            className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-faint"
          />
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="flex w-full items-center gap-1.5 border-t border-border-default px-3 py-2.5 text-[13px] text-faint hover:bg-hover hover:text-muted"
        >
          <Plus className="h-4 w-4" /> Add Subtasks
        </button>
      )}
    </div>
  );
}
