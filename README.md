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

## Vercel deployment

Deployments on Vercel automatically run Prisma migrations before the Next.js build through [vercel.json](/Users/atmaramn/data/work/gh/sampleapps/hrms/vercel.json).

That flow is:

```bash
prisma migrate deploy && prisma db seed && next build
```

So a deployment with `DATABASE_URL` configured will:

- apply any pending committed migrations
- seed the base HRMS data on first deploy into an empty database
- skip seeding on later deploys once employee records already exist

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

Base HRMS records are inserted automatically for a fresh environment. The deploy seed step checks whether the `employees` table already has data and becomes a no-op after initial bootstrap.
