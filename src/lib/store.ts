import { toast } from "sonner";
import { create } from "zustand";
import { api } from "./api";
import { SEED_PROJECTS, SEED_TASKS } from "./seed";
import type {
  Activity,
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
  hydrated: boolean;
  online: boolean;
  /** Global persistence indicator for any edit (idle / saving / saved). */
  saveState: "idle" | "saving" | "saved";
  resetSaveState: () => void;

  hydrate: () => Promise<void>;

  addTask: (group: GroupKey, partial?: Partial<Task>) => Promise<Task>;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  reorderWithin: (group: GroupKey, orderedIds: string[]) => void;

  addSubtask: (taskId: string, title: string) => void;
  updateSubtask: (taskId: string, subtaskId: string, patch: Partial<Subtask>) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;

  addComment: (taskId: string, authorId: string, body: string) => void;
  logActivity: (taskId: string, entry: Omit<Activity, "id" | "createdAt">) => void;

  addProject: (name: string) => void;
  updateProject: (id: string, patch: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  reset: () => void;
}

export const useTaskStore = create<TaskState>()((set, get) => {
  // Global save indicator: any in-flight mutation shows "saving", then "saved".
  let pending = 0;
  const startSave = () => {
    pending++;
    set({ saveState: "saving" });
  };
  const endSave = () => {
    pending = Math.max(0, pending - 1);
    if (pending === 0) set({ saveState: "saved" });
  };

  /** Fire a persistence call; track it, and re-sync from the server if it fails. */
  const persist = (p: Promise<unknown>) => {
    startSave();
    p.catch((e) => {
      console.error("Persist failed, re-syncing:", e);
      toast.error("Couldn't save changes — re-syncing", { id: "persist-error" });
      void get().hydrate();
    }).finally(endSave);
  };

  /** Track a persistence promise (returns the same promise). */
  const tracked = <T>(p: Promise<T>) => {
    startSave();
    return p.finally(endSave);
  };

  /** Replace a task in local state with the authoritative server copy. */
  const replaceTask = (server: Task) =>
    set((s) => ({ tasks: s.tasks.map((t) => (t.id === server.id ? server : t)) }));

  return {
    tasks: [],
    projects: [],
    hydrated: false,
    online: true,
    saveState: "idle",
    resetSaveState: () => set({ saveState: "idle" }),

    hydrate: async () => {
      try {
        const [tasks, projects] = await Promise.all([
          api.tasks(),
          api.projects(),
        ]);
        set({ tasks, projects, hydrated: true, online: true });
      } catch (e) {
        // Backend unreachable — fall back to local seed so the UI still works.
        console.warn("API unreachable, using local seed data.", e);
        toast.error("Can't reach the server — showing local data", {
          id: "offline",
        });
        set({
          tasks: SEED_TASKS,
          projects: SEED_PROJECTS,
          hydrated: true,
          online: false,
        });
      }
    },

    addTask: async (group, partial) => {
      const maxOrder = Math.max(
        0,
        ...get().tasks.filter((t) => t.group === group).map((t) => t.order),
      );
      const payload: Partial<Task> = {
        title: partial?.title ?? "Untitled Task",
        description: partial?.description ?? "",
        group,
        priority: partial?.priority ?? "none",
        labels: partial?.labels ?? [],
        memberIds: partial?.memberIds ?? [],
        projectId: partial?.projectId ?? null,
      };
      try {
        const task = await tracked(api.createTask(payload));
        set((s) => ({ tasks: [...s.tasks, task] }));
        toast.success("Task created");
        return task;
      } catch (e) {
        console.error("createTask failed, adding locally:", e);
        toast.error("Server offline — task added locally", { id: "offline" });
        const task: Task = {
          id: uid("t"),
          title: payload.title!,
          description: "",
          group,
          status: "todo",
          priority: "none",
          labels: [],
          teams: [],
          memberIds: [],
          reporterId: "u-dexter",
          dueDate: null,
          startDate: null,
          subtasks: [],
          comments: [],
          activity: [],
          projectId: payload.projectId ?? null,
          order: maxOrder + 1,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ tasks: [...s.tasks, task] }));
        return task;
      }
    },

    updateTask: (id, patch) => {
      set((s) => ({
        tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
      }));
      persist(api.updateTask(id, patch));
    },

    deleteTask: (id) => {
      set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }));
      persist(api.deleteTask(id));
      toast.success("Task deleted");
    },

    reorderWithin: (group, orderedIds) => {
      set((s) => ({
        tasks: s.tasks.map((t) => {
          const idx = orderedIds.indexOf(t.id);
          return idx >= 0 && t.group === group ? { ...t, order: idx } : t;
        }),
      }));
      orderedIds.forEach((id, i) => persist(api.updateTask(id, { order: i })));
    },

    addSubtask: (taskId, title) => {
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
      }));
      tracked(api.addSubtask(taskId, { title }))
        .then(replaceTask)
        .catch((e) => {
          console.error(e);
          void get().hydrate();
        });
    },

    updateSubtask: (taskId, subtaskId, patch) => {
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
      }));
      persist(api.updateSubtask(taskId, subtaskId, patch));
    },

    deleteSubtask: (taskId, subtaskId) => {
      set((s) => ({
        tasks: s.tasks.map((t) =>
          t.id === taskId
            ? { ...t, subtasks: t.subtasks.filter((st) => st.id !== subtaskId) }
            : t,
        ),
      }));
      persist(api.deleteSubtask(taskId, subtaskId));
    },

    addComment: (taskId, authorId, body) => {
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
      }));
      tracked(api.addComment(taskId, { authorId, body }))
        .then(replaceTask)
        .catch((e) => {
          console.error(e);
          void get().hydrate();
        });
    },

    logActivity: (taskId, entry) => {
      set((s) => ({
        tasks: s.tasks.map((t) =>
          t.id === taskId
            ? {
                ...t,
                activity: [
                  {
                    id: uid("a"),
                    createdAt: new Date().toISOString(),
                    ...entry,
                  } satisfies Activity,
                  ...t.activity,
                ],
              }
            : t,
        ),
      }));
      tracked(api.addActivity(taskId, entry))
        .then(replaceTask)
        .catch((e) => {
          console.error(e);
          void get().hydrate();
        });
    },

    addProject: (name) => {
      const tempId = uid("p");
      set((s) => ({
        projects: [
          ...s.projects,
          {
            id: tempId,
            name,
            priority: "none" as Priority,
            leadId: null,
            dueDate: null,
            order: s.projects.length,
          },
        ],
      }));
      tracked(api.createProject({ name }))
        .then((server) => {
          set((s) => ({
            projects: s.projects.map((p) => (p.id === tempId ? server : p)),
          }));
          toast.success("Project created");
        })
        .catch((e) => {
          console.error(e);
          toast.error("Couldn't create project — re-syncing", { id: "persist-error" });
          void get().hydrate();
        });
    },

    updateProject: (id, patch) => {
      set((s) => ({
        projects: s.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
      }));
      persist(api.updateProject(id, patch));
    },

    deleteProject: (id) => {
      set((s) => ({ projects: s.projects.filter((p) => p.id !== id) }));
      persist(api.deleteProject(id));
      toast.success("Project deleted");
    },

    reset: () => void get().hydrate(),
  };
});

/** Status implied by a board group, mirrors the backend. */
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
