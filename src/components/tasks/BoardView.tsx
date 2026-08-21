"use client";

import { GROUPS, type GroupKey, type Task } from "@/lib/types";
import { statusForGroup, useTaskStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TaskCard } from "./TaskCard";

function Column({
  group,
  tasks,
  onAdd,
}: {
  group: GroupKey;
  tasks: Task[];
  onAdd: (g: GroupKey) => void;
}) {
  const meta = GROUPS.find((g) => g.key === group)!;
  const { setNodeRef, isOver } = useDroppable({ id: `col-${group}` });

  return (
    <div className="flex min-w-0 flex-col">
      <div className="mb-2 flex items-center gap-2 px-1">
        <span
          className="h-2.5 w-2.5 rounded-[3px]"
          style={{ background: meta.dot }}
        />
        <span className="text-[13px] font-semibold">{meta.label}</span>
        <span className="rounded-md bg-surface-2 px-1.5 py-0.5 text-[11px] font-medium text-muted">
          {tasks.length}
        </span>
        <button
          onClick={() => onAdd(group)}
          className="ml-auto grid h-6 w-6 place-items-center rounded-md text-faint hover:bg-hover hover:text-text"
          aria-label={`Add task to ${meta.label}`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex min-h-[120px] flex-1 flex-col gap-2 rounded-xl p-1 transition-colors",
          isOver && "bg-accent-soft/60",
        )}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((t) => (
            <TaskCard key={t.id} task={t} />
          ))}
        </SortableContext>

        <button
          onClick={() => onAdd(group)}
          className="flex items-center gap-1.5 rounded-lg px-2 py-2 text-[13px] text-faint transition-colors hover:bg-hover hover:text-muted"
        >
          <Plus className="h-4 w-4" /> Add Task
        </button>
      </div>
    </div>
  );
}

export function BoardView({ tasks }: { tasks: Task[] }) {
  const { updateTask, addTask } = useTaskStore();
  const router = useRouter();
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleAdd = async (group: GroupKey) => {
    const t = await addTask(group);
    router.push(`/tasks/${t.id}`);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const byGroup = (g: GroupKey) =>
    tasks
      .filter((t) => t.group === g)
      .sort((a, b) => a.order - b.order);

  const findGroup = (id: string): GroupKey | null => {
    if (id.startsWith("col-")) return id.replace("col-", "") as GroupKey;
    return tasks.find((t) => t.id === id)?.group ?? null;
  };

  const onDragStart = (e: DragStartEvent) => setActiveId(e.active.id as string);

  const onDragOver = (e: DragOverEvent) => {
    const { active, over } = e;
    if (!over) return;
    const activeGroup = findGroup(active.id as string);
    const overGroup = findGroup(over.id as string);
    if (!activeGroup || !overGroup || activeGroup === overGroup) return;
    updateTask(active.id as string, {
      group: overGroup,
      status: statusForGroup(overGroup),
    });
  };

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    setActiveId(null);
    if (!over) return;

    const group = findGroup(over.id as string);
    if (!group) return;

    const column = byGroup(group);
    const oldIndex = column.findIndex((t) => t.id === active.id);
    const overIndex = column.findIndex((t) => t.id === over.id);
    const target = overIndex === -1 ? column.length : overIndex;

    const reordered = [...column];
    if (oldIndex !== -1) {
      const [moved] = reordered.splice(oldIndex, 1);
      reordered.splice(target, 0, moved);
    }
    reordered.forEach((t, i) => updateTask(t.id, { order: i }));
  };

  const activeTask = tasks.find((t) => t.id === activeId) ?? null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      {/* Responsive board: 1 column on phones, 2 on tablets, 4 on desktop —
          no horizontal scrolling. */}
      <div className="grid grid-cols-1 items-start gap-4 px-3 pb-6 pt-3 sm:px-4 md:grid-cols-2 xl:grid-cols-4">
        {GROUPS.map((g) => (
          <Column
            key={g.key}
            group={g.key}
            tasks={byGroup(g.key)}
            onAdd={handleAdd}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask && <TaskCard task={activeTask} overlay />}
      </DragOverlay>
    </DndContext>
  );
}
