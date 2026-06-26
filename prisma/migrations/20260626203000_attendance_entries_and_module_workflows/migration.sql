create table if not exists attendance_entries (
  id text primary key,
  employee_name text not null,
  work_date date not null,
  status text not null,
  check_in text not null,
  check_out text,
  work_mode text not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
