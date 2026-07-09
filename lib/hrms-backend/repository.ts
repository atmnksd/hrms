import { randomUUID } from "node:crypto"

import { compare } from "bcryptjs"
import type { PoolClient } from "pg"

import { postgres } from "@/lib/postgres"
import type {
  AdminTask,
  AttendanceEntry,
  AttendanceSignal,
  DashboardSummary,
  DashboardTask,
  Department,
  DepartmentOrgNode,
  DocumentEvent,
  Employee,
  LeaveRequest,
  LoginPayload,
  LoginResult,
  NotificationEvent,
  PayrollIssue,
  RepositoryResult,
  ReviewCycle,
  SettingsGroup,
} from "@/lib/hrms-backend/types"

const DEFAULT_EMPLOYEE_PASSWORD_HASH =
  "$2b$10$rR3wCFZBchGJ.b/mF1JHquHPAUX6M.8nrnHHjKsGDAlf8Ddq4qM3m"

type DbClient = {
  query: PoolClient["query"]
}

type EmployeeRow = {
  id: string
  full_name: string
  email: string
  password_hash: string
  role: string
  department_id: string
  department_name: string
  manager: string
  employment_type: string
  location: string
  phone_number: string
  emergency_contact: string
  compensation_band: string
  payroll_bank_status: string
  status: Employee["status"]
  joining_date: Date | string
}

type DepartmentRow = {
  id: string
  name: string
  lead: string
  budget_status: string
  employee_count: number
  open_roles: number
}

type LeaveRequestRow = {
  id: string
  employee_name: string
  leave_type: string
  date_range: string
  status: string
}

type AttendanceSignalRow = {
  id: string
  title: string
  summary: string
}

type AttendanceEntryRow = {
  id: string
  employee_name: string
  work_date: Date | string
  status: string
  check_in: string
  check_out: string | null
  work_mode: string
  notes: string | null
}

type PayrollIssueRow = {
  id: string
  employee_name: string
  issue: string
  owner: string
  priority: string
}

type ReviewCycleRow = {
  id: string
  title: string
  meta: string
  status: string
}

type DocumentEventRow = {
  id: string
  title: string
  meta: string
  status: string
}

type NotificationEventRow = {
  id: string
  title: string
  meta: string
  status: string
}

type SettingsGroupRow = {
  id: string
  name: string
  description: string
}

type AdminTaskRow = {
  id: string
  title: string
  description: string
}

type DashboardTaskRow = {
  id: string
  employee_name: string
  task: string
  owner: string
  status: string
}

function wrapResult<T>(data: T): RepositoryResult<T> {
  return {
    data,
    source: "postgres",
  }
}

function toIsoDate(value: Date | string) {
  return value instanceof Date ? value.toISOString().slice(0, 10) : value
}

function mapEmployee(record: EmployeeRow): Employee {
  return {
    id: record.id,
    fullName: record.full_name,
    email: record.email,
    role: record.role,
    departmentId: record.department_id,
    departmentName: record.department_name,
    manager: record.manager,
    employmentType: record.employment_type,
    location: record.location,
    phoneNumber: record.phone_number,
    emergencyContact: record.emergency_contact,
    compensationBand: record.compensation_band,
    payrollBankStatus: record.payroll_bank_status,
    status: record.status,
    joiningDate: toIsoDate(record.joining_date),
  }
}

function mapDepartment(record: DepartmentRow): Department {
  return {
    id: record.id,
    name: record.name,
    lead: record.lead,
    budgetStatus: record.budget_status,
    employeeCount: record.employee_count,
    openRoles: record.open_roles,
  }
}

function mapLeaveRequest(record: LeaveRequestRow): LeaveRequest {
  return {
    id: record.id,
    employeeName: record.employee_name,
    leaveType: record.leave_type,
    dateRange: record.date_range,
    status: record.status,
  }
}

function mapAttendanceSignal(record: AttendanceSignalRow): AttendanceSignal {
  return {
    id: record.id,
    title: record.title,
    summary: record.summary,
  }
}

function mapAttendanceEntry(record: AttendanceEntryRow): AttendanceEntry {
  return {
    id: record.id,
    employeeName: record.employee_name,
    workDate: toIsoDate(record.work_date),
    status: record.status,
    checkIn: record.check_in,
    checkOut: record.check_out,
    workMode: record.work_mode,
    notes: record.notes,
  }
}

function mapPayrollIssue(record: PayrollIssueRow): PayrollIssue {
  return {
    id: record.id,
    employeeName: record.employee_name,
    issue: record.issue,
    owner: record.owner,
    priority: record.priority,
  }
}

function mapReviewCycle(record: ReviewCycleRow): ReviewCycle {
  return {
    id: record.id,
    title: record.title,
    meta: record.meta,
    status: record.status,
  }
}

function mapDocumentEvent(record: DocumentEventRow): DocumentEvent {
  return {
    id: record.id,
    title: record.title,
    meta: record.meta,
    status: record.status,
  }
}

function mapNotificationEvent(record: NotificationEventRow): NotificationEvent {
  return {
    id: record.id,
    title: record.title,
    meta: record.meta,
    status: record.status,
  }
}

function mapSettingsGroup(record: SettingsGroupRow): SettingsGroup {
  return {
    id: record.id,
    name: record.name,
    description: record.description,
  }
}

function mapAdminTask(record: AdminTaskRow): AdminTask {
  return {
    id: record.id,
    title: record.title,
    description: record.description,
  }
}

function mapDashboardTask(record: DashboardTaskRow): DashboardTask {
  return {
    id: record.id,
    employeeName: record.employee_name,
    task: record.task,
    owner: record.owner,
    status: record.status,
  }
}

async function queryRows<T>(
  text: string,
  values: unknown[] = [],
  client: DbClient = postgres,
) {
  const result = await client.query(text, values)
  return result.rows as T[]
}

async function queryOne<T>(
  text: string,
  values: unknown[] = [],
  client: DbClient = postgres,
) {
  const rows = await queryRows<T>(text, values, client)
  return rows[0] ?? null
}

async function withTransaction<T>(fn: (client: PoolClient) => Promise<T>) {
  const client = await postgres.connect()

  try {
    await client.query("BEGIN")
    const result = await fn(client)
    await client.query("COMMIT")
    return result
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}

async function syncDepartmentEmployeeCounts(
  client: DbClient,
  departmentIds?: string[],
) {
  const values: unknown[] = []
  const whereClause = departmentIds?.length
    ? `WHERE d.id = ANY($${values.push(departmentIds)}::text[])`
    : ""

  await client.query(
    `
      UPDATE departments AS d
      SET employee_count = counts.employee_count,
          updated_at = NOW()
      FROM (
        SELECT d2.id,
               COUNT(e.id)::int AS employee_count
        FROM departments AS d2
        LEFT JOIN employees AS e
          ON e.department_id = d2.id
          OR e.department_name = d2.name
        ${whereClause.replaceAll("d.", "d2.")}
        GROUP BY d2.id
      ) AS counts
      WHERE d.id = counts.id
    `,
    values,
  )
}

function buildEmployeeUpdatePatch(patch: Partial<Omit<Employee, "id">>) {
  const values: unknown[] = []
  const sets: string[] = []

  const add = (column: string, value: unknown) => {
    values.push(value)
    sets.push(`${column} = $${values.length}`)
  }

  if (patch.fullName !== undefined) add("full_name", patch.fullName)
  if (patch.email !== undefined) add("email", patch.email.toLowerCase())
  if (patch.role !== undefined) add("role", patch.role)
  if (patch.departmentId !== undefined) add("department_id", patch.departmentId)
  if (patch.departmentName !== undefined) add("department_name", patch.departmentName)
  if (patch.manager !== undefined) add("manager", patch.manager)
  if (patch.employmentType !== undefined) {
    add("employment_type", patch.employmentType)
  }
  if (patch.location !== undefined) add("location", patch.location)
  if (patch.phoneNumber !== undefined) add("phone_number", patch.phoneNumber)
  if (patch.emergencyContact !== undefined) {
    add("emergency_contact", patch.emergencyContact)
  }
  if (patch.compensationBand !== undefined) {
    add("compensation_band", patch.compensationBand)
  }
  if (patch.payrollBankStatus !== undefined) {
    add("payroll_bank_status", patch.payrollBankStatus)
  }
  if (patch.status !== undefined) add("status", patch.status)
  if (patch.joiningDate !== undefined) add("joining_date", patch.joiningDate)

  if (sets.length === 0) {
    return null
  }

  sets.push("updated_at = NOW()")

  return { sets, values }
}

function buildDepartmentUpdatePatch(
  patch: Partial<Omit<Department, "id" | "employeeCount">> & {
    employeeCount?: number
  },
) {
  const values: unknown[] = []
  const sets: string[] = []

  const add = (column: string, value: unknown) => {
    values.push(value)
    sets.push(`${column} = $${values.length}`)
  }

  if (patch.name !== undefined) add("name", patch.name)
  if (patch.lead !== undefined) add("lead", patch.lead)
  if (patch.budgetStatus !== undefined) add("budget_status", patch.budgetStatus)
  if (patch.openRoles !== undefined) add("open_roles", patch.openRoles)
  if (patch.employeeCount !== undefined) add("employee_count", patch.employeeCount)

  if (sets.length === 0) {
    return null
  }

  sets.push("updated_at = NOW()")

  return { sets, values }
}

function buildLeaveRequestUpdatePatch(patch: Partial<Omit<LeaveRequest, "id">>) {
  const values: unknown[] = []
  const sets: string[] = []

  const add = (column: string, value: unknown) => {
    values.push(value)
    sets.push(`${column} = $${values.length}`)
  }

  if (patch.employeeName !== undefined) add("employee_name", patch.employeeName)
  if (patch.leaveType !== undefined) add("leave_type", patch.leaveType)
  if (patch.dateRange !== undefined) add("date_range", patch.dateRange)
  if (patch.status !== undefined) add("status", patch.status)

  if (sets.length === 0) {
    return null
  }

  sets.push("updated_at = NOW()")

  return { sets, values }
}

function buildAttendanceEntryUpdatePatch(
  patch: Partial<Omit<AttendanceEntry, "id">>,
) {
  const values: unknown[] = []
  const sets: string[] = []

  const add = (column: string, value: unknown) => {
    values.push(value)
    sets.push(`${column} = $${values.length}`)
  }

  if (patch.employeeName !== undefined) add("employee_name", patch.employeeName)
  if (patch.workDate !== undefined) add("work_date", patch.workDate)
  if (patch.status !== undefined) add("status", patch.status)
  if (patch.checkIn !== undefined) add("check_in", patch.checkIn)
  if (patch.checkOut !== undefined) add("check_out", patch.checkOut)
  if (patch.workMode !== undefined) add("work_mode", patch.workMode)
  if (patch.notes !== undefined) add("notes", patch.notes)

  if (sets.length === 0) {
    return null
  }

  sets.push("updated_at = NOW()")

  return { sets, values }
}

export async function listEmployees() {
  const records = await queryRows<EmployeeRow>(
    `
      SELECT *
      FROM employees
      ORDER BY full_name ASC
    `,
  )

  return wrapResult(records.map(mapEmployee))
}

export async function getEmployeeById(employeeId: string) {
  const record = await queryOne<EmployeeRow>(
    `
      SELECT *
      FROM employees
      WHERE id = $1
    `,
    [employeeId],
  )

  return wrapResult(record ? mapEmployee(record) : null)
}

export async function createEmployee(
  input: Omit<Employee, "id">,
): Promise<RepositoryResult<Employee>> {
  const record = await withTransaction(async (client) => {
    const created = await queryOne<EmployeeRow>(
      `
        INSERT INTO employees (
          full_name,
          email,
          password_hash,
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
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
        )
        RETURNING *
      `,
      [
        input.fullName,
        input.email.toLowerCase(),
        DEFAULT_EMPLOYEE_PASSWORD_HASH,
        input.role,
        input.departmentId,
        input.departmentName,
        input.manager,
        input.employmentType,
        input.location,
        input.phoneNumber,
        input.emergencyContact,
        input.compensationBand,
        input.payrollBankStatus,
        input.status,
        input.joiningDate,
      ],
      client,
    )

    if (!created) {
      throw new Error("Failed to create employee.")
    }

    await syncDepartmentEmployeeCounts(client, [created.department_id])

    return created
  })

  return wrapResult(mapEmployee(record))
}

export async function updateEmployee(
  employeeId: string,
  patch: Partial<Omit<Employee, "id">>,
): Promise<RepositoryResult<Employee | null>> {
  const result = await withTransaction(async (client) => {
    const existing = await queryOne<EmployeeRow>(
      `
        SELECT *
        FROM employees
        WHERE id = $1
      `,
      [employeeId],
      client,
    )

    if (!existing) {
      return null
    }

    const update = buildEmployeeUpdatePatch(patch)

    const record = update
      ? await queryOne<EmployeeRow>(
          `
            UPDATE employees
            SET ${update.sets.join(", ")}
            WHERE id = $${update.values.length + 1}
            RETURNING *
          `,
          [...update.values, employeeId],
          client,
        )
      : existing

    if (!record) {
      throw new Error("Failed to update employee.")
    }

    await syncDepartmentEmployeeCounts(client, [
      existing.department_id,
      record.department_id,
    ])

    return mapEmployee(record)
  })

  return wrapResult(result)
}

export async function listDepartments() {
  const records = await queryRows<DepartmentRow>(
    `
      SELECT *
      FROM departments
      ORDER BY name ASC
    `,
  )

  return wrapResult(records.map(mapDepartment))
}

export async function createDepartment(
  input: Omit<Department, "employeeCount">,
): Promise<RepositoryResult<Department>> {
  const record = await withTransaction(async (client) => {
    const created = await queryOne<DepartmentRow>(
      `
        INSERT INTO departments (
          id,
          name,
          lead,
          budget_status,
          employee_count,
          open_roles
        )
        VALUES ($1, $2, $3, $4, 0, $5)
        RETURNING *
      `,
      [input.id, input.name, input.lead, input.budgetStatus, input.openRoles],
      client,
    )

    if (!created) {
      throw new Error("Failed to create department.")
    }

    await syncDepartmentEmployeeCounts(client, [created.id])

    const refreshed = await queryOne<DepartmentRow>(
      `
        SELECT *
        FROM departments
        WHERE id = $1
      `,
      [created.id],
      client,
    )

    if (!refreshed) {
      throw new Error("Failed to reload department.")
    }

    return refreshed
  })

  return wrapResult(mapDepartment(record))
}

export async function updateDepartment(
  departmentId: string,
  patch: Partial<Omit<Department, "id" | "employeeCount">> & {
    employeeCount?: number
  },
): Promise<RepositoryResult<Department | null>> {
  const result = await withTransaction(async (client) => {
    const existing = await queryOne<DepartmentRow>(
      `
        SELECT *
        FROM departments
        WHERE id = $1
      `,
      [departmentId],
      client,
    )

    if (!existing) {
      return null
    }

    const update = buildDepartmentUpdatePatch(patch)

    const record = update
      ? await queryOne<DepartmentRow>(
          `
            UPDATE departments
            SET ${update.sets.join(", ")}
            WHERE id = $${update.values.length + 1}
            RETURNING *
          `,
          [...update.values, departmentId],
          client,
        )
      : existing

    if (!record) {
      throw new Error("Failed to update department.")
    }

    await syncDepartmentEmployeeCounts(client, [record.id])

    const refreshed = await queryOne<DepartmentRow>(
      `
        SELECT *
        FROM departments
        WHERE id = $1
      `,
      [record.id],
      client,
    )

    if (!refreshed) {
      throw new Error("Failed to reload department.")
    }

    return mapDepartment(refreshed)
  })

  return wrapResult(result)
}

export async function listDepartmentOrgNodes(): Promise<
  RepositoryResult<DepartmentOrgNode[]>
> {
  const [departments, employees] = await Promise.all([listDepartments(), listEmployees()])

  const nodes = departments.data.map((department) => {
    const departmentEmployees = employees.data.filter(
      (employee) =>
        employee.departmentId === department.id ||
        employee.departmentName === department.name,
    )

    const leadRecord =
      departmentEmployees.find((employee) => employee.fullName === department.lead) ?? null

    const directReports = leadRecord
      ? departmentEmployees
          .filter((employee) => employee.manager === leadRecord.fullName)
          .map((employee) => employee.fullName)
      : departmentEmployees
          .filter((employee) => employee.fullName !== department.lead)
          .slice(0, 6)
          .map((employee) => employee.fullName)

    return {
      id: department.id,
      name: department.name,
      lead: department.lead,
      employeeCount: departmentEmployees.length,
      directReports,
    }
  })

  return wrapResult(nodes)
}

export async function listLeaveRequests() {
  const records = await queryRows<LeaveRequestRow>(
    `
      SELECT *
      FROM leave_requests
      ORDER BY created_at DESC, id DESC
    `,
  )

  return wrapResult(records.map(mapLeaveRequest))
}

export async function createLeaveRequest(
  input: Omit<LeaveRequest, "id">,
): Promise<RepositoryResult<LeaveRequest>> {
  const record = await queryOne<LeaveRequestRow>(
    `
      INSERT INTO leave_requests (
        id,
        employee_name,
        leave_type,
        date_range,
        status
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `,
    [
      `leave-${randomUUID().slice(0, 8)}`,
      input.employeeName,
      input.leaveType,
      input.dateRange,
      input.status,
    ],
  )

  if (!record) {
    throw new Error("Failed to create leave request.")
  }

  return wrapResult(mapLeaveRequest(record))
}

export async function updateLeaveRequest(
  requestId: string,
  patch: Partial<Omit<LeaveRequest, "id">>,
): Promise<RepositoryResult<LeaveRequest | null>> {
  const existing = await queryOne<LeaveRequestRow>(
    `
      SELECT *
      FROM leave_requests
      WHERE id = $1
    `,
    [requestId],
  )

  if (!existing) {
    return wrapResult(null)
  }

  const update = buildLeaveRequestUpdatePatch(patch)

  if (!update) {
    return wrapResult(mapLeaveRequest(existing))
  }

  const record = await queryOne<LeaveRequestRow>(
    `
      UPDATE leave_requests
      SET ${update.sets.join(", ")}
      WHERE id = $${update.values.length + 1}
      RETURNING *
    `,
    [...update.values, requestId],
  )

  if (!record) {
    throw new Error("Failed to update leave request.")
  }

  return wrapResult(mapLeaveRequest(record))
}

export async function listAttendanceSignals() {
  const records = await queryRows<AttendanceSignalRow>(
    `
      SELECT *
      FROM attendance_signals
      ORDER BY created_at DESC, id DESC
    `,
  )

  return wrapResult(records.map(mapAttendanceSignal))
}

export async function listAttendanceEntries() {
  const records = await queryRows<AttendanceEntryRow>(
    `
      SELECT *
      FROM attendance_entries
      ORDER BY work_date DESC, employee_name ASC
    `,
  )

  return wrapResult(records.map(mapAttendanceEntry))
}

export async function createAttendanceEntry(
  input: Omit<AttendanceEntry, "id">,
): Promise<RepositoryResult<AttendanceEntry>> {
  const record = await queryOne<AttendanceEntryRow>(
    `
      INSERT INTO attendance_entries (
        id,
        employee_name,
        work_date,
        status,
        check_in,
        check_out,
        work_mode,
        notes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `,
    [
      `att-entry-${randomUUID().slice(0, 8)}`,
      input.employeeName,
      input.workDate,
      input.status,
      input.checkIn,
      input.checkOut,
      input.workMode,
      input.notes,
    ],
  )

  if (!record) {
    throw new Error("Failed to create attendance entry.")
  }

  return wrapResult(mapAttendanceEntry(record))
}

export async function updateAttendanceEntry(
  entryId: string,
  patch: Partial<Omit<AttendanceEntry, "id">>,
): Promise<RepositoryResult<AttendanceEntry | null>> {
  const existing = await queryOne<AttendanceEntryRow>(
    `
      SELECT *
      FROM attendance_entries
      WHERE id = $1
    `,
    [entryId],
  )

  if (!existing) {
    return wrapResult(null)
  }

  const update = buildAttendanceEntryUpdatePatch(patch)

  if (!update) {
    return wrapResult(mapAttendanceEntry(existing))
  }

  const record = await queryOne<AttendanceEntryRow>(
    `
      UPDATE attendance_entries
      SET ${update.sets.join(", ")}
      WHERE id = $${update.values.length + 1}
      RETURNING *
    `,
    [...update.values, entryId],
  )

  if (!record) {
    throw new Error("Failed to update attendance entry.")
  }

  return wrapResult(mapAttendanceEntry(record))
}

export async function listPayrollIssues() {
  const records = await queryRows<PayrollIssueRow>(
    `
      SELECT *
      FROM payroll_issues
      ORDER BY created_at DESC, id DESC
    `,
  )

  return wrapResult(records.map(mapPayrollIssue))
}

export async function listReviewCycles() {
  const records = await queryRows<ReviewCycleRow>(
    `
      SELECT *
      FROM review_cycles
      ORDER BY created_at DESC, id DESC
    `,
  )

  return wrapResult(records.map(mapReviewCycle))
}

export async function listDocumentEvents() {
  const records = await queryRows<DocumentEventRow>(
    `
      SELECT *
      FROM document_events
      ORDER BY created_at DESC, id DESC
    `,
  )

  return wrapResult(records.map(mapDocumentEvent))
}

export async function listNotificationEvents() {
  const records = await queryRows<NotificationEventRow>(
    `
      SELECT *
      FROM notification_events
      ORDER BY created_at DESC, id DESC
    `,
  )

  return wrapResult(records.map(mapNotificationEvent))
}

export async function listSettingsGroups() {
  const records = await queryRows<SettingsGroupRow>(
    `
      SELECT *
      FROM settings_groups
      ORDER BY name ASC
    `,
  )

  return wrapResult(records.map(mapSettingsGroup))
}

export async function listAdminTasks() {
  const records = await queryRows<AdminTaskRow>(
    `
      SELECT *
      FROM admin_tasks
      ORDER BY created_at DESC, id DESC
    `,
  )

  return wrapResult(records.map(mapAdminTask))
}

export async function listDashboardTasks() {
  const records = await queryRows<DashboardTaskRow>(
    `
      SELECT *
      FROM dashboard_tasks
      ORDER BY created_at DESC, id DESC
    `,
  )

  return wrapResult(records.map(mapDashboardTask))
}

export async function getDashboardSummary() {
  const [headcountRow, openRequestsRow, verifiedPayrollRow, remoteCountRow] =
    await Promise.all([
      queryOne<{ count: string }>("SELECT COUNT(*)::text AS count FROM employees"),
      queryOne<{ count: string }>(
        `
          SELECT COUNT(*)::text AS count
          FROM leave_requests
          WHERE status <> 'Approved'
        `,
      ),
      queryOne<{ count: string }>(
        `
          SELECT COUNT(*)::text AS count
          FROM employees
          WHERE payroll_bank_status = 'Verified'
        `,
      ),
      queryOne<{ count: string }>(
        `
          SELECT COUNT(*)::text AS count
          FROM employees
          WHERE status = 'Remote'
        `,
      ),
    ])

  const headcount = Number(headcountRow?.count ?? 0)
  const openRequests = Number(openRequestsRow?.count ?? 0)
  const verifiedPayroll = Number(verifiedPayrollRow?.count ?? 0)
  const remoteCount = Number(remoteCountRow?.count ?? 0)

  const summary: DashboardSummary = {
    headcount,
    openRequests,
    payrollReadyPercent:
      headcount === 0 ? 0 : Math.round((verifiedPayroll / headcount) * 100),
    attendanceRate:
      headcount === 0
        ? 0
        : Number((((headcount - remoteCount * 0.2) / headcount) * 100).toFixed(1)),
  }

  return wrapResult(summary)
}

export async function attemptLogin(
  payload: LoginPayload,
): Promise<RepositoryResult<LoginResult>> {
  const normalizedEmail = payload.email.toLowerCase()

  const [employeeCountRow, record] = await Promise.all([
    queryOne<{ count: string }>("SELECT COUNT(*)::text AS count FROM employees"),
    queryOne<EmployeeRow>(
      `
        SELECT *
        FROM employees
        WHERE email = $1
      `,
      [normalizedEmail],
    ),
  ])

  const employeeCount = Number(employeeCountRow?.count ?? 0)
  const user = record ? mapEmployee(record) : null
  const passwordMatches =
    record !== null &&
    payload.password.length >= 8 &&
    (await compare(payload.password, record.password_hash))

  if (employeeCount === 0) {
    return wrapResult({
      ok: false,
      message: "HRMS database has no users yet. Run the seed step for this environment.",
    })
  }

  if (!passwordMatches || !user) {
    return wrapResult({
      ok: false,
      message: "Invalid email or password.",
    })
  }

  return wrapResult({
    ok: true,
    user: {
      employeeId: user.id,
      fullName: user.fullName,
      role: user.role,
    },
    message: "Login successful",
  })
}
