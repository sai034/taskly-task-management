import type { Member, Project, Task } from "./types";

const BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:4000/api";

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status} ${path} — ${text}`);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    title: string;
    username: string;
    guest: boolean;
  };
}

const body = (data: unknown) => JSON.stringify(data);

export const api = {
  base: BASE,

  // ---- auth ----
  guest: () => req<AuthResponse>("/auth/guest", { method: "POST" }),
  google: () => req<AuthResponse>("/auth/google", { method: "POST" }),

  // ---- members ----
  members: () => req<Member[]>("/members"),

  // ---- tasks ----
  tasks: () => req<Task[]>("/tasks"),
  task: (id: string) => req<Task>(`/tasks/${id}`),
  createTask: (data: Partial<Task>) =>
    req<Task>("/tasks", { method: "POST", body: body(data) }),
  updateTask: (id: string, data: Partial<Task>) =>
    req<Task>(`/tasks/${id}`, { method: "PATCH", body: body(data) }),
  deleteTask: (id: string) =>
    req<{ id: string }>(`/tasks/${id}`, { method: "DELETE" }),

  addSubtask: (taskId: string, data: { title: string }) =>
    req<Task>(`/tasks/${taskId}/subtasks`, { method: "POST", body: body(data) }),
  updateSubtask: (taskId: string, subtaskId: string, data: unknown) =>
    req<Task>(`/tasks/${taskId}/subtasks/${subtaskId}`, {
      method: "PATCH",
      body: body(data),
    }),
  deleteSubtask: (taskId: string, subtaskId: string) =>
    req<Task>(`/tasks/${taskId}/subtasks/${subtaskId}`, { method: "DELETE" }),

  addComment: (taskId: string, data: { authorId?: string; body: string }) =>
    req<Task>(`/tasks/${taskId}/comments`, { method: "POST", body: body(data) }),
  addActivity: (
    taskId: string,
    data: {
      authorId?: string;
      kind: "change" | "post";
      field?: string;
      from?: string;
      to?: string;
      note?: string;
    },
  ) => req<Task>(`/tasks/${taskId}/activity`, { method: "POST", body: body(data) }),

  // ---- projects ----
  projects: () => req<Project[]>("/projects"),
  createProject: (data: { name: string }) =>
    req<Project>("/projects", { method: "POST", body: body(data) }),
  updateProject: (id: string, data: Partial<Project>) =>
    req<Project>(`/projects/${id}`, { method: "PATCH", body: body(data) }),
  deleteProject: (id: string) =>
    req<{ id: string }>(`/projects/${id}`, { method: "DELETE" }),
};
