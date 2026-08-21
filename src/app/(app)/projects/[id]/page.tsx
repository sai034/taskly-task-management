"use client";

import { Topbar } from "@/components/layout/Topbar";
import { ListView } from "@/components/tasks/ListView";
import { ListSkeleton } from "@/components/skeletons";
import { Button } from "@/components/ui/Button";
import { useTaskStore } from "@/lib/store";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const project = useTaskStore((s) => s.projects.find((p) => p.id === id));
  const tasks = useTaskStore((s) => s.tasks);
  const hydrated = useTaskStore((s) => s.hydrated);

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

  return (
    <>
      <Topbar
        breadcrumb={
          <nav className="flex items-center gap-1.5 text-[13px] text-muted">
            <Link href="/projects" className="hover:text-text">
              Projects
            </Link>
            <span className="text-faint">/</span>
            <span className="truncate font-medium text-text">{project.name}</span>
          </nav>
        }
      />
      <div className="min-h-0 flex-1 overflow-y-auto">
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
