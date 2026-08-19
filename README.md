# HRMS

Versioned HRMS product screens built on Next.js and PostgreSQL.

## Database setup

This app requires a real PostgreSQL database. There is no runtime fallback data source.

Set `DATABASE_URL`, then run:

```bash
npm run db:setup
```

Available commands:

`npm run db:migrate` creates a new local development migration.

`npm run db:deploy` applies committed Prisma migrations to the target database.

`npm run db:seed` runs the Prisma seed hook.
It inserts the starter HRMS data only when the database is empty.

## Local development

Local development uses Dockerized PostgreSQL.

1. Create a private env file from the example:

```bash
cp .env.local.example .env.local
```

2. Start the local database:

```bash
npm run db:up
```

3. Apply migrations and one-time bootstrap data:

```bash
npm run db:setup
```

4. Start the app:

```bash
npm run dev
```

After seeding, you can sign in with any seeded employee account.
Try one of these usernames with password `Workgrid123!`:

- `ava.patel@workgrid.example`
- `noah.silva@workgrid.example`
- `arjun.rao@workgrid.example`

If this environment was seeded before August 19, 2026, the next seed run will update those seeded employee records to use the shared password above.

You can stop the local database with:

```bash
npm run db:down
```

If you use VS Code, run the task `HRMS: Full Stack Dev`. It starts Postgres, applies Prisma bootstrap, and launches the Next.js dev server.

## Vercel deployment

Deployments on Vercel automatically run Prisma migrations before the Next.js build through [vercel.json](/Users/atmaramn/data/work/gh/sampleapps/hrms/vercel.json).

That flow is:

```bash
prisma migrate deploy && prisma db seed && next build
```

So a deployment with `DATABASE_URL` configured will:

- apply any pending committed migrations
- seed or resynchronize the base HRMS data, including seeded employee credentials
- update existing seeded records when matching IDs already exist

## What gets created

The Prisma migration creates the operational tables used by the app:

- `employees`
- `departments`
- `leave_requests`
- `attendance_signals`
- `payroll_issues`
- `review_cycles`
- `document_events`
- `notification_events`
- `settings_groups`
- `admin_tasks`
- `dashboard_tasks`

Base HRMS records are inserted automatically for a fresh environment. The deploy seed step uses `INSERT ... ON CONFLICT DO UPDATE`, so later seed runs keep the standard sample records in sync.
