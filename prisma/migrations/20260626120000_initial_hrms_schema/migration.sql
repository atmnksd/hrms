create sequence if not exists employees_id_seq start 100;

create table if not exists employees (
  id text primary key default ('emp-' || lpad(nextval('employees_id_seq')::text, 3, '0')),
  full_name text not null,
  email text not null unique,
  role text not null,
  department_id text not null,
  department_name text not null,
  manager text not null,
  employment_type text not null,
  location text not null,
  phone_number text not null,
  emergency_contact text not null,
  compensation_band text not null,
  payroll_bank_status text not null,
  status text not null,
  joining_date date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists departments (
  id text primary key,
  name text not null,
  lead text not null,
  budget_status text not null,
  employee_count integer not null,
  open_roles integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists leave_requests (
  id text primary key,
  employee_name text not null,
  leave_type text not null,
  date_range text not null,
  status text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists attendance_signals (
  id text primary key,
  title text not null,
  summary text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists payroll_issues (
  id text primary key,
  employee_name text not null,
  issue text not null,
  owner text not null,
  priority text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists review_cycles (
  id text primary key,
  title text not null,
  meta text not null,
  status text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists document_events (
  id text primary key,
  title text not null,
  meta text not null,
  status text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists notification_events (
  id text primary key,
  title text not null,
  meta text not null,
  status text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists settings_groups (
  id text primary key,
  name text not null,
  description text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists admin_tasks (
  id text primary key,
  title text not null,
  description text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists dashboard_tasks (
  id text primary key,
  employee_name text not null,
  task text not null,
  owner text not null,
  status text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
