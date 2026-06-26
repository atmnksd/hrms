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

## Vercel deployment

Deployments on Vercel automatically run Prisma migrations before the Next.js build through [vercel.json](/Users/atmaramn/data/work/gh/sampleapps/hrms/vercel.json).

That flow is:

```bash
prisma migrate deploy && next build
```

So a deployment with `DATABASE_URL` configured will apply any pending committed migrations automatically.

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

Base HRMS records are inserted by the Prisma seed step using idempotent upserts, so rerunning the seed refreshes the starter dataset without duplicating rows.
