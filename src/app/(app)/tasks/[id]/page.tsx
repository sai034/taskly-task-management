"use client";

import { Topbar } from "@/components/layout/Topbar";
import { Comments } from "@/components/tasks/Comments";
import { SubtaskTable } from "@/components/tasks/SubtaskTable";
import { TaskDetailPanel } from "@/components/tasks/TaskDetailPanel";
import { UpdatesFeed } from "@/components/tasks/UpdatesFeed";
import { TaskDetailSkeleton } from "@/components/skeletons";
import { LabelPicker } from "@/components/pickers/LabelPicker";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { DateBadge, LabelPill } from "@/components/ui/Tags";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
} from "@/components/ui/Menu";
import { useTaskStore } from "@/lib/store";
import { getMember } from "@/lib/utils";
import {
  Eye,
  Link2,
  Lock,
  MoreHorizontal,
  Plus,
  Tag,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const task = useTaskStore((s) => s.tasks.find((t) => t.id === id));
  const hydrated = useTaskStore((s) => s.hydrated);
  const { updateTask, deleteTask } = useTaskStore();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDesc(task.description);
    }
  }, [task?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!task && !hydrated) {
    return (
      <>
        <Topbar title="Task" />
        <div className="min-h-0 flex-1 overflow-y-auto bg-surface">
          <TaskDetailSkeleton />
        </div>
      </>
    );
  }

  if (!task) {
    return (
      <>
        <Topbar title="Task" />
        <div className="grid flex-1 place-items-center p-8 text-center">
          <div>
            <p className="text-sm text-muted">This task no longer exists.</p>
            <Button className="mt-3" onClick={() => router.push("/tasks")}>
              Back to Tasks
            </Button>
          </div>
        </div>
      </>
    );
  }

  const designer = getMember(task.reporterId);

  return (
    <>
      <Topbar
        breadcrumb={
          <nav className="flex items-center gap-1.5 text-[13px] text-muted">
            <Link href="/tasks" className="hover:text-text">
              Tasks
            </Link>
            <span className="text-faint">/</span>
            <span className="truncate font-medium text-text">{task.title}</span>
          </nav>
        }
        actions={
          <>
            <button className="hidden h-8 w-8 place-items-center rounded-lg text-muted hover:bg-hover sm:grid">
              <Lock className="h-4 w-4" />
            </button>
            <button className="hidden h-8 items-center gap-1.5 rounded-lg px-2 text-[13px] text-muted hover:bg-hover sm:inline-flex">
              <Eye className="h-4 w-4" /> 1
            </button>
            <Menu>
              <MenuTrigger asChild>
                <button className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-hover">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </MenuTrigger>
              <MenuContent align="end">
                <MenuItem>
                  <Link2 className="h-4 w-4" /> Copy link
                </MenuItem>
                <MenuItem
                  className="text-p-urgent data-[highlighted]:bg-p-urgent/10"
                  onSelect={() => {
                    deleteTask(task.id);
                    router.push("/tasks");
                  }}
                >
                  <Trash2 className="h-4 w-4" /> Delete task
                </MenuItem>
              </MenuContent>
            </Menu>
          </>
        }
      />

      <div className="min-h-0 flex-1 overflow-y-auto bg-surface">
        <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 sm:py-6">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_308px]">
            {/* Main */}
            <div className="order-2 min-w-0 lg:order-1">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => updateTask(task.id, { title: title.trim() || "Untitled Task" })}
                className="w-full bg-transparent text-2xl font-semibold tracking-tight outline-none"
                placeholder="Task title"
              />
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                onBlur={() => updateTask(task.id, { description: desc })}
                rows={2}
                placeholder="Add a description..."
                className="mt-2 w-full resize-none bg-transparent text-[14px] leading-relaxed text-muted outline-none placeholder:text-faint"
              />

              {/* Properties */}
              <div className="mt-4 space-y-2.5">
                <div className="grid grid-cols-[92px_1fr] items-center gap-2">
                  <span className="text-[12px] font-medium text-muted">Properties</span>
                  <div className="flex flex-wrap items-center gap-2">
                    {designer && (
                      <span className="inline-flex items-center gap-1.5 rounded-md border border-border-default bg-surface-2 px-2 py-1 text-[12px]">
                        <Avatar member={designer} size="xs" /> {designer.name}
                      </span>
                    )}
                    <DateBadge iso={task.dueDate} />
                  </div>
                </div>

                <div className="grid grid-cols-[92px_1fr] items-start gap-2">
                  <span className="pt-1 text-[12px] font-medium text-muted">Labels</span>
                  <LabelPicker
                    value={task.labels}
                    onChange={(l) => updateTask(task.id, { labels: l })}
                  >
                    <button className="flex flex-wrap items-center gap-1.5 text-left">
                      {task.labels.map((l) => (
                        <LabelPill key={l} label={l} />
                      ))}
                      <span className="inline-flex items-center gap-1 rounded-md border border-dashed border-border-strong px-1.5 py-0.5 text-[11px] text-faint hover:text-muted">
                        <Plus className="h-3 w-3" /> Label
                      </span>
                    </button>
                  </LabelPicker>
                </div>

                <div className="grid grid-cols-[92px_1fr] items-center gap-2">
                  <span className="text-[12px] font-medium text-muted">Resources</span>
                  <button className="inline-flex items-center gap-1.5 text-[13px] text-faint hover:text-muted">
                    <Tag className="h-3.5 w-3.5" /> Add document or link...
                  </button>
                </div>
              </div>

              {/* Subtasks */}
              <div className="mt-6">
                <h3 className="mb-2.5 text-[13px] font-semibold">Subtasks</h3>
                <SubtaskTable task={task} />
              </div>

              {/* Comments */}
              <div className="mt-6">
                <Comments task={task} />
              </div>
            </div>

            {/* Details panel + Updates feed */}
            <div className="order-1 lg:order-2">
              <div className="lg:sticky lg:top-4">
                <TaskDetailPanel task={task} />
                <UpdatesFeed task={task} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
