# Taskly — Task Management System

A clean, responsive task-management workspace built to match the provided Figma design.
Board & list views, a rich task-detail page, projects, guest login, and a full dual-axis
theming system (light/dark × 6 accent colors) that persists across refreshes.

> **Assessment note.** This repository is **Part 1** (the app). The current phase is a
> polished, fully-working **frontend** with a client-side data layer (Zustand + `localStorage`).
> The data layer is deliberately isolated behind a store so a **NestJS backend** can be
> dropped in next with minimal churn (see [Roadmap](#roadmap-backend-phase)).

---

## Tech Stack

| Area       | Choice                                                        |
| ---------- | ------------------------------------------------------------- |
| Framework  | **Next.js 16** (App Router) + **React 19**                    |
| Language   | **TypeScript** (strict)                                       |
| Styling    | **Tailwind CSS v4** (CSS-variable theme tokens)               |
| State      | **Zustand** (with `persist` middleware)                       |
| UI a11y    | **Radix UI** (dropdown, popover, dialog primitives)          |
| Drag & drop| **dnd-kit** (Kanban board)                                    |
| Icons      | **lucide-react**                                              |

---

## Getting Started

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # production build
npm run start    # serve the production build
```

On first load you land on the login screen — click **Continue as Guest** to enter the workspace.

---

## Features

### Authentication
- **Guest login** and a mock **Login with Google** flow.
- Session persisted to `localStorage`; unauthenticated users are redirected to `/login`,
  and the route group `(app)` is guarded.

### Theming (persists across refresh)
Two **independent** axes, exactly as in the Figma "Change Theme" / "Color Mode" menus:
- **Color mode** — Light / Dark (class-based on `<html>`, so an explicit choice always wins over the OS).
- **Accent color** — Amber, Blue, Pink, Rose, Emerald, Black.
- A blocking inline script applies the saved theme **before first paint** (no flash of wrong theme).
- All colors are CSS variables mapped into Tailwind tokens (`bg-surface`, `text-muted`,
  `bg-accent`, …), so every component themes automatically. The **Black** accent inverts to
  near-white in dark mode so it stays visible.

### Tasks
- **Board view** — Kanban columns (To Do / Doing / Completed / On Hold) with **drag-and-drop**
  between and within columns (dnd-kit), live status updates, and a drag overlay.
- **List view** — grouped, collapsible sections with an inline-editable table (priority,
  members, due date all editable in place).
- **View switcher** and **field visibility** toggles live in the **Fields** popover.
- **Search** (by title) and **priority filter**.
- **Task detail** — editable title & description, properties, labels, a **subtasks** table,
  **comments**, and a right-hand **Details** panel (status, priority, members, dates with a
  custom calendar, labels, reporter).

### Projects & Profile
- **Projects** table with inline editing and a per-project detail view (its tasks).
- **Profile** page with editable name / title / username and a *Leave Workspace* action.

### Responsiveness
Mobile-first. The sidebar collapses to a slide-over drawer, tables reflow to stacked cards,
the board scrolls horizontally within its own container, and there is **no page-level
horizontal overflow** at 375 / 768 / 1280+.

---

## Project Structure

```
src/
├─ app/
│  ├─ layout.tsx            # fonts, no-flash theme script, providers
│  ├─ page.tsx              # auth-aware redirect
│  ├─ login/                # guest / Google login
│  └─ (app)/                # authenticated shell (guarded)
│     ├─ layout.tsx         # sidebar + main region
│     ├─ tasks/             # board + list, and tasks/[id] detail
│     ├─ projects/          # table + projects/[id] detail
│     └─ profile/
├─ components/
│  ├─ ui/                   # Button, Avatar, Priority, Tags, Menu, Popover, Calendar
│  ├─ pickers/              # priority / status / member / label / date pickers
│  ├─ layout/               # Sidebar, Topbar, WorkspaceMenu, ShellContext
│  └─ tasks/                # BoardView, ListView, TaskCard, detail widgets, toolbar
└─ lib/
   ├─ types.ts              # domain model + display metadata
   ├─ seed.ts               # seed data (members, tasks, projects)
   ├─ store.ts              # Zustand tasks/projects store (persisted)
   ├─ ui-store.ts           # view mode, visible fields, filters (persisted)
   ├─ theme.tsx             # theme provider + no-flash script
   ├─ auth.tsx              # guest auth provider
   └─ utils.ts              # cn(), date & member helpers
```

Reusability is a first-class concern: every interactive control (pickers, menus, avatars,
priority indicators, date badges) is a shared component used identically across the board,
list, detail, projects, and profile screens.

---

## Intentional deviations from the Figma

- **Illustrations / avatars.** The Figma uses photographic avatars; those aren't part of the
  design tokens, so members render as deterministic gradient initials.
- **Dark palette.** The Figma frames are light-mode only. The dark palette is an original,
  contrast-checked extension of the same neutral + accent system.
- **Google login** is a mocked client flow (returns a signed-in user). It becomes a real
  OAuth redirect in the backend phase.
- Copy, seed content, and empty states were authored to match the spirit of the design where
  a frame didn't specify them.

---

## Roadmap (backend phase)

The frontend already talks to a single data layer (`lib/store.ts`). The plan for **NestJS**:

- `Tasks`, `Projects`, `Auth`, `Members` modules with DTO validation (`class-validator`).
- Swap the Zustand persistence for a typed API client; the component layer stays unchanged.
- Real guest sessions + Google OAuth; database via Prisma (PostgreSQL/SQLite).

---

## Scripts

| Command         | Description                     |
| --------------- | ------------------------------- |
| `npm run dev`   | Start the dev server            |
| `npm run build` | Production build                |
| `npm run start` | Serve the production build      |
| `npm run lint`  | Run ESLint                      |
