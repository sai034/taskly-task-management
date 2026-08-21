"use client";

import { Topbar } from "@/components/layout/Topbar";
import { DatePicker } from "@/components/pickers/DatePicker";
import { MemberPicker } from "@/components/pickers/MemberPicker";
import { PriorityPicker } from "@/components/pickers/PriorityPicker";
import { FilterMenu } from "@/components/tasks/FilterMenu";
import { PageToolbar } from "@/components/tasks/PageToolbar";
import { ProjectsSkeleton } from "@/components/skeletons";
import { AvatarGroup } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
} from "@/components/ui/Menu";
import { PriorityTag } from "@/components/ui/Priority";
import { useTaskStore } from "@/lib/store";
import { useUiStore } from "@/lib/ui-store";
import { cn, formatDate } from "@/lib/utils";
import { MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function ProjectsPage() {
  const router = useRouter();
  const { projects, updateProject, deleteProject, addProject } = useTaskStore();
  const hydrated = useTaskStore((s) => s.hydrated);
  const { priorityFilter } = useUiStore();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects
      .filter((p) => (priorityFilter ? p.priority === priorityFilter : true))
      .filter((p) => (q ? p.name.toLowerCase().includes(q) : true))
      .sort((a, b) => a.order - b.order);
  }, [projects, query, priorityFilter]);

  return (
    <>
      <Topbar
        breadcrumb={
          <PageToolbar
            title="Projects"
            query={query}
            onQuery={setQuery}
            placeholder="Search projects..."
          >
            <FilterMenu />
            <Button
              variant="solid"
              size="sm"
              onClick={() => addProject("New Project")}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Project</span>
            </Button>
          </PageToolbar>
        }
      />

      {!hydrated ? (
        <div className="min-h-0 flex-1 overflow-y-auto">
          <ProjectsSkeleton />
        </div>
      ) : (
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-4">
        <div className="overflow-hidden rounded-xl border border-border-default bg-surface">
          {/* Header */}
          <div className="hidden grid-cols-[1fr_130px_90px_130px_44px] gap-4 bg-surface-2 px-4 py-2.5 text-[11px] font-medium uppercase tracking-wide text-faint md:grid">
            <span>Projects</span>
            <span>Priority</span>
            <span>Lead</span>
            <span>Due Date</span>
            <span />
          </div>

          {filtered.map((p) => (
            <div
              key={p.id}
              onClick={() => router.push(`/projects/${p.id}`)}
              className="group grid cursor-pointer grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5 border-t border-border-default px-4 py-3 transition-colors hover:bg-hover md:grid-cols-[1fr_130px_90px_130px_44px]"
            >
              <div className="min-w-0">
                <span className="truncate text-[13.5px] font-medium">{p.name}</span>
                <div className="mt-1 flex items-center gap-2 md:hidden">
                  <PriorityTag priority={p.priority} />
                  {p.dueDate && (
                    <span className="text-[12px] text-muted">{formatDate(p.dueDate)}</span>
                  )}
                </div>
              </div>

              <div className="hidden md:block" onClick={(e) => e.stopPropagation()}>
                <PriorityPicker
                  value={p.priority}
                  onChange={(pr) => updateProject(p.id, { priority: pr })}
                />
              </div>
              <div className="hidden md:block" onClick={(e) => e.stopPropagation()}>
                <MemberPicker
                  value={p.leadId ? [p.leadId] : []}
                  onChange={(ids) =>
                    updateProject(p.id, { leadId: ids[ids.length - 1] ?? null })
                  }
                >
                  <button className="rounded-md px-1 py-1 hover:bg-active">
                    <AvatarGroup ids={p.leadId ? [p.leadId] : []} max={1} />
                  </button>
                </MemberPicker>
              </div>
              <div
                className="hidden text-[13px] text-muted md:block"
                onClick={(e) => e.stopPropagation()}
              >
                <DatePicker
                  value={p.dueDate}
                  onChange={(d) => updateProject(p.id, { dueDate: d })}
                >
                  <button
                    className={cn(
                      "rounded-md px-1.5 py-1 hover:bg-active",
                      !p.dueDate && "text-faint",
                    )}
                  >
                    {p.dueDate ? formatDate(p.dueDate) : "—"}
                  </button>
                </DatePicker>
              </div>

              <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                <Menu>
                  <MenuTrigger asChild>
                    <button className="grid h-7 w-7 place-items-center rounded-md text-faint opacity-0 hover:bg-active hover:text-text group-hover:opacity-100 data-[state=open]:opacity-100">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </MenuTrigger>
                  <MenuContent align="end">
                    <MenuItem onSelect={() => router.push(`/projects/${p.id}`)}>
                      Open project
                    </MenuItem>
                    <MenuItem
                      className="text-p-urgent data-[highlighted]:bg-p-urgent/10"
                      onSelect={() => deleteProject(p.id)}
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </MenuItem>
                  </MenuContent>
                </Menu>
              </div>
            </div>
          ))}

          <button
            onClick={() => addProject("New Project")}
            className="flex w-full items-center gap-1.5 border-t border-border-default px-4 py-3 text-[13px] text-faint hover:bg-hover hover:text-muted"
          >
            <Plus className="h-4 w-4" /> Add Projects
          </button>
        </div>
      </div>
      )}
    </>
  );
}
