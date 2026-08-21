// Allowed enum-like values, shared by validation and mapping.
export const PRIORITIES = ['none', 'urgent', 'high', 'medium', 'low'] as const;
export const STATUSES = [
  'backlog',
  'todo',
  'in_progress',
  'done',
  'cancelled',
] as const;
export const GROUPS = ['todo', 'doing', 'completed', 'on_hold'] as const;
export const LABELS = [
  'research',
  'design',
  'development',
  'testing',
  'deployment',
] as const;
export const TEAMS = [
  'engineering',
  'design',
  'product',
  'marketing',
  'qa',
] as const;
export const ACTIVITY_KINDS = ['change', 'post'] as const;

export type Priority = (typeof PRIORITIES)[number];
export type Status = (typeof STATUSES)[number];
export type GroupKey = (typeof GROUPS)[number];
export type LabelKey = (typeof LABELS)[number];
export type TeamKey = (typeof TEAMS)[number];

/** Default Status implied by a board group, mirrors the frontend. */
export function statusForGroup(group: GroupKey): Status {
  switch (group) {
    case 'todo':
      return 'todo';
    case 'doing':
      return 'in_progress';
    case 'completed':
      return 'done';
    case 'on_hold':
      return 'backlog';
    default:
      return 'todo';
  }
}
