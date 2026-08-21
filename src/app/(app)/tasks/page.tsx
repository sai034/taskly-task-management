"use client";

import { Topbar } from "@/components/layout/Topbar";
import { BoardView } from "@/components/tasks/BoardView";
import { FieldsMenu } from "@/components/tasks/FieldsMenu";
import { FilterMenu } from "@/components/tasks/FilterMenu";
import { ListView } from "@/components/tasks/ListView";
import { PageToolbar } from "@/components/tasks/PageToolbar";
import { Button } from "@/components/ui/Button";
import { useTaskStore } from "@/lib/store";
import { useUiStore } from "@/lib/ui-store";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function TasksPage() {
  const router = useRouter();
  const tasks = useTaskStore((s) => s.tasks);
  const addTask = useTaskStore((s) => s.addTask);
  const { view, priorityFilter } = useUiStore();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks.filter((t) => {
      if (priorityFilter && t.priority !== priorityFilter) return false;
      if (q && !t.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [tasks, query, priorityFilter]);

  const handleAdd = async () => {
    const t = await addTask("todo", { title: "Untitled Task" });
    router.push(`/tasks/${t.id}`);
  };

  return (
    <>
      <Topbar
        breadcrumb={
          <PageToolbar title="Tasks" query={query} onQuery={setQuery}>
            <FieldsMenu />
            <FilterMenu />
            <Button variant="solid" size="sm" onClick={handleAdd}>
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Task</span>
            </Button>
          </PageToolbar>
        }
      />
      <div className="min-h-0 flex-1 overflow-y-auto">
        {view === "board" ? (
          <BoardView tasks={filtered} />
        ) : (
          <ListView tasks={filtered} />
        )}
      </div>
    </>
  );
}
