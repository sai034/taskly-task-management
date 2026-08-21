"use client";

import { Topbar } from "@/components/layout/Topbar";
import { DatePicker } from "@/components/pickers/DatePicker";
import { MemberPicker } from "@/components/pickers/MemberPicker";
import { PriorityPicker } from "@/components/pickers/PriorityPicker";
import { ListView } from "@/components/tasks/ListView";
import { ListSkeleton } from "@/components/skeletons";
import { AvatarGroup } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { PriorityTag } from "@/components/ui/Priority";
import { useTaskStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import { CalendarDays, Check, Pencil, UserRound } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const project = useTaskStore((s) => s.projects.find((p) => p.id === id));
  const tasks = useTaskStore((s) => s.tasks);
  const hydrated = useTaskStore((s) => s.hydrated);
  const updateProject = useTaskStore((s) => s.updateProject);
  const saveState = useTaskStore((s) => s.saveState);
  const resetSaveState = useTaskStore((s) => s.resetSaveState);

  const [name, setName] = useState("");
  useEffect(() => {
    if (project) {
      setName(project.name);
      resetSaveState();
    }
  }, [project?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const projectTasks = useMemo(
    () => tasks.filter((t) => t.projectId === id),
    [tasks, id],
  );

  if (!project && !hydrated) {
    return (
      <>
        <Topbar title="Project" />
        <div className="min-h-0 flex-1 overflow-y-auto">
          <ListSkeleton />
        </div>
      </>
    );
  }

  if (!project) {
    return (
      <>
        <Topbar title="Project" />
        <div className="grid flex-1 place-items-center p-8 text-center">
          <div>
            <p className="text-sm text-muted">This project no longer exists.</p>
            <Button className="mt-3" onClick={() => router.push("/projects")}>
              Back to Projects
            </Button>
          </div>
        </div>
      </>
    );
  }

  const saveName = () => {
    const next = name.trim() || "Untitled Project";
    if (next !== name) setName(next);
    if (next !== project.name) updateProject(project.id, { name: next });
  };

  return (
    <>
      <Topbar
        breadcrumb={
          <nav className="flex items-center gap-1.5 text-[13px] text-muted">
            <Link href="/projects" className="hover:text-text">
              Projects
            </Link>
            <span className="text-faint">/</span>
            <span className="truncate font-medium text-text">{name || project.name}</span>
          </nav>
        }
      />
      <div className="min-h-0 flex-1 overflow-y-auto bg-surface">
        {/* Editable project header */}
        <div className="px-3 pt-5 sm:px-6">
          <div className="relative -mx-2.5">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={saveName}
              placeholder="Project name"
              aria-label="Project name (editable)"
              className="w-full rounded-lg bg-transparent px-2.5 py-1.5 pr-11 text-2xl font-semibold tracking-tight outline-none transition-colors hover:bg-hover focus:bg-hover focus:ring-2 focus:ring-[var(--accent-ring)]"
            />
            <span className="pointer-events-none absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md bg-surface-2 text-muted">
              <Pencil className="h-3.5 w-3.5" />
            </span>
          </div>

          {/* Editable properties */}
          <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px]">
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-medium text-muted">Priority</span>
              <PriorityPicker
                value={project.priority}
                onChange={(p) => updateProject(project.id, { priority: p })}
              >
                <button className="inline-flex items-center rounded-md px-1.5 py-1 hover:bg-hover">
                  <PriorityTag priority={project.priority} />
                </button>
              </PriorityPicker>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[12px] font-medium text-muted">Lead</span>
              <MemberPicker
                value={project.leadId ? [project.leadId] : []}
                onChange={(ids) =>
                  updateProject(project.id, { leadId: ids[ids.length - 1] ?? null })
                }
              >
                <button className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-muted hover:bg-hover">
                  {project.leadId ? (
                    <AvatarGroup ids={[project.leadId]} max={1} />
                  ) : (
                    <>
                      <UserRound className="h-3.5 w-3.5" />
                      <span className="text-faint">Add lead</span>
                    </>
                  )}
                </button>
              </MemberPicker>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[12px] font-medium text-muted">Due</span>
              <DatePicker
                value={project.dueDate}
                onChange={(d) => updateProject(project.id, { dueDate: d })}
              >
                <button className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-muted hover:bg-hover">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {project.dueDate ? (
                    formatDate(project.dueDate)
                  ) : (
                    <span className="text-faint">Set date</span>
                  )}
                </button>
              </DatePicker>
            </div>
          </div>

          {/* Auto-save status */}
          <div className="mt-2 flex h-4 items-center gap-1.5 px-0.5 text-[11px] font-medium text-muted">
            {saveState === "saving" ? (
              <>
                <span className="h-2.5 w-2.5 animate-spin rounded-full border-[1.5px] border-border-strong border-t-accent" />
                Saving…
              </>
            ) : saveState === "saved" ? (
              <>
                <Check className="h-3 w-3 text-s-done" />
                Saved
              </>
            ) : (
              <span className="text-faint">
                ✎ Edits save automatically as you type
              </span>
            )}
          </div>

          <h3 className="mb-1 mt-6 text-[13px] font-semibold">Tasks</h3>
        </div>

        {projectTasks.length > 0 ? (
          <ListView tasks={projectTasks} />
        ) : (
          <div className="grid place-items-center p-16 text-center">
            <div className="max-w-xs">
              <div className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-xl bg-surface-2 text-muted">
                <span className="text-lg">📋</span>
              </div>
              <h3 className="text-sm font-semibold">No tasks in this project</h3>
              <p className="mt-1 text-[13px] text-muted">
                Tasks linked to {project.name} will appear here.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
