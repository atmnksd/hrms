insert into employees (
  id,
  full_name,
  email,
  role,
  department_id,
  department_name,
  manager,
  employment_type,
  location,
  phone_number,
  emergency_contact,
  compensation_band,
  payroll_bank_status,
  status,
  joining_date
)
values
  ('emp-001', 'Ava Patel', 'ava.patel@workgrid.example', 'Senior Recruiter', 'dept-talent', 'Talent', 'Grace Chen', 'Full-time', 'Bengaluru', '+91 99888 00001', 'Rohan Patel', 'P3', 'Verified', 'Active', '2024-03-11'),
  ('emp-002', 'Noah Silva', 'noah.silva@workgrid.example', 'Payroll Analyst', 'dept-finance', 'Finance', 'Marta Diaz', 'Full-time', 'Mumbai', '+91 99888 00002', 'Lena Silva', 'P2', 'Mismatch', 'Active', '2023-09-18'),
  ('emp-003', 'Mia Shah', 'mia.shah@workgrid.example', 'Office Manager', 'dept-admin', 'Admin', 'Harish Mehta', 'Full-time', 'Bengaluru', '+91 99888 00003', 'Nidhi Shah', 'P2', 'Verified', 'Probation', '2026-05-06'),
  ('emp-004', 'Liam Wong', 'liam.wong@workgrid.example', 'Engineering Manager', 'dept-eng', 'Engineering', 'Jules Carter', 'Full-time', 'Singapore', '+65 9000 0004', 'May Wong', 'M1', 'Verified', 'Remote', '2022-01-10')
on conflict (id) do update
set
  full_name = excluded.full_name,
  email = excluded.email,
  role = excluded.role,
  department_id = excluded.department_id,
  department_name = excluded.department_name,
  manager = excluded.manager,
  employment_type = excluded.employment_type,
  location = excluded.location,
  phone_number = excluded.phone_number,
  emergency_contact = excluded.emergency_contact,
  compensation_band = excluded.compensation_band,
  payroll_bank_status = excluded.payroll_bank_status,
  status = excluded.status,
  joining_date = excluded.joining_date,
  updated_at = now();

insert into departments (id, name, lead, budget_status, employee_count, open_roles)
values
  ('dept-eng', 'Engineering', 'Jules Carter', 'On track', 78, 2),
  ('dept-talent', 'Talent', 'Grace Chen', 'Needs approval', 12, 3),
  ('dept-finance', 'Finance', 'Marta Diaz', 'On track', 16, 1),
  ('dept-admin', 'Admin', 'Harish Mehta', 'Watchlist', 11, 0)
on conflict (id) do update
set
  name = excluded.name,
  lead = excluded.lead,
  budget_status = excluded.budget_status,
  employee_count = excluded.employee_count,
  open_roles = excluded.open_roles,
  updated_at = now();

insert into leave_requests (id, employee_name, leave_type, date_range, status)
values
  ('leave-001', 'Mia Shah', 'Annual leave', 'Jul 02 - Jul 05', 'Pending manager'),
  ('leave-002', 'Ava Patel', 'Sick leave', 'Jun 28', 'Approved'),
  ('leave-003', 'Noah Silva', 'Comp-off', 'Jul 12', 'Pending HR'),
  ('leave-004', 'Liam Wong', 'Work from home', 'Jul 01 - Jul 03', 'Policy review')
on conflict (id) do update
set
  employee_name = excluded.employee_name,
  leave_type = excluded.leave_type,
  date_range = excluded.date_range,
  status = excluded.status,
  updated_at = now();

insert into attendance_signals (id, title, summary)
values
  ('att-001', 'Late arrivals', 'Nine employees crossed the grace period today.'),
  ('att-002', 'Shift swaps', 'Four pending approvals across customer support.'),
  ('att-003', 'Remote presence', '63 employees marked remote for the day.'),
  ('att-004', 'Biometric sync', 'One office device is still waiting to upload logs.')
on conflict (id) do update
set
  title = excluded.title,
  summary = excluded.summary,
  updated_at = now();

insert into payroll_issues (id, employee_name, issue, owner, priority)
values
  ('pay-001', 'Noah Silva', 'Bank account mismatch', 'Payroll', 'High'),
  ('pay-002', 'Priya Menon', 'Missing tax regime', 'HR Ops', 'Medium'),
  ('pay-003', 'Daniel Reed', 'Bonus pending approval', 'Finance', 'Medium'),
  ('pay-004', 'Ivy Kumar', 'Location allowance conflict', 'Comp Team', 'High')
on conflict (id) do update
set
  employee_name = excluded.employee_name,
  issue = excluded.issue,
  owner = excluded.owner,
  priority = excluded.priority,
  updated_at = now();

insert into review_cycles (id, title, meta, status)
values
  ('rev-001', 'Mid-year cycle launched', '124 employees assigned reviewers', 'Live'),
  ('rev-002', 'Manager reminders queued', '18 managers have overdue feedback', 'Attention'),
  ('rev-003', 'Calibration deck updated', 'Leadership review scheduled for Friday', 'Ready')
on conflict (id) do update
set
  title = excluded.title,
  meta = excluded.meta,
  status = excluded.status,
  updated_at = now();

insert into document_events (id, title, meta, status)
values
  ('doc-001', 'Visa renewal packet uploaded', 'For Mia Shah by Admin Ops', 'New'),
  ('doc-002', 'Policy handbook versioned', 'FY26 release published to all employees', 'Published'),
  ('doc-003', 'Offer letter signed', 'Candidate accepted payroll analyst role', 'Completed')
on conflict (id) do update
set
  title = excluded.title,
  meta = excluded.meta,
  status = excluded.status,
  updated_at = now();

insert into notification_events (id, title, meta, status)
values
  ('not-001', 'Benefits enrollment closes soon', 'Sent to all employees 2 hours ago', 'Unread'),
  ('not-002', 'Manager review reminder', 'Queued for 18 managers this morning', 'Queued'),
  ('not-003', 'Office closure advisory', 'Shared with Bengaluru office staff', 'Delivered')
on conflict (id) do update
set
  title = excluded.title,
  meta = excluded.meta,
  status = excluded.status,
  updated_at = now();

insert into settings_groups (id, name, description)
values
  ('set-001', 'Approvals', 'Routing rules for leave, onboarding, and payroll exceptions.'),
  ('set-002', 'Branding', 'Logo, email copy, and employee portal language.'),
  ('set-003', 'Security', 'Password policies, SSO, and session governance.'),
  ('set-004', 'Localization', 'Working week, holiday calendar, and timezone preferences.')
on conflict (id) do update
set
  name = excluded.name,
  description = excluded.description,
  updated_at = now();

insert into admin_tasks (id, title, description)
values
  ('adm-001', 'Role administration', 'Assign HR admin, payroll, and auditor permissions.'),
  ('adm-002', 'Audit monitoring', 'Inspect elevated actions and export compliance trails.'),
  ('adm-003', 'Data maintenance', 'Archive stale records and reconcile controlled lists.'),
  ('adm-004', 'Environment flags', 'Toggle staged rollout behavior for selected modules.')
on conflict (id) do update
set
  title = excluded.title,
  description = excluded.description,
  updated_at = now();

insert into dashboard_tasks (id, employee_name, task, owner, status)
values
  ('dash-001', 'Ava Patel', 'Finalize onboarding plan', 'HR Ops', 'In progress'),
  ('dash-002', 'Liam Wong', 'Approve location transfer', 'People Lead', 'Awaiting'),
  ('dash-003', 'Noah Silva', 'Confirm payroll exception', 'Payroll', 'Needs review'),
  ('dash-004', 'Mia Shah', 'Collect visa renewal copy', 'Admin', 'Scheduled')
on conflict (id) do update
set
  employee_name = excluded.employee_name,
  task = excluded.task,
  owner = excluded.owner,
  status = excluded.status,
  updated_at = now();

select setval('employees_id_seq', greatest(
  coalesce(
    (
      select max(cast(replace(id, 'emp-', '') as integer))
      from employees
      where id like 'emp-%'
    ),
    100
  ),
  100
), true);
