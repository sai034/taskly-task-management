import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Priority } from "./types";

export type ViewMode = "board" | "list";

export type FieldKey =
  | "priority"
  | "members"
  | "dueDate"
  | "labels"
  | "status"
  | "reporter";

export const FIELD_OPTIONS: { key: FieldKey; label: string }[] = [
  { key: "priority", label: "Priority" },
  { key: "members", label: "Members" },
  { key: "dueDate", label: "Due Date" },
  { key: "labels", label: "Labels" },
  { key: "status", label: "Status" },
  { key: "reporter", label: "Reporter" },
];

interface UiState {
  view: ViewMode;
  fields: Record<FieldKey, boolean>;
  priorityFilter: Priority | null;
  setView: (v: ViewMode) => void;
  toggleField: (f: FieldKey) => void;
  setPriorityFilter: (p: Priority | null) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      view: "board",
      fields: {
        priority: true,
        members: true,
        dueDate: true,
        labels: false,
        status: false,
        reporter: false,
      },
      priorityFilter: null,
      setView: (view) => set({ view }),
      toggleField: (f) =>
        set((s) => ({ fields: { ...s.fields, [f]: !s.fields[f] } })),
      setPriorityFilter: (priorityFilter) => set({ priorityFilter }),
    }),
    { name: "tm-ui-v1" },
  ),
);
