# Taskly API

The backend for Taskly — a REST API built with **NestJS**, **Prisma**, and **PostgreSQL**.

## Requirements

- Node.js 18+
- npm
- A PostgreSQL database (a free one from [Render](https://render.com) or [Neon](https://neon.tech))

## Setup

```bash
npm install
# set DATABASE_URL in .env (see .env.example), then:
npx prisma db push          # create the tables from the schema
npm run db:seed             # seed members, projects, and tasks
npm run start:dev           # start the API on http://localhost:4000/api
```

## Environment

Copy `.env.example` to `.env` and set your values:

| Variable        | Description                                       | Example                                 |
| --------------- | ------------------------------------------------- | --------------------------------------- |
| `DATABASE_URL`  | PostgreSQL connection string                      | `postgresql://user:pass@host:5432/db`   |
| `PORT`          | Port the API listens on                           | `4000`                                  |
| `CORS_ORIGINS`  | Comma-separated list of allowed frontend origins  | `http://localhost:3000`                 |

## Project structure

```
src/
├─ main.ts            # bootstrap: global prefix, CORS, validation pipe
├─ app.module.ts      # root module
├─ app.controller.ts  # health check (GET /api)
├─ prisma/            # PrismaService + module
├─ common/            # shared constants (enum values, helpers)
├─ auth/              # guest / google login
├─ members/           # members (read-only)
├─ projects/          # projects CRUD
└─ tasks/             # tasks CRUD + subtasks, comments, activity
prisma/
├─ schema.prisma      # data model
├─ migrations/        # generated migrations
└─ seed.ts            # seed data
```

## API

Base URL: `/api`. Requests are validated with DTOs and a global `ValidationPipe`
(`whitelist` + `forbidNonWhitelisted`): unknown or invalid fields return `400`, and missing
resources return `404`.

| Method   | Endpoint                             | Description                     |
| -------- | ------------------------------------ | ------------------------------- |
| `GET`    | `/api`                               | Health check                    |
| `POST`   | `/api/auth/guest`                    | Guest login                     |
| `POST`   | `/api/auth/google`                   | Mock OAuth login                |
| `GET`    | `/api/members`                       | List members                    |
| `GET`    | `/api/tasks`                         | List tasks (with relations)     |
| `GET`    | `/api/tasks/:id`                     | Get one task                    |
| `POST`   | `/api/tasks`                         | Create task                     |
| `PATCH`  | `/api/tasks/:id`                     | Update task                     |
| `DELETE` | `/api/tasks/:id`                     | Delete task                     |
| `POST`   | `/api/tasks/:id/subtasks`            | Add subtask                     |
| `PATCH`  | `/api/tasks/:id/subtasks/:subtaskId` | Update subtask                  |
| `DELETE` | `/api/tasks/:id/subtasks/:subtaskId` | Delete subtask                  |
| `POST`   | `/api/tasks/:id/comments`            | Add comment                     |
| `POST`   | `/api/tasks/:id/activity`            | Log an activity entry           |
| `GET`    | `/api/projects`                      | List projects                   |
| `POST`   | `/api/projects`                      | Create project                  |
| `PATCH`  | `/api/projects/:id`                  | Update project                  |
| `DELETE` | `/api/projects/:id`                  | Delete project                  |

## Scripts

| Command               | Description                                  |
| --------------------- | -------------------------------------------- |
| `npm run start:dev`   | Start in watch mode                          |
| `npm run build`       | Compile to `dist/`                           |
| `npm run start:prod`  | Run the compiled build                       |
| `npm run db:push`     | Sync the schema to the database              |
| `npm run db:seed`     | Seed the database                            |
| `npm run db:reset`    | Drop, re-sync the schema, and re-seed        |
| `npm test`            | Run unit tests                               |
| `npm run test:e2e`    | Run end-to-end tests                         |

## Deployment

Set `DATABASE_URL` (PostgreSQL) and `CORS_ORIGINS` (the frontend URL) as environment variables.

- **Build command:** `npm install && npx prisma generate && npm run build`
- **Start command:** `npm run start:deploy` — runs `prisma db push` to sync the schema, then
  starts the server. The database self-seeds on first boot when empty (idempotent), so existing
  data is never overwritten on restarts.
