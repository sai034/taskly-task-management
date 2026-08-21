import { PrismaClient } from '@prisma/client';

const d = (s: string) => new Date(s);

export const MEMBERS = [
  { id: 'u-dexter', name: 'Dexter', initials: 'DX', color: 'linear-gradient(135deg,#8b5cf6,#ec4899)' },
  { id: 'u-admin', name: 'Admin', initials: 'AD', color: 'linear-gradient(135deg,#3b82f6,#22d3ee)' },
  { id: 'u-cn', name: 'Charles N.', initials: 'CN', color: 'linear-gradient(135deg,#64748b,#94a3b8)' },
  { id: 'u-ankit', name: 'Ankit Dutta', initials: 'AN', color: 'linear-gradient(135deg,#f59e0b,#ef4444)' },
  { id: 'u-maya', name: 'Maya R.', initials: 'MR', color: 'linear-gradient(135deg,#10b981,#34d399)' },
  { id: 'u-nils', name: 'Nils B.', initials: 'NB', color: 'linear-gradient(135deg,#6366f1,#8b5cf6)' },
  { id: 'u-sara', name: 'Sara K.', initials: 'SK', color: 'linear-gradient(135deg,#ec4899,#f43f5e)' },
];

export const PROJECTS = [
  { id: 'p-home', name: 'Design Homepage', priority: 'high', leadId: 'u-dexter', dueDate: d('2026-09-12'), order: 0 },
  { id: 'p-login', name: 'Develop Login Feature', priority: 'low', leadId: 'u-cn', dueDate: d('2026-09-15'), order: 1 },
  { id: 'p-payment', name: 'Test Payment Gateway', priority: 'medium', leadId: null, dueDate: d('2026-09-18'), order: 2 },
];

type TaskSeed = {
  id: string;
  title: string;
  description: string;
  group: string;
  status: string;
  priority: string;
  labels: string[];
  teams?: string[];
  memberIds: string[];
  reporterId: string | null;
  dueDate: Date | null;
  startDate: Date | null;
  projectId: string | null;
  order: number;
  createdAt: Date;
  subtasks?: {
    id: string;
    title: string;
    priority: string;
    memberIds: string[];
    dueDate: Date | null;
    done: boolean;
    order: number;
  }[];
  comments?: { id: string; authorId: string; body: string; createdAt: Date }[];
  activity?: {
    id: string;
    authorId: string;
    kind: string;
    field?: string;
    from?: string;
    to?: string;
    note?: string;
    createdAt: Date;
  }[];
};

export const TASKS: TaskSeed[] = [
  {
    id: 't-api-docs',
    title: 'Write API Documentation',
    description:
      'Create clear and detailed API documentation to guide developers in using the inventory and sales metrics features effectively.',
    group: 'todo',
    status: 'backlog',
    priority: 'high',
    labels: ['research', 'design', 'development', 'testing', 'deployment'],
    teams: ['engineering', 'design'],
    memberIds: ['u-admin', 'u-nils'],
    reporterId: 'u-dexter',
    dueDate: d('2026-07-31'),
    startDate: d('2026-01-10'),
    projectId: 'p-login',
    order: 0,
    createdAt: d('2026-06-01'),
    subtasks: [
      { id: 'st-1', title: 'Subtask 1', priority: 'high', memberIds: ['u-dexter'], dueDate: d('2026-09-12'), done: false, order: 0 },
      { id: 'st-2', title: 'Subtask 2', priority: 'low', memberIds: ['u-cn'], dueDate: d('2026-09-15'), done: false, order: 1 },
      { id: 'st-3', title: 'Subtask 3', priority: 'medium', memberIds: [], dueDate: d('2026-09-18'), done: false, order: 2 },
    ],
    comments: [
      { id: 'c-1', authorId: 'u-ankit', body: 'Draft is ready for review.', createdAt: d('2026-08-01') },
    ],
    activity: [
      { id: 'a-1', authorId: 'u-dexter', kind: 'change', field: 'priority', from: 'No Priority', to: 'Urgent', createdAt: d('2026-08-02') },
      { id: 'a-2', authorId: 'u-dexter', kind: 'post', note: 'posted an update', createdAt: d('2026-08-01') },
    ],
  },
  { id: 't-search', title: 'Implement Search Function', description: 'Add fuzzy search across tasks, members and labels.', group: 'todo', status: 'todo', priority: 'medium', labels: ['development'], memberIds: ['u-admin'], reporterId: 'u-dexter', dueDate: d('2026-07-29'), startDate: null, projectId: null, order: 1, createdAt: d('2026-06-02') },
  { id: 't-deploy', title: 'Deploy to Production', description: 'Ship the release candidate to production infrastructure.', group: 'todo', status: 'todo', priority: 'urgent', labels: ['deployment'], memberIds: ['u-admin'], reporterId: 'u-dexter', dueDate: d('2026-07-29'), startDate: null, projectId: null, order: 2, createdAt: d('2026-06-03') },
  { id: 't-review', title: 'Code Review Completed', description: 'Peer review of the checkout module.', group: 'doing', status: 'in_progress', priority: 'high', labels: ['development'], memberIds: ['u-admin', 'u-sara'], reporterId: 'u-dexter', dueDate: d('2026-07-29'), startDate: null, projectId: null, order: 3, createdAt: d('2026-06-04') },
  { id: 't-mockups', title: 'Design Mockups Finalized', description: 'High-fidelity mockups for the dashboard revamp.', group: 'doing', status: 'in_progress', priority: 'medium', labels: ['design', 'deployment'], memberIds: ['u-admin'], reporterId: 'u-dexter', dueDate: d('2026-07-29'), startDate: null, projectId: null, order: 4, createdAt: d('2026-06-05') },
  { id: 't-testing', title: 'Feature Testing Passed', description: 'Regression suite green for the billing feature.', group: 'completed', status: 'done', priority: 'low', labels: ['testing'], memberIds: ['u-maya'], reporterId: 'u-dexter', dueDate: d('2026-07-30'), startDate: null, projectId: null, order: 5, createdAt: d('2026-06-06') },
  { id: 't-ui-updated', title: 'UI Design Updated', description: 'Refined spacing and typography across the app.', group: 'completed', status: 'done', priority: 'medium', labels: ['design'], memberIds: ['u-nils'], reporterId: 'u-dexter', dueDate: d('2026-07-31'), startDate: null, projectId: null, order: 6, createdAt: d('2026-06-07') },
  { id: 't-security', title: 'Security Audit Scheduled', description: 'Third-party penetration test booked.', group: 'completed', status: 'done', priority: 'high', labels: ['research'], memberIds: ['u-sara'], reporterId: 'u-dexter', dueDate: d('2026-08-01'), startDate: null, projectId: null, order: 7, createdAt: d('2026-06-08') },
  { id: 't-ui-review', title: 'UI Review', description: 'Stakeholder walkthrough of the new interface.', group: 'on_hold', status: 'backlog', priority: 'low', labels: ['design'], memberIds: ['u-maya'], reporterId: 'u-dexter', dueDate: null, startDate: null, projectId: null, order: 8, createdAt: d('2026-06-09') },
  { id: 't-backend', title: 'Backend Integration', description: 'Wire the dashboard to the metrics service.', group: 'on_hold', status: 'backlog', priority: 'medium', labels: ['development'], memberIds: ['u-admin'], reporterId: 'u-dexter', dueDate: null, startDate: null, projectId: null, order: 9, createdAt: d('2026-06-10') },
  { id: 't-feedback', title: 'User Feedback Review', description: 'Synthesise findings from the latest research round.', group: 'on_hold', status: 'backlog', priority: 'low', labels: ['research'], memberIds: ['u-sara'], reporterId: 'u-dexter', dueDate: null, startDate: null, projectId: null, order: 10, createdAt: d('2026-06-11') },
];

/**
 * Seed the database only if it's empty. Safe to call on every boot — it will
 * skip when data already exists, so it never wipes changes. Uses the generated
 * Prisma Client, so it runs from compiled JS (no ts-node required at runtime).
 */
export async function seedIfEmpty(prisma: PrismaClient): Promise<void> {
  const existing = await prisma.member.count();
  if (existing > 0) {
    console.log('Database already seeded — skipping.');
    return;
  }

  await prisma.member.createMany({ data: MEMBERS });
  for (const p of PROJECTS) await prisma.project.create({ data: p });

  for (const t of TASKS) {
    const { subtasks, comments, activity, teams, labels, memberIds, ...rest } = t;
    await prisma.task.create({
      data: {
        ...rest,
        labels,
        teams: teams ?? [],
        memberIds,
        subtasks: subtasks ? { create: subtasks } : undefined,
        comments: comments ? { create: comments } : undefined,
        activity: activity ? { create: activity } : undefined,
      },
    });
  }

  console.log(
    `Seeded ${MEMBERS.length} members, ${PROJECTS.length} projects, ${TASKS.length} tasks.`,
  );
}
