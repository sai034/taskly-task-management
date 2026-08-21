/* ------------------------------------------------------------------ */
/*  Domain types                                                       */
/* ------------------------------------------------------------------ */

export type Priority = "urgent" | "high" | "medium" | "low" | "none";

export type Status = "backlog" | "todo" | "in_progress" | "done" | "cancelled";

/** The Kanban columns / list groups shown in the design. */
export type GroupKey = "todo" | "doing" | "completed" | "on_hold";

export type LabelKey =
  | "research"
  | "design"
  | "development"
  | "testing"
  | "deployment";

export interface Member {
  id: string;
  name: string;
  /** Two-letter fallback initials. */
  initials: string;
  /** Tailwind-friendly gradient/solid used for the avatar bubble. */
  color: string;
}

export interface Comment {
  id: string;
  authorId: string;
  body: string;
  createdAt: string; // ISO
}

export interface Subtask {
  id: string;
  title: string;
  priority: Priority;
  memberIds: string[];
  dueDate: string | null; // ISO
  done: boolean;
}

export type TeamKey = "engineering" | "design" | "product" | "marketing" | "qa";

/** An entry in a task's "Updates" activity feed. */
export interface Activity {
  id: string;
  authorId: string;
  createdAt: string; // ISO
  /** "change" = a field was edited; "post" = a free-text update. */
  kind: "change" | "post";
  field?: string; // e.g. "priority", "status"
  from?: string;
  to?: string;
  note?: string; // for kind === "post"
}

export interface Task {
  id: string;
  title: string;
  description: string;
  group: GroupKey;
  status: Status;
  priority: Priority;
  labels: LabelKey[];
  teams: TeamKey[];
  memberIds: string[];
  reporterId: string | null;
  dueDate: string | null; // ISO
  startDate: string | null; // ISO
  subtasks: Subtask[];
  comments: Comment[];
  activity: Activity[];
  projectId: string | null;
  order: number;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  priority: Priority;
  leadId: string | null;
  dueDate: string | null;
  order: number;
}

/* ------------------------------------------------------------------ */
/*  Display metadata                                                   */
/* ------------------------------------------------------------------ */

export const GROUPS: { key: GroupKey; label: string; dot: string }[] = [
  { key: "todo", label: "To Do", dot: "var(--s-todo)" },
  { key: "doing", label: "Doing", dot: "var(--s-progress)" },
  { key: "completed", label: "Completed", dot: "var(--s-done)" },
  { key: "on_hold", label: "On Hold", dot: "var(--s-backlog)" },
];

export const PRIORITIES: {
  key: Priority;
  label: string;
  bars: number; // filled bars 0..3
  color: string;
}[] = [
  { key: "none", label: "No Priority", bars: 0, color: "var(--p-none)" },
  { key: "urgent", label: "Urgent", bars: 3, color: "var(--p-urgent)" },
  { key: "high", label: "High", bars: 3, color: "var(--p-high)" },
  { key: "medium", label: "Medium", bars: 2, color: "var(--p-medium)" },
  { key: "low", label: "Low", bars: 1, color: "var(--p-low)" },
];

export const STATUSES: { key: Status; label: string; color: string }[] = [
  { key: "backlog", label: "Backlog", color: "var(--s-backlog)" },
  { key: "todo", label: "Todo", color: "var(--s-todo)" },
  { key: "in_progress", label: "In Progress", color: "var(--s-progress)" },
  { key: "done", label: "Done", color: "var(--s-done)" },
  { key: "cancelled", label: "Cancelled", color: "var(--s-cancelled)" },
];

export const LABELS: { key: LabelKey; label: string }[] = [
  { key: "research", label: "Research" },
  { key: "design", label: "Design" },
  { key: "development", label: "Development" },
  { key: "testing", label: "Testing" },
  { key: "deployment", label: "Deployment" },
];

export const TEAMS: { key: TeamKey; label: string; color: string }[] = [
  { key: "engineering", label: "Engineering", color: "#3b82f6" },
  { key: "design", label: "Design", color: "#ec4899" },
  { key: "product", label: "Product", color: "#8b5cf6" },
  { key: "marketing", label: "Marketing", color: "#f59e0b" },
  { key: "qa", label: "QA", color: "#10b981" },
];

export function priorityMeta(p: Priority) {
  return PRIORITIES.find((x) => x.key === p)!;
}
export function statusMeta(s: Status) {
  return STATUSES.find((x) => x.key === s)!;
}
export function groupMeta(g: GroupKey) {
  return GROUPS.find((x) => x.key === g)!;
}
export function labelMeta(l: LabelKey) {
  return LABELS.find((x) => x.key === l)!;
}
export function teamMeta(t: TeamKey) {
  return TEAMS.find((x) => x.key === t)!;
}
