# Taskly — Full-Stack Task Management System

A clean, responsive task-management workspace built to match the provided Figma design —
now **full-stack**: a **Next.js** frontend and a **NestJS + Prisma** REST API.

Board & list views, a rich task-detail page (subtasks, comments, activity feed), projects,
guest login, and a dual-axis theming system (light/dark × 6 accent colors) that persists
across refreshes.

- **Part 1** — this application (frontend + backend).
- **Part 2** — product-understanding write-up: [`docs/PART-2-ableSpace.md`](docs/PART-2-ableSpace.md).

---

## Monorepo layout

```
task-management/
├─ src/            # Next.js frontend (App Router)
├─ backend/        # NestJS + Prisma API
└─ docs/           # Part 2 write-up
```

The frontend lives at the repo root; the backend is a self-contained app in `backend/`.

---

## Tech Stack

| Area        | Frontend                                   | Backend                              |
| ----------- | ------------------------------------------ | ------------------------------------ |
| Framework   | Next.js 16 (App Router) + React 19         | NestJS 11                            |
| Language    | TypeScript (strict)                        | TypeScript                           |
| Styling     | Tailwind CSS v4 (CSS-variable tokens)      | —                                    |
| Data / ORM  | Zustand store → typed API client           | Prisma 6 + **SQLite** (dev)          |
| Validation  | —                                          | class-validator / class-transformer  |
| UI a11y     | Radix UI (dropdown, popover, dialog)       | —                                    |
| Drag & drop | dnd-kit (Kanban)                           | —                                    |
| Icons       | lucide-react                               | —                                    |

> **Database choice.** SQLite is used for zero-setup local development. The schema switches to
> PostgreSQL for production by changing one line — see [Deployment](#deployment).

---

## Getting Started (run the full stack locally)

Two terminals. **Backend first** (the frontend reads from it):

### 1) Backend — http://localhost:4000/api

```bash
cd backend
npm install
npx prisma migrate dev      # creates the SQLite DB + tables
npm run db:seed             # seeds members, projects, tasks
npm run start:dev           # API on http://localhost:4000/api
```

### 2) Frontend — http://localhost:3000

```bash
npm install
npm run dev                 # http://localhost:3000
```

The frontend reads `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:4000/api`; see
`.env.example`). On first load, click **Continue as Guest** to enter the workspace.

> **Offline-friendly:** if the API is unreachable, the frontend falls back to local seed data
> so the UI still renders — handy for a quick look without starting the backend.

---

## API

Base URL: `/api`. All list/detail responses return fully-shaped resources (tasks include their
`subtasks`, `comments`, and `activity`).

| Method   | Endpoint                               | Description                        |
| -------- | -------------------------------------- | ---------------------------------- |
| `GET`    | `/api`                                 | Health check                       |
| `POST`   | `/api/auth/guest`                      | Guest login → `{ token, user }`    |
| `POST`   | `/api/auth/google`                     | Mock OAuth → `{ token, user }`     |
| `GET`    | `/api/members`                         | List members                       |
| `GET`    | `/api/tasks`                           | List tasks (with relations)        |
| `GET`    | `/api/tasks/:id`                       | Get one task                       |
| `POST`   | `/api/tasks`                           | Create task                        |
| `PATCH`  | `/api/tasks/:id`                       | Update task                        |
| `DELETE` | `/api/tasks/:id`                       | Delete task (cascades children)    |
| `POST`   | `/api/tasks/:id/subtasks`              | Add subtask                        |
| `PATCH`  | `/api/tasks/:id/subtasks/:subtaskId`   | Update subtask                     |
| `DELETE` | `/api/tasks/:id/subtasks/:subtaskId`   | Delete subtask                     |
| `POST`   | `/api/tasks/:id/comments`              | Add comment                        |
| `POST`   | `/api/tasks/:id/activity`              | Log an activity/update entry       |
| `GET`    | `/api/projects`                        | List projects                      |
| `POST`   | `/api/projects`                        | Create project                     |
| `PATCH`  | `/api/projects/:id`                    | Update project                     |
| `DELETE` | `/api/projects/:id`                    | Delete project (detaches tasks)    |

Requests are validated by DTOs with a global `ValidationPipe`
(`whitelist` + `forbidNonWhitelisted`): unknown/invalid fields → `400`, missing tasks → `404`.

---

## Features

### Authentication
- **Guest login** and a mock **Login with Google** flow, both served by the NestJS `auth` module.
- Session + token persisted client-side; the `(app)` route group is guarded and redirects to `/login`.

### Theming (persists across refresh)
Two **independent** axes, matching the Figma "Change Theme" / "Color Mode" menus:
- **Color mode** — Light / Dark (class on `<html>`, so an explicit choice beats the OS setting).
- **Accent** — Amber, Blue, Pink, Rose, Emerald, Black (Black inverts to near-white in dark mode).
- A blocking inline script applies the saved theme **before first paint** (no flash).

### Tasks
- **Board** (Kanban, drag-and-drop between/within columns) and **List** (grouped, collapsible,
  inline-editable) views, switchable in the **Fields** popover alongside column-visibility toggles.
- **Search** and **priority filter**.
- **Task detail** — editable title/description, properties, labels, a **subtasks** table,
  **comments**, and a **Details** panel (status, priority, members, dates w/ calendar, labels,
  **teams**) plus an **Updates** activity feed that logs priority/status changes live.

### Projects & Profile
- **Projects** table with inline editing + a per-project detail view; editable **Profile** page.

### Responsiveness & UX
Mobile-first: sidebar → focus-trapped modal drawer, tables reflow, no page-level horizontal
overflow at 320 / 768 / 1280+. Smooth animated search, optimistic updates, pointer cursors.

---

## Deployment

- **Frontend → Vercel.** Import the repo, set `NEXT_PUBLIC_API_URL` to the deployed API URL.
- **Backend → Railway / Render.** Deploy `backend/`. For a persistent production database, switch
  Prisma to PostgreSQL:
  1. In `backend/prisma/schema.prisma` set `datasource db { provider = "postgresql" }`.
  2. Set `DATABASE_URL` to your Postgres connection string, and `CORS_ORIGINS` to the frontend URL.
  3. `npx prisma migrate deploy && npm run db:seed && npm run start:prod`.

---

## Scripts

**Frontend** (root): `npm run dev` · `npm run build` · `npm run start` · `npm run lint`

**Backend** (`backend/`): `npm run start:dev` · `npm run build` · `npm run start:prod`
· `npm run db:seed` · `npm run db:reset` · `npm test`

---

## Intentional deviations from the Figma
- **Avatars** render as deterministic gradient initials (photographic avatars aren't design tokens).
- **Dark palette** is an original, contrast-checked extension (the Figma frames are light-only).
- **Google login** is a mocked exchange (returns a signed-in user), not a real OAuth redirect.
