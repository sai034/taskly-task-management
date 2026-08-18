import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SEED_PROJECTS, SEED_TASKS } from "./seed";
import type {
  Comment,
  GroupKey,
  Priority,
  Project,
  Status,
  Subtask,
  Task,
} from "./types";
import { uid } from "./utils";

interface TaskState {
  tasks: Task[];
  projects: Project[];

  addTask: (group: GroupKey, partial?: Partial<Task>) => Task;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, group: GroupKey, order: number) => void;
  reorderWithin: (group: GroupKey, orderedIds: string[]) => void;

  addSubtask: (taskId: string, title: string) => void;
  updateSubtask: (taskId: string, subtaskId: string, patch: Partial<Subtask>) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;

  addComment: (taskId: string, authorId: string, body: string) => void;

  addProject: (name: string) => void;
  updateProject: (id: string, patch: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  reset: () => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: SEED_TASKS,
      projects: SEED_PROJECTS,

      addTask: (group, partial) => {
        const maxOrder = Math.max(
          0,
          ...get().tasks.filter((t) => t.group === group).map((t) => t.order),
        );
        const task: Task = {
          id: uid("t"),
          title: partial?.title ?? "New Task",
          description: partial?.description ?? "",
          group,
          status: partial?.status ?? "todo",
          priority: partial?.priority ?? "none",
          labels: partial?.labels ?? [],
          memberIds: partial?.memberIds ?? [],
          reporterId: partial?.reporterId ?? "u-dexter",
          dueDate: partial?.dueDate ?? null,
          startDate: partial?.startDate ?? null,
          subtasks: [],
          comments: [],
          projectId: partial?.projectId ?? null,
          order: maxOrder + 1,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ tasks: [...s.tasks, task] }));
        return task;
      },

      updateTask: (id, patch) =>
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        })),

      deleteTask: (id) =>
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

      moveTask: (id, group, order) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id ? { ...t, group, order } : t,
          ),
        })),

      reorderWithin: (group, orderedIds) =>
        set((s) => ({
          tasks: s.tasks.map((t) => {
            const idx = orderedIds.indexOf(t.id);
            return idx >= 0 && t.group === group ? { ...t, order: idx } : t;
          }),
        })),

      addSubtask: (taskId, title) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  subtasks: [
                    ...t.subtasks,
                    {
                      id: uid("st"),
                      title,
                      priority: "none" as Priority,
                      memberIds: [],
                      dueDate: null,
                      done: false,
                    },
                  ],
                }
              : t,
          ),
        })),

      updateSubtask: (taskId, subtaskId, patch) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  subtasks: t.subtasks.map((st) =>
                    st.id === subtaskId ? { ...st, ...patch } : st,
                  ),
                }
              : t,
          ),
        })),

      deleteSubtask: (taskId, subtaskId) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId
              ? { ...t, subtasks: t.subtasks.filter((st) => st.id !== subtaskId) }
              : t,
          ),
        })),

      addComment: (taskId, authorId, body) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  comments: [
                    ...t.comments,
                    {
                      id: uid("c"),
                      authorId,
                      body,
                      createdAt: new Date().toISOString(),
                    } satisfies Comment,
                  ],
                }
              : t,
          ),
        })),

      addProject: (name) =>
        set((s) => ({
          projects: [
            ...s.projects,
            {
              id: uid("p"),
              name,
              priority: "none" as Priority,
              leadId: null,
              dueDate: null,
              order: s.projects.length,
            },
          ],
        })),

      updateProject: (id, patch) =>
        set((s) => ({
          projects: s.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),

      deleteProject: (id) =>
        set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),

      reset: () => set({ tasks: SEED_TASKS, projects: SEED_PROJECTS }),
    }),
    { name: "tm-data-v1" },
  ),
);

/** Status helper kept out of the component layer. */
export function statusForGroup(group: GroupKey): Status {
  switch (group) {
    case "todo":
      return "todo";
    case "doing":
      return "in_progress";
    case "completed":
      return "done";
    case "on_hold":
      return "backlog";
  }
}
