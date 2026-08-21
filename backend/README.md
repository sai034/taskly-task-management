# Taskly API

The backend for Taskly — a REST API built with **NestJS**, **Prisma**, and **SQLite** (for
zero-setup local development; the schema switches to PostgreSQL for production).

## Requirements

- Node.js 18+
- npm

## Setup

```bash
npm install
npx prisma migrate dev      # create the SQLite database and tables
npm run db:seed             # seed members, projects, and tasks
npm run start:dev           # start the API on http://localhost:4000/api
```

## Environment

Copy `.env.example` to `.env` and adjust as needed:

| Variable        | Description                                       | Default                     |
| --------------- | ------------------------------------------------- | --------------------------- |
| `DATABASE_URL`  | Prisma connection string                          | `file:./dev.db`             |
| `PORT`          | Port the API listens on                           | `4000`                      |
| `CORS_ORIGINS`  | Comma-separated list of allowed frontend origins  | `http://localhost:3000`     |

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
| `npm run db:seed`     | Seed the database                            |
| `npm run db:reset`    | Reset the database and re-run migrations     |
| `npm test`            | Run unit tests                               |
| `npm run test:e2e`    | Run end-to-end tests                         |

## Production database (PostgreSQL)

1. In `prisma/schema.prisma`, set `datasource db { provider = "postgresql" }`.
2. Set `DATABASE_URL` to your PostgreSQL connection string and `CORS_ORIGINS` to the frontend URL.
3. Run `npx prisma migrate deploy && npm run db:seed && npm run start:prod`.
